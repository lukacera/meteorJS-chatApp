import React from 'react'

export default function Message({message}) {
  return (
    <div 
        key={message._id} 
        className="bg-dark text-white rounded p-3 mb-2 mx-2 position-relative"
    >
        <div className="d-flex justify-content-between align-items-start mb-2">
            <span className="fw-bold">{message.user}</span>
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
  )
}
