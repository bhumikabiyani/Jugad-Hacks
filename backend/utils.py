from db import database
import json
import assemblyai as aai
from config import settings
from fastapi import HTTPException,status
import google.generativeai as genai
import boto3

s3 = boto3.resource('s3')
bucket = s3.Bucket('mom-audios')

generation_config = {
    "temperature": 0,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
    }

safety_settings = [
{
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_ONLY_HIGH"
},
{
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_ONLY_HIGH"
},
{
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
},
{
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_ONLY_HIGH"
},
]

def transcribe(video_id):
    result = database.get_transcript(video_id)
    if result:
        check = database.get_meeting_name(video_id)
        if check == "" or check == None :
            title = generate_meeting_name(json.loads(result['transcript']))
            database.set_meeting_name(video_id,title)
        return json.loads(result['transcript'])
    aai.settings.api_key = settings.ASSEMBLYAI_API_KEY
    config = aai.TranscriptionConfig(
        speaker_labels=True,
    )
    transcriber = aai.Transcriber()
    try:
        obj = bucket.Object(video_id)
        response = obj.get()
        audio = response['Body'].read()
        transcript = transcriber.transcribe(audio, config)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found") 
    # transcript = transcriber.transcribe(f"check.mp4", config)
    if transcript.status == aai.TranscriptStatus.error:
        return {"error": transcript.error}
    else:
        dump_transcript=[]
        for utterance in transcript.utterances:
            words = []
            for word in utterance.words:
                words.append({"start": word.start, "end": word.end, "confidence": word.confidence, "text": word.text, "speaker": word.speaker})
            dump_transcript.append({"speaker": utterance.speaker, "text": utterance.text, "start": utterance.start, "end": utterance.end, "confidence": utterance.confidence, "words": words})
        dumpVal = json.dumps(dump_transcript)
        check = database.get_meeting_name(video_id)
        if check == "" or check == None :
            title = generate_meeting_name(dump_transcript)
            database.set_meeting_name(video_id,title)
        database.insert_transcript(video_id, dumpVal)
        return dump_transcript

def summarize(video_id):
    result = database.get_summary(video_id)
    if result["summary"]:
        return json.loads(result["summary"])
    
    GOOGLE_API_KEY=settings.GOOGLE_API_KEY
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel(model_name="gemini-1.0-pro",
                                generation_config=generation_config,
                                safety_settings=safety_settings)
    
    # text = "You are a proficient AI with a specialty in distilling information into key points. Based on the following text, identify and list the main points that were discussed or brought up. These should be the most important ideas, findings, or topics that are crucial to the essence of the discussion. Your goal is to provide a list that someone could read to quickly understand what was talked about.\n\n"
    text = "Give the summary/minutes of meeting\n\n"

    result = database.get_transcript(video_id)
    if result:
        transcript = json.loads(result["transcript"])
        for utterance in transcript:
            text += utterance["text"] + "\n\n"

    response = model.generate_content(text)
    dump_summary = json.dumps(response.text)
    database.insert_summary(video_id, dump_summary)

    return response.text


def generate_meeting_name(dumpVal):
    GOOGLE_API_KEY=settings.GOOGLE_API_KEY
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel(model_name="gemini-1.0-pro",
                                generation_config=generation_config,
                                safety_settings=safety_settings) 
    text = "What can be the title of the meeting\n\n"
    print(dumpVal[0])
    for utterance in dumpVal:
        text += utterance["text"] + "\n\n"
    response = model.generate_content(text)
    print(response.text)
    return response.text

