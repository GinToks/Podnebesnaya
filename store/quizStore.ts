import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import type { Product, ScentCategory } from "@/data/products";

export interface QuizOption {
  id: string;
  text: string;
  categories: ScentCategory[];
}

export interface QuizQuestion {
  id: string;
  title: string;
  options: QuizOption[];
}

export interface QuizSettings {
  welcomeTitle: string;
  welcomeText: string;
  resultTitle: string;
  resultText: string;
}

export interface QuizState {
  questions: QuizQuestion[];
  settings: QuizSettings;
  setQuestions: (questions: QuizQuestion[]) => void;
  addQuestion: (question: Omit<QuizQuestion, "id"> & { id?: string }) => void;
  updateQuestion: (id: string, patch: Partial<QuizQuestion>) => void;
  deleteQuestion: (id: string) => void;
  addOption: (questionId: string, option: Omit<QuizOption, "id"> & { id?: string }) => void;
  updateOption: (questionId: string, optionId: string, patch: Partial<QuizOption>) => void;
  deleteOption: (questionId: string, optionId: string) => void;
  setSettings: (patch: Partial<QuizSettings>) => void;
  reset: () => void;
}

const defaultQuestions: QuizQuestion[] = [
  {
    id: "mood",
    title: "Какое настроение вы ищете?",
    options: [
      { id: "calm", text: "Спокойствие и уют", categories: ["fresh", "floral"] },
      { id: "energy", text: "Энергия и бодрость", categories: ["spicy", "fresh"] },
      { id: "romance", text: "Романтика", categories: ["floral"] },
      { id: "mystic", text: "Таинственность", categories: ["woody", "spicy"] },
    ],
  },
  {
    id: "season",
    title: "Какой сезон вам ближе?",
    options: [
      { id: "spring", text: "Весна", categories: ["floral", "fresh"] },
      { id: "summer", text: "Лето", categories: ["fresh"] },
      { id: "autumn", text: "Осень", categories: ["spicy", "woody"] },
      { id: "winter", text: "Зима", categories: ["woody", "spicy"] },
    ],
  },
  {
    id: "intensity",
    title: "Какая интенсивность аромата?",
    options: [
      { id: "light", text: "Лёгкая", categories: ["fresh", "floral"] },
      { id: "medium", text: "Средняя", categories: ["floral", "woody"] },
      { id: "strong", text: "Насыщенная", categories: ["woody", "spicy"] },
      { id: "very-strong", text: "Очень насыщенная", categories: ["spicy", "woody"] },
    ],
  },
  {
    id: "occasion",
    title: "Для какого случая?",
    options: [
      { id: "daily", text: "На каждый день", categories: ["fresh", "floral"] },
      { id: "evening", text: "Вечер / свидание", categories: ["floral", "spicy"] },
      { id: "meditation", text: "Медитация / отдых", categories: ["woody", "fresh"] },
      { id: "gift", text: "В подарок", categories: ["floral", "spicy"] },
    ],
  },
  {
    id: "preference",
    title: "Какие ноты предпочитаете?",
    options: [
      { id: "floral", text: "Цветочные", categories: ["floral"] },
      { id: "woody", text: "Древесные", categories: ["woody"] },
      { id: "fresh", text: "Свежие / зелёные", categories: ["fresh"] },
      { id: "spicy", text: "Пряные", categories: ["spicy"] },
    ],
  },
];

const defaultSettings: QuizSettings = {
  welcomeTitle: "Найдите свой аромат",
  welcomeText:
    "Ответьте на 5 вопросов, и мы подберём свечи, которые гармонируют с вашим настроением и сезоном.",
  resultTitle: "Вам подойдут эти ароматы",
  resultText: "Основываясь на ваших ответах, мы рекомендуем:",
};

const genId = () => `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const genOptId = () => `o-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const useQuizStore = create<QuizState>()(
  devtools(
    persist(
      (set) => ({
        questions: defaultQuestions,
        settings: defaultSettings,
        setQuestions: (questions) => set({ questions }),
        addQuestion: (question) => {
          const id = question.id ?? genId();
          set((state) => ({
            questions: [...state.questions, { ...question, id, options: question.options ?? [] }],
          }));
        },
        updateQuestion: (id, patch) =>
          set((state) => ({
            questions: state.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)),
          })),
        deleteQuestion: (id) =>
          set((state) => ({ questions: state.questions.filter((q) => q.id !== id) })),
        addOption: (questionId, option) => {
          const id = option.id ?? genOptId();
          set((state) => ({
            questions: state.questions.map((q) =>
              q.id === questionId
                ? { ...q, options: [...q.options, { ...option, id }] }
                : q
            ),
          }));
        },
        updateOption: (questionId, optionId, patch) =>
          set((state) => ({
            questions: state.questions.map((q) =>
              q.id === questionId
                ? {
                    ...q,
                    options: q.options.map((o) =>
                      o.id === optionId ? { ...o, ...patch } : o
                    ),
                  }
                : q
            ),
          })),
        deleteOption: (questionId, optionId) =>
          set((state) => ({
            questions: state.questions.map((q) =>
              q.id === questionId
                ? { ...q, options: q.options.filter((o) => o.id !== optionId) }
                : q
            ),
          })),
        setSettings: (patch) =>
          set((state) => ({ settings: { ...state.settings, ...patch } })),
        reset: () => set({ questions: defaultQuestions, settings: defaultSettings }),
      }),
      {
        name: "podnebesnaya-quiz",
        partialize: (state) => ({ questions: state.questions, settings: state.settings }) as unknown,
        storage: typeof window !== "undefined" ? createJSONStorage(() => localStorage) : undefined,
      }
    )
  )
);

export function computeRecommendations(
  answers: Record<string, string>,
  questions: QuizQuestion[],
  products: Product[],
  limit = 4
): Product[] {
  const weights: Record<string, number> = {};
  questions.forEach((q) => {
    const optId = answers[q.id];
    const opt = q.options.find((o) => o.id === optId);
    opt?.categories?.forEach((c) => {
      weights[c] = (weights[c] || 0) + 1;
    });
  });
  return products
    .map((p) => ({ p, score: weights[p.category] || 0 }))
    .sort((a, b) => b.score - a.score || b.p.stock - a.p.stock)
    .slice(0, limit)
    .map((x) => x.p);
}
