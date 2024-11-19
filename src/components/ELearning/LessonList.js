// components/ELearning/LessonList.js
import { useState } from 'react';
import LessonContent from './LessonContent';

export default function LessonList({ lessons, completedLessons, updateProgress }) {
  const [currentLesson, setCurrentLesson] = useState(null);

  const handleLessonClick = (lesson) => {
    setCurrentLesson(lesson);
  };

  const handleLessonComplete = async (lessonId) => {
    await updateProgress(lessonId);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 pr-4">
        <h2 className="text-2xl font-bold text-[#F0EDE5] mb-4">Lezioni</h2>
        <ul className="space-y-2">
          {lessons.map((lesson) => (
            <li 
              key={lesson.id}
              className={`p-2 rounded cursor-pointer ${
                completedLessons.includes(lesson.id)
                  ? 'bg-[#00613A] text-[#F0EDE5]'
                  : 'bg-[#1D4D2B] text-[#A1A0A0] hover:bg-[#00613A]'
              }`}
              onClick={() => handleLessonClick(lesson)}
            >
              {lesson.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full md:w-2/3 mt-6 md:mt-0">
        {currentLesson ? (
          <LessonContent 
            lesson={currentLesson}
            isCompleted={completedLessons.includes(currentLesson.id)}
            onComplete={() => handleLessonComplete(currentLesson.id)}
          />
        ) : (
          <p className="text-[#A1A0A0]">Seleziona una lezione per iniziare</p>
        )}
      </div>
    </div>
  );
}