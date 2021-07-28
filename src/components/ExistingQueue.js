import React from 'react';
import MainQue from "./MainQue";
const urlParams = new URLSearchParams(window.location.search);

const ExistingQueue = () => {
    return (
        <div>
            <p>Queue with id {urlParams.get("queueID")}</p>
        </div>
    )
}

export default ExistingQueue
