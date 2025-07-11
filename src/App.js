import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Card Component
const FeatureCard = ({ icon, title, description, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`feature-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transitionDelay: `${delay}ms`,
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)'
      }}
    >
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

// Tile Component
const StatTile = ({ number, label, icon }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const tileRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate counting
          const duration = 2000; // 2 seconds
          const step = (target, current, duration) => {
            const increment = target / (duration / 16);
            if (current < target) {
              setCount(Math.ceil(current + increment));
              requestAnimationFrame(() => step(target, current + increment, duration));
            } else {
              setCount(target);
            }
          };
          step(number, 0, duration);
        }
      },
      { threshold: 0.5 }
    );

    if (tileRef.current) {
      observer.observe(tileRef.current);
    }

    return () => observer.disconnect();
  }, [number]);

  return (
    <div className="stat-tile" ref={tileRef}>
      <div className="tile-icon">{icon}</div>
      <div className="tile-number">{isVisible ? count : '0'}+</div>
      <div className="tile-label">{label}</div>
    </div>
  );
};

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
      const styleButtons = document.querySelectorAll('.style-button');
      
      // Process each button individually
      styleButtons.forEach(button => {
        // Get the button's position
        const rect = button.getBoundingClientRect();
        const centerX = Math.floor(rect.left + rect.width / 2);
        const centerY = Math.floor(rect.top + rect.height / 2);
        
        // Get the background color at the button's position
        const bgElement = document.elementFromPoint(centerX, centerY);
        if (!bgElement) return;
        
        // Get the computed background color
        const bgStyle = window.getComputedStyle(bgElement);
        let bgColor = bgStyle.backgroundColor;
        
        // If background is transparent, get the actual visible color
        if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
          let parent = bgElement.parentElement;
          while (parent && (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent')) {
            const parentStyle = window.getComputedStyle(parent);
            bgColor = parentStyle.backgroundColor;
            parent = parent.parentElement;
          }
        }
        
        // Convert RGB to brightness value (0-255)
        const rgb = bgColor.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const r = parseInt(rgb[0]);
          const g = parseInt(rgb[1]);
          const b = parseInt(rgb[2]);
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          
          // Set button variant based on background brightness
          button.classList.remove('light', 'dark');
          button.classList.add(brightness > 150 ? 'dark' : 'light');
          
          // Add contrast class for better visibility
          button.classList.toggle('high-contrast', brightness > 200 || brightness < 60);
        }
      });
    };
    
    // Initial check
    updateButtonColors();
    
    // Update on scroll and resize
    const handleScroll = () => requestAnimationFrame(updateButtonColors);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateButtonColors);
    
    // Set up mutation observer to watch for style changes
    const observer = new MutationObserver(updateButtonColors);
    document.querySelectorAll('section, .hero').forEach(el => {
      observer.observe(el, { 
        attributes: true, 
        attributeFilter: ['style', 'class'] 
      });
    });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateButtonColors);
      observer.disconnect();
    };
  }, [currentStyle]);

  // Features data
  const features = [
    {
      icon: '🚀',
      title: 'Lightning Fast',
      description: 'Experience blazing fast performance with our optimized platform.'
    },
    {
      icon: '🎨',
      title: 'Beautiful Design',
      description: 'Sleek and modern design that captivates your audience.'
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security.'
    },
    {
      icon: '🔄',
      title: 'Easy Integration',
      description: 'Seamlessly connect with your favorite tools and services.'
    }
  ];

  // Stats data
  const stats = [
    { number: 1000, label: 'Happy Users', icon: '😊' },
    { number: 500, label: 'Projects', icon: '🚀' },
    { number: 50, label: 'Team Members', icon: '👥' },
    { number: 24, label: 'Support Hours', icon: '⏱️' }
  ];

  // Handle mouse move effect
  const handleMouseMove = (e) => {
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  };

  return (
    <div className={`App ${currentStyle}`} onMouseMove={handleMouseMove}>
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
        <div className="hero-content">
          <h1>Welcome to Our Amazing Platform</h1>
          <p>Discover the future of web experiences with our cutting-edge solutions</p>
          <button className="cta-button">Get Started</button>
        </div>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <h2>Our Amazing Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <StatTile
              key={index}
              number={stat.number}
              label={stat.label}
              icon={stat.icon}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to get started?</h2>
          <p>Join thousands of satisfied customers today</p>
          <div className="cta-buttons">
            <button className="cta-button primary">Get Started</button>
            <button className="cta-button secondary">Learn More</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
