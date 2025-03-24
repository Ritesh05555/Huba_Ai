import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { FaMicrophone, FaPaperPlane, FaSun, FaMoon, FaSignOutAlt, FaRedo, FaCopy } from 'react-icons/fa';
import './App.css?v=1';

const SplashScreen = ({ onAnimationEnd }) => (
  <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
    <h1 className="splash-title">
      <span className="splash-text">HUBA AI</span>
    </h1>
  </div>
);

const AuthScreen = ({ setIsAuthenticated, setUserName }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      firstName: formData.fullName,
      email: formData.email,
      password: formData.password,
    };

    const url = isSignup
      ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
      : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';
    
    try {
      console.log('Sending data to', url, ':', dataToSend);
      const response = await axios.post(url, isSignup ? dataToSend : formData);
      if (response.status === 200 || response.status === 201) {
        const token = response.data.token;
        console.log('Signup/Login response:', response.data);
        const signupFirstName = response.data.firstName || formData.fullName || 'User';
        localStorage.setItem('token', token);

        try {
          const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          console.log('User details fetched:', userResponse.data);
          const firstName = userResponse.data.firstName || signupFirstName;
          setUserName(firstName);
        } catch (userError) {
          console.error('Error fetching user details:', userError.response ? userError.response.data : userError.message);
          setUserName(signupFirstName);
        }

        setIsAuthenticated(true);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'An unknown error occurred';
      console.error('Auth error:', error.response ? error.response.data : error.message);
      setError(errorMessage);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="auth-input"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="auth-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="auth-input"
          />
          <button type="submit" className="auth-button">
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <p onClick={() => setIsSignup(!isSignup)} className="auth-toggle">
          {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
        </p>
      </div>
    </div>
  );
};

const ChatScreen = ({ setIsAuthenticated, userName, theme, toggleTheme }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  const chatContentRef = useRef(null);

  // State to manage "Copied" feedback for each code block
  const [copiedStates, setCopiedStates] = useState({});

  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
      setShowTitle(true);
    }, 3000);
    return () => clearTimeout(welcomeTimer);
  }, []);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSubmit = async (e, retryMessage = null) => {
    e.preventDefault();
    const messageToSend = retryMessage || query;
    if (!messageToSend.trim()) return;

    const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false };
    if (!retryMessage) {
      setMessages((prev) => [...prev, newMessage]);
    }
    setIsThinking(true);

    try {
      const response = await axios.post(
        'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
        { question: messageToSend },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log('API Response:', response.data);
      setMessages((prev) => {
        const updatedMessages = [...prev];
        const messageIndex = retryMessage
          ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
          : updatedMessages.length - 1;
        updatedMessages[messageIndex] = {
          ...updatedMessages[messageIndex],
          answer: response.data.response || 'No response data',
          error: false,
          canRetry: false,
        };
        return updatedMessages;
      });
    } catch (error) {
      console.error('Chat Error:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } else {
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const messageIndex = retryMessage
            ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
            : updatedMessages.length - 1;
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            answer: 'Sorry, something went wrong. Please try again.',
            error: true,
            canRetry: true,
          };
          return updatedMessages;
        });
      }
    }
    setIsThinking(false);
    if (!retryMessage) {
      setQuery('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Voice recognition started. Speak now.');
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice Input:', transcript);
      setQuery(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Voice Recognition Error:', event.error);
      if (event.error === 'no-speech') {
        alert('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
      } else {
        alert('An error occurred during voice recognition: ' + event.error);
      }
    };

    recognition.onend = () => {
      console.log('Voice recognition ended.');
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const handleRetry = (message) => (e) => {
    handleSubmit(e, message);
  };

  const handleCopy = (code, index) => {
    // Use the Clipboard API to copy the code
    navigator.clipboard.writeText(code).then(() => {
      // Update the copied state for this specific code block
      setCopiedStates((prev) => ({ ...prev, [index]: true }));
      // Reset the "Copied" state after 2 seconds
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [index]: false }));
      }, 2000);
    }).catch((err) => {
      console.error('Failed to copy code:', err);
      alert('Failed to copy code. Please copy it manually.');
    });
  };

  const renderResponse = (response) => {
    if (!response) return null;

    if (response.includes('```')) {
      const parts = response.split('```');
      return parts.map((part, index) => {
        if (index % 2 === 1) {
          return (
            <div key={index} className="code-block">
              <button
                className="copy-button"
                onClick={() => handleCopy(part, index)}
                title={copiedStates[index] ? 'Copied!' : 'Copy code'}
              >
                {copiedStates[index] ? 'Copied!' : <FaCopy />}
              </button>
              <pre>{part}</pre>
            </div>
          );
        }
        return <span key={index}>{part}</span>;
      });
    }

    const listRegex = /(\d+\.\s|[*-]\s)/;
    if (listRegex.test(response)) {
      const lines = response.split('\n');
      return (
        <div className="options-block">
          {lines.map((line, index) => {
            const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
            if (match) {
              const [, prefix, content] = match;
              return (
                <div key={index} className="option-item">
                  <span className="option-key">{prefix}</span>
                  <span className="option-content">{content}</span>
                </div>
              );
            }
            return <div key={index}>{line}</div>;
          })}
        </div>
      );
    }

    return response;
  };

  return (
    <div className="chat-screen">
      <div className="chat-container">
        {showTitle && (
          <div className="chat-header">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <h2 className="chat-title">HUBA AI</h2>
            <button onClick={handleLogout} className="logout-button" title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        )}
        {showWelcome && (
          <div className="welcome-message">
            Welcome {userName} to HUBA AI
          </div>
        )}
        <div className="chat-content" ref={chatContentRef}>
          {messages.map((message, index) => (
            <div key={index} className="chat-item">
              <div className="message user-message">
                <p>{message.question}</p>
              </div>
              {message.answer && (
                <div className="message ai-message">
                  <p>{renderResponse(message.answer)}</p>
                  {message.error && message.canRetry && (
                    <button
                      onClick={handleRetry(message.question)}
                      className="retry-button"
                      title="Retry"
                    >
                      <FaRedo />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
          {isThinking && <div className="thinking">Thinking...</div>}
        </div>
        <div className="chat-input-bar">
          <textarea
            placeholder="Ask anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="chat-input"
            rows="1"
          />
          <FaMicrophone
            className={`chat-icon ${isRecording ? 'recording' : ''}`}
            onClick={handleVoiceInput}
          />
          <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

const ThemeToggle = ({ theme, toggleTheme }) => (
  <div className="theme-toggle" onClick={toggleTheme}>
    {theme === 'light' ? <FaMoon /> : <FaSun />}
  </div>
);

function ChatBot() {
  const [isSplash, setIsSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    console.log('Initial theme from localStorage:', savedTheme);
    return savedTheme || 'light';
  });
  const [userName, setUserName] = useState('');

  useEffect(() => {
    console.log('Theme state updated to:', theme);
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      axios
        .get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then((response) => {
          const firstName = response.data.firstName || 'User';
          setUserName(firstName);
        })
        .catch((error) => {
          console.error('Error fetching user name:', error);
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        });
    }
    setTimeout(() => {
      setIsSplash(false);
    }, 3000);
  }, []);

  const toggleTheme = () => {
    console.log('Toggling theme from', theme, 'to', theme === 'light' ? 'dark' : 'light');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    console.log('New theme set in localStorage:', newTheme);
  };

  return (
    <div className={`app ${theme}`}>
      {isSplash ? (
        <SplashScreen onAnimationEnd={!isSplash} />
      ) : (
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/chat" />
                ) : (
                  <AuthScreen setIsAuthenticated={setIsAuthenticated} setUserName={setUserName} />
                )
              }
            />
            <Route
              path="/chat"
              element={
                isAuthenticated ? (
                  <ChatScreen
                    setIsAuthenticated={setIsAuthenticated}
                    userName={userName}
                    theme={theme}
                    toggleTheme={toggleTheme}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default ChatBot;