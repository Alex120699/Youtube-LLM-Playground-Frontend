import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, ListGroup, Spinner, Alert } from 'react-bootstrap';

function TopWords() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await axios.post(`${backendURL}/top-words/analyze`, { url });
      setResults(response.data.top_words);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al analizar el video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Palabras más frecuentes</h1>
      
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
                  Analizando...
                </>
              ) : (
                'Analizar Video'
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

      {results && (
        <Card>
          <Card.Header>Top 10 palabras más frecuentes</Card.Header>
          <ListGroup variant="flush">
            {results.map((item, index) => (
              <ListGroup.Item key={index}>
                <div className="d-flex justify-content-between align-items-center">
                  <span>{item.word}</span>
                  <span className="badge bg-primary rounded-pill">{item.count}</span>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
    </Container>
  );
}

export default TopWords; 