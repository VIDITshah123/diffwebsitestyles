import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [currentStyle, setCurrentStyle] = useState('default');
  const [buttonVariant, setButtonVariant] = useState('light');
  const heroRef = useRef(null);

  const styles = [
    { id: 'carousel', name: 'Carousel/Slideshow' },
    { id: 'grid', name: 'Grid Layouts' },
    { id: 'typography', name: 'Typography-focused' },
    { id: 'split', name: 'Split Screen' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'gradient', name: 'Gradient Backgrounds' },
    { id: 'interactive', name: 'Interactive Elements' }
  ];

  // Update button colors based on background brightness
  useEffect(() => {
    const updateButtonColors = () => {
      if (!heroRef.current) return;
      
      // Get the computed background color of the hero section
      const bgColor = window.getComputedStyle(heroRef.current).backgroundColor;
      
      // Convert RGB to brightness value (0-255)
      const rgb = bgColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const brightness = (parseInt(rgb[0]) * 299 + 
                          parseInt(rgb[1]) * 587 + 
                          parseInt(rgb[2]) * 114) / 1000;
        
        // Determine if we need light or dark button variant
        setButtonVariant(brightness > 128 ? 'dark' : 'light');
      }
    };
    
    // Initial check
    updateButtonColors();
    
    // Set up mutation observer to watch for style changes
    const observer = new MutationObserver(updateButtonColors);
    if (heroRef.current) {
      observer.observe(heroRef.current, { 
        attributes: true, 
        attributeFilter: ['style', 'class'] 
      });
    }
    
    // Cleanup
    return () => observer.disconnect();
  }, [currentStyle]);

  return (
    <div className={`App ${currentStyle}`}>
      <div className="style-selector">
        {styles.map(style => (
          <button
            key={style.id}
            className={`style-button ${currentStyle === style.id ? 'active' : ''} ${buttonVariant}`}
            onClick={() => setCurrentStyle(style.id)}
          >
            {style.name}
          </button>
        ))}
      </div>
      
      <div className="hero" ref={heroRef}>
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
