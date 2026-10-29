"use client";

import { useQuizStore } from "@/store/quizStore";

export default function QuizTab() {
  const { questions: quizQuestions, settings: quizSettings, addQuestion: addQuizQuestion, updateQuestion: updateQuizQuestion, deleteQuestion: deleteQuizQuestion, addOption: addQuizOption, updateOption: updateQuizOption, deleteOption: deleteQuizOption, setSettings: setQuizSettings, reset: resetQuiz } = useQuizStore();

  return (
    <>
      <div className="mb-8">
        <h1 className="serif text-3xl font-light tracking-[0.1em] text-ink">Квиз</h1>
        <p className="text-sm text-ink-muted mt-1">Редактируйте вопросы, ответы и баллы (категории ароматов).</p>
      </div>
      <div className="mb-6 p-6 bg-bg-elevated border border-mist rounded-xl shadow-sm">
        <h2 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">Настройки квиза</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">Заголовок приветствия</label>
            <input value={quizSettings.welcomeTitle} onChange={(e) => setQuizSettings({ welcomeTitle: e.target.value })} className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">Текст приветствия</label>
            <textarea value={quizSettings.welcomeText} onChange={(e) => setQuizSettings({ welcomeText: e.target.value })} rows={2} className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">Заголовок результата</label>
            <input value={quizSettings.resultTitle} onChange={(e) => setQuizSettings({ resultTitle: e.target.value })} className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">Текст результата</label>
            <textarea value={quizSettings.resultText} onChange={(e) => setQuizSettings({ resultText: e.target.value })} rows={2} className="w-full px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => addQuizQuestion({ title: "Новый вопрос", options: [] })} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-bg text-xs font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors">+ Вопрос</button>
          <button onClick={resetQuiz} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-mist text-ink text-xs font-medium tracking-wide uppercase hover:bg-mist transition-colors">Сбросить</button>
        </div>
      </div>
      <div className="space-y-6">
        {quizQuestions.map((q) => (
          <div key={q.id} className="p-6 bg-bg border border-mist rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <input value={q.title} onChange={(e) => updateQuizQuestion(q.id, { title: e.target.value })} className="flex-1 px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
              <button onClick={() => deleteQuizQuestion(q.id)} className="text-xs text-accent hover:underline">Удалить</button>
            </div>
            <div className="space-y-3">
              {q.options.map((opt) => (
                <div key={opt.id} className="flex flex-col md:flex-row gap-2 items-start md:items-center p-3 bg-mist/30 rounded-lg">
                  <input value={opt.text} onChange={(e) => updateQuizOption(q.id, opt.id, { text: e.target.value })} className="flex-1 px-3 py-2 rounded bg-mist border border-mist text-ink text-sm focus:border-accent outline-none transition-colors" />
                  <div className="flex flex-wrap gap-2">
                    {["fresh", "floral", "woody", "spicy"].map((cat) => (
                      <label key={cat} className="flex items-center gap-1 text-xs text-ink-muted">
                        <input type="checkbox" checked={opt.categories.includes(cat as never)} onChange={(e) => {
                          const cats = e.target.checked ? [...opt.categories, cat] : opt.categories.filter((c) => c !== cat);
                          updateQuizOption(q.id, opt.id, { categories: cats as never });
                        }} className="rounded border-mist" />
                        {cat}
                      </label>
                    ))}
                  </div>
                  <button onClick={() => deleteQuizOption(q.id, opt.id)} className="text-xs text-accent hover:underline">✕</button>
                </div>
              ))}
            </div>
            <button onClick={() => addQuizOption(q.id, { text: "Новый ответ", categories: [] })} className="mt-3 px-4 py-2 rounded-full border border-mist text-ink text-xs font-medium hover:bg-mist transition-colors">+ Ответ</button>
          </div>
        ))}
        {quizQuestions.length === 0 && <p className="text-ink-muted text-sm text-center py-8">Вопросов пока нет.</p>}
      </div>
    </>
  );
}
