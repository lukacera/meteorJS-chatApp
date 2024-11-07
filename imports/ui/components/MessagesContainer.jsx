import React, { useState, useEffect, useRef } from 'react';
import { useTracker } from "meteor/react-meteor-data";
import { MessagesCollection } from "../../api/messages/messages";
import { Trash2, MoreVertical } from 'lucide-react';
import { Meteor } from 'meteor/meteor';
import MessagesControlsPanel from './MessagesControlsPanel';
import Message from './Message';

const MESSAGES_PER_PAGE = 5;

export default function MessagesContainer() {

    const [limit, setLimit] = useState(MESSAGES_PER_PAGE);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [sortDirection, setSortDirection] = useState(-1); // -1 for desc, 1 for asc
    const [dateFilter, setDateFilter] = useState({
        from: '',
        to: ''
    });
    const [dataStreamActive, setDataStreamActive] = useState(true);
    const [preservedMessages, setPreservedMessages] = useState([]);
    const endMessagesRef = useRef(null);

    const { messages, hasMoreMessages } = useTracker(() => {
        if (!dataStreamActive) {
            return { 
                messages: preservedMessages, 
                hasMoreMessages: false 
            };
        }

        Meteor.subscribe('messages', {
            limit: limit,
            skip: limit * page,
            sortDirection
        });
    
        const messages = MessagesCollection.find(
            {},
            {
                limit: limit,
                skip: limit * page,
                sort: { timestamp: sortDirection }
            }
        ).fetch();

        return {
            messages,
            hasMoreMessages: messages.length === limit
        };

    }, [limit, page, sortDirection, dateFilter, dataStreamActive, preservedMessages]);

    const toggleSort = () => {
        setSortDirection(prev => prev * -1);
    };

    const handleStreamToggle = (newState) => {
        if (!newState) { // If turning stream off(state is false)
            setPreservedMessages(messages); 
        }
        setDataStreamActive(newState);
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
                dataStreamActive={dataStreamActive}
                handleStreamToggle={handleStreamToggle}
            />
            {/* Messages List */}
            <div className="p-3">
                <div className="d-flex flex-column gap-3">
                    {messages.map((message) => (
                        <Message 
                            message={message}
                        />
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