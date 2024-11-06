import React, { useState, useEffect, useRef } from 'react';
import { useTracker } from "meteor/react-meteor-data";
import { MessagesCollection } from "../../api/messages/messages";
import { Trash2, MoreVertical } from 'lucide-react';
import { Meteor } from 'meteor/meteor';

const MESSAGES_PER_PAGE = 5;

export default function MessagesContainer() {
    const [activeMenu, setActiveMenu] = useState(null);
    const [limit, setLimit] = useState(MESSAGES_PER_PAGE);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const endMessagesRef = useRef(null);

    // Whenever limit changes, fetch new messages
    const { messages, hasMoreMessages } = useTracker(() => {
        Meteor.subscribe('messages', limit);
        const messages = MessagesCollection.find(
            {}, 
            {
                limit: limit,
                skip: limit * page,
                sort: {timestamp: -1}
            }
        ).fetch();
        
        return {
            messages,
            hasMoreMessages: messages.length === limit
        };
    }, [limit]);

    console.log(messages.length)
    
    const handleDelete = async (messageId) => {
        await Meteor.callAsync('messages.delete', messageId, (error) => {
            if (error) {
                console.error('Error deleting message:', error);
                alert('Could not delete message');
            }
        });
        setActiveMenu(null);
    };

    const toggleMenu = (messageId) => {
        setActiveMenu(activeMenu === messageId ? null : messageId);
    };
    
    const loadMore = () => {
        if (!isLoading && hasMoreMessages) {
            setIsLoading(true);
            setLimit(prevLimit => prevLimit + MESSAGES_PER_PAGE);
        }
    };
    
    useEffect(() => {
        setIsLoading(false);
    }, [messages]);
    
    // Load more messages when user reached the end of current ones
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && hasMoreMessages && !isLoading) {
                    console.log("User has reached the end of current messages");
                    loadMore();
                }
            },
            {
                threshold: 0.1,
            }
        );

        // Observe the endMessagesRef element
        if (endMessagesRef.current) {
            observer.observe(endMessagesRef.current);
        }

        return () => {
            if (endMessagesRef.current) {
                observer.unobserve(endMessagesRef.current);
            }
        };
    }, [hasMoreMessages, isLoading]);

    return (
        <div className="flex-grow-1 overflow-auto mb-3 p-3">
            <div className="d-flex flex-column gap-3">
                {messages.map((message, index) => (
                    <div 
                        key={message._id} 
                        className="bg-dark text-white rounded p-3 mb-2 mx-2 position-relative"
                    >
                        <span>
                           {index} 
                        </span>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <span className="fw-bold">{message.user}</span>
                            <div className="dropdown">
                                <button
                                    onClick={() => toggleMenu(message._id)}
                                    className="btn btn-link text-secondary p-0 opacity-0 menu-btn"
                                    title="Message options"
                                >
                                    <MoreVertical size={16} />
                                </button>
                                {activeMenu === message._id && (
                                    <div className="dropdown-menu show position-absolute" style={{ right: 0, top: '20px' }}>
                                        <button 
                                            className="dropdown-item text-danger d-flex align-items-center gap-2"
                                            onClick={() => handleDelete(message._id)}
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className='text-break mb-2'>
                            {message.message}
                        </p>
                        <div className="d-flex justify-content-end">
                            <span className="text-secondary small">
                                {message.timestamp.toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={endMessagesRef}>
                    {isLoading &&
                    <div className="spinner-border text-primary" role="status" />}
                </div>
            </div>
        </div>
    );
}