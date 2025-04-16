// src/components/SummarizeVideo.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';

function SummarizeVideo() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await axios.post(`${backendURL}/summarize`, { url });
      setSummary(response.data.summary);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al generar el resumen');
    } finally {
      setLoading(false);
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
        <Card>
          <Card.Header>Resumen del video</Card.Header>
          <Card.Body>
            <p>{summary}</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default SummarizeVideo;
