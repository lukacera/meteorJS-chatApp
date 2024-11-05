import React from 'react'
import { useTracker } from "meteor/react-meteor-data"
import { MessagesCollection } from "../../api/messages/messages"

export default function MessagesContainer() {

    const messages = useTracker(() => {
        Meteor.subscribe('messages');
        return MessagesCollection.find().fetch();
    });

    return (
        <div className="flex-grow-1 overflow-auto mb-3 p-3">
            <div className="d-flex flex-column-reverse gap-3">
            {messages.map((message) => (
                <div 
                key={message.id} 
                className="bg-dark text-white rounded p-3 mb-2 mx-2"
                >
                <div className="d-flex justify-content-between 
                align-items-baseline mb-2">
                    <span className="fw-bold">{message.user}</span>
                    <span className="text-secondary">
                        {message.timestamp.toLocaleTimeString()}
                    </span>
                </div>
                <p className='text-'>
                    {message.message}
                </p>
                </div>
            ))}
            </div>
        </div>
    )
}
