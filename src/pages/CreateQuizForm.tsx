import React, { useState } from "react";
import { ref, set } from "firebase/database";
import { database } from "../firebase";

type Option = string;

interface Question {
  questionText: string;
  options: Option[];
  answerIndex: number | null;
}

export default function CreateQuizForm() {
  const [classId, setClassId] = useState("");
  const [quizId, setQuizId] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { questionText: "", options: ["", ""], answerIndex: null },
  ]);

  // Helper function to update questions immutably
  const updateQuestions = (updater: (questions: Question[]) => void) => {
    setQuestions(prev => {
      const newQuestions = [...prev];
      updater(newQuestions);
      return newQuestions;
    });
  };

  const updateQuestionText = (index: number, text: string) => {
    updateQuestions(questions => {
      questions[index].questionText = text;
    });
  };

  const updateOption = (qIndex: number, oIndex: number, text: string) => {
    updateQuestions(questions => {
      questions[qIndex].options[oIndex] = text;
    });
  };

  const addOption = (qIndex: number) => {
    updateQuestions(questions => {
      questions[qIndex].options.push("");
    });
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    updateQuestions(questions => {
      if (questions[qIndex].options.length > 2) {
        const answerIndex = questions[qIndex].answerIndex;
        questions[qIndex].options.splice(oIndex, 1);
        
        if (answerIndex !== null) {
          if (oIndex < answerIndex) {
            questions[qIndex].answerIndex = answerIndex - 1;
          } else if (oIndex === answerIndex) {
            questions[qIndex].answerIndex = null;
          }
        }
      }
    });
  };

  const setAnswerIndex = (qIndex: number, index: number) => {
    updateQuestions(questions => {
      questions[qIndex].answerIndex = index;
    });
  };

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { questionText: "", options: ["", ""], answerIndex: null },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!classId || !quizId) {
      alert("Please enter class ID and quiz ID");
      return;
    }

    const validationErrors = questions.flatMap((q, i) => {
      const errors = [];
      if (!q.questionText.trim()) errors.push(`Question ${i + 1} has no text`);
      if (q.options.some(opt => !opt.trim())) errors.push(`Question ${i + 1} has empty options`);
      if (q.answerIndex === null) errors.push(`Question ${i + 1} has no correct answer`);
      return errors;
    });

    if (validationErrors.length > 0) {
      alert(validationErrors.join("\n"));
      return;
    }

    try {
      const updates = questions.reduce((acc, q, i) => {
        acc[`quizzes/${classId}/${quizId}/questionBank/q${i + 1}`] = {
          question: q.questionText,
          options: q.options,
          answer: q.answerIndex,
        };
        return acc;
      }, {} as Record<string, unknown>);

      await Promise.all(
        Object.entries(updates).map(([path, data]) =>
          set(ref(database, path), data)
      ));

      alert("Quiz saved successfully!");
      setClassId("");
      setQuizId("");
      setQuestions([{ questionText: "", options: ["", ""], answerIndex: null }]);
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md" style={{justifyItems: 'center'}}>
      <h1 className="text-2xl font-bold text-center mb-6">Create New Quiz</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class ID
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiz ID
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={quizId}
              onChange={(e) => setQuizId(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="p-4 border border-gray-200 rounded-lg">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question {qIndex + 1}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={q.questionText}
                  onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options
                </label>
                <div className="space-y-2">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        value={opt}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                        onClick={() => removeOption(qIndex, oIndex)}
                        disabled={q.options.length <= 2}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  onClick={() => addOption(qIndex)}
                >
                  + Add Option
                </button>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer
                </label>
                <div className="flex flex-wrap gap-4">
                  {q.options.map((_, oIndex) => (
                    <label key={oIndex} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={`answer-${qIndex}`}
                        checked={q.answerIndex === oIndex}
                        onChange={() => setAnswerIndex(qIndex, oIndex)}
                        className="text-blue-600"
                        required
                      />
                      <span>Option {oIndex + 1}</span>
                    </label>
                  ))}
                </div>
              </div>

              {questions.length > 1 && (
                <button
                  type="button"
                  className="w-full mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  onClick={() => removeQuestion(qIndex)}
                >
                  Remove Question
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
            onClick={addQuestion}
          >
            + Add Question
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Quiz
          </button>
        </div>
      </form>
    </div>
  );
}