import os
import shutil
from fastapi import FastAPI, UploadFile,Request,Depends,HTTPException,status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import random
import string
from pydub import AudioSegment
from schemas import User
from auth import verify_user,get_current_user_email,remove_access_token,create_user,verify_otp
from schemas import OTPVerify
import json
from utils import summarize,transcribe
from db import database
import boto3

s3 = boto3.resource('s3')
bucket = s3.Bucket('mom-audios')
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

def generate_random_id():
    characters = string.ascii_letters + string.digits
    random_id = ''.join(random.choice(characters) for _ in range(8))
    return random_id

@app.post("/signin")
async def login(user : User):
    print(user)
    return verify_user(user)

@app.post("/signup")
async def signup(user : User):
    return create_user(user)

@app.post("/verify")
async def verify(otpVerify: OTPVerify):
    print(otpVerify)
    return verify_otp(otpVerify.email,otpVerify.otp)

@app.get("/logout")
async def logout(message:str = Depends(remove_access_token)):
    return message



@app.get("/get_meetings")
async def get_meetings(email: str = Depends(get_current_user_email)):
    return database.get_meetings(email)
    
@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/isshared/{meeting_id}")
async def is_shared(meeting_id:str,email: str): 
    data = database.is_meeting_shared(meeting_id,email)
    if data["is_shared"]==False and data["own"]==False:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    transcript=database.get_transcript(meeting_id)
    summary=database.get_summary(meeting_id)
    if transcript == None or summary == None:
        return {"transcript" : None,"summary":None,"is_shared":False}
    print(data["own"],data["is_shared"])
    return {"transcript" : json.loads(transcript["transcript"]),"summary":json.loads(summary["summary"]),"is_shared":data["is_shared"],"own":data["own"]}
    
@app.get("/transcript/{meeting_id}")
def getTranscript(meeting_id: str,email: str = Depends(get_current_user_email)):
    if database.verify_meeting_id(meeting_id,email) == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found") 
    return transcribe(meeting_id)

@app.get("/summary/{meeting_id}")
def getSummary(meeting_id:str,email: str = Depends(get_current_user_email)):
    if database.verify_meeting_id(meeting_id,email) == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found") 
    return summarize(meeting_id)

@app.get("/audio/{video_id}")
async def read_item(request: Request, video_id: str):
    # streaming audio from s3 bucket
    try:
        obj = bucket.Object(video_id)
        response = obj.get()
        audio = response['Body'].read()
        start, end = 0, len(audio) - 1
        if "range" in request.headers:
            byte_pos = request.headers["range"].replace("bytes=", "").split("-")
            start = int(byte_pos[0])
            end = int(byte_pos[1]) if len(byte_pos) > 1 and byte_pos[1] else len(audio) - 1
        def content():
            yield audio[start:end+1]
        response = StreamingResponse(content(), media_type="audio/mp3")
        response.headers["Content-Range"] = f"bytes {start}-{end}/{len(audio)}"
        response.status_code = 206
        return response
    except Exception as e:
        print(f"Error processing and uploading file: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error processing and uploading file")

@app.post("/uploadfile")
async def create_upload_file(file: UploadFile = UploadFile(...) ,email: str = Depends(get_current_user_email)):
    meeting_id = generate_random_id()
    if not file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    
    contents = await file.read()
    size = len(contents)
    # Size should not exceed 50 MB
    if not 0 < size < 52428800:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Size of file should be less than 50mb")

    meeting_id = generate_random_id()
    database.add_meeting_id(meeting_id=meeting_id,email=email)
    await s3Upload(contents, meeting_id)
    print("File uploaded successfully")
    return {"video_id": meeting_id}

@app.get("/share/{meeting_id}")
async def share_meeting(meeting_id:str,share:bool,email: str = Depends(get_current_user_email)):
    print(meeting_id,share,email)
    if database.verify_meeting_id(meeting_id,email):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found") 
    database.update_meeting_share_status(meeting_id,share)
    return {"message":"Meeting shared successfully","is_shared":share}



async def s3Upload(contents: bytes, meeting_id: str):
    try:
        bucket.put_object(Key=meeting_id, Body=contents)
    except Exception as e:
        print(f"Error processing and uploading file: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error processing and uploading file")

 