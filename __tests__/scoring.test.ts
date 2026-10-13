/**
 * Validation harness for the quiz → archetype → field/career mapping.
 *
 * Guards the three properties that keep results trustworthy:
 * 1. The quiz gives every RIASEC dimension equal airtime.
 * 2. Affinity scoring sends clear-cut profiles to the fields/careers
 *    a human would expect (and displayed % honestly reflects fit).
 * 3. No dimension is structurally favored for random takers.
 */
import { describe, expect, it } from '@jest/globals';

import archetypesData from '../data/archetypes.json';
import careersData from '../data/careers.json';
import { Career, Question, QuestionOption, Riasec, RiasecScores } from '../types';
import {
  fetchCareerRecommendations,
  fetchTopFieldMatches,
  rawAffinity,
  submitQuizResponses,
} from '../utils/api';

const KEYS: Riasec[] = ['R', 'I', 'A', 'S', 'E', 'C'];
const questions = archetypesData.questions as unknown as Question[];
const careers = careersData.careers as unknown as Career[];

/** Answers like a person who is purely dimension `dim`: picks the option that
 * scores `dim` when one exists, otherwise the first option. */
const pureTakerAnswers = (dim: Riasec): QuestionOption[] =>
  questions.map(
    (q) =>
      q.options.find((o) => (o.weights[dim] ?? 0) > 0) ?? q.options[0],
  );

const scoreAnswers = (selected: QuestionOption[]): RiasecScores => {
  const scores: RiasecScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  selected.forEach((o) =>
    Object.entries(o.weights).forEach(([d, w]) => {
      scores[d as Riasec] += w ?? 0;
    }),
  );
  return scores;
};

/** A profile that is 100% one dimension — sharpest possible probe. */
const unitProfile = (dim: Riasec): RiasecScores => ({
  R: 0, I: 0, A: 0, S: 0, E: 0, C: 0,
  [dim]: 16,
});

describe('quiz structure', () => {
  it('gives every dimension equal airtime (8 questions × 2 points)', () => {
    const count: Record<Riasec, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    questions.forEach((q) => {
      const dims = q.options.flatMap((o) => Object.keys(o.weights) as Riasec[]);
      // No dimension twice in one question — options must be distinct choices.
      expect(new Set(dims).size).toBe(dims.length);
      dims.forEach((d) => {
        count[d] += 1;
      });
      // Every option is worth the same total weight.
      q.options.forEach((o) => {
        const total = Object.values(o.weights).reduce((a, b) => a + (b ?? 0), 0);
        expect(total).toBe(2);
      });
    });
    KEYS.forEach((d) => expect(count[d]).toBe(8));
  });
});

describe('career data', () => {
  it('every career has a full O*NET riasec profile and matching primary', () => {
    careers.forEach((c) => {
      expect(c.onetCodes?.length).toBeGreaterThan(0);
      KEYS.forEach((d) => {
        const v = c.riasec[d];
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(7);
      });
      const argmax = KEYS.reduce((a, b) =>
        (c.riasec[b] ?? 0) > (c.riasec[a] ?? 0) ? b : a,
      );
      expect(c.primaryArchetype).toBe(argmax);
    });
  });

  it('each career matches its own primary dimension best', () => {
    careers.forEach((c) => {
      const byDim = KEYS.map((d) => ({ d, aff: rawAffinity(unitProfile(d), c) }));
      const best = byDim.reduce((a, b) => (b.aff > a.aff ? b : a));
      expect(best.d).toBe(c.primaryArchetype);
    });
  });
});

describe('pure-archetype takers land where a human would expect', () => {
  const EXPECTED_FIELDS: Record<Riasec, string[]> = {
    R: ['Skilled Trades'],
    I: ['Science & Research', 'Data & Tech', 'Engineering'],
    A: ['Creative & Design'],
    S: ['Healthcare', 'Education'],
    E: ['Business & Leadership'],
    C: ['Finance & Operations'],
  };

  KEYS.forEach((dim) => {
    it(`pure ${dim} taker → archetype ${dim} and a sensible #1 field`, async () => {
      const answers = pureTakerAnswers(dim);
      const { archetype } = await submitQuizResponses(answers);
      expect(archetype.id).toBe(dim);

      const scores = scoreAnswers(answers);
      const fields = await fetchTopFieldMatches(scores);
      expect(fields.length).toBeGreaterThan(0);
      expect(EXPECTED_FIELDS[dim]).toContain(fields[0].category);
    });
  });

  it('pure Connector (S) sees helping careers, not sales, on top', async () => {
    const scores = scoreAnswers(pureTakerAnswers('S'));
    const { wiring } = await fetchCareerRecommendations(scores);
    const ids = wiring.map((c) => c.id);
    const helping = ['counselor', 'teacher', 'nurse'];
    expect(helping).toContain(ids[0]);
    const sales = ids.indexOf('sales-rep');
    if (sales !== -1) {
      expect(sales).toBeGreaterThan(ids.indexOf('counselor'));
    }
  });

  it('pure Organizer (C) sees Accountant among top careers', async () => {
    const scores = scoreAnswers(pureTakerAnswers('C'));
    const { wiring } = await fetchCareerRecommendations(scores);
    expect(wiring.map((c) => c.id)).toContain('accountant');
  });
});

describe('displayed match % is honest', () => {
  it('equals round(affinity × 100) and decreases down the list', async () => {
    const scores = scoreAnswers(pureTakerAnswers('S'));
    const fields = await fetchTopFieldMatches(scores);
    fields.forEach((field) => {
      field.careers.forEach((career) => {
        const expected = Math.max(
          1,
          Math.min(99, Math.round(rawAffinity(scores, career) * 100)),
        );
        expect(career.matchScore).toBe(expected);
      });
    });
    // Field order follows actual fit.
    const fieldScores = fields.map((f) => f.score);
    expect([...fieldScores].sort((a, b) => b - a)).toEqual(fieldScores);
  });
});

describe('no structural bias', () => {
  it('random takers split roughly evenly across archetypes', async () => {
    const runs = 3000;
    const wins: Record<Riasec, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    for (let i = 0; i < runs; i++) {
      const answers = questions.map(
        (q) => q.options[Math.floor(Math.random() * q.options.length)],
      );
      const { archetype } = await submitQuizResponses(answers);
      wins[archetype.id] += 1;
    }
    // Fair target is 1/6 ≈ 16.7% each; allow generous sampling noise.
    KEYS.forEach((d) => {
      const share = wins[d] / runs;
      expect(share).toBeGreaterThan(0.10);
      expect(share).toBeLessThan(0.25);
    });
  });
});
