import React, { useState } from 'react';
import axios from 'axios';
//import './TopWords.css'; // Nuevo CSS
import { Form, Button, Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { FaYoutube } from 'react-icons/fa'; // Ícono decorativo

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
    <div className="topwords-background">
      <Container className="py-5">
        <h1 className="text-center text-light mb-5 title-glow">Top Palabras del Video</h1>

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
                  Analizando...
                </>
              ) : (
                'Analizar Video'
              )}
            </Button>
          </Form>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {results && (
          <Card className="results-card">
            <Card.Header className="bg-dark text-white">Top 10 palabras más frecuentes</Card.Header>
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
    </div>
  );
}

export default TopWords;
