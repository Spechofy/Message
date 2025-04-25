from stream_chat import StreamChat
from app.core.config import STREAM_API_KEY, STREAM_API_SECRET

chat_client = StreamChat(api_key=STREAM_API_KEY, api_secret=STREAM_API_SECRET)

def check_users_in_stream(user_ids: list[str]):
    missing_users = []
    for user_id in user_ids:
        try:
            # Vérifie si l'utilisateur existe déjà dans Stream Chat
            user = chat_client.query_users(id=user_id)
            if not user:
                # Si l'utilisateur n'existe pas, le créer
                chat_client.upsert_user({"id": user_id, "name": user_id})
        except Exception as e:
            # Si l'utilisateur est manquant, l'ajouter à la liste des manquants
            missing_users.append(user_id)
    return missing_users
