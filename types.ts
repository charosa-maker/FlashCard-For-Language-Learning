export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  example?: string;
  imageUrl?: string;
  // SRS metadata
  interval: number;
  repetition: number;
  efactor: number;
  dueDate?: number;
}

export interface CSVParseResult {
  data: Flashcard[];
  error?: string;
}