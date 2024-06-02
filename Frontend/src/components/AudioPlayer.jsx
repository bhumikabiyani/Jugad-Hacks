// import React from 'react';
// import AudioPlayer from 'react-modern-audio-player';
// import './AudioPlayer.css';
// import { useLocation } from 'react-router-dom';

// export default function AudioPlayerApp({ onTimeUpdate }) {
//   const location = useLocation();
//   const src = location.state?.file;
//   console.log('Location state:', location.state);
//   console.log('Audio src:', src);
//   const handleTimeUpdate = (event) => {
//     onTimeUpdate(event.target.currentTime);
//   };
//   const playList = [
//     {
//       src: src,
//       id: 1
//     },
//   ];

//   return (
//     <div className="player-container">
//       <AudioPlayer
//         onTimeUpdate={handleTimeUpdate}
//         playList={playList}
//         activeUI={{
//           playButton: true,
//           progress: "waveform",
//           volume: true,
//           trackInfo: true,
//           trackTime: true,
//         }}
//         placement={{
//           player: "bottom-left",
//           interface: {
//             templateArea: {
//               artwork: "row1-8",
//               trackInfo: "row1-5",
//               trackTimeCurrent: "row1-3",
//               trackTimeDuration: "row1-4",
//               progress: "row1-2",
//               repeatType: "row1-6",
//               volume: "row1-7",
//               playButton: "row1-1",
//               playList: "row1-9",
//             },
//           },
//         }}
//         rootContainerProps={{
//           colorScheme: "light",
//           width: "100%",
//           // height: "20px"
//         }}
//       />
//     </div>
//   );
// }

import React from 'react';
import { styled } from '@mui/material/styles';
import { useRef,useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const StyledAudioControl = styled('audio')(() => ({
  // position: 'fixed',
  // left: "0",
  width: '100%',
  // top: '',
  // marginTop: "10vh",
  
  // backgroundColor: '#fff',
  // background: `#eec0ec url('https://imgproxy.gamma.app/resize/quality:80/resizing_type:fit/width:2400/https://cdn.gamma.app/theme_images/prism-background.2232a16e.png?w=3707&q=70') no-repeat center bottom`, // Change this line
  borderRadius: '5px 5px 0 0',
  // borderRadius: '0 0 5px 5px',
  // padding: '10px 20px', // Change this line
  // boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
}));

const AudioPlayer = ({ onTimeUpdate, AudioTime, ResponseID }) => {

  const location = useLocation();
  const src = `http://127.0.0.1:8000/audio/${ResponseID}`
  const audioRef = useRef(null);
  const handleTimeUpdate = (event) => {
    onTimeUpdate(event.target.currentTime);
  };
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = AudioTime/1000;
      console.log('AudioTime:', AudioTime/1000);
    }
  }, [AudioTime]);

  

  return (
    <StyledAudioControl ref={audioRef} key={src} controls preload="auto" onTimeUpdate={handleTimeUpdate}>
      <source src={src} />
      Your browser does not support the audio element.
    </StyledAudioControl>
  );
}

export default AudioPlayer;