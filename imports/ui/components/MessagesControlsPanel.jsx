import React from 'react'
import { SortAsc, SortDesc } from 'lucide-react';

export default function MessagesControlsPanel({
    limit,
    handleLimitChange,
    dateFilter,
    setDateFilter,
    sortDirection,
    toggleSort,
    dataStreamActive,
    handleStreamToggle
}) {
return (
    <div className="bg-dark p-3 mb-3 rounded text-white">
        <div className="d-flex gap-3 align-items-center justify-content-between px-5">
            <div className="d-flex align-items-center gap-5">
                    <div className="d-flex align-items-center gap-2">
                        <label htmlFor="messageLimit" className="text-white mb-0">
                            Messages per page:
                        </label>
                        <input
                            id="messageLimit"
                            type="number"
                            className="form-control form-control-sm"
                            style={{ width: '80px' }}
                            value={limit}
                            onChange={handleLimitChange}
                            min={1}
                        />
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <label htmlFor="dateFilter" className="text-white mb-0">
                            Filter by date:
                        </label>
                        <input
                            id="dateFilter"
                            type="date"
                            className="form-control form-control-sm"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
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
