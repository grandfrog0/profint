"use client";

import { useEffect, useState } from "react";
import { getGeneralStats } from "../actions";

interface StatsData {
  IT: number;
  Экономика: number;
  Креатив: number;
  total: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData>({ IT: 0, Экономика: 0, Креатив: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  // Автоматически запрашиваем данные с сервера при открытии страницы
  useEffect(() => {
    async function loadStats() {
      const res = await getGeneralStats();
      if (res.success) {
        setStats(res.data);
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <p className="text-lg">Загрузка статистики...</p>
      </main>
    );
  }

  // Считаем проценты для визуальных полосок (чтобы не делить на ноль)
  const getPercentage = (value: number) => {
    return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center">
      <div className="max-w-md w-full space-y-8 pt-8">
        <header className="text-center">
          <h1 className="text-3xl font-black text-blue-400">Панель статистики</h1>
          <p className="text-slate-400 mt-2 text-sm">Общие результаты тестирования пользователей</p>
        </header>

        {/* Общее количество */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center shadow-xl">
          <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">
            Всего пройдено тестов
          </p>
          <p className="text-5xl font-black text-white mt-2">{stats.total}</p>
        </div>

        {/* Сферы детально */}
        <div className="space-y-4">
          {/* Блок IT */}
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700/60 shadow-lg">
            <div className="flex justify-between font-bold text-sm mb-2">
              <span className="text-blue-400">💻 Сфера IT</span>
              <span>
                {stats.IT} чел. ({getPercentage(stats.IT)}%)
              </span>
            </div>
            <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-500"
                style={{ width: `${getPercentage(stats.IT)}%` }}
              ></div>
            </div>
          </div>

          {/* Блок Экономика */}
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700/60 shadow-lg">
            <div className="flex justify-between font-bold text-sm mb-2">
              <span className="text-emerald-400">📊 Экономика и финансы</span>
              <span>
                {stats.Экономика || stats.Экономика} чел. ({getPercentage(stats.Экономика)}%)
              </span>
            </div>
            <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${getPercentage(stats.Экономика)}%` }}
              ></div>
            </div>
          </div>

          {/* Блок Креатив */}
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700/60 shadow-lg">
            <div className="flex justify-between font-bold text-sm mb-2">
              <span className="text-purple-400">🎨 Креативные индустрии</span>
              <span>
                {stats.Креатив || stats.Креатив} чел. ({getPercentage(stats.Креатив)}%)
              </span>
            </div>
            <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full transition-all duration-500"
                style={{ width: `${getPercentage(stats.Креатив)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <a
          href="/"
          className="block text-center text-sm text-slate-500 hover:text-slate-400 transition-colors pt-4"
        >
          ← Вернуться к тесту
        </a>
      </div>
    </main>
  );
}
