import AudioPlayer from './AudioPlayer';
import "./transcript.css";
import Table from './table';
import Navbar from './navbar';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';



function Transcript() {
  const { ResponseID } = useParams();
  const [NormalHighlight, setNormalHighlight] = useState(false);
  const [FollowHighligh, setFollowHighligh] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [AudioTime, setAudioTime] = useState(0);
  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };


  return (
    <>
      <Navbar ResponseID={ResponseID} onPage='Transcript' setNormalHighlight={setNormalHighlight} setFollowHighligh={setFollowHighligh} />
      <div className='px-4 bg-[#f6f3f3]'>
        <div className='p-4 bg-white rounded-2xl'>
          <AudioPlayer onTimeUpdate={handleTimeUpdate} AudioTime={AudioTime} ResponseID={ResponseID} />
          <Table setAudioTime={setAudioTime} ResponseID={ResponseID} currentTime={currentTime} NormalHighlight={NormalHighlight} FollowHighligh={FollowHighligh} />
        </div>
      </div>
    </>

  );
}

export default Transcript;