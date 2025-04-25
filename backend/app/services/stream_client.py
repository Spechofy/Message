from stream_chat import StreamChat
from app.core.config import STREAM_API_KEY, STREAM_API_SECRET

chat_client = StreamChat(api_key=STREAM_API_KEY, api_secret=STREAM_API_SECRET)

def create_token(user_id: str):
    # Génère un token d'authentification pour l'utilisateur
    token = chat_client.create_token(user_id)
    return token

def create_or_get_channel(user_ids: list[str]):
    # Créer un ID de canal unique basé sur les IDs des utilisateurs
    channel_id = "-".join(sorted(user_ids))

    # Créer un canal de messagerie avec les membres
    channel = chat_client.channel("messaging", channel_id, {
        "members": user_ids
    })
    channel.create(user_ids[0])  # Le premier utilisateur devient le créateur du canal
    return {"channel_id": channel_id}

def check_users_in_stream(user_ids: list[str]):
    # Vérifie si les utilisateurs existent dans Stream Chat
    missing_users = []
    for user_id in user_ids:
        try:
            # Vérifie si l'utilisateur existe dans Stream Chat
            chat_client.query_users(id=user_id)
        except Exception as e:
            missing_users.append(user_id)
    return missing_users
