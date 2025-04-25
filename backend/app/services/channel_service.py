# app/services/channel_service.py
from stream_chat import StreamChat
from app.core.config import STREAM_API_KEY, STREAM_API_SECRET

chat_client = StreamChat(api_key=STREAM_API_KEY, api_secret=STREAM_API_SECRET)

def create_token(user_id: str):
    token = chat_client.create_token(user_id)
    return token

def create_or_get_channel(user_ids: list[str]):
    channel_id = "-".join(sorted(user_ids))
    for user_id in user_ids:
        try:
            user_data = {
                "id": user_id,
                "name": user_id,
                "role": "user"
            }
            chat_client.upsert_users([user_data])
        except Exception as e:
            return {"error": f"Erreur lors de la création de l'utilisateur {user_id}: {str(e)}"}
    try:
        channel = chat_client.channel("messaging", channel_id)
        channel.query()
        return {"channel_id": channel_id, "message": "Canal déjà existant"}
    except Exception as e:
        try:
            channel = chat_client.channel("messaging", channel_id, {"members": user_ids})
            channel.create(user_ids[0])
            return {"channel_id": channel_id, "message": "Nouveau canal créé"}
        except Exception as e:
            return {"error": f"Erreur API lors de la création du canal : {str(e)}"}

def send_message_to_channel(channel_id: str, message: str, sender_id: str):
    try:
        channel = chat_client.channel("messaging", channel_id)
        response = channel.send_message({"text": message}, sender_id)
        return {"message": "Message envoyé avec succès", "response": response}
    except Exception as e:
        return {"error": f"Erreur lors de l'envoi du message : {str(e)}"}

def check_users_in_stream(user_ids: list[str]):
    missing_users = []
    for user_id in user_ids:
        try:
            chat_client.query_users({"id": user_id})
        except Exception as e:
            missing_users.append(user_id)
    return missing_users