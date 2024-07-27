import React, { useContext, useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Card, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { API_NOTAS } from '../var';
import study from '../study.png';

const Dashboard = () => {
  const { user, loading, error, logout } = useContext(UserContext);
  const [tokenUrl, setTokenUrl] = useState('');
  const [generating, setGenerating] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [cardDetails, setCardDetails] = useState({});
  const navigate = useNavigate();

  const handleGenerateToken = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no encontrado');
      }
      const url = `${API_NOTAS}?token=${encodeURIComponent(token)}`;

      const currentDate = new Date();
      setTokenUrl(url);
      setCardDetails({
        date: currentDate.toLocaleDateString(),
        time: currentDate.toLocaleTimeString(),
        token,
        url
      });
      setShowCard(true);
    } catch (err) {
      console.error('Error generando token URL:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">
            <img
              src={study}
              alt="Logo"
              style={{ height: '40px' }}
            />
            Cursos
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              {user && (
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {user.correo}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <h1>Tokens</h1>
        {user && (
          <div>
            <h2>Bienvenido, {user.nombre}</h2>
            <Button 
              variant="primary" 
              onClick={handleGenerateToken} 
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Generate Token URL'}
            </Button>

            {showCard && (
              <Card className="mt-4">
                <Card.Body>
                  <Card.Title>Detalles de Token</Card.Title>
                  <Card.Text>
                    <strong>Fecha:</strong> {cardDetails.date}<br />
                    <strong>Hora:</strong> {cardDetails.time}<br />
                    <strong>Token:</strong> {cardDetails.token}<br />
                    <strong>URL:</strong> <a href={cardDetails.url} target="_blank" rel="noopener noreferrer">{cardDetails.url}</a>
                  </Card.Text>
                </Card.Body>
              </Card>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
