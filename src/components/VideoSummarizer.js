// src/components/SummarizeVideo.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';

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
    <Container className="mt-5">
      <h1 className="text-center mb-4">Resumen del video</h1>

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>URL del video de YouTube</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
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
                'Generar Resumen'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>

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
  );
}

export default SummarizeVideo;
