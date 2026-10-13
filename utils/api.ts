// Local, offline data + scoring layer.
// Everything is bundled with the app — no server, no network, no API cost.
// Functions stay async so screens can later swap in a real API without changes.

import archetypesData from '../data/archetypes.json';
import careersData from '../data/careers.json';
import scenariosData from '../data/scenarios.json';
import {
  Archetype,
  Career,
  MatchTier,
  Question,
  QuestionOption,
  Riasec,
  RiasecScores,
  ShiftScenario,
} from '../types';

const RIASEC_KEYS: Riasec[] = ['R', 'I', 'A', 'S', 'E', 'C'];

/** Rank → codecademy-style bucket (Most like / A lot like / …). */
const TIER_BY_RANK: MatchTier[] = [
  'most',
  'alot',
  'alot',
  'also',
  'also',
  'little',
];

export const MATCH_TIER_LABEL: Record<MatchTier, string> = {
  most: 'Most like',
  alot: 'A lot like',
  also: 'Also like',
  little: 'A little like',
};

export const MATCH_TIER_ORDER: MatchTier[] = ['most', 'alot', 'also', 'little'];

export const entryPathLabel = (path: Career['entry']['path']): string | null => {
  if (path === 'portfolio') return 'Portfolio path';
  if (path === 'apprenticeship') return 'Apprenticeship';
  return null;
};

const archetypes = archetypesData.archetypes as unknown as Archetype[];
const questions = archetypesData.questions as unknown as Question[];
const careers = careersData.careers as unknown as Career[];

const emptyScores = (): RiasecScores => ({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });

/** All quiz questions. */
export const fetchQuestions = async (): Promise<Question[]> => questions;

/** All archetypes (for intro / browse screens). */
export const getArchetypes = (): Archetype[] => archetypes;

export const getArchetypeById = (id: Riasec): Archetype | undefined =>
  archetypes.find((a) => a.id === id);

/**
 * Tally the selected answers into RIASEC scores and resolve the winning archetype.
 */
export const submitQuizResponses = async (
  selected: QuestionOption[],
): Promise<{ archetype: Archetype }> => {
  const scores = emptyScores();

  selected.forEach((option) => {
    Object.entries(option.weights).forEach(([dim, weight]) => {
      scores[dim as Riasec] += weight ?? 0;
    });
  });

  // Winner = highest-scoring dimension; exact ties resolved by a fair coin
  // flip rather than a fixed order (a fixed order would bias results toward R).
  const topScore = Math.max(...RIASEC_KEYS.map((dim) => scores[dim]));
  const tied = RIASEC_KEYS.filter((dim) => scores[dim] === topScore);
  const topId = tied[Math.floor(Math.random() * tied.length)];

  const base = getArchetypeById(topId) ?? archetypes[0];
  const archetype: Archetype = { ...base, scores, topScore: scores[topId] };

  return { archetype };
};

export const userTopDims = (scores: RiasecScores, n = 2): Riasec[] =>
  [...RIASEC_KEYS].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0)).slice(0, n);

/**
 * Raw affinity — Pearson correlation between the user's RIASEC profile and the
 * career's O*NET interest profile, mapped to [0, 1] (1 = same shape,
 * 0.5 = unrelated, 0 = opposite). Standard profile-matching for Holland codes:
 * scale-invariant, so quiz point totals and O*NET's 1–7 range don't distort it.
 */
export const rawAffinity = (scores: RiasecScores, career: Career): number => {
  const u = RIASEC_KEYS.map((dim) => scores[dim] ?? 0);
  const c = RIASEC_KEYS.map((dim) => career.riasec[dim] ?? 0);
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const uMean = mean(u);
  const cMean = mean(c);

  let num = 0;
  let uVar = 0;
  let cVar = 0;
  RIASEC_KEYS.forEach((_, i) => {
    num += (u[i] - uMean) * (c[i] - cMean);
    uVar += (u[i] - uMean) ** 2;
    cVar += (c[i] - cMean) ** 2;
  });

  if (uVar === 0 || cVar === 0) return 0.5; // flat profile — no signal either way

  const r = num / Math.sqrt(uVar * cVar);
  return (r + 1) / 2;
};

/** Affinity → honest display percentage. */
const toMatchScore = (raw: number): number =>
  Math.max(1, Math.min(99, Math.round(raw * 100)));

type Scored = { career: Career; raw: number };

/** Prefer variety: at most 2 careers with the same primary in the wiring list. */
const pickDiversified = (scored: Scored[], limit: number): Scored[] => {
  const out: Scored[] = [];
  const skipped: Scored[] = [];
  const counts: Partial<Record<Riasec, number>> = {};

  for (const item of scored) {
    if (out.length >= limit) break;
    const p = item.career.primaryArchetype;
    const n = counts[p] ?? 0;
    if (n >= 2) {
      skipped.push(item);
      continue;
    }
    out.push(item);
    counts[p] = n + 1;
  }

  for (const item of skipped) {
    if (out.length >= limit) break;
    out.push(item);
  }

  return out;
};

const stampTiers = (items: Scored[]): Career[] =>
  items.map(({ career, raw }, index) => ({
    ...career,
    // Honest %: straight from affinity, not a rank-based ladder.
    matchScore: toMatchScore(raw),
    matchTier: TIER_BY_RANK[index] ?? 'little',
    matchLane: 'wiring' as const,
  }));

/** Secondary dim is strong enough to deserve its own "build toward" lane. */
export const secondaryIsStrong = (scores: RiasecScores): boolean => {
  const [primary, secondary] = userTopDims(scores, 2);
  const p = scores[primary] ?? 0;
  const s = scores[secondary] ?? 0;
  if (p <= 0) return false;
  return s >= 4 && s >= p * 0.4;
};

export interface CareerRecommendations {
  /** How you're wired right now (RIASEC affinity, diversified). */
  wiring: Career[];
  /** Aspiration / secondary-dim careers worth investing proof toward. */
  buildToward: Career[];
  /** Flat list: wiring then buildToward (compat). */
  recommendations: Career[];
}

export interface FieldFit {
  category: string;
  /** Mean affinity of the field's top 2 careers (size-independent). */
  score: number;
  count: number;
}

/** Field score = mean of its top-2 career affinities, so a 5-career field
 * doesn't beat a 1-career field just by rolling more dice. */
const fieldScore = (affinities: number[]): number => {
  const top = [...affinities].sort((a, b) => b - a).slice(0, 2);
  return top.reduce((a, b) => a + b, 0) / top.length;
};

export interface FieldMatch {
  category: string;
  score: number;
  /** Top roles inside this field for the user's answers. */
  careers: Career[];
}

/** Rank parent fields by how well the user's profile fits careers inside them. */
export const fetchFieldFits = async (
  scores: RiasecScores,
): Promise<FieldFit[]> => {
  const byCat: Record<string, number[]> = {};
  careers.forEach((career) => {
    (byCat[career.category] ??= []).push(rawAffinity(scores, career));
  });
  return Object.entries(byCat)
    .map(([category, affinities]) => ({
      category,
      score: fieldScore(affinities),
      count: affinities.length,
    }))
    .sort((a, b) => b.score - a.score);
};

/**
 * Top 1–3 parent fields for this profile, each with its top 2 roles.
 * Extra fields only appear when they stay close to the #1 field score.
 */
export const fetchTopFieldMatches = async (
  scores: RiasecScores,
  maxFields = 3,
  rolesPerField = 2,
): Promise<FieldMatch[]> => {
  const scored = careers
    .map((career) => ({
      career,
      raw: rawAffinity(scores, career),
    }))
    .sort((a, b) => b.raw - a.raw);

  const byCat: Record<string, typeof scored> = {};
  scored.forEach((item) => {
    (byCat[item.career.category] ??= []).push(item);
  });

  const ranked = Object.entries(byCat)
    .map(([category, roles]) => ({
      category,
      score: fieldScore(roles.map((r) => r.raw)),
      careers: roles.slice(0, rolesPerField).map(({ career, raw }, index) => ({
        ...career,
        matchScore: toMatchScore(raw),
        matchTier: (index === 0 ? 'most' : 'alot') as MatchTier,
      })),
    }))
    .filter((f) => f.careers.length > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) return [];

  const topScore = ranked[0].score;
  // Keep #1 always; add #2/#3 only while they're a genuinely positive fit
  // (affinity > 0.5 = positively correlated) and not far behind the leader.
  const close = ranked.filter(
    (f, i) =>
      i === 0 ||
      (i < maxFields && f.score >= 0.55 && f.score >= topScore - 0.15),
  );
  return close.slice(0, maxFields);
};

/**
 * Rank careers into two lanes:
 * - wiring: diversified affinity matches (tiers Most like → A little like)
 * - buildToward: secondary-dim / portfolio-leaning careers not already in wiring
 * Pass `category` to rank only inside a parent field the user picked.
 */
export const fetchCareerRecommendations = async (
  scores: RiasecScores,
  limit = 5,
  category?: string,
): Promise<CareerRecommendations> => {
  const pool = category
    ? careers.filter((c) => c.category === category)
    : careers;

  const scored = pool
    .map((career) => ({
      career,
      raw: rawAffinity(scores, career),
    }))
    .sort((a, b) => b.raw - a.raw);

  const tops = userTopDims(scores, 2);
  const primary = tops[0];
  const secondary = tops[1];
  const strongSecondary = secondaryIsStrong(scores);

  let wiringPicks = pickDiversified(scored, limit);

  // If secondary is strong but missing from top 2, promote best secondary-primary career.
  if (strongSecondary) {
    const topTwoHaveSecondary = wiringPicks
      .slice(0, 2)
      .some((s) => s.career.primaryArchetype === secondary);
    if (!topTwoHaveSecondary) {
      const bestSecondary = scored.find(
        (s) => s.career.primaryArchetype === secondary,
      );
      if (bestSecondary) {
        const without = wiringPicks.filter(
          (s) => s.career.id !== bestSecondary.career.id,
        );
        wiringPicks = [without[0], bestSecondary, ...without.slice(1)].filter(
          Boolean,
        ).slice(0, limit);
      }
    }
  }

  const wiring = stampTiers(wiringPicks);
  const wiringIds = new Set(wiring.map((c) => c.id));

  let buildToward: Career[] = [];
  if (strongSecondary && secondary !== primary) {
    buildToward = scored
      .filter((s) => !wiringIds.has(s.career.id))
      .filter((s) => {
        const c = s.career;
        const primaryHit = c.primaryArchetype === secondary;
        // Career "leans" the secondary dim if it's one of its top-2 interests.
        const careerTop2 = [...RIASEC_KEYS]
          .sort((a, b) => (c.riasec[b] ?? 0) - (c.riasec[a] ?? 0))
          .slice(0, 2);
        return primaryHit || careerTop2.includes(secondary);
      })
      // Prefer portfolio / mixed paths for "build toward" (proof over gate).
      .sort((a, b) => {
        const pathScore = (c: Career) =>
          c.entry?.path === 'portfolio' ? 2 : c.entry?.path === 'mixed' ? 1 : 0;
        const d = pathScore(b.career) - pathScore(a.career);
        return d !== 0 ? d : b.raw - a.raw;
      })
      .slice(0, 3)
      .map(({ career, raw }) => ({
        ...career,
        matchScore: toMatchScore(raw),
        matchTier: undefined,
        matchLane: 'buildToward' as const,
      }));
  }

  return {
    wiring,
    buildToward,
    recommendations: [...wiring, ...buildToward],
  };
};

const shiftScenarios = scenariosData.scenarios as unknown as ShiftScenario[];

/** "Try a shift" job preview for a career, when one has been authored. */
export const getShiftScenario = (careerId: string): ShiftScenario | undefined =>
  shiftScenarios.find((s) => s.careerId === careerId);

/** Look up a single career by id. */
export const fetchCareerDetails = async (careerId: string): Promise<Career> => {
  const career = careers.find((c) => c.id === careerId);
  if (!career) {
    throw new Error(`Career not found: ${careerId}`);
  }
  return career;
};
