// app/page.tsx
"use client";

import { useState, useRef } from "react";
import { submitQuizResults } from "./actions";

const QUESTIONS = [
  {
    id: "q1",
    text: "1. Тебе дали задание подготовить проект. Что ты сделаешь в первую очередь?",
    variants: {
      А: "Продумаю алгоритм, логику работы или напишу код.",
      Б: "Составлю смету, посчитаю расходы и выгоду.",
      В: "Подберу цвета, шрифты и оформлю красивую презентацию."
    }
  },
  {
    id: "q2",
    text: "2. Чем тебе интереснее заниматься в свободное время?",
    variants: {
      А: "Изучать новые гаджеты, софт или пробовать автоматизировать задачи.",
      Б: "Копить деньги на крупную покупку, вести учет своих трат.",
      В: "Рисовать, фотографировать или переставлять мебель в комнате."
    }
  },
  {
    id: "q3",
    text: "3. Представь, что ты создаешь интернет-магазин. Твоя роль:",
    variants: {
      А: "Сделать так, чтобы кнопки нажимались, а данные сохранялись в базе.",
      Б: "Рассчитать налоги, цены на товары и зарплату курьерам.",
      В: "Сделать удобный интерфейс и красивый логотип, чтобы сайт выглядел стильно."
    }
  },
  {
    id: "q4",
    text: "4. Какая ошибка больше всего тебе не нравится?",
    variants: {
      А: "«Лишняя» точка с запятой, из-за которой не запускается программа.",
      Б: "Ошибка в один рубль, из-за которой не сходится общая сумма.",
      В: "Неровный отступ или сочетание цветов, которое «режет глаз»."
    }
  },
  {
    id: "q5",
    text: "5. Твой идеальный инструмент для работы:",
    variants: {
      А: "Мощный ноутбук с черным экраном консоли и сложным кодом.",
      Б: "Таблицы Excel со множеством формул и графиков.",
      В: "Графический планшет или программы для обработки графики."
    }
  },
  {
    id: "q6",
    text: "6. Какую суперспособность ты бы выбрал?",
    variants: {
      А: "Понимать язык машин и управлять любой техникой силой мысли.",
      Б: "Видеть выгодные сделки и предсказывать курс валют.",
      В: "Создавать из ничего визуальные шедевры, которые всех восхищают."
    }
  },
  {
    id: "q7",
    text: "7. Какую ошибку тебе интереснее всего исправлять?",
    variants: {
      А: "Искать «баг» в системе, чтобы всё снова заработало.",
      Б: "Найти, куда «ушли» лишние деньги или где закралась ошибка в смете.",
      В: "Исправлять неудачный макет, чтобы сделать его визуально идеальным."
    }
  },
  {
    id: "q8",
    text: "8. В какой обстановке тебе комфортнее работать?",
    variants: {
      А: "За мощным компьютером, погрузившись в код или данные.",
      Б: "В современном офисе со строгим дресс-кодом и чётким графиком.",
      В: "В творческой студии или дома в свободном графике."
    }
  },
  {
    id: "q9",
    text: "9. Какая школьная дисциплина давалась легче и интереснее?",
    variants: {
      А: "Информатика, физика и математика.",
      Б: "Математика и обществознание.",
      В: "ИЗО, Литература, художественная культура."
    }
  }
];

export default function Home() {
  const [answers, setAnswers] = useState<Record<string, "А" | "Б" | "В">>({});
  const [result, setResult] = useState<{ title: string; description: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleSelect = (questionId: string, value: "А" | "Б" | "В", index: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    const nextQuestion = QUESTIONS[index + 1];
    
    setTimeout(() => {
      if (nextQuestion) {
        questionRefs.current[nextQuestion.id]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        questionRefs.current["submit-zone"]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 250);
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < QUESTIONS.length) {
      alert("Пожалуйста, ответьте на все вопросы опроса!");
      return;
    }

    setLoading(true);
    const res = await submitQuizResults(answers);
    setLoading(false);

    if (res.success) {
      setResult({ title: res.title, description: res.description });
      // Перематываем страницу в самый верх, так как контент поменяется на экран результата
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      alert(res.description);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center px-4 py-12 select-none">
      <div className="max-w-md w-full">
        
        {/* ЭКРАН 1: ВОПРОСЫ (показываем, только если результат еще не получен) */}
        {!result ? (
          <div className="space-y-24">
            <header className="text-center">
              <h1 className="text-3xl font-extrabold text-blue-400 tracking-tight">Профориентация</h1>
              <p className="text-slate-400 mt-2 text-sm">Узнай своё идеальное отделение в колледже</p>
            </header>

            {/* Интерактивный список вопросов */}
            {QUESTIONS.map((q, index) => {
              const currentAnswer = answers[q.id];

              return (
                <div
                  key={q.id}
                  ref={(el) => { questionRefs.current[q.id] = el; }}
                  className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700/60 transition-all duration-300"
                >
                  <h2 className="text-base font-semibold mb-5 text-slate-200 leading-snug">{q.text}</h2>
                  <div className="flex flex-col gap-3">
                    {(["А", "Б", "В"] as const).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelect(q.id, key, index)}
                        className={`p-4 rounded-xl text-left border text-sm font-normal transition-all duration-200 active:scale-98 leading-relaxed ${
                          currentAnswer === key
                            ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40 font-medium"
                            : "bg-slate-700/40 border-slate-600/70 hover:bg-slate-700 text-slate-300"
                        }`}
                      >
                        <span className="font-bold text-blue-400 mr-1">{key}.</span> {q.variants[key]}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Блок отправки */}
            <div 
              ref={(el) => { questionRefs.current["submit-zone"] = el; }}
              className="text-center pt-6"
            >
              <button
                onClick={handleSubmit}
                disabled={loading || Object.keys(answers).length < QUESTIONS.length}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 border disabled:border-slate-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 text-lg"
              >
                {loading ? "Обработка ответов..." : "Узнать результат"}
              </button>
            </div>
          </div>
        ) : (
          /* ЭКРАН 2: ВЫВОД РЕЗУЛЬТАТА (показывается взамен вопросов) */
          <div className="space-y-8 pt-8 animate-fade-in">
            <header className="text-center">
              <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">Тест завершен!</h1>
              <p className="text-slate-400 mt-2 text-sm">Мы проанализировали твои ответы и вот вердикт:</p>
            </header>

            <div className="bg-gradient-to-br from-slate-800 to-indigo-950 p-8 rounded-2xl border-2 border-emerald-500/30 text-left shadow-2xl space-y-4">
              <h3 className="text-2xl font-black text-emerald-400 tracking-wide text-center leading-tight">
                {result.title}
              </h3>
              <p className="text-base text-slate-300 leading-relaxed pt-4 border-t border-slate-700/50">
                {result.description}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold py-4 px-6 rounded-2xl transition-all duration-200 text-base"
            >
              Пройти тест заново
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
