export type Document = {
  id: string;
  title: string;
  topic: string;
  uploadedAt: string;
  wordCount: number;
};

export type AssessmentResult = {
  date: string;
  score: number;
};

export type RecommendedMaterial = {
  documentId: string;
  title: string;
  topic: string;
  sections: string[];
  reason: string;
};

export type Question = {
  id: string;
  type: 'multiple-choice' | 'fill-in-the-blank';
  question: string;
  options?: string[];
  answer: string;
};
