import React from 'react';
import ChatApp from './components/chat_app';
import './App.css';

function App() {
    const streamApiKey = 'trsn9cbke583'; // Match the backend STREAM_API_KEY

    return (
        
        <div className="App">
            
            <div style={{ height: '89vh' }}>
                <ChatApp apiKey={streamApiKey} />
            </div>
        </div>
    );
}

export default App;