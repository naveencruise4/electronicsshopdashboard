import React, { useState } from "react";
import "./AIAssistant.css";

export default function AIAssistant({ summary }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askQuestion = async () => {
    if (!question.trim()) return;

    setAnswer("Thinking...");

    try {
      const response = await fetch(
        "https://retail-ai-buddy.fearlessnaveen4.workers.dev/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            question,
            summary
          })
        }
      );

      const result = await response.json();

      setAnswer(result.answer);
    } catch (err) {
      setAnswer("Unable to process request.");
    }
  };

  return (
    <div className="ai-container">

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask anything about your business..."
      />

      <button onClick={askQuestion}>
        Ask
      </button>

      {answer && (
        <div className="ai-answer">
          {answer}
        </div>
      )}
    </div>
  );
}
