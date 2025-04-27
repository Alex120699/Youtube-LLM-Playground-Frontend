import React, { useState } from 'react';
import axios from 'axios';

function ChatWithVideo() {
  const [videoURL, setVideoURL] = useState('');
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transcribed, setTranscribed] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  
  const handleTranscribe = async () => {
    if (!videoURL.trim()) {
      alert('Please enter a video URL.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendURL}/transcribe`, {
        url: videoURL,
      });

      if (response.data && response.data.text) {
        localStorage.setItem('videoTranscript', response.data.text);
        setTranscribed(true);
        alert('Transcription completed! You can now chat with the video.');
      } else {
        alert('No transcript received.');
      }
    } catch (err) {
      console.error(err);
      alert('Error transcribing the video.');
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const videoTranscript = localStorage.getItem('videoTranscript');
    if (!videoTranscript) {
      alert('No transcript found. Please transcribe a video first.');
      return;
    }

    const newMessage = { role: 'user', content: userInput };
    const updatedHistory = [...chatHistory, newMessage];
    setChatHistory(updatedHistory);
    setLoading(true);
    setStreamingContent('');

    try {
      const response = await fetch(`${backendURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          transcript: videoTranscript,
          history: updatedHistory
        }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        result += chunk;
        setStreamingContent(result); // Actualiza lo que se muestra
      }

      const botReply = {
        role: 'assistant',
        content: result
      };

      setChatHistory(prev => [...prev, botReply]);
      setUserInput('');
    } catch (err) {
      console.error(err);
      alert('Error al contactar con el chatbot.');
    }

    setLoading(false);
  };

  const handleReset = () => {
    localStorage.removeItem('videoTranscript');
    setVideoURL('');
    setChatHistory([]);
    setUserInput('');
    setTranscribed(false);
    setStreamingContent('');
  };

  return (
    <div className="container mt-4">
      <h2>Chat with Video Context</h2>
    
      {!transcribed && (
        <div className="mb-3">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Paste a video URL to transcribe..."
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
          />
          <button className="btn btn-secondary" onClick={handleTranscribe} disabled={loading}>
            {loading ? 'Transcribing...' : 'Transcribe Video'}
          </button>
        </div>
      )}

      {transcribed && (
        <button className="btn btn-outline-danger mb-3" onClick={handleReset}>
          Preguntar sobre otro video
        </button>
      )}

      <div className="chat-box border p-3 mb-3" style={{ height: '400px', overflowY: 'auto' }}>
        {chatHistory.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-end' : 'text-start'}`}>
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
          </div>
        ))}
        {loading && streamingContent && (
          <div className="text-start">
            <strong>Bot:</strong> {streamingContent}
          </div>
        )}
      </div>

      <div className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Ask something about the video..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={!transcribed}
        />
        <button className="btn btn-primary" onClick={handleSend} disabled={loading || !transcribed}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default ChatWithVideo;
