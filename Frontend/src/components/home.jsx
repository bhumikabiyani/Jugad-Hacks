import React, { useState, useEffect } from 'react';
import './home.css';
import 'react-toastify/dist/ReactToastify.css';
import UploadBox from './uploadbox';
import axios from 'axios';
import { WarningNotification } from './notification';
import Navbar from './navbar';

const Home = () => {
  let isLoggedIn = localStorage.getItem('isLoggedIn');
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const [clickedOn, setClickedOn] = useState('');
  
  const handleDialogOpenUploadMOM = () => {
    isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        WarningNotification("You need to login to access this feature !!")
        return;
    }
    setClickedOn('mom');
    setIsOpenUpload(true);
  };  
  const handleDialogOpenUploadShorts = () => {
    isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        WarningNotification("You need to login to access this feature !!")
        return;
    }
    setClickedOn('shorts');
    setIsOpenUpload(true);
  };  

 


  return (

    <div className="body scroll-smooth">
      <Navbar isLoggedInHome={isLoggedIn} onPage="home" />
      <UploadBox uploadType={clickedOn} isOpen={isOpenUpload} onClose={() => setIsOpenUpload(false)} />
      <div className='p-4'>
        <section id='s1' className="text-gray-600 body-font lg:px-16 rounded-lg">
          <div className="md:h-[90vh] lg:h-auto container px-5 py-28 mx-auto flex flex-col lg:flex-row items-center justify-center">
            <div className='flex flex-col lg:flex-row items-center justify-center transform scale-100 transition-transform duration-300 ease-in-out hover:scale-110 '>
              <img alt="ecommerce" className="lg:w-1/2 lg:h-auto md:h-80 mx-8  object-cover object-center rounded order-1 lg:order-2 drop-shadow-xl" style={{ objectFit: 'contain' }} src="https://cdn-site-assets.veed.io/cdn-cgi/image/width=1280,quality=75,format=auto/Audio_to_Text_26b67a012c/Audio_to_Text_26b67a012c.png" />
              <div className="flex-column text-center lg:p-12 py-2 lg:w-1/2 lg:pr-10 lg:py-6 mb-6 lg:mb-0 justify-center items-center order-2 lg:order-1">
                <h1 className="text-gray-900 lg:text-5xl text-3xl title-font font-bold">Audio to Text</h1>
                <p className="leading-relaxed mb-4 my-4">Transcribe audio to text automatically, using AI.</p>
                <button onClick={handleDialogOpenUploadMOM} className="flex text-white items-center justify-center bg-blue-500 my-2 border-0 py-4 px-12 focus:outline-none hover:bg-blue-600 rounded-full w-[80%] mx-auto drop-shadow-xl">
                  AI minutes of meetings Generator
                  <div className="shadow-neutral-1000/25 -mr-[15px] grid items-center justify-center rounded-full p-3 mx-3 drop-shadow-xl bg-white text-blue-600  rtl:-scale-x-100" bis_skin_checked="1">
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <polyline points="16 16 12 12 8 16"></polyline>
                      <line x1="12" y1="12" x2="12" y2="21"></line>
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                      <polyline points="16 16 12 12 8 16"></polyline>
                    </svg>
                  </div>
                </button>
                <button onClick={handleDialogOpenUploadShorts} className="flex text-white items-center justify-center bg-blue-500 my-2 border-0 py-4 px-12 focus:outline-none hover:bg-blue-600 rounded-full w-[80%] mx-auto drop-shadow-xl">
                  AI shorts Generator
                  <div className="shadow-neutral-1000/25 -mr-[15px] grid items-center justify-center rounded-full p-3 mx-3 drop-shadow-xl bg-white text-blue-600  rtl:-scale-x-100" bis_skin_checked="1">
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <polyline points="16 16 12 12 8 16"></polyline>
                      <line x1="12" y1="12" x2="12" y2="21"></line>
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                      <polyline points="16 16 12 12 8 16"></polyline>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>


        <section id='s2' className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto lg:h-[100vh]" bis_skin_checked="1">
            <div className="flex flex-col text-center w-full mb-16" bis_skin_checked="1">
              <h1 className="text-gray-900 text-4xl title-font font-medium mb-4">How to transcribe audio to text:</h1>
            </div>
            <div className="lg:flex md:flex flex-wrap justify-center -m-4" bis_skin_checked="1">
              <div className="p-4 lg:w-1/3 md:w-1/2 transform scale-100 transition-transform duration-300 ease-in-out hover:scale-110" bis_skin_checked="1">
                <div className="h-full flex flex-col items-center text-center" bis_skin_checked="1">
                  <img alt="team" className="flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4 drop-shadow-xl" src="https://cdn-site-assets.veed.io/cdn-cgi/image/width=640,quality=75,format=auto/Upload_or_record_d9784e01b0/Upload_or_record_d9784e01b0.png" />
                  <div className="w-full" bis_skin_checked="1">
                    <h2 className="title-font font-bold text-2xl text-gray-900">Upload or record</h2>
                    <p className="mb-4 text-center">Upload your audio or video.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 lg:w-1/3 md:w-1/2 transform scale-100 transition-transform duration-300 ease-in-out hover:scale-110" bis_skin_checked="1">
                <div className="h-full flex flex-col items-center text-center" bis_skin_checked="1">
                  <img alt="team" className="flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4 drop-shadow-xl" src="https://cdn-site-assets.veed.io/cdn-cgi/image/width=640,quality=75,format=auto/Auto_transcribe_and_translate_f9f7a99235/Auto_transcribe_and_translate_f9f7a99235.png" />
                  <div className="w-full" bis_skin_checked="1">
                    <h2 className="title-font font-bold text-2xl text-gray-900">Auto-transcribe with Speaker Labels</h2>
                    <p className="mb-4 text-justify">Advanced AI algorithms auto-transcribe meeting recordings into text with speaker labels, making it easy to identify who said what during discussions.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 lg:w-1/3 md:w-1/2 transform scale-100 transition-transform duration-300 ease-in-out hover:scale-110" bis_skin_checked="1">
                <div className="h-full flex flex-col items-center text-center" bis_skin_checked="1">
                  <img alt="team" className="flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4 drop-shadow-xl" src="https://cdn-site-assets.veed.io/cdn-cgi/image/width=640,quality=75,format=auto/Review_and_export_39508d3634/Review_and_export_39508d3634.png" />
                  <div className="w-full" bis_skin_checked="1">
                    <h2 className="title-font font-bold text-2xl text-gray-900">Summarized Meeting Minutes</h2>
                    <p className="mb-4 text-justify">System generates concise meeting minutes, capturing key points, decisions, and action items discussed during the meeting.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
        <section id='s3' className="text-gray-600 body-font overflow-hidden py-20">
          <div className="transform scale-100 transition-transform duration-300 ease-in-out hover:scale-110 container px-12 py-28 mx-auto sm:h-[100vh] flex flex-col lg:flex-row items-center justify-center">
            <div className="flex flex-col items-center lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0 order-1 lg:order-0">
              <h1 className="text-gray-900 text-2xl title-font font-bold mb-4">Instant transcription downloads for better documentation</h1>
              <p className="leading-relaxed mb-4 my-8 text-justify">We uses cutting-edge technology to transcribe your audio to text at lightning-fast speed. Download your transcript in one click and keep track of your records. Get a written copy of your recordings instantly and one proofread for 100% accuracy. Downloading transcriptions is available to registered users.</p>
              {/* <img className='w-[18rem]' src="https://assets-global.website-files.com/616e938268c8f02f94b2b53c/631707159beb05307c0c1c1e_3.png" alt="" /> */}
            </div>
            <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto mb-8 object-cover object-center rounded lg:order-1" style={{ objectFit: 'contain' }} src="https://img.freepik.com/free-vector/files-management-concept-illustration_114360-20449.jpg?t=st=1715281439~exp=1715285039~hmac=d3897dbca0d16b24bec806f02beb74ed04c57413f5b6d76d873b3325c67e4751&w=1060" />
          </div>
        </section>
        <section id='s4' className="text-gray-600 body-font overflow-hidden">
          <div className="transform scale-100 transition-transform duration-300 ease-in-out hover:scale-110 container px-12 py-28 mx-auto min:h-[100vh] flex flex-col lg:flex-row items-center justify-center">
            <img alt="ecommerce" className="lg:w-1/2 lg:pr-10 w-full lg:h-auto mb-8 object-cover object-center rounded " style={{ objectFit: 'contain' }} src="https://static.vecteezy.com/system/resources/previews/003/524/418/non_2x/teamwork-sharing-idea-and-collaborating-at-company-free-vector.jpg" />
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h1 className="text-gray-900 text-2xl title-font font-bold mb-4">Instant transcription Shareable Links</h1>
              <p className="leading-relaxed mb-4 my-8 text-justify">Share your transcript with anyone using a shareable link. You can share the link with your team members, clients, or anyone you want to share the transcript with. Shareable links are available to registered users.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div >
  );
};

export default Home;
