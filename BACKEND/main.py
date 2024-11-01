import os
from fastapi import FastAPI, HTTPException, Form
from fastapi.responses import FileResponse
import qrcode
import jwt   # for encoding JWTs
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Loading environment variables:
# # load_dotenv(): This function loads environment variables from a .env file into your program. You need to import it and call it if you have sensitive information (like API keys or secrets) stored in a .env file.
# # SECRET_KEY = os.getenv("SECRET_KEY", "your_default_secret_key"): This line retrieves the SECRET_KEY environment variable. If SECRET_KEY is not set in the environment, it defaults to "your_default_secret_key".
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "default_fallback_key")

app = FastAPI()

# TEMP: Define the User's emergency info (from DB)
users_data = {
    "user1": {
        "name": "John Doe",
        "contact": "+123456789",
        "email": "johndoe@example.com",
    },
    "user2": {
        "name": "Jane Monrow",
        "contact": "+123456789",
        "email": "janesexy@example.com",
    }
}

# JWT Generation function:
# datetime.utcnow(): This function returns the current time in UTC (Coordinated Universal Time) as a datetime object.

# timedelta(hours=1): This creates a time difference of 1 hour.

# expiration = datetime.utcnow() + timedelta(hours=1): This line sets an expiration time that is 1 hour from the current UTC time.

# encoded_jwt = jwt.encode({"some": "payload"}, "secret", algorithm="HS256")
def create_jwt(user_id: str):
    expiration =datetime.utcnow() + timedelta(hours=1)
    token = jwt.encode(
        {"user_id": user_id, "exp": expiration}, 
        SECRET_KEY,
        algorithm="HS256"
    )
    return token


# Endpoint for user registration
@app.post("/register")
def register_user(name: str = Form(...), contact: str = Form(...), email: str = Form(...)):
    # Here, you'd typically store the user's data in a database.
    # For demonstration, we store it in the dictionary.

    user_id = f"user{len(users_data)+1}"
    users_data[user_id] = {
        "name": name,
        "contact": contact,
        "email": email
    }

    return {"message": "User registered successfully", "user_id": user_id}

# Endpoint tp generate QR code
@app.get("/generate_qr/{user_id}")
def generate_qr(user_id: str):
    # Check if user exists
    user_data = users_data.get(user_id)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Generate JWT for secure access
    token = create_jwt(user_id)
    # # Creates a URL for accessing emergency contact information with the token as a query parameter.
    url = f"http://127.0.0.1:8000/emergency_contact?token={token}"

    # Generate QR code containing the url
    # qr = qrcode.make(url): Creates a QR code containing the URL with the token using the qrcode library.
    # # qr_filename = f"{user_id}_qr.png": Sets the filename based on user_id.
    # # qr.save(qr_filename): Saves the QR code image as a PNG file. Saves QR codes locally on server(issue) in CWD
    qr = qrcode.make(url)
    qr_filename = f"{user_id}_qr.png"
    qr.save(qr_filename)

    # Serve generated QR code image
    # # return FileResponse(...): Returns the generated QR code image as a response. FileResponse serves the file with the MIME type image/png so that the client can download or display the QR code.
    return FileResponse(qr_filename, media_type="image/png", filename=qr_filename)


# Endpoint to access emergency contact info (secured by JWT)
@app.get("/emergency_contact")
def get_emergency_contact(token: str):
    try:
        # Decode the JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        # Extracting user_id from received token
        user_id = payload.get("user_id")

        #Fetch user info
        user_data = users_data.get(user_id)
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")
    
        return {
            "name": user_data["name"],
            "contact": user_data["contact"],
            "email": user_data["email"]
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    



@app.get("/")
def read_root():
    return {"message": "Hello, World"}


# Explicit declaration of host and port address(optional)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
