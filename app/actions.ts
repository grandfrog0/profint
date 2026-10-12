// app/actions.ts
"use server";

import fs from "fs";
import path from "path";

interface QuizAnswers {
  [key: string]: "А" | "Б" | "В";
}

// Путь к файлу, где будет лежать статистика (в корне проекта файл stats.json)
const STATS_FILE_PATH = path.join(process.cwd(), "stats.json");

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
      description = "Тебе нравится логика, структура и решение технических задач. Ты сможешь стать разработчиком, сисадмином или оператором беспилотных летательных аппаратов. В колледже тебе отлично подойдут отделения: «ИТ и БПЛА», «Программирование».";
    } else if (counts.Б >= counts.А && counts.Б >= counts.В) {
      title = "Твой путь: Экономика и финансы";
      sphere = "Экономика";
      description = "Ты любишь точность, расчеты и порядок в делах. Твои специальности в колледже: «Экономика и бухгалтерский учет», «Банковское дело». Из тебя выйдет отличный аналитик, бухгалтер или менеджер.";
    } else {
      title = "Твой путь: Креативные индустрии";
      sphere = "Креатив";
      description = "У тебя развито визуальное восприятие, чувство стиля, но ты не хочешь ограничивать себя рамками одного учебника. Твое место на отделении креативных индустрий! Здесь дизайн, реклама, музыка и анимация создают единую экосистему. Ты научишься не просто «рисовать», а создавать целые миры и упаковывать идеи в крутые медиапродукты.";
    }

    // 2. ЛОГИКА СБОРА ДАННЫХ: Читаем старый файл и добавляем новую запись
    let currentData = [];
    
    // Если файл со статистикой уже существует — считываем его
    if (fs.existsSync(STATS_FILE_PATH)) {
      const fileContent = fs.readFileSync(STATS_FILE_PATH, "utf-8");
      try {
        currentData = JSON.parse(fileContent);
      } catch (e) {
        currentData = []; // Если файл был побит или пуст
      }
    }

    // Создаем объект новой записи
    const newEntry = {
      timestamp: new Date().toISOString(), // Дата и время прохождения
      answers: answers,                    // Что конкретно ответил
      resultSphere: sphere                 // Итоговый вердикт
    };

    // Добавляем запись в массив
    currentData.push(newEntry);

    // Записываем обновленный массив обратно в файл stats.json с красивыми отступами
    fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(currentData, null, 2), "utf-8");

    // Вывод в консоль сервера для проверки
    console.log(`=== СЕРВЕР: Новая запись добавлена! Всего ответов: ${currentData.length} ===`);

    return { success: true, title, description };
  } catch (error) {
    console.error("Ошибка сервера при записи файла:", error);
    return { success: false, title: "Ошибка", description: "Не удалось сохранить результат на сервере." };
  }
}
