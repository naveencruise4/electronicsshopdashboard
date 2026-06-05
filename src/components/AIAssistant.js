import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./AIAssistant.css";

export default function AIAssistant({ summary }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const askQuestion = async () => {
    if (!question.trim() || loading) return;

    const userQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userQuestion
      }
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://retail-ai-buddy.fearlessnaveen4.workers.dev/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            question: userQuestion,
            summary
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();

      const aiResponse =
        result?.answer ||
        "No response was received from the AI service.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiResponse
        }
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "❌ Unable to process your request. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  return (
    <div className="ai-container">
      <div className="ai-header">
        <div className="ai-title">
          🤖 AI Operations Assistant
        </div>
        <div className="ai-subtitle">
          Ask questions about sales, products,
          customers, inventory, and trends.
        </div>
      </div>

      <div className="chat-window">
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">✨</div>

            <h3>Ask your business data anything</h3>

            <p>
              Examples:
            </p>

            <ul>
              <li>
                Which product is most profitable?
              </li>
              <li>
                What are the top sales trends?
              </li>
              <li>
                Which customers generate the most revenue?
              </li>
              <li>
                What inventory should be increased?
              </li>
            </ul>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-row ${message.role}`}
          >
            <div
              className={`message-bubble ${message.role}`}
            >
              <div className="message-label">
                {message.role === "user"
                  ? "You"
                  : "AI Assistant"}
              </div>

              <div className="message-content">
                {message.role === "assistant" ? (
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="message-row assistant">
            <div className="message-bubble assistant loading">
              <div className="message-label">
                AI Assistant
              </div>

              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="input-section">
        <textarea
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={handleKeyPress}
          placeholder="Ask anything about your business..."
          rows={2}
          disabled={loading}
        />

        <button
          onClick={askQuestion}
          disabled={loading || !question.trim()}
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </div>
    </div>
  );
}
