import React, { useState, useEffect, useRef } from 'react';
import { useTracker } from "meteor/react-meteor-data";
import { MessagesCollection } from "../../api/messages/messages";
import { Meteor } from 'meteor/meteor';
import MessagesControlsPanel from './MessagesControlsPanel';
import Message from './Message';

const MESSAGES_PER_PAGE = 5;

export default function MessagesContainer() {
    const [limit, setLimit] = useState(MESSAGES_PER_PAGE);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [sortDirection, setSortDirection] = useState(-1);
    const [dateFilter, setDateFilter] = useState({
        from: '',
        to: ''
    });
    const [dataStreamActive, setDataStreamActive] = useState(true);
    const [preservedMessages, setPreservedMessages] = useState([]);
    const [isCustomLimit, setIsCustomLimit] = useState(false);
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
            sortDirection,
            dateFilter
        });
    
        const query = {};
        
        // Add date filtering to the query
        if (dateFilter.from || dateFilter.to) {
            query.timestamp = {};
            if (dateFilter.from) {
                const fromDate = new Date(dateFilter.from);
                fromDate.setHours(0, 0, 0, 0);
                query.timestamp.$gte = fromDate;
            }
            if (dateFilter.to) {
                const toDate = new Date(dateFilter.to);
                toDate.setHours(23, 59, 59, 999);
                query.timestamp.$lte = toDate;
            }
        }

        const messages = MessagesCollection.find(
            query,
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

    const handleDateFilterChange = (newDateFilter) => {
        setDateFilter(newDateFilter);
        setPage(0); // Reset to first page when filter changes
        
        // Construct alert message based on filter values
        let alertMessage = 'Date filter has been updated!';
        if (newDateFilter.from && newDateFilter.to) {
            alertMessage += ` Showing messages from ${newDateFilter.from} to ${newDateFilter.to}`;
        } else if (newDateFilter.from) {
            alertMessage += ` Showing messages from ${newDateFilter.from} onwards`;
        } else if (newDateFilter.to) {
            alertMessage += ` Showing messages up to ${newDateFilter.to}`;
        }
        
        alert(alertMessage);
    };

    const toggleSort = () => {
        setSortDirection(prev => prev * -1);
    };

    const handleStreamToggle = (newState) => {
        if (!newState) {
            setPreservedMessages(messages);
        }
        setDataStreamActive(newState);
    };

    const handleLimitChange = (e) => {
        const newLimit = parseInt(e.target.value) || MESSAGES_PER_PAGE;
        if (newLimit === MESSAGES_PER_PAGE) {
            setIsCustomLimit(false);
        } else {
            setIsCustomLimit(true);
        }
        setLimit(newLimit);
        setPage(0);
    };

    const loadMore = () => {
        if (!isLoading && hasMoreMessages) {
            console.log("Loading more messages...");
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
        <div className="overflow-auto mb-3">
            <MessagesControlsPanel
                limit={limit}
                handleLimitChange={handleLimitChange}
                dateFilter={dateFilter}
                setDateFilter={handleDateFilterChange}
                sortDirection={sortDirection}
                toggleSort={toggleSort}
                dataStreamActive={dataStreamActive}
                handleStreamToggle={handleStreamToggle}
                customLimit={isCustomLimit}
                setIsCustomLimit={setIsCustomLimit}
            />
            
            <div className="p-3">
                <div className="d-flex flex-column gap-3">
                    {messages.map((message) => (
                        <Message 
                            key={message._id}
                            message={message}
                        />
                    ))}
                    {!isCustomLimit && <div ref={endMessagesRef}>
                        {isLoading &&
                        <div className="spinner-border text-primary" role="status" />}
                    </div>}
                </div>
            </div>
        </div>
    );
}