export interface Flashcard {
  id: string;
  word: string;
  type: string;
  cefr: 'b2' | 'c1';
  definition: string;
  example: string;
  phon_br: string;
  phon_n_am: string;
  word_pl: string;
}

export type StudyMode = 'en_to_en' | 'pl_to_en';
export type CefrLevel = 'b2' | 'c1' | 'both';
