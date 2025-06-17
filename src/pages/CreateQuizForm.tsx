import React, { useState } from "react";
import { ref, set } from "firebase/database";
import { database } from "../firebase"; // Your firebase config file

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

  // Handle question text change
  const updateQuestionText = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = text;
    setQuestions(newQuestions);
  };

  // Handle option change
  const updateOption = (qIndex: number, oIndex: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = text;
    setQuestions(newQuestions);
  };

  // Add new option to question
  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push("");
    setQuestions(newQuestions);
  };

  // Remove option from question
  const removeOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length > 2) {
      newQuestions[qIndex].options.splice(oIndex, 1);
      // Adjust answerIndex if needed
      if (
        newQuestions[qIndex].answerIndex !== null &&
        oIndex < newQuestions[qIndex].answerIndex!
      ) {
        newQuestions[qIndex].answerIndex!--;
      } else if (oIndex === newQuestions[qIndex].answerIndex) {
        newQuestions[qIndex].answerIndex = null;
      }
      setQuestions(newQuestions);
    }
  };

  // Set correct answer index
  const setAnswerIndex = (qIndex: number, index: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answerIndex = index;
    setQuestions(newQuestions);
  };

  // Add new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", ""], answerIndex: null },
    ]);
  };

  // Remove question
  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId || !quizId) {
      alert("Please enter class ID and quiz ID");
      return;
    }
    for (const q of questions) {
      if (!q.questionText.trim()) {
        alert("All questions must have text");
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        alert("All options must be filled");
        return;
      }
      if (q.answerIndex === null) {
        alert("All questions must have a correct answer selected");
        return;
      }
    }

    try {
      // Save questions under quizzes/{classId}/{quizId}/questionBank
      const updates: Record<string, any> = {};
      questions.forEach((q, i) => {
        updates[
          `quizzes/${classId}/${quizId}/questionBank/q${i + 1}`
        ] = {
          question: q.questionText,
          options: q.options,
          answer: q.answerIndex,
        };
      });
      await Promise.all(
        Object.entries(updates).map(([path, data]) =>
          set(ref(database, path), data)
        )
      );
      alert("Quiz saved successfully!");
      // Reset form (optional)
      setClassId("");
      setQuizId("");
      setQuestions([{ questionText: "", options: ["", ""], answerIndex: null }]);
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Class ID: </label>
        <input
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Quiz ID: </label>
        <input
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
          required
        />
      </div>

      {questions.map((q, qIndex) => (
        <div key={qIndex} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <label>Question {qIndex + 1}:</label>
          <input
            type="text"
            value={q.questionText}
            onChange={(e) => updateQuestionText(qIndex, e.target.value)}
            required
            style={{ width: "100%" }}
          />
          <div>
            Options:
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  required
                  style={{ flexGrow: 1 }}
                />
                <button
                  type="button"
                  onClick={() => removeOption(qIndex, oIndex)}
                  disabled={q.options.length <= 2}
                  style={{ marginLeft: "5px" }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addOption(qIndex)}>
              Add Option
            </button>
          </div>

          <div>
            Correct Answer:
            {q.options.map((_, oIndex) => (
              <label key={oIndex} style={{ marginLeft: "10px" }}>
                <input
                  type="radio"
                  name={`answer-${qIndex}`}
                  checked={q.answerIndex === oIndex}
                  onChange={() => setAnswerIndex(qIndex, oIndex)}
                  required
                />
                Option {oIndex + 1}
              </label>
            ))}
          </div>

          {questions.length > 1 && (
            <button type="button" onClick={() => removeQuestion(qIndex)} style={{ marginTop: "10px" }}>
              Remove Question
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={addQuestion}>
        Add Question
      </button>
      <br />
      <button type="submit" style={{ marginTop: "15px" }}>
        Save Quiz
      </button>
    </form>
  );
};
