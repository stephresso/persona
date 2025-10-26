export interface Archetype {
  id: string;
  name: string;
  description: string;
  traits: string[];
  scores?: { [key: string]: number };
  topScore?: number;
}

export interface Question {
  id: string;
  question: string;
  options: QuestionOption[];
}

export interface QuestionOption {
  text: string;
  archetype: string;
  weight: number;
}

export interface Career {
  id: string;
  title: string;
  category: string;
  description: string;
  archetypeMatches: string[];
  primaryArchetype: string;
  skills: string[];
  companySize: CompanySizeDetails;
  salary: SalaryRange;
  matchScore?: number;
  companyDetails?: CompanyInfo;
}

export interface CompanySizeDetails {
  startup: CompanyInfo;
  mid: CompanyInfo;
  enterprise: CompanyInfo;
}

export interface CompanyInfo {
  description: string;
  pros: string[];
  cons: string[];
  typicalTasks: string[];
}

export interface SalaryRange {
  startup: string;
  mid: string;
  enterprise: string;
}

export type CompanySize = 'startup' | 'mid' | 'enterprise';
