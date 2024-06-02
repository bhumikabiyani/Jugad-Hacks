import React from "react";
import { useState } from "react";
import Sidebar from "react-sidebar";
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import { toast } from "react-toastify";
import axios from "axios";
import { ErrorNotification, SuccessNotification } from "./notification";

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme, expanded }) => ({
    flexDirection: 'row-reverse',
    backgroundColor: expanded ? '#3b82f6' : 'inherit',
    color: expanded ? 'white' : 'inherit',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme, expanded }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
    backgroundColor: expanded ? blue[500] : 'inherit',
    color: expanded ? 'white' : 'inherit',
}));



const SideBar = ({handleDialogOpenUploadShorts, handleDialogOpenUploadMom, ResponseID, onPage, ExportasExcel, ExportasJSON, setIsOpenSideBar, isOpenSideBar, isLoggedIn, meetings, handleNormalHighlight, Normal, Follow, handleFollowHighlight }) => {
    const [isShared, setIsShared] = useState(false);
    const [itsown, setItsown] = useState(false);
    const navigate = useNavigate();
    const [expanded, setExpanded] = React.useState('panel3');
    const is_shared = async ()  => {
        const response1 = await axios.get(`http://127.0.0.1:8000/isshared/${ResponseID}?email=${localStorage.getItem('email')}`);
        setItsown(response1.data["own"]);
        if (response1.data["own"] == true && response1.data["is_shared"]==false) {
            setIsShared(false);
        }
        else{
            setIsShared(true)
        }

    }
    is_shared();
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    let text = "http://10.1.189.210:5173/transcript/" + ResponseID + "/";
    const copyToClipboard = async () => {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            SuccessNotification('Link copied to clipboard');
        } catch (err) {
            console.error('Failed to copy: ', err);
            ErrorNotification('Failed to copy link');
        }
    };
    
    const changeIsShared = () => {
        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/share/${ResponseID}?share=${!isShared}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        }
                    });
                    setIsShared(response.data["is_shared"]);
                    if (isShared) {
                        resolve('Meeting Unshared');
                    }
                    else {
                        resolve('Meeting Shared');
                    }

                } catch (error) {
                    console.error('Failed to share meeting:', error);
                    if (isShared) {
                        reject('Failed to unshare Meeting');
                    }
                    else {
                        reject('Failed to share Meeting');
                    }
                }
            }), {
            pending: "Please wait...",
            success: {
                render({ data }) {
                    return data
                },
            },
            error: {
                render({ data }) {
                    return data
                },
            },
        },
            {
                position: "top-center",
                autoClose: 2000,
            }
        );
    }
    // let isLoggedIn = localStorage.getItem('isLoggedIn');





    return (
        <Sidebar
            sidebar={
                <>
                
                    <div className="h-full">

                        {!isLoggedIn ? (<div className="flex flex-col item-center justify center h-full w-full" >
                            <div className="flex flex-col items-center justify-center h-full w-full">
                                <h1 className="text-xl font-bold text-center">Please Login</h1>
                            </div>

                        </div>) :
                            (<>
                                <div className="px-4 py-1 w-full">
                                <button onClick={()=>{setIsOpenSideBar(false); handleDialogOpenUploadMom()}} className="flex text-white w-full items-center justify-center bg-blue-500 border-0 py-4 px-10 focus:outline-none hover:bg-blue-600 rounded-full mx-auto">
                                    AI Minutes of Meeting
                                    <div className="shadow-neutral-1000/25 -mr-[15px] grid items-center justify-center rounded-full p-3 mx-3 shadow-xl bg-white text-blue-600  rtl:-scale-x-100" bis_skin_checked="1">
                                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <polyline points="16 16 12 12 8 16"></polyline>
                                            <line x1="12" y1="12" x2="12" y2="21"></line>
                                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                                            <polyline points="16 16 12 12 8 16"></polyline>
                                        </svg>
                                    </div>
                                </button>
                                </div>
                                <div className="px-4 py-1 w-full">
                                <button onClick={()=>{setIsOpenSideBar(false); handleDialogOpenUploadShorts()}} className="flex text-white w-full items-center justify-center bg-blue-500 border-0 py-4 px-10 focus:outline-none hover:bg-blue-600 rounded-full mx-auto">
                                    Ai Shorts Generator
                                    <div className="shadow-neutral-1000/25 -mr-[15px] grid items-center justify-center rounded-full p-3 mx-3 shadow-xl bg-white text-blue-600  rtl:-scale-x-100" bis_skin_checked="1">
                                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <polyline points="16 16 12 12 8 16"></polyline>
                                            <line x1="12" y1="12" x2="12" y2="21"></line>
                                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                                            <polyline points="16 16 12 12 8 16"></polyline>
                                        </svg>
                                    </div>
                                </button>
                                </div>
                                <div>
                                    {onPage == "Transcript" ? (<>
                                        {itsown&&<Accordion expanded={expanded === 'panel0'} onChange={handleChange('panel0')}>
                                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expanded={expanded === 'panel0'}>
                                                <Typography className="w-[90%]">
                                                    <h1 className="w-full text-[1.2rem] text-center">Share Meeting</h1>
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    <a onClick={changeIsShared}
                                                        className="appearance-none transition group grid-row-col grid gap-2 mb-2 rounded-lg p-3 bg-[#f7f7f8] hover:bg-neutral-200 md:gap-4 md:p-6">
                                                        <div className="grid grid-flow-col content-start items-center justify-between justify-items-start gap-3"
                                                            bis_skin_checked="1">
                                                            <div className="bg-[#38BE09] flex justify-center align-center h-9 w-9 p-[7px] rounded-full" bis_skin_checked="1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF"><path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600ZM240-480Zm480 280Z" /></svg>
                                                            </div>
                                                            <h2 className="text leading-tight tracking-tight">Meeting Shared</h2>
                                                            <Switch checked={isShared} />
                                                        </div>
                                                    </a>
                                                    {isShared && <a onClick={copyToClipboard}
                                                        className="appearance-none transition group grid-row-col grid gap-2 rounded-lg p-3 bg-[#f7f7f8] hover:bg-neutral-200 md:gap-4 md:p-6">
                                                        <div className="grid grid-flow-col content-start items-center justify-start justify-items-start gap-3"
                                                            bis_skin_checked="1">
                                                            <div className="bg-[#3498DB] flex justify-center align-center h-9 w-9 p-[7px] rounded-full" bis_skin_checked="1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                                                                    <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" /></svg>
                                                            </div>
                                                            <h2 className="text-md leading-tight tracking-tight">Copy Link to Clipboard</h2>
                                                        </div>
                                                    </a>
                                                    }
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>}

                                        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expanded={expanded === 'panel1'}>
                                                <Typography className="w-[90%]">
                                                    <h1 className="w-full text-[1.2rem] text-center">Highlights</h1>
                                                </Typography>                                        </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    <a onClick={handleNormalHighlight}
                                                        className="appearance-none transition group grid-row-col grid gap-2 mb-2 rounded-lg p-3 bg-[#f7f7f8] hover:bg-neutral-200 md:gap-4 md:p-6">
                                                        <div className="grid grid-flow-col content-start items-center justify-start justify-items-start gap-3"
                                                            bis_skin_checked="1">
                                                            <div className="h-8 w-8" bis_skin_checked="1">
                                                                <img alt="Property 1=Blog.svg"
                                                                    src="https://cdn-site-assets.veed.io/cdn-cgi/image/width=96,quality=75,format=auto/Property_1_Blog_9221a1ffab/Property_1_Blog_9221a1ffab.svg"
                                                                    width="48" height="48" decoding="async" data-nimg="1"
                                                                    loading="lazy" />
                                                            </div>
                                                            <h2 className="font-medium leading-tight tracking-tight">Normal Highlight
                                                            </h2>
                                                            <Switch checked={Normal} />
                                                        </div>
                                                    </a>
                                                    <a onClick={handleFollowHighlight}
                                                        className="appearance-none transition group grid-row-col grid gap-2 rounded-lg p-3 bg-[#f7f7f8] hover:bg-neutral-200 md:gap-4 md:p-6">
                                                        <div className="grid grid-flow-col content-start items-center justify-start justify-items-start gap-3"
                                                            bis_skin_checked="1">
                                                            <div className="h-8 w-8" bis_skin_checked="1">
                                                                <img alt="Property 1=Blog.svg"
                                                                    src="https://cdn-site-assets.veed.io/cdn-cgi/image/width=96,quality=75,format=auto/Articles_8171b5cd3a/Articles_8171b5cd3a.svg"
                                                                    width="48" height="48" decoding="async" data-nimg="1"
                                                                    loading="lazy" />
                                                            </div>
                                                            <h2 className="font-medium leading-tight tracking-tight">Highlight & Follow
                                                            </h2>
                                                            <Switch checked={Follow} />
                                                        </div>
                                                    </a>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                            <AccordionSummary aria-controls="panel2d-content" id="panel2d-header" expanded={expanded === 'panel2'}>
                                                <Typography className="w-[90%]">
                                                    <h1 className="w-full text-[1.2rem] text-center">Export File</h1>
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    <a onClick={ExportasJSON}
                                                        className="appearance-none transition mb-2 group grid-row-col grid gap-2 rounded-lg p-3 bg-[#f7f7f8] hover:bg-neutral-200 md:gap-4 md:p-6">
                                                        <div className="grid grid-flow-col content-start items-center justify-start justify-items-start gap-3"
                                                            bis_skin_checked="1">
                                                            <div className="h-8 w-8" bis_skin_checked="1">
                                                                <img alt="Property 1=Blog.svg"
                                                                    src="https://cdn-site-assets.veed.io/cdn-cgi/image/width=96,quality=75,format=auto/Property_1_Blog_9221a1ffab/Property_1_Blog_9221a1ffab.svg"
                                                                    width="48" height="48" decoding="async" data-nimg="1"
                                                                    loading="lazy" />
                                                            </div>
                                                            <h2 className="font-medium leading-tight tracking-tight">Export as JSON
                                                            </h2>
                                                        </div>
                                                    </a>
                                                    <a onClick={ExportasExcel}
                                                        className="appearance-none transition w-auto group grid-row-col grid gap-2 rounded-lg p-3 bg-[#f7f7f8] hover:bg-neutral-200 md:gap-4 md:p-6">

                                                        <div className="grid grid-flow-col w-auto content-start items-center justify-start justify-items-start gap-3"
                                                            bis_skin_checked="1">
                                                            <div className="h-8 w-8" bis_skin_checked="1">
                                                                <img alt="Property 1=Blog.svg"
                                                                    src="https://cdn-site-assets.veed.io/cdn-cgi/image/width=96,quality=75,format=auto/Property_1_Blog_9221a1ffab/Property_1_Blog_9221a1ffab.svg"
                                                                    width="48" height="48" decoding="async" data-nimg="1"
                                                                    loading="lazy" />
                                                            </div>
                                                            <h2 className="font-medium leading-tight tracking-tight text-2">Export as Excel
                                                            </h2>
                                                        </div>
                                                    </a>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </>) : null}
                                    {(isShared || isLoggedIn) && <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header" expanded={expanded === 'panel3'}>
                                            <Typography className="w-[90%]">
                                                <h1 className="w-full text-[1.2rem] text-center">Meetings</h1>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails >
                                            <Typography>
                                                <ul>
                                                    {meetings.map((item) => {
                                                        return (
                                                            <li key={item}>
                                                                <button onClick={() => { setIsOpenSideBar(false); navigate(`/transcript/${item["meeting_id"]}`) }} className="flex flex-col w-[95%] h-12 m-2 items-center hover:text-white text-xl justify-center bg-neutral-200 hover:bg-blue-500 rounded-lg">
                                                                    {item["meeting_name"].slice(0, 22)}...
                                                                </button>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>}
                                </div>

                            </>
                            )}
                    </div>
                </>
            }
            open={isOpenSideBar}
            onSetOpen={setIsOpenSideBar}
            // pullRight={true}
            touch={true}
            styles={{

                sidebar: {
                    zIndex: 2,
                    width: "20rem",
                    position: "fixed",
                    top: 0,
                    bottom: 0,
                    transition: "transform .3s ease-out",
                    WebkitTransition: "-webkit-transform .3s ease-out",
                    willChange: "transform",
                    overflowY: "auto",
                    backgroundColor: "rgb(246 243 243)",
                    boxShadow: "2px 0 6px rgba(0,0,0,.1)",
                    display: "flex",
                    flexDirection: "column",
                    paddingTop: "5rem",
                    height: "100%",
                },
                content: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflowY: "auto",
                    WebkitOverflowScrolling: "touch",
                    transition: "left .3s ease-out, right .3s ease-out"
                },
                overlay: {
                    zIndex: 1,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0,
                    visibility: "hidden",
                    transition: "opacity .3s ease-out, visibility .3s ease-out",
                    backgroundColor: "rgba(0,0,0,.3)"
                }

            }}
        >

            <button onClick={() => this.onSetSidebarOpen(true)}>
                Open sidebar
            </button>
        </Sidebar>
    );
}


export default SideBar;