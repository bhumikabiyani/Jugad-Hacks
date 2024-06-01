import pymongo
from config import settings
from fastapi import HTTPException,status

class DataBase:
    def __init__(self) -> None:
        try:
            self.client = pymongo.MongoClient(settings.DATABASE_URL)
            self.db = self.client[settings.MONGODB_NAME]
            print("Connected to MongoDB")
        except Exception as e:
            print(f"Error while connecting to MongoDB: {e}")
        
    def close_connection(self):
        self.client.close()
        print("MongoDB connection closed")
    
    def get_user(self, username):
        return self.db.users.find_one({"email": username})
    
    def update_user_verification_status(self, username, is_verified):
        self.db.users.update_one({"email": username}, {"$set": {"is_verified": is_verified}})
        
    def verify_meeting_id(self,meeting_id,email):
        return self.db.meetings.find_one({"meeting_id": meeting_id, "email": email}) is None
    
    def add_meeting_id(self,meeting_id,email):
        self.db.meetings.insert_one({"meeting_id": meeting_id, "email": email,"is_shared": False,"meeting_name": ""})
        
    def get_meetings(self, email):
        result = self.db.meetings.find({"email": email}, {"_id": 0, "meeting_id": 1, "meeting_name": 1})
        meetings = [{"meeting_id": doc["meeting_id"], "meeting_name": doc["meeting_name"]} for doc in result]
        return meetings
    
    def update_meeting_share_status(self,meeting_id,status):
        self.db.meetings.update_one({"meeting_id": meeting_id}, {"$set": {"is_shared": status}})
        
    def is_meeting_shared(self,meeting_id,email):
        if self.db.meetings.find_one({"meeting_id": meeting_id}) is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
        if email!="null" and self.db.meetings.find_one({"meeting_id": meeting_id, "email": email}) is not None:
            return {"own":True,"is_shared":self.db.meetings.find_one({"meeting_id": meeting_id})["is_shared"]}
        return {"own":False,"is_shared":self.db.meetings.find_one({"meeting_id": meeting_id})["is_shared"]}

    
    def add_user(self, username, password,is_verified=False):
        if self.get_user(username)!=None:
            self.db.users.update_one({"email": username}, {"$set": {"password_hash": password}, "$set": {"is_verified": is_verified}})
        self.db.users.insert_one({"email": username, "password_hash": password, "is_verified": is_verified})
        
    def add_blacklisted_token(self, token):
        if self.is_token_blacklisted(token):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token blacklisted")
        self.db.blacklistedtokens.insert_one({"token": token})
        return {"message": "Logged out successfully"}
        
    def is_token_blacklisted(self, token):
        return self.db.blacklistedtokens.find_one({"token": token}) is not None
    
    def insert_transcript(self,meeting_id,transcript):
        self.db.minutesOfMeetings.insert_one({"meeting_id": meeting_id, "transcript": transcript,"summary": ""})
        
    def get_transcript(self,meeting_id):
        result = self.db.minutesOfMeetings.find_one({"meeting_id": meeting_id})
        return result
    
    def insert_summary(self,meeting_id,summary):
        self.db.minutesOfMeetings.update_one({"meeting_id": meeting_id}, {"$set": {"summary": summary}})
    
    def get_summary(self,meeting_id):
        result = self.db.minutesOfMeetings.find_one({"meeting_id": meeting_id})
        return result

    def set_meeting_name(self,meeting_id,meeting_name):
        self.db.meetings.update_one({"meeting_id": meeting_id}, {"$set": {"meeting_name": meeting_name}})
    
    def get_meeting_name(self,meeting_id):
        result = self.db.meetings.find_one({"meeting_id": meeting_id})
        return result["meeting_name"]
    
database=DataBase()