import React, { useState } from 'react';
import axios from 'axios';

function Transcriber() {
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const handleTranscribe = async () => {
    if (!url) return;

    setLoading(true);
    setTranscript('');
    setError('');

    try {
      const response = await axios.post(`${backendURL}/transcribe`, {
        url: url
      });

      if (response.data && response.data.text) {
        setTranscript(response.data.text);
        localStorage.setItem('videoTranscript', response.data.text); // Guardamos para el chatbot
      } else {
        setError('No se recibió transcripción.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al transcribir el video.');
    }

    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2>Transcribe YouTube Video</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleTranscribe} disabled={loading}>
          {loading ? 'Transcribing...' : 'Transcribe'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {transcript && (
        <div className="mt-4">
          <h5>Transcript:</h5>
          <textarea
            className="form-control"
            rows="15"
            value={transcript}
            readOnly
          ></textarea>
        </div>
      )}
    </div>
  );
}

export default Transcriber;
