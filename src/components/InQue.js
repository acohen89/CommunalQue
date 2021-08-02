import React from 'react'
import SongInQue from './SongInQue';


const InQue = ({songs}) => {
    return (
        <div>
            <SongInQue songs = {songs} inQueue={true} />
        </div>
    )
}

export default InQue
