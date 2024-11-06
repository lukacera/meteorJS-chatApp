import React, { useState, useEffect, useRef } from 'react';
import { useTracker } from "meteor/react-meteor-data";
import { MessagesCollection } from "../../api/messages/messages";
import { Trash2, MoreVertical } from 'lucide-react';
import { Meteor } from 'meteor/meteor';
import MessagesControlsPanel from './MessagesControlsPanel';

const MESSAGES_PER_PAGE = 5;

export default function MessagesContainer() {
    const [activeMenu, setActiveMenu] = useState(null);
    const [limit, setLimit] = useState(MESSAGES_PER_PAGE);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [sortDirection, setSortDirection] = useState(-1); // -1 for desc, 1 for asc
    const [dateFilter, setDateFilter] = useState('');
    const endMessagesRef = useRef(null);

    // Whenever limit or filters change, fetch new messages
    const { messages, hasMoreMessages } = useTracker(() => {
        // 1. Handle subscription
        console.log('Subscribing to messages with limit:', limit, 'page:', page, 'sortDirection:', sortDirection);
        Meteor.subscribe('messages', {
            limit: limit,
            skip: limit * page,
            sortDirection
        });
    
        
        // 3. Get messages with the same parameters as subscription
        const messages = MessagesCollection.find(
            {},
            {
                limit: limit,
                skip: limit * page,
                sort: { timestamp: sortDirection }
            }
        ).fetch();
    
        
        console.log(messages)

        return {
            messages,
            hasMoreMessages: messages.length === limit
        };

    }, [limit, page, sortDirection, dateFilter]);

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

    const toggleSort = () => {
        setSortDirection(prev => prev * -1);
    };
    
    const handleLimitChange = (e) => {
        const newLimit = parseInt(e.target.value) || MESSAGES_PER_PAGE;
        setLimit(newLimit);
        setPage(0); // Reset page when changing limit
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
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && hasMoreMessages && !isLoading) {
                    loadMore();
                }
            },
            {
                threshold: 0.1,
            }
        );

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
        <div className="flex-grow-1 overflow-auto mb-3">
            {/* Controls Panel */}
            <MessagesControlsPanel
                limit={limit}
                handleLimitChange={handleLimitChange}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                sortDirection={sortDirection}
                toggleSort={toggleSort}
            />
            {/* Messages List */}
            <div className="p-3">
                <div className="d-flex flex-column gap-3">
                    {messages.map((message) => (
                        <div 
                            key={message._id} 
                            className="bg-dark text-white rounded p-3 mb-2 mx-2 position-relative"
                        >
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
                                {new Date(message.timestamp).toLocaleString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
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
        </div>
    );
}