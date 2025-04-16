import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import TopWords from './components/TopWords';
import CompleteText from './components/CompleteText';
import VideoSummarizer from './components/VideoSummarizer';
import Transcriber from './components/Transcriber';
import ChatWithVideo from './components/ChatWithVideo';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">YouTube Text Analyzer</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/top-words">Top Words</Nav.Link>
                <Nav.Link as={Link} to="/complete-text">Complete Text</Nav.Link>
                <Nav.Link as={Link} to="/summarize">Summarize Video</Nav.Link>
                <Nav.Link as={Link} to="/transcribe">Transcribe Video</Nav.Link>
                <Nav.Link as={Link} to="/chat">Chat with Video</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/top-words" element={<TopWords />} />
          <Route path="/complete-text" element={<CompleteText />} />
          <Route path="/summarize" element={<VideoSummarizer />} />
          <Route path="/transcribe" element={<Transcriber />} />
          <Route path="/chat" element={<ChatWithVideo />} />
          <Route path="/" element={<TopWords />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
