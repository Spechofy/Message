# app/api/routes_channel.py
from fastapi import APIRouter
from app.schemas.schemas import ChannelRequest, MessageRequest
from app.services.channel_service import create_or_get_channel, send_message_to_channel
#ici j'ai crée un objet router pour regrouper tout les canaux les utiliser dans l'app
router = APIRouter()
#ici je crée un canal ou je récupére un canal existant avec post 
@router.post("/channel")
#le requete ici doit correspondre à un shemas channelrequest qui contient la liste des utilisateurs
def create_channel_endpoint(request: ChannelRequest):
    response = create_or_get_channel(request.user_ids)
    if response.get("message") == "Nouveau canal créé":
        channel_id = response.get("channel_id")
        message_response = send_message_to_channel(channel_id, "Bienvenue dans le canal !", request.user_ids[0])
        return {"create_channel_response": response, "send_message_response": message_response}
    return response
#ceci me permet d'envoyer un message dans un canal déja existant
@router.post("/message")
def send_message_endpoint(request: MessageRequest):
    response = send_message_to_channel(request.channel_id, request.message, request.user_ids[0])
    return response