import React, { useState } from "react";
import "./AIAssistant.css";
import ReactMarkdown from "react-markdown";

export default function AIAssistant({ summary }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

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

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      setAnswer(result?.answer || "No response received from AI.");
    } catch (err) {
      console.error(err);
      setAnswer("Unable to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-container">
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask anything about your business..."
        disabled={loading}
      />

      <button onClick={askQuestion} disabled={loading}>
        {loading ? "Thinking..." : "Ask"}
      </button>

      {
        answer && (
          <div className="ai-answer">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        );
      }
    </div>
  );
}
