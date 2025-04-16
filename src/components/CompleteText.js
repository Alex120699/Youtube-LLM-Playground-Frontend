import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';

function CompleteText() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const [hiddenWords, setHiddenWords] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setText('');
    setHiddenWords({});
    setUserAnswers({});
    setResults(null);

    try {
      const response = await axios.post('http://localhost:5000/complete-text/get-text', { url });
      setText(response.data.text);
      setHiddenWords(response.data.hidden_words);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al analizar el video');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleValidate = async () => {
    try {
      const response = await axios.post('http://localhost:5000/complete-text/validate', {
        answers: userAnswers,
        hidden_words: hiddenWords
      });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al validar las respuestas');
    }
  };

  const renderText = () => {
    if (!text) return null;

    const words = text.split(' ');
    return words.map((word, index) => {
      if (word === '_____') {
        return (
          <Form.Control
            key={index}
            type="text"
            size="sm"
            style={{ 
              width: '100px', 
              display: 'inline-block',
              margin: '0 5px'
            }}
            value={userAnswers[index] || ''}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
          />
        );
      }
      return <span key={index}>{word} </span>;
    });
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Completa el texto</h1>
      
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
                'Obtener texto'
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

      {text && (
        <Card className="mb-4">
          <Card.Header>Completa las palabras faltantes</Card.Header>
          <Card.Body>
            <div className="mb-4" style={{ lineHeight: '2.5' }}>
              {renderText()}
            </div>
            <Button 
              variant="success" 
              onClick={handleValidate}
              disabled={Object.keys(userAnswers).length === 0}
            >
              Validar respuestas
            </Button>
          </Card.Body>
        </Card>
      )}

      {results && (
        <Card>
          <Card.Header>Resultados</Card.Header>
          <Card.Body>
            <p>Porcentaje de acierto: {results.percentage}%</p>
            <p>Puntuación: {results.score}</p>
            <p>Palabras correctas: {results.correct_count} de {results.total_words}</p>
            <Alert variant="info">
              <h5>Respuestas correctas:</h5>
              <ul>
                {Object.entries(results.correct_answers).map(([index, word]) => (
                  <li key={index}>
                    Posición {parseInt(index) + 1}: {word}
                    {userAnswers[index]?.toLowerCase() === word.toLowerCase() ? 
                      ' ✅' : 
                      ` ❌ (Tu respuesta: ${userAnswers[index] || 'vacío'})`}
                  </li>
                ))}
              </ul>
            </Alert>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default CompleteText; 