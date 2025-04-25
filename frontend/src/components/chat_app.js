import React, { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, MessageList, MessageInput, ChannelList } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

// récupère le token d'authentification nécessaire pour connecter l'utilisateur à Stream Chat
const fetchToken = async (userId) => {
  const response = await fetch(`http://127.0.0.1:8000/api/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });
  const data = await response.json();
  return data.token;
};

const ChatApp = ({ apiKey }) => {
  //L'ID de l'utilisateur connecté.
  const [userId, setUserId] = useState(null);
  //Liste des canaux auxquels l'utilisateur est abonné.
  const [channels, setChannels] = useState([]);
  //Le canal actuellement sélectionné par l'utilisateur.
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [chatClient] = useState(() => new StreamChat(apiKey));  // Utilisation de la clé API valide
  //Indicateur qui définit si le client est prêt à être utilisé
  const [isClientReady, setIsClientReady] = useState(false);

  // récupère l'ID de l'utilisateur depuis les paramètres de l'URL 
  useEffect(() => {
    const urlUserId = new URLSearchParams(window.location.search).get('user');
    if (urlUserId) {
      setUserId(urlUserId);
    }
  }, []);

  // Configurer le chat
  useEffect(() => {
    let isMounted = true;
    //récupère les canaux auxquels l'utilisateur appartient.
    const setupChat = async () => {
      if (!userId || !chatClient) return;

      setChannels([]);
      setSelectedChannel(null);
      setIsClientReady(false);

      const userToken = await fetchToken(userId);  // Récupérer le token utilisateur depuis le backend
      await chatClient.connectUser(
        { id: userId, name: userId },
        userToken
      );
      //triée par date du dernier message et l'utilisateur est redirigé vers le premier canal disponible.
      setIsClientReady(true);
      const userChannels = await chatClient.queryChannels({ members: { $in: [userId] } });
      userChannels.sort((a, b) => b.lastMessage()?.created_at - a.lastMessage()?.created_at);
      setChannels(userChannels);

      if (userChannels.length > 0) {
        setSelectedChannel(userChannels[0]);
      }
    };

    if (userId) {
      setupChat();
    }

    return () => {
      isMounted = false;
      chatClient.disconnectUser();
      setIsClientReady(false);
    };
  }, [userId, chatClient]);

  if (!userId) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
        <h2>Connexion</h2>
        <input
          type="text"
          placeholder="Entrez votre nom"
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
    );
  }

  if (!isClientReady) {
    //en attente de la connexion de l'utilisateur
    return <div>Chargement...</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f6f9', margin: 0 }}>
      {/* Navbar fixe */}
      <nav style={{ backgroundColor: '#0084ff', color: '#fff', padding: '15px', position: 'sticky', top: 0, zIndex: 100 }}>
        <h1>Spechofy</h1>
      </nav>

      <Chat client={chatClient} theme="messaging light">
        
        {/* Barre latérale */}
        <div style={{
            width: '350px',  // Largeur fixe pour la barre latérale
            background: '#fff',
            borderRight: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
            height: '100vh',
            boxShadow: '4px 0px 6px rgba(0,0,0,0.1)',
            flexShrink: 0,   // Empêche la barre latérale de rétrécir
          }}>
<div style={{ padding: '10px', fontWeight: 'bold', color: '#0084ff', fontSize: '16px' }}>
  Chats {userId ? `- ${userId}` : ''}
</div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              style={{
                width: '80%',
                padding: '8px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                fontSize: '14px',
              }}
            />
          </div>

          {/* Liste des canaux */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {channels.length > 0 ? (
              channels.map((channel) => {
                const members = Object.keys(channel.state.members || {});
                // Trouver l'autre membre (autre que l'utilisateur connecté)
                const otherMember = members.find(member => member !== userId);
                
                return (
                  <div
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    style={{
                      padding: '12px',
                      cursor: 'pointer',
                      background: selectedChannel?.id === channel.id ? '#e0f7fa' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: '1px solid #ddd',
                      borderRadius: '8px',
                      marginBottom: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#007bff',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        marginRight: '10px',
                      }}
                    >
                      {otherMember ? otherMember.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                      {otherMember ? otherMember : 'Canal'}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ color: '#888', fontStyle: 'italic' }}>Aucun canal disponible.</div>
            )}
          </div>
        </div>

        {/* Zone de messages */}
        <div style={{
          flex: 1,  // La zone de chat occupe tout l'espace restant
          display: 'flex', 
          flexDirection: 'column', 
          overflowY: 'auto',  // Permet de défiler si le contenu est trop long
          backgroundColor: '#ffffff',
          width: 'calc(100% - 350px)',  // Calcul pour que la zone de messages prenne tout le reste de l'espace
          paddingBottom: '60px', // Espacement pour le bouton d'envoi en bas
        }}>
          {selectedChannel ? (
            <Channel channel={selectedChannel}>
              <div style={{ padding: '20px', background: '#fff', borderBottom: '1px solid #ddd' }}>
                <div style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '10px',
                    width: '900px',
                  }}>
                  {Object.keys(selectedChannel.state.members || {})
                    .find((member) => member !== userId)?.toUpperCase() || 'Canal'}
                </div>
                <MessageList />
                <div style={{
                position: 'fixed',  // L'input de message reste fixé en bas
                bottom: 0,
                
                width: 'calc(70% - 100px)', // Largeur ajustée pour la zone des messages
                padding: '10px 20px',
                background: '#f1f1f1',
                borderTop: '1px solid #ddd',
              }}>
                <MessageInput />
              </div>
              </div>
              
            </Channel>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#888',
            }}>
              Sélectionnez un canal pour discuter.
            </div>
          )}
        </div>
      </Chat>
    </div>
  );
};

export default ChatApp;
