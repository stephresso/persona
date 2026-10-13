// RIASEC / Holland Code dimensions — the model under the hood.
export type Riasec = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export type RiasecScores = Record<Riasec, number>;

// An archetype is a friendly, on-brand face for one RIASEC dimension.
export interface Archetype {
  id: Riasec;
  name: string; // fun brand name, e.g. "The Maker"
  emoji: string;
  color: string; // hex from the brand palette
  tagline: string;
  description: string;
  traits: string[];
  // Populated at scoring time:
  scores?: RiasecScores;
  topScore?: number;
}

export interface QuestionOption {
  text: string;
  emoji?: string;
  // How strongly this answer leans toward each RIASEC dimension.
  // Empty weights = skip / none of these (no score change).
  weights: Partial<RiasecScores>;
  /** Soft skip — none of the answers fit. */
  skip?: boolean;
}

export interface Question {
  id: string;
  question: string;
  options: QuestionOption[];
}

export type CompanySize = 'startup' | 'mid' | 'enterprise';

export interface CompanyInfo {
  description: string;
  pros: string[];
  cons: string[];
  typicalTasks: string[];
}

export type CompanySizeDetails = Record<CompanySize, CompanyInfo>;

export type SalaryRange = Record<CompanySize, string>;

// Work-style attributes — the "I don't like meetings / I want remote" angle.
export interface WorkStyle {
  remoteFriendly: 'high' | 'medium' | 'low';
  meetingLoad: 'high' | 'medium' | 'low';
  pace: 'fast' | 'steady' | 'calm';
  peopleFacing: 'high' | 'medium' | 'low';
}

/** How people typically break into the role. */
export type EntryPath =
  | 'degree'
  | 'bootcamp'
  | 'apprenticeship'
  | 'portfolio'
  | 'mixed';

export interface CareerEntry {
  path: EntryPath;
  note: string;
}

export interface ProofProject {
  title: string;
  brief: string;
}

// ---- "Try a shift" job-preview scenarios ----

/**
 * How a shift scenario plays. The mechanic follows the job's core daily loop
 * (what the worker stares at and decides on), not its RIASEC letter.
 * The library grows as careers need new loops.
 */
export type ShiftMechanic = 'photoStory' | 'sequencing' | 'dialogue' | 'printout';

export type ShiftQuality = 'best' | 'ok' | 'bad';

export interface ShiftChoice {
  text: string;
  /** What happens + how a pro thinks about it. The teaching payload. */
  outcome: string;
  quality: ShiftQuality;
}

/** sequencing: one order on the board. */
export interface ShiftTicket {
  item: string;
  station: string;
  /** Minutes it's been on the board. */
  age: number;
  status: 'new' | 'cooking' | 'dying';
  /** Extra line on the ticket — cook time, flags ("12 min cook"). */
  note?: string;
}

/** dialogue: one message in the thread. */
export interface ShiftMessage {
  from: 'them' | 'you';
  /** Who's talking when it isn't you ("Mrs. Alvarez", "Charge nurse"). */
  name?: string;
  text: string;
}

/** printout: a paper artifact (report, log, ledger, readings). */
export interface ShiftPaper {
  title: string;
  /** Monospace lines, printed as-is. */
  lines: string[];
}

export interface ShiftBeat {
  id: string;
  prompt: string;
  choices: ShiftChoice[];
  /** photoStory: what you're looking at; doubles as the gen-image brief. */
  scene?: string;
  /** photoStory: emoji stand-in until a generated render is bundled. */
  sceneEmoji?: string;
  /** photoStory: bundled render filename (Krea etc.) once generated. */
  image?: string;
  /** sequencing: the board at this moment. */
  tickets?: ShiftTicket[];
  /** dialogue: the conversation so far. */
  messages?: ShiftMessage[];
  /** printout: the document in your hands. */
  paper?: ShiftPaper;
}

export interface ShiftScenario {
  id: string;
  careerId: string;
  mechanic: ShiftMechanic;
  title: string;
  /** Scene-setting intro line ("Friday, 6:04 PM…"). */
  setting: string;
  beats: ShiftBeat[];
  /** Verdict-screen text — the honest texture of the job. */
  debrief: string;
}

/** Codecademy-style match buckets (display order). */
export type MatchTier = 'most' | 'alot' | 'also' | 'little';

/** Wiring = how you work today; buildToward = secondary aspiration / proof path. */
export type MatchLane = 'wiring' | 'buildToward';

export interface Career {
  id: string;
  title: string;
  category: string;
  emoji: string;
  description: string;
  // RIASEC interest profile of the career — O*NET OI scale (1–7 per dimension).
  riasec: Partial<RiasecScores>;
  primaryArchetype: Riasec;
  /** Source O*NET-SOC occupation(s) the riasec profile was generated from. */
  onetCodes?: string[];
  skills: string[];
  workStyle: WorkStyle;
  companySize: CompanySizeDetails;
  salary: SalaryRange;
  /** How people get in + one-line note. */
  entry: CareerEntry;
  /** Concrete projects that prove fit for the role. */
  proofProjects: ProofProject[];
  // Populated at match time:
  matchScore?: number;
  matchTier?: MatchTier;
  matchLane?: MatchLane;
}
