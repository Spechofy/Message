from fastapi import FastAPI
import redis
from pydantic import BaseModel

app = FastAPI()

# Connexion à Redis
redis_client = redis.Redis(host="redis", port=6379, db=0)

# Route pour la racine
@app.get("/")
async def read_root():
    return {"message": "Bienvenue dans l'API Message"}

# Route pour ajouter un message dans Redis
class Message(BaseModel):
    key: str
    value: str

@app.post("/message")
async def set_message(message: Message):
    redis_client.set(message.key, message.value)
    return {"message": f"Message '{message.key}' ajouté dans Redis"}

# Route pour récupérer un message depuis Redis
@app.get("/message/{key}")
async def get_message(key: str):
    message = redis_client.get(key)
    if message:
        return {"message": message.decode("utf-8")}
    return {"message": "Message not found"}
