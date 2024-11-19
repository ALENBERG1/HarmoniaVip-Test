// components/ELearning/LessonContent.js
import { useState } from 'react';

export default function LessonContent({ lesson, isCompleted, onComplete }) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  const handleAnswerChange = (questionId, answer) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answer });
  };

  const handleSubmitQuiz = () => {
    const allCorrect = lesson.quiz.every(
      (question) => quizAnswers[question.id] === question.correctAnswer
    );
    if (allCorrect) {
      onComplete();
      alert('Congratulazioni! Hai completato la lezione.');
    } else {
      alert('Riprova! Non tutte le risposte sono corrette.');
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg p-4">
      <h2 className="text-2xl font-bold text-white mb-4">{lesson.title}</h2>
      <div className="text-gray-300 mb-6" dangerouslySetInnerHTML={{ __html: lesson.content }} />
      {!showQuiz && !isCompleted && (
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          onClick={() => setShowQuiz(true)}
        >
          Inizia il quiz
        </button>
      )}
      {showQuiz && !isCompleted && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-white mb-4">Quiz</h3>
          {lesson.quiz.map((question) => (
            <div key={question.id} className="mb-4">
              <p className="text-white mb-2">{question.question}</p>
              {question.options.map((option) => (
                <label key={option} className="block text-gray-300 mb-2">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    onChange={() => handleAnswerChange(question.id, option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
            onClick={handleSubmitQuiz}
          >
            Invia risposte
          </button>
        </div>
      )}
      {isCompleted && (
        <p className="text-green-500 font-bold">Lezione completata!</p>
      )}
    </div>
  );
}