import AudioPlayer from './AudioPlayer';
import "./transcript.css";
import Navbar from './navbar';
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

function Shorts() {
  const { ResponseID } = useParams();
  const location = useLocation();
  const [shorts, setShorts] = useState([]);
  const src = `http://127.0.0.1:8000/audio/${ResponseID}`

  useEffect(() => {
    toast.promise(
      new Promise((resolve, reject) => {
        (async () => {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/gen_shorts/${ResponseID}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            });
            console.clear();
            console.log(response.data);
            setShorts(response.data['shorts']);
            resolve();
          } catch (error) {
            console.log(error);
            reject();
          }
        }
        )();
      }
      ), {
      pending: 'Generating shorts...',
      success: 'Shorts generated successfully!',
    });
  }

    , []);




  return (
    <>
      <Navbar ResponseID={ResponseID} onPage='shorts' />
      <div className='px-4 bg-[#f6f3f3]'>
        <div className='flex justify-center p-4 bg-white rounded-2xl'>
          <video controls className='w-[60%]'>
            <source src={`http://127.0.0.1:8000/audio/${ResponseID}`} type="video/mp4" />
          </video>
        </div>
        <h1 className='text-2xl font-bold text-center'>Shorts</h1>
        <div className='flex flex-wrap justify-center p-4 bg-white rounded-2xl'>
          {
            (shorts || []).map((short, index) => (
              <div key={index} className='w-1/2 p-2'>
                <video className='w-full' controls>
                  <source src={`http://127.0.0.1:8000/stream_shorts/${ResponseID}/${short}`} type="video/mp4" />
                </video>
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
}


export default Shorts;