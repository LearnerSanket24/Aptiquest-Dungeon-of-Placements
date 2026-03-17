import { Question } from '../types';

export const QUESTIONS: Question[] = [
  {
    id: '1',
    text: "If a train runs at 60 km/h, it takes 15 hours to complete a journey. How much time will it take at 90 km/h?",
    options: ["10 hours", "12 hours", "8 hours", "9 hours"],
    correctAnswer: 0,
    category: "Quantitative Aptitude",
    explanation: "Time = Distance / Speed. Distance = 60 * 15 = 900 km. New Time = 900 / 90 = 10 hours."
  },
  {
    id: '2',
    text: "Find the missing number in the series: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    correctAnswer: 1,
    category: "Logical Reasoning",
    explanation: "The differences are 4, 6, 8, 10, so the next difference is 12. 30 + 12 = 42."
  },
  {
    id: '3',
    text: "Choose the synonym for 'Abundant'.",
    options: ["Scarce", "Plentiful", "Rare", "Limited"],
    correctAnswer: 1,
    category: "English",
    explanation: "Abundant means existing or available in large quantities; plentiful."
  },
  {
    id: '4',
    text: "A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. The sum is:",
    options: ["Rs. 650", "Rs. 690", "Rs. 698", "Rs. 700"],
    correctAnswer: 2,
    category: "Quantitative Aptitude",
    explanation: "S.I. for 1 year = 854 - 815 = 39. S.I. for 3 years = 39 * 3 = 117. Principal = 815 - 117 = 698."
  },
  {
    id: '5',
    text: "If 'COB' is coded as 3152, then 'DOG' is coded as:",
    options: ["4157", "4158", "4167", "4156"],
    correctAnswer: 0,
    category: "Logical Reasoning",
    explanation: "C=3, O=15, B=2. D=4, O=15, G=7."
  }
];
