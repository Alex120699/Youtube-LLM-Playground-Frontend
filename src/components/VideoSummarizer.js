// src/components/SummarizeVideo.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { FaYoutube } from 'react-icons/fa'; // Ícono decorativo

function SummarizeVideo() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const [logs, setLogs] = useState([]); // <-- logs visuales

  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const log = (msg) => {
    setLogs((prevLogs) => [...prevLogs, msg]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSummary('');
    setLogs([]); // limpiar logs al nuevo intento

    log('📤 Enviando solicitud al backend...');
    log(`🌐 URL del backend: ${backendURL}/summarize`);

    try {
      const response = await axios.post(`${backendURL}/summarize`, { url });
      log('✅ Respuesta recibida del backend');
      log(`📄 Resumen: ${response.data.summary?.slice(0, 100)}...`); // mostrar parte del resumen
      setSummary(response.data.summary);
    } catch (err) {
      log('❌ Error al hacer POST');
      log(JSON.stringify(err.response?.data || err.message));
      setError(err.response?.data?.error || 'Error al generar el resumen');
    } finally {
      setLoading(false);
      log('🏁 Proceso terminado');
    }
  };

  return (
    <div className="topwords-background">
      <Container className="py-5">
        <h1 className="text-center text-light mb-5 title-glow">Resumen de Video</h1>

      <div className="glass-card mx-auto mb-4 p-4">
          <Form onSubmit={handleSubmit}>
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
                  Resumiendo...
                </>
              ) : (
                'Obtener texto'
              )}
            </Button>
          </Form>
      </div>

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {summary && (
        <Card className="mb-4">
          <Card.Header>Resumen del video</Card.Header>
          <Card.Body>
            <p>{summary}</p>
          </Card.Body>
        </Card>
      )}

      {/* Mostrar logs visuales */}
      {logs.length > 0 && (
        <Card>
          <Card.Header>🛠️ Debug Logs</Card.Header>
          <Card.Body>
            <ul>
              {logs.map((log, i) => (
                <li key={i}>{log}</li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      )}
    </Container>
    </div>
  );
}

export default SummarizeVideo;
