import React, { useState } from 'react';

export const App = () => {

  const [messageValue, setMessageValue] = useState("");
  // Dummy data
  const messages = [
    { id: 1, text: "Hello everyone! This is the first message.", timestamp: "10:30 AM", user: "Alice" },
    { id: 2, text: "Hey Alice! Nice to see you here.", timestamp: "10:32 AM", user: "Bob" },
    { id: 3, text: "This is a longer message to demonstrate how the layout handles multiple lines of text. It should wrap nicely within the message container.", timestamp: "10:35 AM", user: "Charlie" },
    { id: 4, text: "Anyone working on the new project?", timestamp: "10:40 AM", user: "Alice" },
  ];

  return (
    <div className="bg-black vh-100 vw-100 d-flex flex-column">
      {/* Messages Container */}
      <div className="flex-grow-1 overflow-auto mb-3 p-3">
        <div className="d-flex flex-column-reverse gap-3">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className="bg-dark text-white rounded p-3 mb-2 mx-2"
            >
              <div className="d-flex justify-content-between align-items-baseline mb-1">
                <span className="fw-bold">{message.user}</span>
                <small className="text-secondary">{message.timestamp}</small>
              </div>
              <div>{message.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Container */}
      <div className="p-3 bg-dark border-top">
        <div className="input-group">
          <input 
            type="text" 
            className="form-control bg-dark text-white border-dark" 
            placeholder="Type your message..."
            aria-label="Message"
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
          />
          <button 
            className="btn btn-primary" 
            type="button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};