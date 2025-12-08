import { Flashcard } from '../types';

export const parseCSV = (csvContent: string): Flashcard[] => {
  const lines = csvContent.split('\n');
  const flashcards: Flashcard[] = [];

  // Regex to match CSV fields, respecting quotes
  const csvRegex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;

  lines.forEach((line, index) => {
    if (!line.trim()) return;

    // Simple parser fallback if the line is simple, otherwise use regex approach could be better
    // But for simplicity and robustness in this context, let's use a custom split logic
    // that respects standard CSV comma separation.
    
    // We will use a simple mapping: Col 0 = Question, Col 1 = Answer, Col 2 = Example, Col 3 = Image
    // Using a regex to split by comma but ignoring commas inside quotes
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g); 
    // The above is too simple. Let's use a simpler split by comma if we assume simple data, 
    // or a proper reducer.
    
    // Robust split by comma handling quotes
    const parts: string[] = [];
    let currentPart = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(currentPart.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        currentPart = '';
      } else {
        currentPart += char;
      }
    }
    parts.push(currentPart.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));

    if (parts.length >= 2) {
      const question = parts[0];
      const answer = parts[1];
      const example = parts[2] || undefined;
      const imageUrl = parts[3] || undefined;

      if (question && answer) {
        flashcards.push({
          id: `card-${index}`,
          question,
          answer,
          example,
          imageUrl,
          // Initialize SRS defaults
          interval: 0,
          repetition: 0,
          efactor: 2.5,
          dueDate: Date.now()
        });
      }
    }
  });

  return flashcards;
};