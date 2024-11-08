import React, { useState } from 'react'
import { Meteor } from 'meteor/meteor';

export default function InputNewMessage() {
    
    const [messageValue, setMessageValue] = useState("");
  
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const message = messageValue;
            // Prevent empty messages
            if (message.trim() === "") {
                return;
            }
            await Meteor.callAsync('messages.insert', message, "Guest");
            setMessageValue("");   
        } catch (error) {
            console.error("Error while adding new message " +error);
        }
    }
    return (
        <form className="p-3 bg-dark border-top">
            <div className="d-flex">
            <input 
                type="text" 
                className="form-control border-secondary bg-dark text-white" 
                placeholder="Type your message..."
                aria-label="Message"
                id='messageInput'
                value={messageValue}
                onChange={(e) => setMessageValue(e.target.value)}
            />
            <button 
                className="btn btn-primary ms-5" 
                type="submit"
                onClick={handleSubmit}
                disabled={messageValue.trim() === ""}
            >
                Send
            </button>
            </div>
        </form>   
    )
}
