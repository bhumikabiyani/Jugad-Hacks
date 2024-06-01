from pydantic import BaseModel

class User(BaseModel):
    email: str
    password: str

class OTPVerify(BaseModel):
    email: str
    otp: str
    
class Meeting(BaseModel):
    meeting_id: str
    email: str