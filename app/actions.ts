// app/actions.ts
"use server";

import fs from "fs";
import path from "path";

interface QuizAnswers {
  [key: string]: "А" | "Б" | "В";
}

// Путь к файлу, где будет лежать статистика (в корне проекта файл stats.json)
const STATS_FILE_PATH = path.join(process.cwd(), "data/stats.json");

export async function submitQuizResults(answers: QuizAnswers) {
  try {
    // 1. Считаем, каких букв больше всего
    const counts = { А: 0, Б: 0, В: 0 };
    Object.values(answers).forEach((val) => {
      if (counts[val] !== undefined) {
        counts[val]++;
      }
    });

    let title = "";
    let description = "";
    let sphere = ""; // Для детальной статистики

    if (counts.А >= counts.Б && counts.А >= counts.В) {
      title = "Сфера IT";
      sphere = "IT";
      description =
        "Тебе нравится логика, структура и решение технических задач. Ты сможешь стать разработчиком, сисадмином или оператором беспилотных летательных аппаратов. В колледже тебе отлично подойдут отделения: «ИТ и БПЛА», «Программирование».";
    } else if (counts.Б >= counts.А && counts.Б >= counts.В) {
      title = "Твой путь: Экономика и финансы";
      sphere = "Экономика";
      description =
        "Ты любишь точность, расчеты и порядок в делах. Твои специальности в колледже: «Экономика и бухгалтерский учет», «Банковское дело». Из тебя выйдет отличный аналитик, бухгалтер или менеджер.";
    } else {
      title = "Твой путь: Креативные индустрии";
      sphere = "Креатив";
      description =
        "У тебя развито визуальное восприятие, чувство стиля, но ты не хочешь ограничивать себя рамками одного учебника. Твое место на отделении креативных индустрий! Здесь дизайн, реклама, музыка и анимация создают единую экосистему. Ты научишься не просто «рисовать», а создавать целые миры и упаковывать идеи в крутые медиапродукты.";
    }

    // Проверяем, запущен ли сайт на Vercel (в облаке)
    const isVercel = process.env.VERCEL === "1";

    if (isVercel) {
      // В облаке Vercel просто выводим данные в консоль, чтобы сайт не падал
      console.log("=== ОБЛАКО VERCEL: Статистика ответов ===");
      console.log("Данные ответа:", JSON.stringify(answers));
    } else {
      // На твоем компьютере (локально) продолжает работать сохранение в файл stats.json
      let currentData = [];
      if (fs.existsSync(STATS_FILE_PATH)) {
        const fileContent = fs.readFileSync(STATS_FILE_PATH, "utf-8");
        try {
          currentData = JSON.parse(fileContent);
        } catch {
          currentData = [];
        }
      }

      const newEntry = {
        timestamp: new Date().toISOString(),
        answers: answers,
        resultSphere: sphere,
      };

      currentData.push(newEntry);
      fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(currentData, null, 2), "utf-8");
      console.log(`=== ЛОКАЛЬНЫЙ СЕРВЕР: Записано в файл. Всего: ${currentData.length} ===`);
    }

    return { success: true, title, description };
  } catch (error) {
    console.error("Ошибка сервера при записи файла:", error);
    return {
      success: false,
      title: "Ошибка",
      description: "Не удалось сохранить результат на сервере.",
    };
  }
}

export async function getGeneralStats() {
  try {
    const totalCounts = { IT: 0, Экономика: 0, Креатив: 0, total: 0 };

    if (fs.existsSync(STATS_FILE_PATH)) {
      const fileContent = fs.readFileSync(STATS_FILE_PATH, "utf-8");
      const currentData = JSON.parse(fileContent);

      // Проходимся по всем записям в файле и суммируем результаты
      currentData.forEach((entry: { resultSphere: "IT" | "Экономика" | "Креатив" }) => {
        if (entry.resultSphere === "IT") totalCounts.IT++;
        if (entry.resultSphere === "Экономика") totalCounts.Экономика++;
        if (entry.resultSphere === "Креатив") totalCounts.Креатив++;
      });

      totalCounts.total = currentData.length;
    }

    return { success: true, data: totalCounts };
  } catch (error) {
    console.error("Ошибка при подсчете общей статистики:", error);
    return { success: false, data: { IT: 0, Экономика: 0, Креатив: 0, total: 0 } };
  }
}
