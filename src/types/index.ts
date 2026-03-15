export interface Question {
  id: number;
  question: string;
  question_ml?: string;
  options: string[];
  options_ml?: string[];
  answer: number; // index of correct option
  kerala_stat_2026: string;
  national_average: string;
  historical_benchmark: string;
  flex_fact: string;
  flex_fact_ml?: string;
  source: string;
}

export interface Module {
  slug: string;
  title: string;
  title_ml: string;
  dept_tag: string;
  icon: string;
  color: string;
  description: string;
  questions: Question[];
}

export interface ModuleScore {
  slug: string;
  score: number;
  total: number;
  completed: boolean;
}
