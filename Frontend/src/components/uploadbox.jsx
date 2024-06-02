import React, { useState, useRef } from 'react';
import {
    DialogBody,
    DialogOverlay,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogClose,
    DialogStyled,
    DialogButton,
    FileName,
    DropArea,
    SelectedFile,
    AudioIcon,
} from "./styled";
import AudioFile from "../assets/AudioFile.svg";
import { toast } from 'react-toastify';
import "./UploadBox.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UploadBox = ({uploadType, onClose, ...rest }) => {
    const languages = [
        { value: "en", label: "English" },
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "hi", label: "Hindi" }];
        

    const [selectedOption, setSelectedOption] = useState("");

    // Function to handle option change
    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const navigate = useNavigate();
    const elRef = useRef();
    const handleModalVibration = () => {
        console.log('shake');
        elRef.current.classList.add("shake");
        setTimeout(() => {
            elRef.current.classList.remove("shake");
        }, 1000);
    };
    const [file, setFile] = useState(null);

    const fileInputRef = useRef();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };
    const handleClose = () => {
        setFile(null);
        fileInputRef.current.value = null;
    };
    const handleFileDrop = (event) => {
        event.preventDefault();
        const selectedFile = event.dataTransfer.files[0];
        setFile(selectedFile);
    };
    const HandleCloseButtonClose = () => {
        setFile(null);
        fileInputRef.current.value = null;
        onClose();
    }

    const openFileDialog = () => {
        fileInputRef.current.click();
    };

    const handleFormSubmit = (event) => {
        // console.log('submit');
        event.preventDefault();
        toast.promise(
            new Promise((resolve, reject) => {
                (async () => {
                    try {
                        const formData = new FormData();
                        formData.append('file', file);
                        // const generateID = () => {
                        //     return Math.random().toString(36).substr(2, 10);
                        // };
                        
                        const response = await axios.post('http://127.0.0.1:8000/uploadfile', formData, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                        console.clear();
                        console.log(response.data['video_id']);
                        console.log(uploadType);
                        if(uploadType == 'mom'){
                            navigate(`/transcript/${response.data.video_id}`, { state: { file: URL.createObjectURL(file) } });
                            console.log(uploadType);
                        }
                        else if(uploadType == 'shorts'){
                            console.log(uploadType);
                            navigate(`/shorts/${response.data.video_id}`, { state: { file: URL.createObjectURL(file) } });
                        }
                        resolve();
                        HandleCloseButtonClose();
                    } catch (error) {
                        console.log(error);
                        reject();
                    }
                })();
            }),
            {
                pending: 'Uploading file...',
                success: 'File uploaded successfully!',
                error: 'Upload failed',
            },
            {
                position: "top-center",
                autoClose: 2000,
            }
        );
    };

    return (
        <DialogStyled {...rest} tabindex="-1">
            <DialogOverlay onClick={handleModalVibration} />
            <DialogContent ref={elRef}>
                <DialogHeader>
                    <h2>Upload Audio</h2>
                    <DialogClose onClick={HandleCloseButtonClose} />
                </DialogHeader>
                <DialogBody>
                    <form onSubmit={handleFormSubmit} className="file-input">
                        <DropArea onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()} onClick={openFileDialog}>
                            <input type="file" accept="audio/*,video/*" ref={fileInputRef} onChange={handleFileChange} hidden />
                            {!file ? (
                                <p>Drag and drop MP3, M4A, WAV, or MP4 file here, or select files to upload.</p>
                            ) : <p onClick={handleClose} className="replace-file">Click here or drag and drop a new file to replace the current one.</p>
                            }
                        </DropArea>
                        {file && (
                            <>
                                <SelectedFile>
                                    {/* <AudioIcon className="fas fa-file-audio" /> */}
                                    <img src={AudioFile} className='audiofileicon' alt="" />
                                    <FileName>{file.name}</FileName>
                                </SelectedFile>
                                {/* <select
                                    value={selectedOption}
                                    onChange={handleOptionChange}
                                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {languages.map((language) => (
                                        <option key={language.value} value={language.value}>
                                            {language.label}
                                        </option>
                                    ))}
                                </select> */}
                                <div className='flex justify-center'>
                                <DialogButton className='GreenButton ' type="submit">Upload</DialogButton>
                                </div>
                            </>
                        )}
                    </form>
                </DialogBody>
                <DialogFooter>
                    {/* {file && <button className='GreenButton' type="submit">Upload</button>} */}
                </DialogFooter>

            </DialogContent>
        </DialogStyled >
    );
};
export default UploadBox;
