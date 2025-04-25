# app/api/routes_token.py
from fastapi import APIRouter
from app.services.channel_service import create_token, create_or_get_channel
from app.schemas.schemas import TokenRequest 

router = APIRouter()
#permet de créer un token d'authentification pour un utilisateur donné.
@router.post("/token")
def create_token_endpoint(request: TokenRequest): 
    token = create_token(request.user_id) 
    return {"user_id": request.user_id, "token": token}

@router.post("/create-channel")
def create_channel_endpoint(user_ids: list[str]):
    result = create_or_get_channel(user_ids)
    return result