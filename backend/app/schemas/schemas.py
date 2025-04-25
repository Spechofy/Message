# app/schemas/schemas.py
from pydantic import BaseModel
from typing import List
#la requête qui sera envoyée pour créer ou récupérer un canal
class ChannelRequest(BaseModel):
    user_ids: List[str]
#la requête utilisée pour envoyer un message dans un canal
class MessageRequest(BaseModel):
    channel_id: str
    user_ids: List[str]
    message: str

# générer un token d'authentification pour un utilisateur
class TokenRequest(BaseModel):
    user_id: str