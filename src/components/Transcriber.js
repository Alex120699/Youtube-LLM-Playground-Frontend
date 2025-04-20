import React, { useState } from 'react';
import axios from 'axios';
import { FaYoutube } from 'react-icons/fa'; // Ícono decorativo
import { Form, Button, Spinner } from 'react-bootstrap';
import { Container } from 'react-bootstrap';


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
    <div className="topwords-background">
          <Container className="py-5">
            <h1 className="text-center text-light mb-5 title-glow">Transcribe YouTube Video</h1>

      <div className="glass-card mx-auto mb-4 p-4">
                <Form onSubmit={handleTranscribe}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">URL del video de YouTube</Form.Label>
                    <div className="input-with-icon">
                      <FaYoutube className="input-icon" />
                      <input
                        className="input-glass"
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>
                  <Button className="custom-btn" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Analizando...
                      </>
                    ) : (
                      'Obtener texto'
                    )}
                  </Button>
                </Form>
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
      </Container>
    </div>
  );
}

export default Transcriber;
