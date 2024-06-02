import React, { useState, useEffect } from 'react';
import './navbar.css';
import Logo from '../assets/logo2.png';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Login from './login';
import SideBar from './sidebar';
import axios from 'axios';
import { WarningNotification, ErrorNotification, SuccessNotification } from './notification';
import { Link } from 'react-router-dom';
import { Workbook } from 'exceljs';
import UploadBox from "./uploadbox";
const ExportasJSON = () => {
    let jsonData = JSON.parse(localStorage.getItem('JSON_DATA'));
    if (jsonData) {
        jsonData = jsonData.map(item => ({
            speaker: item.speaker,
            text: item.text,
            start: item.start,
            end: item.end
        }));
        const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'data.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        SuccessNotification("File Downloaded Successfully!! ")
    } else {
        ErrorNotification("Download Failed");
    }
    
}
const ExportasExcel = () => {
    let jsonData = JSON.parse(localStorage.getItem('JSON_DATA'));
    if (jsonData) {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Meeting Data');
        worksheet.addRow(['Meeting ID', 'Date', 'StartTime(s)', 'EndTime(s)']);
        jsonData.forEach((meeting) => {
            worksheet.addRow([meeting.speaker, meeting.text, meeting.start / 1000, meeting.end / 1000]);
        });
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'meeting_data.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            SuccessNotification("File Downloaded Successfully!! ")
        });
    } else {
        ErrorNotification("Download Failed");
    }
}

const fetchMeetings = (token, setMeetings, setIsLoggedIn) => {
    axios.get('http://127.0.0.1:8000/get_meetings', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        console.log(res.data);
        setMeetings(res.data);
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', true);
        console.log(token);
    }).catch((err) => {
        WarningNotification("You have been logged out !!")
        console.log(token);
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
    });    
};

const Navbar = ({ ResponseID,  onPage, setNormalHighlight, setFollowHighligh }) => {
    let token = localStorage.getItem('token');
    let email = localStorage.getItem('email');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isOpenSideBar, setIsOpenSideBar] = useState(false);
    const [Normal, setNormal] = useState(false);
    const [Follow, setFollow] = useState(false);
    const [meetings, setMeetings] = useState([])

    const handleNormalHighlight = () => {
        setNormalHighlight(prevState => !prevState);
        setNormal(prevState => !prevState);
        setFollow(false);
        setFollowHighligh(false);
        console.log(Normal);
    };
    const handleFollowHighlight = () => {
        setFollowHighligh(prevState => !prevState);
        setFollow(prevState => !prevState);
        setNormal(false);
        setNormalHighlight(false);
        console.log(Follow);
    };
    

    useEffect(() => {
        if (token) {
            fetchMeetings(token,setMeetings, setIsLoggedIn);
        }
        else{
            setIsLoggedIn(false);
        }
    }, [isLoggedIn]);

    const navigate = useNavigate();
    const Logout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('JSON_DATA');
        setIsLoggedIn(false);
        try {
            const response = await axios.get('http://127.0.0.1:8000/logout', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/');
            SuccessNotification("Logged Out Successfully !!");
        }
        catch (error) {
            console.log(error);
            ErrorNotification("Error Logging Out !!");
        }


    };



    const OpenSideBarSetter = () => {
        setIsOpenSideBar(!isOpenSideBar);
    };

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        section.scrollIntoView({ behavior: "smooth" });
    };

    const [isOpenLogin, setIsOpenLogin] = useState(false);
    const [clickedOn, setClickedOn] = useState('');
    const handleDialogOpenLogin = () => {
        setIsOpenLogin(!isOpenLogin);

    };
    const [isOpenUpload, setIsOpenUpload] = useState(false);
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

    return (<>
      <UploadBox uploadType={clickedOn} isOpen={isOpenUpload} onClose={() => setIsOpenUpload(false)} />
        <SideBar handleDialogOpenUploadShorts={handleDialogOpenUploadShorts} handleDialogOpenUploadMom ={handleDialogOpenUploadMOM} ResponseID={ResponseID} ExportasExcel={ExportasExcel} ExportasJSON={ExportasJSON} onPage={onPage} Normal={Normal} Follow={Follow} handleNormalHighlight={handleNormalHighlight} handleFollowHighlight={handleFollowHighlight} isOpenSideBar={isOpenSideBar} setIsOpenSideBar={setIsOpenSideBar} isLoggedIn={isLoggedIn} meetings={meetings} />
        <header className="sticky top-0 bg-[#f7f7f8] flex w-full text-gray-600 body-font z-[2000]">
            <nav className="navbar px-4 ">
                <div className='flex w-full justify-between '>
                    <div className='flex w-full lg:justify-start'>
                        <button onClick={OpenSideBarSetter} className="flex text-white items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 -960 960 960" width="36">
                                <path d="M160-240q-17 0-28.5-11.5T120-280q0-17 11.5-28.5T160-320h640q17 0 28.5 11.5T840-280q0 17-11.5 28.5T800-240H160Zm0-200q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h640q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H160Zm0-200q-17 0-28.5-11.5T120-680q0-17 11.5-28.5T160-720h640q17 0 28.5 11.5T840-680q0 17-11.5 28.5T800-640H160Z" />
                            </svg>
                        </button>
                        <Link to='/' className="cursor-pointer navbar-logo flex items-center font-medium ">
                            <img className="logo" src={Logo} alt="Logo" />
                            <span className="logo-text mr-6 text-4xl font-bold">MOM.AI</span>
                        </Link>
                        {onPage === 'home' ?
                            <div className="lg:flex md:flex hidden">
                                <a onClick={() => scrollToSection('s2')}
                                    className="appearance-none transition group inline-grid grid-flow-col p-3 justify-center items-center rounded-full  font-medium hover:bg-white cursor-pointer text-neutral-1000  xl:gap-2">
                                    How it works
                                </a>
                                <a onClick={() => scrollToSection('s3')}
                                    className="appearance-none transition group inline-grid grid-flow-col p-3 justify-center items-center rounded-full  font-medium hover:bg-white cursor-pointer text-neutral-1000  xl:gap-2">
                                    Export Transcript
                                </a>
                                <a onClick={() => scrollToSection('s4')}
                                    className="appearance-none transition group inline-grid grid-flow-col p-3 justify-center items-center rounded-full  font-medium hover:bg-white cursor-pointer text-neutral-1000  xl:gap-2">
                                    Shareable Links
                                </a>
                                <a onClick={() => scrollToSection('s4')}
                                    className="appearance-none transition group inline-grid grid-flow-col p-3 justify-center items-center rounded-full  font-medium hover:bg-white cursor-pointer text-neutral-1000  xl:gap-2">
                                    About
                                </a>
                            </div> : null}


                    </div>
                    <div className="navbar-option navbar-dropdown flex justify-center">
                        <button className="text-white items-center justify-center mr-2">
                            <svg  xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32">
                                <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
                            </svg>
                        </button>
                        <div className="navbar-dropdown-content left-[-150px]">
                            <div className="top-full -mt-4 lg:-ml-12 lg:mr-3" bis_skin_checked="1">
                                <ul className="w-full" id="headlessui-menu-items-:Rjioom:" role="menu" tabIndex="0"
                                    data-headlessui-state="">
                                    <div className="rounded-2xl bg-white shadow-2xl lg:max-w-screen-xl" bis_skin_checked="1">
                                        <div className="p-2" bis_skin_checked="1">
                                            <div className="grid max-w-3xl  gap-2 rounded-xl bg-[#f7f7f8] py-4"
                                                bis_skin_checked="1">
                                                {isLoggedIn && (<a
                                                    className="appearance-none transition group grid-row-col grid gap-2 rounded-lg p-3 bg-[#f7f7f8] hover:bg-white md:gap-4 md:p-6">
                                                    <div className="grid grid-flow-col content-start items-center justify-start justify-items-start gap-3"
                                                        bis_skin_checked="1">
                                                        <svg fill='#3B81F6' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                                            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480v58q0 59-40.5 100.5T740-280q-35 0-66-15t-52-43q-29 29-65.5 43.5T480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480v58q0 26 17 44t43 18q26 0 43-18t17-44v-58q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93h200v80H480Zm0-280q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Z" />
                                                        </svg>
                                                        <p title={email} className="font-medium leading-tight w-[20px] tracking-tight">
                                                            {email.length > 20 ? `${email.substring(0, 20)}...` : email}
                                                        </p>
                                                    </div>
                                                </a>)}
                                                <a onClick={isLoggedIn ? Logout : handleDialogOpenLogin}
                                                    className="appearance-none transition group grid-row-col grid gap-2 rounded-lg p-3 bg-[#f7f7f8] hover:bg-white md:gap-4 md:p-6">
                                                    <div className="grid grid-flow-col content-start items-center justify-start justify-items-start gap-3"
                                                        bis_skin_checked="1">
                                                        <svg fill='#3B81F6' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H200v560h240q17 0 28.5 11.5T480-160q0 17-11.5 28.5T440-120H200Zm487-320H400q-17 0-28.5-11.5T360-480q0-17 11.5-28.5T400-520h287l-75-75q-11-11-11-27t11-28q11-12 28-12.5t29 11.5l143 143q12 12 12 28t-12 28L669-309q-12 12-28.5 11.5T612-310q-11-12-10.5-28.5T613-366l74-74Z" />
                                                        </svg>
                                                        <h2 className="font-medium leading-tight tracking-tight">{isLoggedIn ? 'Logout' : 'Login'}
                                                        </h2>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <Login isOpen={isOpenLogin} LoggedIn={() => setIsLoggedIn(true)} onClose={() => setIsOpenLogin(false)} />
                </div>
            </nav>
        </header>
    </>
    );
}

export default Navbar;
