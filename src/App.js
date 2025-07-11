import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentStyle, setCurrentStyle] = useState('default');

  const styles = [
    { id: 'carousel', name: 'Carousel/Slideshow' },
    { id: 'grid', name: 'Grid Layouts' },
    { id: 'typography', name: 'Typography-focused' },
    { id: 'split', name: 'Split Screen' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'gradient', name: 'Gradient Backgrounds' },
    { id: 'interactive', name: 'Interactive Elements' }
  ];

  return (
    <div className={`App ${currentStyle}`}>
      <div className="style-selector">
        {styles.map(style => (
          <button
            key={style.id}
            className={`style-button ${currentStyle === style.id ? 'active' : ''}`}
            onClick={() => setCurrentStyle(style.id)}
          >
            {style.name}
          </button>
        ))}
      </div>
      
      <div className="hero">
        {/* <nav className="navbar">
          <div className="logo">Brand</div>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </nav> */}
        <div className="hero-content">
          <h1>Welcome to Our Amazing Platform</h1>
          <p>Discover the future of web experiences with our cutting-edge solutions</p>
          <button className="cta-button">Get Started</button>
        </div>
      </div>
    </div>
  );
}

export default App;
