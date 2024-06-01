from fastapi import HTTPException, Depends,status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from db import database
from schemas import User
from config import settings
# import aioredis
from email.message import EmailMessage
import random
import smtplib

SECRET_KEY = settings.JWT_SECRET
ALGORITHM = settings.JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.JWT_EXPIRES_MINUTES

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

user_otp = {}
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def verify_user(user:User):
    userdata = database.get_user(user.email)
    # if get_password_hash(user.password) != userdata['password_hash']:
    #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")
    if not userdata:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found !!")
    if userdata['is_verified'] == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not verified")
    if not verify_password(user.password, userdata['password_hash']):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password !!")
    return create_access_token(data={"sub": userdata['email']})

# def create_user(user:User):
#     hashed_password = get_password_hash(user.password)
#     database.add_user(user.email, hashed_password,True)
#     # return create_otp(User)
#     return create_access_token(data={"sub": user.email})

def create_user(user:User):
    datauser=database.get_user(user.email)
    if datauser and datauser['is_verified'] == True:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists")
    hashed_password = get_password_hash(user.password)
    otp = random.randint(1000,9999)
    user_otp[user.email] = str(otp)
    return send_otp_on_email(user.email,hashed_password, otp)

def verify_otp(email: str, otp: str):
    
    user=database.get_user(email)
    print(type(user['is_verified']),user['is_verified'])
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user['is_verified'] != 0:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User already verified")
    if user_otp.get(email) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid OTP request")
    if user_otp[email] != otp:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect OTP")
    user_otp.pop(email)
    database.update_user_verification_status(email, True)
    return {"message": "User verified successfully", "token": create_access_token(data={"sub": email}) }

def verify_access_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if database.is_token_blacklisted(token):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token blacklisted")
        if payload is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

def get_current_user_email(token: str = Depends(oauth2_scheme)):
    print(token)
    token_data = verify_access_token(token)
    return token_data['sub']

def remove_access_token(token: str = Depends(oauth2_scheme)):
    database.add_blacklisted_token(token)
    return {"message": "User logged out successfully"}

def send_otp_on_email(email: str,hashed_password: str, otp: int):
    msg = EmailMessage()
    msg['Subject'] = "OTP verification"
    msg['To'] = email
    http_message = f"Your OTP is {otp}"
    msg.set_content(http_message)
    try:
        server = smtplib.SMTP('smtp.gmail.com', '587')
        server.starttls()
        server.login(settings.EMAIL, settings.EMAIL_PASSWORD)
        server = smtplib.SMTP('smtp.gmail.com', '587')
        server.starttls()
        server.login(settings.EMAIL, settings.EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        database.add_user(email, hashed_password, False)
        return {"message": "OTP sent successfully"}
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error while sending OTP")
    