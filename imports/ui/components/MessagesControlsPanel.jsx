import React from 'react'
import { SortAsc, SortDesc, RotateCcw } from 'lucide-react';

export default function MessagesControlsPanel({
    limit,
    customLimit,
    setIsCustomLimit,
    handleLimitChange,
    dateFilter,
    setDateFilter,
    sortDirection,
    toggleSort,
    dataStreamActive,
    handleStreamToggle
}) {
    const handleDateChange = (field, value) => {
        const newDateFilter = {
            ...dateFilter,
            [field]: value
        };
        setDateFilter(newDateFilter);
    };

    const handleLimit = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0 || e.target.value === '') {
            handleLimitChange(e);
        }
    };

    const handleReset = () => {
        // Pass an event-like object with a default value of 5
        handleLimitChange({ target: { value: 5 } });
        setIsCustomLimit(false);
    };

    return (
        <div className="bg-dark p-3 mb-3 rounded text-white">
            <div className="d-flex gap-3 align-items-center justify-content-between px-5">
                <div className="d-flex align-items-center gap-5">
                    <div className="d-flex align-items-center gap-2">
                        <label htmlFor="messageLimit" className="text-white mb-0">
                            Limit:
                        </label>
                        <div className="d-flex align-items-center gap-2">
                            <input
                                id="messageLimit"
                                type="number"
                                className="form-control form-control-sm"
                                style={{ width: '80px' }}
                                value={customLimit ? limit : 0}
                                onChange={handleLimit}
                                min={1}
                                placeholder="5"
                            />
                            <button
                                className="btn btn-outline-light btn-sm d-flex align-items-center"
                                onClick={handleReset}
                                title="Reset limit to default"
                            >
                                <RotateCcw size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <label htmlFor="fromDate" className="text-white mb-0">
                            From:
                        </label>
                        <input
                            id="fromDate"
                            type="date"
                            className="form-control form-control-sm"
                            value={dateFilter.from}
                            onChange={(e) => handleDateChange('from', e.target.value)}
                        />
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <label htmlFor="toDate" className="text-white mb-0">
                            To:
                        </label>
                        <input
                            id="toDate"
                            type="date"
                            className="form-control form-control-sm"
                            value={dateFilter.to}
                            onChange={(e) => handleDateChange('to', e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="d-flex align-items-center flex-column gap-2">
                    <label className="text-white mb-0">Start/stop data stream:</label>
                    <button 
                        className="btn btn-outline-light btn-sm"
                        onClick={() => handleStreamToggle(!dataStreamActive)}
                    >
                        {dataStreamActive ? "Stop" : "Start"}
                    </button>
                </div>

                <button
                    className="btn btn-outline-light btn-sm d-flex 
                    align-items-center gap-1"
                    onClick={toggleSort}
                    title={sortDirection === -1 ? "Newest first" : "Oldest first"}
                >
                    {sortDirection === -1 ? <SortDesc size={16} /> : <SortAsc size={16} />}
                    {sortDirection === -1 ? "Newest" : "Oldest"}
                </button>
            </div>
        </div>
    )
}