import React from 'react'
const urlParams = new URLSearchParams(window.location.search);

const ExistingQueue = () => {
    return (
        <div>
            <p>Queue with id {urlParams.get("queueID")}</p>
        </div>
    )
}

export default ExistingQueue
