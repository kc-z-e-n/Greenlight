// src/components/QuizPopup.tsx
import React, { useState } from 'react';


type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};


type Props = {
  questions: QuizQuestion[];
  onClose: () => void;
};

const QuizPopup: React.FC<Props> = ({ questions, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedOption === currentQuestion.answer;

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose(); // Close the popup after last question
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{justifyItems: 'center'}}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Quiz</h2>

        <p className="text-md font-semibold mb-3">
          {currentQuestion.question}
        </p>

        <div className="space-y-2 mb-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`w-full text-left p-2 rounded border ${
                selectedOption === option
                  ? option === currentQuestion.answer
                    ? 'bg-green-100 border-green-500'
                    : 'bg-red-100 border-red-500'
                  : 'hover:bg-gray-100 border-gray-300'
              }`}
              disabled={showFeedback}
            >
              {option}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className="mb-4 text-sm font-medium">
            {isCorrect ? (
              <p className="text-green-600">Correct!</p>
            ) : (
              <p className="text-red-600">
                Incorrect. Correct answer: <strong>{currentQuestion.answer}</strong>
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end">
          {showFeedback && (
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {currentIndex < questions.length - 1 ? 'Next' : 'Finish'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPopup;
