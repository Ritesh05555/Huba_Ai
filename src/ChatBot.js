// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSun, FaMoon, FaSignOutAlt, FaRedo, FaCopy } from 'react-icons/fa';
// import './App.css?v=1';

// const SplashScreen = ({ onAnimationEnd }) => (
//   <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//     <h1 className="splash-title">
//       <span className="splash-text">HUBA AI</span>
//     </h1>
//   </div>
// );

// const AuthScreen = ({ setIsAuthenticated, setUserName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const dataToSend = {
//       firstName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };

//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';
    
//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(url, isSignup ? dataToSend : formData);
//       if (response.status === 200 || response.status === 201) {
//         const token = response.data.token;
//         console.log('Signup/Login response:', response.data);
//         const signupFirstName = response.data.firstName || formData.fullName || 'User';
//         localStorage.setItem('token', token);

//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//             },
//           });
//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || signupFirstName;
//           setUserName(firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response ? userError.response.data : userError.message);
//           setUserName(signupFirstName);
//         }

//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'An unknown error occurred';
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       setError(errorMessage);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button">
//             {isSignup ? 'Sign Up' : 'Login'}
//           </button>
//         </form>
//         <p onClick={() => setIsSignup(!isSignup)} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, userName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(false);
//   const chatContentRef = useRef(null);

//   // State to manage "Copied" feedback for each code block
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(false);
//       setShowTitle(true);
//     }, 3000);
//     return () => clearTimeout(welcomeTimer);
//   }, []);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [messages, isThinking]);

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;
//     if (!messageToSend.trim()) return;

//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false };
//     if (!retryMessage) {
//       setMessages((prev) => [...prev, newMessage]);
//     }
//     setIsThinking(true);

//     try {
//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );
//       console.log('API Response:', response.data);
//       setMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;
//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//       } else {
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedMessages;
//         });
//       }
//     }
//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);
//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };

//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };

//     recognition.start();
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setIsAuthenticated(false);
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     // Use the Clipboard API to copy the code
//     navigator.clipboard.writeText(code).then(() => {
//       // Update the copied state for this specific code block
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       // Reset the "Copied" state after 2 seconds
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;

//     if (response.includes('```')) {
//       const parts = response.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index}>{part}</span>;
//       });
//     }

//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(response)) {
//       const lines = response.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">{content}</span>
//                 </div>
//               );
//             }
//             return <div key={index}>{line}</div>;
//           })}
//         </div>
//       );
//     }

//     return response;
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         {showTitle && (
//           <div className="chat-header">
//             <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
//             <h2 className="chat-title">HUBA AI</h2>
//             <button onClick={handleLogout} className="logout-button" title="Logout">
//               <FaSignOutAlt />
//             </button>
//           </div>
//         )}
//         {showWelcome && (
//           <div className="welcome-message">
//             Welcome {userName} to HUBA AI
//           </div>
//         )}
//         <div className="chat-content" ref={chatContentRef}>
//           {messages.map((message, index) => (
//             <div key={index} className="chat-item">
//               <div className="message user-message">
//                 <p>{message.question}</p>
//               </div>
//               {message.answer && (
//                 <div className="message ai-message">
//                   <p>{renderResponse(message.answer)}</p>
//                   {message.error && message.canRetry && (
//                     <button
//                       onClick={handleRetry(message.question)}
//                       className="retry-button"
//                       title="Retry"
//                     >
//                       <FaRedo />
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//           {isThinking && <div className="thinking">Thinking...</div>}
//         </div>
//         <div className="chat-input-bar">
//           <textarea
//             placeholder="Ask anything..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="chat-input"
//             rows="1"
//           />
//           <FaMicrophone
//             className={`chat-icon ${isRecording ? 'recording' : ''}`}
//             onClick={handleVoiceInput}
//           />
//           <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//             <FaPaperPlane />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ThemeToggle = ({ theme, toggleTheme }) => (
//   <div className="theme-toggle" onClick={toggleTheme}>
//     {theme === 'light' ? <FaMoon /> : <FaSun />}
//   </div>
// );

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     console.log('Initial theme from localStorage:', savedTheme);
//     return savedTheme || 'light';
//   });
//   const [userName, setUserName] = useState('');

//   useEffect(() => {
//     console.log('Theme state updated to:', theme);
//   }, [theme]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsAuthenticated(true);
//       axios
//         .get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         })
//         .then((response) => {
//           const firstName = response.data.firstName || 'User';
//           setUserName(firstName);
//         })
//         .catch((error) => {
//           console.error('Error fetching user name:', error);
//           if (error.response && error.response.status === 401) {
//             localStorage.removeItem('token');
//             setIsAuthenticated(false);
//           }
//         });
//     }
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 3000);
//   }, []);

//   const toggleTheme = () => {
//     console.log('Toggling theme from', theme, 'to', theme === 'light' ? 'dark' : 'light');
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//     console.log('New theme set in localStorage:', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 isAuthenticated ? (
//                   <Navigate to="/chat" />
//                 ) : (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setUserName={setUserName} />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     userName={userName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }

// export default ChatBot;
////////////////////////////////////////////

///////////////////// old auth 

// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSun, FaMoon, FaSignOutAlt, FaRedo, FaCopy } from 'react-icons/fa';
// import './App.css?v=1';

// const SplashScreen = ({ onAnimationEnd }) => (
//   <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//     <h1 className="splash-title">
//       <span className="splash-text">HUBA AI</span>
//     </h1>
//   </div>
// );

// const AuthScreen = ({ setIsAuthenticated, setUserName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const dataToSend = {
//       firstName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };

//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';
    
//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(url, isSignup ? dataToSend : formData);
//       if (response.status === 200 || response.status === 201) {
//         const token = response.data.token;
//         console.log('Signup/Login response:', response.data);
//         const signupFirstName = response.data.firstName || formData.fullName || 'User';
//         localStorage.setItem('token', token);

//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//             },
//           });
//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || signupFirstName;
//           setUserName(firstName);
//           localStorage.setItem('userName', firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response ? userError.response.data : userError.message);
//           setUserName(signupFirstName);
//           localStorage.setItem('userName', signupFirstName);
//         }

//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'An unknown error occurred';
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       setError(errorMessage);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button">
//             {isSignup ? 'Sign Up' : 'Login'}
//           </button>
//         </form>
//         <p onClick={() => setIsSignup(!isSignup)} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, userName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(false);
//   const chatContentRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(false);
//       setShowTitle(true);
//     }, 3000);
//     return () => clearTimeout(welcomeTimer);
//   }, []);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [messages, isThinking]);

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;
//     if (!messageToSend.trim()) return;

//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false };
//     if (!retryMessage) {
//       setMessages((prev) => [...prev, newMessage]);
//     }
//     setIsThinking(true);

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Sending message with token:', token);
//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('API Response:', response.data);
//       setMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;
//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         console.log('401 Unauthorized: Token is invalid or expired. Error details:', error.response.data);
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };
//           return updatedMessages;
//         });
//       } else {
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedMessages;
//         });
//       }
//     }
//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);
//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };

//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };

//     recognition.start();
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userName'); // Clear userName on explicit logout
//     setIsAuthenticated(false);
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;

//     if (response.includes('```')) {
//       const parts = response.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index}>{part}</span>;
//       });
//     }

//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(response)) {
//       const lines = response.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">{content}</span>
//                 </div>
//               );
//             }
//             return <div key={index}>{line}</div>;
//           })}
//         </div>
//       );
//     }

//     return response;
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         {showTitle && (
//           <div className="chat-header">
//             <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
//             <h2 className="chat-title">HUBA AI</h2>
//             <button onClick={handleLogout} className="logout-button" title="Logout">
//               <FaSignOutAlt />
//             </button>
//           </div>
//         )}
//         {showWelcome && (
//           <div className="welcome-message">
//             Welcome {userName || 'User'} to HUBA AI
//           </div>
//         )}
//         <div className="chat-content" ref={chatContentRef}>
//           {messages.map((message, index) => (
//             <div key={index} className="chat-item">
//               <div className="message user-message">
//                 <p>{message.question}</p>
//               </div>
//               {message.answer && (
//                 <div className="message ai-message">
//                   <p>{renderResponse(message.answer)}</p>
//                   {message.error && message.canRetry && (
//                     <button
//                       onClick={handleRetry(message.question)}
//                       className="retry-button"
//                       title="Retry"
//                     >
//                       <FaRedo />
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//           {isThinking && <div className="thinking">Thinking...</div>}
//         </div>
//         <div className="chat-input-bar">
//           <textarea
//             placeholder="Ask anything..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="chat-input"
//             rows="1"
//           />
//           <FaMicrophone
//             className={`chat-icon ${isRecording ? 'recording' : ''}`}
//             onClick={handleVoiceInput}
//           />
//           <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//             <FaPaperPlane />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ThemeToggle = ({ theme, toggleTheme }) => (
//   <div className="theme-toggle" onClick={toggleTheme}>
//     {theme === 'light' ? <FaMoon /> : <FaSun />}
//   </div>
// );

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     console.log('Initial theme from localStorage:', savedTheme);
//     return savedTheme || 'light';
//   });
//   const [userName, setUserName] = useState(localStorage.getItem('userName') || '');

//   useEffect(() => {
//     console.log('Theme state updated to:', theme);
//   }, [theme]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsAuthenticated(true);
//       axios
//         .get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         })
//         .then((response) => {
//           const firstName = response.data.firstName || localStorage.getItem('userName') || 'User';
//           setUserName(firstName);
//           localStorage.setItem('userName', firstName);
//           console.log('User details fetched successfully:', response.data);
//         })
//         .catch((error) => {
//           console.error('Error fetching user name:', error.response ? error.response.data : error.message);
//           if (error.response && error.response.status === 401) {
//             console.log('401 Unauthorized during app init: Token is invalid or expired. Error details:', error.response.data);
//             localStorage.removeItem('token');
//             setIsAuthenticated(false);
//             // Do NOT clear userName here; preserve it for the welcome message
//             const storedUserName = localStorage.getItem('userName') || 'User';
//             setUserName(storedUserName);
//           } else {
//             const storedUserName = localStorage.getItem('userName') || 'User';
//             setUserName(storedUserName);
//           }
//         });
//     }
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 3000);
//   }, []);

//   const toggleTheme = () => {
//     console.log('Toggling theme from', theme, 'to', theme === 'light' ? 'dark' : 'light');
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//     console.log('New theme set in localStorage:', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 isAuthenticated ? (
//                   <Navigate to="/chat" />
//                 ) : (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setUserName={setUserName} />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     userName={userName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }

// export default ChatBot;

/////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSun, FaMoon, FaSignOutAlt, FaRedo, FaCopy } from 'react-icons/fa';
// import './App.css?v=1';

// const SplashScreen = ({ onAnimationEnd }) => (
//   <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//     <h1 className="splash-title">
//       <span className="splash-text">HUBA AI</span>
//     </h1>
//   </div>
// );

// const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const dataToSend = {
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };

//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';

//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(url, isSignup ? dataToSend : { email: formData.email, password: formData.password });
      
//       if (isSignup && response.status === 200) {
//         // Signup successful, prompt to login
//         setSignupSuccess(true);
//         setError('Signup successful! Please log in.');
//         return;
//       }

//       if (!isSignup && (response.status === 200 || response.status === 201)) {
//         const token = response.data.token;
//         console.log('Login response:', response.data);
//         const loginFirstName = response.data.user.fullName.split(' ')[0] || 'User'; // Extract first name
//         localStorage.setItem('token', token);
//         localStorage.setItem('firstName', loginFirstName);

//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });
//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || loginFirstName;
//           setFirstName(firstName);
//           localStorage.setItem('firstName', firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response?.data || userError.message);
//           setFirstName(loginFirstName);
//         }

//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       setError(errorMessage);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button">
//             {isSignup ? 'Sign Up' : 'Login'}
//           </button>
//         </form>
//         <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(false);
//   const chatContentRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     console.log('ChatScreen mounted with firstName:', firstName);
//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(false);
//       setShowTitle(true);
//     }, 3000);
//     return () => clearTimeout(welcomeTimer);
//   }, [firstName]);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [messages, isThinking]);

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;
//     if (!messageToSend.trim()) return;

//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false };
//     if (!retryMessage) {
//       setMessages((prev) => [...prev, newMessage]);
//     }
//     setIsThinking(true);

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Sending message with token:', token);
//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('API Response:', response.data);
//       setMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;
//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         console.log('401 Unauthorized: Token is invalid or expired. Error details:', error.response.data);
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };
//           return updatedMessages;
//         });
//       } else {
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedMessages;
//         });
//       }
//     }
//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);
//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };

//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };

//     recognition.start();
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('firstName');
//     setIsAuthenticated(false);
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;

//     if (response.includes('```')) {
//       const parts = response.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index}>{part}</span>;
//       });
//     }

//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(response)) {
//       const lines = response.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">{content}</span>
//                 </div>
//               );
//             }
//             return <div key={index}>{line}</div>;
//           })}
//         </div>
//       );
//     }

//     return response;
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         {showTitle && (
//           <div className="chat-header">
//             <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
//             <h2 className="chat-title">HUBA AI</h2>
//             <button onClick={handleLogout} className="logout-button" title="Logout">
//               <FaSignOutAlt />
//             </button>
//           </div>
//         )}
//         {showWelcome && (
//           <div className="welcome-message">
//             Welcome {firstName || 'User'} to HUBA AI
//           </div>
//         )}
//         <div className="chat-content" ref={chatContentRef}>
//           {messages.map((message, index) => (
//             <div key={index} className="chat-item">
//               <div className="message user-message">
//                 <p>{message.question}</p>
//               </div>
//               {message.answer && (
//                 <div className="message ai-message">
//                   <p>{renderResponse(message.answer)}</p>
//                   {message.error && message.canRetry && (
//                     <button
//                       onClick={handleRetry(message.question)}
//                       className="retry-button"
//                       title="Retry"
//                     >
//                       <FaRedo />
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//           {isThinking && <div className="thinking">Thinking...</div>}
//         </div>
//         <div className="chat-input-bar">
//           <textarea
//             placeholder="Ask anything..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="chat-input"
//             rows="1"
//           />
//           <FaMicrophone
//             className={`chat-icon ${isRecording ? 'recording' : ''}`}
//             onClick={handleVoiceInput}
//           />
//           <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//             <FaPaperPlane />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ThemeToggle = ({ theme, toggleTheme }) => (
//   <div className="theme-toggle" onClick={toggleTheme}>
//     {theme === 'light' ? <FaMoon /> : <FaSun />}
//   </div>
// );

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme || 'light';
//   });
//   const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');

//   useEffect(() => {
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 3000);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 !isAuthenticated ? (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
//                 ) : (
//                   <Navigate to="/chat" />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     firstName={firstName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }

// export default ChatBot;

////////////////////////////////////////////////////////////////////////////////////////
// major updates
// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSun, FaMoon, FaSignOutAlt, FaRedo, FaCopy } from 'react-icons/fa';
// import './App.css?v=1';

// const SplashScreen = ({ onAnimationEnd }) => (
//   <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//     <h1 className="splash-title">
//       <span className="splash-text">HUBA AI</span>
//     </h1>
//   </div>
// );

// const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const dataToSend = {
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };

//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';

//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(url, isSignup ? dataToSend : { email: formData.email, password: formData.password });
      
//       if (isSignup && response.status === 200) {
//         setSignupSuccess(true);
//         setError('Signup successful! Please log in.');
//         return;
//       }

//       if (!isSignup && (response.status === 200 || response.status === 201)) {
//         const token = response.data.token;
//         console.log('Login response:', response.data);
//         const loginFirstName = response.data.user.fullName.split(' ')[0] || 'User';
//         localStorage.setItem('token', token);
//         localStorage.setItem('firstName', loginFirstName);

//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });
//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || loginFirstName;
//           setFirstName(firstName);
//           localStorage.setItem('firstName', firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response?.data || userError.message);
//           setFirstName(loginFirstName);
//         }

//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       setError(errorMessage);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button">
//             {isSignup ? 'Sign Up' : 'Login'}
//           </button>
//         </form>
//         <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(false);
//   const chatContentRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     console.log('ChatScreen mounted with firstName:', firstName);
//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(false);
//       setShowTitle(true);
//     }, 3000);
//     return () => clearTimeout(welcomeTimer);
//   }, [firstName]);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [messages, isThinking]);

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;
//     if (!messageToSend.trim()) return;

//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false };
//     if (!retryMessage) {
//       setMessages((prev) => [...prev, newMessage]);
//     }
//     setIsThinking(true);

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Sending message with token:', token);

//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend }, // Removed history field
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('API Response:', response.data);
//       setMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;
//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         console.log('401 Unauthorized: Token is invalid or expired. Error details:', error.response.data);
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };
//           return updatedMessages;
//         });
//       } else {
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedMessages;
//         });
//       }
//     }
//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);
//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };

//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };

//     recognition.start();
//   };

//   const handleLogout = () => {
//     // Call the logout endpoint to clear session history on the backend
//     const token = localStorage.getItem('token');
//     axios.post(
//       'https://aichatbot-backend-hxs8.onrender.com/api/chat/logout',
//       {},
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     ).then(() => {
//       console.log('Logged out successfully');
//     }).catch((err) => {
//       console.error('Logout error:', err);
//     });

//     localStorage.removeItem('token');
//     localStorage.removeItem('firstName');
//     setIsAuthenticated(false);
//     setMessages([]); // Clear messages on logout to reset context
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;

//     if (response.includes('```')) {
//       const parts = response.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index}>{part}</span>;
//       });
//     }

//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(response)) {
//       const lines = response.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">{content}</span>
//                 </div>
//               );
//             }
//             return <div key={index}>{line}</div>;
//           })}
//         </div>
//       );
//     }

//     return response;
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         {showTitle && (
//           <div className="chat-header">
//             <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
//             <h2 className="chat-title">HUBA AI</h2>
//             <button onClick={handleLogout} className="logout-button" title="Logout">
//               <FaSignOutAlt />
//             </button>
//           </div>
//         )}
//         {showWelcome && (
//           <div className="welcome-message">
//             Welcome {firstName || 'User'} to HUBA AI
//           </div>
//         )}
//         <div className="chat-content" ref={chatContentRef}>
//           {messages.map((message, index) => (
//             <div key={index} className="chat-item">
//               <div className="message user-message">
//                 <p>{message.question}</p>
//               </div>
//               {message.answer && (
//                 <div className="message ai-message">
//                   <p>{renderResponse(message.answer)}</p>
//                   {message.error && message.canRetry && (
//                     <button
//                       onClick={handleRetry(message.question)}
//                       className="retry-button"
//                       title="Retry"
//                     >
//                       <FaRedo />
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//           {isThinking && <div className="thinking">Thinking...</div>}
//         </div>
//         <div className="chat-input-bar">
//           <textarea
//             placeholder="Ask anything..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="chat-input"
//             rows="1"
//           />
//           <FaMicrophone
//             className={`chat-icon ${isRecording ? 'recording' : ''}`}
//             onClick={handleVoiceInput}
//           />
//           <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//             <FaPaperPlane />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ThemeToggle = ({ theme, toggleTheme }) => (
//   <div className="theme-toggle" onClick={toggleTheme}>
//     {theme === 'light' ? <FaMoon /> : <FaSun />}
//   </div>
// );

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme || 'light';
//   });
//   const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');

//   useEffect(() => {
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 3000);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 !isAuthenticated ? (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
//                 ) : (
//                   <Navigate to="/chat" />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     firstName={firstName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }

// export default ChatBot;

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

//before submit button
// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSun, FaMoon, FaSignOutAlt, FaRedo, FaCopy } from 'react-icons/fa';
// import DOMPurify from 'dompurify'; // Import DOMPurify for sanitizing HTML
// import './App.css?v=1';

// const SplashScreen = ({ onAnimationEnd }) => (
//   <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//     <h1 className="splash-title">
//       <span className="splash-text">HUBA AI</span>
//     </h1>
//   </div>
// );

// const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const dataToSend = {
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };

//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';

//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(url, isSignup ? dataToSend : { email: formData.email, password: formData.password });
      
//       if (isSignup && response.status === 200) {
//         setSignupSuccess(true);
//         setError('Signup successful! Please log in.');
//         return;
//       }

//       if (!isSignup && (response.status === 200 || response.status === 201)) {
//         const token = response.data.token;
//         console.log('Login response:', response.data);
//         const loginFirstName = response.data.user.fullName.split(' ')[0] || 'User';
//         localStorage.setItem('token', token);
//         localStorage.setItem('firstName', loginFirstName);

//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });
//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || loginFirstName;
//           setFirstName(firstName);
//           localStorage.setItem('firstName', firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response?.data || userError.message);
//           setFirstName(loginFirstName);
//         }

//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       setError(errorMessage);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button">
//             {isSignup ? 'Sign Up' : 'Login'}
//           </button>
//         </form>
//         <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(false);
//   const chatContentRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     console.log('ChatScreen mounted with firstName:', firstName);
//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(false);
//       setShowTitle(true);
//     }, 3000);
//     return () => clearTimeout(welcomeTimer);
//   }, [firstName]);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [messages, isThinking]);

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;
//     if (!messageToSend.trim()) return;

//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false };
//     if (!retryMessage) {
//       setMessages((prev) => [...prev, newMessage]);
//     }
//     setIsThinking(true);

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Sending message with token:', token);

//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('API Response:', response.data);
//       setMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;
//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         console.log('401 Unauthorized: Token is invalid or expired. Error details:', error.response.data);
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };
//           return updatedMessages;
//         });
//       } else {
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedMessages;
//         });
//       }
//     }
//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);
//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };

//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };

//     recognition.start();
//   };

//   const handleLogout = () => {
//     const token = localStorage.getItem('token');
//     axios.post(
//       'https://aichatbot-backend-hxs8.onrender.com/api/chat/logout',
//       {},
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     ).then(() => {
//       console.log('Logged out successfully');
//     }).catch((err) => {
//       console.error('Logout error:', err);
//     });

//     localStorage.removeItem('token');
//     localStorage.removeItem('firstName');
//     setIsAuthenticated(false);
//     setMessages([]);
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;

//     // Sanitize the HTML content to prevent XSS attacks
//     const sanitizedResponse = DOMPurify.sanitize(response, { USE_PROFILES: { html: true } });

//     // Handle code blocks (e.g., ```code```)
//     if (sanitizedResponse.includes('```')) {
//       const parts = sanitizedResponse.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
//       });
//     }

//     // Handle lists (e.g., "1. Indian Institutes of Technology (IITs): Several IITs...")
//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(sanitizedResponse)) {
//       const lines = sanitizedResponse.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             // Check if the line is a list item (e.g., "1. <strong>Indian Institutes of Technology (IITs):</strong> Several IITs...")
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               // Split the content into the key (bold part) and the rest
//               const contentParts = content.split(/<\/?strong>/);
//               let key = '';
//               let rest = content;
//               if (contentParts.length > 1) {
//                 // The part between <strong> and </strong> is the key
//                 key = contentParts[1]; // The bolded text (e.g., "Indian Institutes of Technology (IITs):")
//                 // Reconstruct the rest of the content, removing the <strong> tags
//                 rest = content.replace(`<strong>${key}</strong>`, '');
//               }
//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">
//                     <strong>{key}</strong>
//                     <span dangerouslySetInnerHTML={{ __html: rest }} />
//                   </span>
//                 </div>
//               );
//             }
//             return <div key={index} dangerouslySetInnerHTML={{ __html: line }} />;
//           })}
//         </div>
//       );
//     }

//     // Handle plain text with HTML (e.g., <strong>text</strong>)
//     return <div dangerouslySetInnerHTML={{ __html: sanitizedResponse }} />;
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         {showTitle && (
//           <div className="chat-header">
//             <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
//             <h2 className="chat-title">HUBA AI</h2>
//             <button onClick={handleLogout} className="logout-button" title="Logout">
//               <FaSignOutAlt />
//             </button>
//           </div>
//         )}
//         {showWelcome && (
//           <div className="welcome-message">
//             Welcome {firstName || 'User'} to HUBA AI
//           </div>
//         )}
//         <div className="chat-content" ref={chatContentRef}>
//           {messages.map((message, index) => (
//             <div key={index} className="chat-item">
//               <div className="message user-message">
//                 <p>{message.question}</p>
//               </div>
//               {message.answer && (
//                 <div className="message ai-message">
//                   <p>{renderResponse(message.answer)}</p>
//                   {message.error && message.canRetry && (
//                     <button
//                       onClick={handleRetry(message.question)}
//                       className="retry-button"
//                       title="Retry"
//                     >
//                       <FaRedo />
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//           {isThinking && <div className="thinking">Thinking...</div>}
//         </div>
//         <div className="chat-input-bar">
//           <textarea
//             placeholder="Ask anything..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="chat-input"
//             rows="1"
//           />
//           <FaMicrophone
//             className={`chat-icon ${isRecording ? 'recording' : ''}`}
//             onClick={handleVoiceInput}
//           />
//           <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//             <FaPaperPlane />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ThemeToggle = ({ theme, toggleTheme }) => (
//   <div className="theme-toggle" onClick={toggleTheme}>
//     {theme === 'light' ? <FaMoon /> : <FaSun />}
//   </div>
// );

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme || 'light';
//   });
//   const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');

//   useEffect(() => {
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 3000);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 !isAuthenticated ? (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
//                 ) : (
//                   <Navigate to="/chat" />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     firstName={firstName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }

// export default ChatBot;



/////////////////////////////////////////////////////
//updated buttons in auth

// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSun, FaMoon, FaSignOutAlt, FaRedo, FaCopy } from 'react-icons/fa';
// import DOMPurify from 'dompurify';
// import './App.css?v=1';

// const SplashScreen = ({ onAnimationEnd }) => (
//   <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//     <h1 className="splash-title">
//       <span className="splash-text">HUBA AI</span>
//     </h1>
//   </div>
// );

// const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const dataToSend = {
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };

//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';

//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(
//         url,
//         isSignup ? dataToSend : { email: formData.email, password: formData.password },
//         { timeout: 10000 } // Added timeout to prevent hanging
//       );

//       if (isSignup && response.status === 200) {
//         setSignupSuccess(true);
//         setError('Signup successful! Please log in.');
//         return;
//       }

//       if (!isSignup && (response.status === 200 || response.status === 201)) {
//         const token = response.data.token;
//         console.log('Login response:', response.data);
//         const loginFirstName = response.data.user.fullName.split(' ')[0] || 'User';
//         localStorage.setItem('token', token);
//         localStorage.setItem('firstName', loginFirstName);

//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });
//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || loginFirstName;
//           setFirstName(firstName);
//           localStorage.setItem('firstName', firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response?.data || userError.message);
//           setFirstName(loginFirstName);
//         }

//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       if (error.code === 'ERR_NETWORK') {
//         setError('Network Error: Unable to connect to the server. Please check your internet connection or try again later.');
//       } else if (error.response) {
//         setError(error.response.data?.error || 'An error occurred. Please try again.');
//       } else {
//         setError(error.message || 'An unknown error occurred');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button" disabled={isLoading}>
//             {isLoading ? (
//               <span className="loading-text">
//                 {isSignup ? 'Creating Account' : 'Logging In'} <span className="dots">...</span>
//               </span>
//             ) : (
//               isSignup ? 'Sign Up' : 'Login'
//             )}
//           </button>
//         </form>
//         <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(false);
//   const chatContentRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     console.log('ChatScreen mounted with firstName:', firstName);
//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(false);
//       setShowTitle(true);
//     }, 3000);
//     return () => clearTimeout(welcomeTimer);
//   }, [firstName]);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [messages, isThinking]);

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;
//     if (!messageToSend.trim()) return;

//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false };
//     if (!retryMessage) {
//       setMessages((prev) => [...prev, newMessage]);
//     }
//     setIsThinking(true);

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Sending message with token:', token);

//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           timeout: 10000, // Added timeout
//         }
//       );
//       console.log('API Response:', response.data);
//       setMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;
//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         console.log('401 Unauthorized: Token is invalid or expired. Error details:', error.response.data);
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };
//           return updatedMessages;
//         });
//       } else {
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: error.response?.data?.error || 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedMessages;
//         });
//       }
//     }
//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);
//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };

//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };

//     recognition.start();
//   };

//   const handleLogout = () => {
//     const token = localStorage.getItem('token');
//     axios.post(
//       'https://aichatbot-backend-hxs8.onrender.com/api/chat/logout',
//       {},
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     ).then(() => {
//       console.log('Logged out successfully');
//     }).catch((err) => {
//       console.error('Logout error:', err);
//     });

//     localStorage.removeItem('token');
//     localStorage.removeItem('firstName');
//     setIsAuthenticated(false);
//     setMessages([]);
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;

//     const sanitizedResponse = DOMPurify.sanitize(response, { USE_PROFILES: { html: true } });

//     if (sanitizedResponse.includes('```')) {
//       const parts = sanitizedResponse.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
//       });
//     }

//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(sanitizedResponse)) {
//       const lines = sanitizedResponse.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               const contentParts = content.split(/<\/?strong>/);
//               let key = '';
//               let rest = content;
//               if (contentParts.length > 1) {
//                 key = contentParts[1];
//                 rest = content.replace(`<strong>${key}</strong>`, '');
//               }
//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">
//                     <strong>{key}</strong>
//                     <span dangerouslySetInnerHTML={{ __html: rest }} />
//                   </span>
//                 </div>
//               );
//             }
//             return <div key={index} dangerouslySetInnerHTML={{ __html: line }} />;
//           })}
//         </div>
//       );
//     }

//     return <div dangerouslySetInnerHTML={{ __html: sanitizedResponse }} />;
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         {showTitle && (
//           <div className="chat-header">
//             <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
//             <h2 className="chat-title">HUBA AI</h2>
//             <button onClick={handleLogout} className="logout-button" title="Logout">
//               <FaSignOutAlt />
//             </button>
//           </div>
//         )}
//         {showWelcome && (
//           <div className="welcome-message">
//             Welcome {firstName || 'User'} to HUBA AI
//           </div>
//         )}
//         <div className="chat-content" ref={chatContentRef}>
//           {messages.map((message, index) => (
//             <div key={index} className="chat-item">
//               <div className="message user-message">
//                 <p>{message.question}</p>
//               </div>
//               {message.answer && (
//                 <div className="message ai-message">
//                   <p>{renderResponse(message.answer)}</p>
//                   {message.error && message.canRetry && (
//                     <button
//                       onClick={handleRetry(message.question)}
//                       className="retry-button"
//                       title="Retry"
//                     >
//                       <FaRedo />
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//           {isThinking && <div className="thinking">Thinking...</div>}
//         </div>
//         <div className="chat-input-bar">
//           <textarea
//             placeholder="Ask anything..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="chat-input"
//             rows="1"
//           />
//           <FaMicrophone
//             className={`chat-icon ${isRecording ? 'recording' : ''}`}
//             onClick={handleVoiceInput}
//           />
//           <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//             <FaPaperPlane />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ThemeToggle = ({ theme, toggleTheme }) => (
//   <div className="theme-toggle" onClick={toggleTheme}>
//     {theme === 'light' ? <FaMoon /> : <FaSun />}
//   </div>
// );

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme || 'light';
//   });
//   const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');

//   useEffect(() => {
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 3000);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 !isAuthenticated ? (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
//                 ) : (
//                   <Navigate to="/chat" />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     firstName={firstName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }

// export default ChatBot;


////////////////////////////////////////////////////////////////////////////////////123

// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSun, FaMoon, FaSignOutAlt, FaRedo, FaCopy } from 'react-icons/fa';
// import DOMPurify from 'dompurify';
// import './App.css?v=1';

// const SplashScreen = ({ onAnimationEnd }) => (
//   <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//     <h1 className="splash-title">
//       <span className="splash-text">HUBA AI</span>
//     </h1>
//   </div>
// );

// const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const dataToSend = {
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };

//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';

//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(
//         url,
//         isSignup ? dataToSend : { email: formData.email, password: formData.password },
//         { timeout: 10000 }
//       );

//       if (isSignup && response.status === 200) {
//         setSignupSuccess(true);
//         setError('Signup successful! Please log in.');
//         setIsLoading(false);
//         return;
//       }

//       if (!isSignup && (response.status === 200 || response.status === 201)) {
//         const token = response.data.token;
//         console.log('Login response:', response.data);
//         const loginFirstName = response.data.user.firstName || 'User';
//         localStorage.setItem('token', token);
//         localStorage.setItem('firstName', loginFirstName);
//         setFirstName(loginFirstName);
//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       if (error.code === 'ERR_NETWORK') {
//         setError('Network Error: Unable to connect to the server. Please check your internet connection or try again later.');
//       } else if (error.response) {
//         setError(error.response.data?.error || 'An error occurred. Please try again.');
//       } else {
//         setError(error.message || 'An unknown error occurred');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
//         {isLoading && <p style={{ color: 'blue', textAlign: 'center' }}>Loading...</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button" disabled={isLoading}>
//             {isLoading ? (
//               <span className="loading-text">
//                 {isSignup ? 'Creating Account' : 'Logging In'} <span className="dots">...</span>
//               </span>
//             ) : (
//               isSignup ? 'Sign Up' : 'Login'
//             )}
//           </button>
//         </form>
//         <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(false);
//   const chatContentRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     console.log('ChatScreen mounted with firstName:', firstName);
//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(false);
//       setShowTitle(true);
//     }, 1000);
//     return () => clearTimeout(welcomeTimer);
//   }, [firstName]);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [messages, isThinking]);

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;
//     if (!messageToSend.trim()) return;

//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false };
//     if (!retryMessage) {
//       setMessages((prev) => [...prev, newMessage]);
//     }
//     setIsThinking(true);

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Sending message with token:', token);

//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           timeout: 10000,
//         }
//       );
//       console.log('API Response:', response.data);
//       setMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;
//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         console.log('401 Unauthorized: Token is invalid or expired. Error details:', error.response.data);
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };
//           return updatedMessages;
//         });
//       } else {
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: error.response?.data?.error || 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedMessages;
//         });
//       }
//     } finally {
//       setIsThinking(false);
//     }
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);
//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };

//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };

//     recognition.start();
//   };

//   const handleLogout = () => {
//     const token = localStorage.getItem('token');
//     axios.post(
//       'https://aichatbot-backend-hxs8.onrender.com/api/chat/logout',
//       {},
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     ).then(() => {
//       console.log('Logged out successfully');
//     }).catch((err) => {
//       console.error('Logout error:', err);
//     });

//     localStorage.removeItem('token');
//     localStorage.removeItem('firstName');
//     setIsAuthenticated(false);
//     setMessages([]);
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;

//     const sanitizedResponse = DOMPurify.sanitize(response, { USE_PROFILES: { html: true } });

//     // Check for code blocks
//     if (sanitizedResponse.includes('```')) {
//       const parts = sanitizedResponse.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
//       });
//     }

//     // Check for temperature responses
//     const tempRegex = /The current temperature in ([\w\s]+) is ([\d.-]+)°C with ([\w\s]+)\./i;
//     const tempMatch = sanitizedResponse.match(tempRegex);
//     if (tempMatch) {
//       const [, location, temperature, weather] = tempMatch;
//       return (
//         <div className="temperature-block">
//           <div className="temperature-header">
//             <span className="temperature-label">Weather in {location}</span>
//           </div>
//           <div className="temperature-content">
//             <span className="temperature-value">{temperature}°C</span>
//             <span className="weather-description">{weather}</span>
//           </div>
//         </div>
//       );
//     }

//     // Check for lists
//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(sanitizedResponse)) {
//       const lines = sanitizedResponse.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               const contentParts = content.split(/<\/?strong>/);
//               let key = '';
//               let rest = content;
//               if (contentParts.length > 1) {
//                 key = contentParts[1];
//                 rest = content.replace(`<strong>${key}</strong>`, '');
//               }
//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">
//                     <strong>{key}</strong>
//                     <span dangerouslySetInnerHTML={{ __html: rest }} />
//                   </span>
//                 </div>
//               );
//             }
//             return <div key={index} dangerouslySetInnerHTML={{ __html: line }} />;
//           })}
//         </div>
//       );
//     }

//     // Default rendering for other responses
//     return <div dangerouslySetInnerHTML={{ __html: sanitizedResponse }} />;
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         {showTitle && (
//           <div className="chat-header">
//             <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
//             <h2 className="chat-title">HUBA AI</h2>
//             <button onClick={handleLogout} className="logout-button" title="Logout">
//               <FaSignOutAlt />
//             </button>
//           </div>
//         )}
//         {showWelcome && (
//           <div className="welcome-message">
//             Welcome {firstName || 'User'} to HUBA AI
//           </div>
//         )}
//         <div className="chat-content" ref={chatContentRef}>
//           {messages.map((message, index) => (
//             <div key={index} className="chat-item">
//               <div className="message user-message">
//                 <p>{message.question}</p>
//               </div>
//               {message.answer && (
//                 <div className="message ai-message">
//                   <p>{renderResponse(message.answer)}</p>
//                   {message.error && message.canRetry && (
//                     <button
//                       onClick={handleRetry(message.question)}
//                       className="retry-button"
//                       title="Retry"
//                     >
//                       <FaRedo />
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//           {isThinking && <div className="thinking">Thinking...</div>}
//         </div>
//         <div className="chat-input-bar">
//           <textarea
//             placeholder="Ask anything..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="chat-input"
//             rows="1"
//           />
//           <FaMicrophone
//             className={`chat-icon ${isRecording ? 'recording' : ''}`}
//             onClick={handleVoiceInput}
//           />
//           <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//             <FaPaperPlane />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ThemeToggle = ({ theme, toggleTheme }) => (
//   <div className="theme-toggle" onClick={toggleTheme}>
//     {theme === 'light' ? <FaMoon /> : <FaSun />}
//   </div>
// );

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme || 'light';
//   });
//   const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');

//   useEffect(() => {
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 1000);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 !isAuthenticated ? (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
//                 ) : (
//                   <Navigate to="/chat" />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     firstName={firstName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }

// export default ChatBot;
/////////////////////////////////////////////////////////////
//super cool

// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSun, FaMoon, FaSignOutAlt, FaRedo, FaCopy } from 'react-icons/fa';
// import DOMPurify from 'dompurify';
// import './App.css?v=1';

// const SplashScreen = ({ onAnimationEnd }) => (
//   <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//     <h1 className="splash-title">
//       <span className="splash-text">HUBA AI</span>
//     </h1>
//   </div>
// );

// const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false); // New loading state

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true); // Start loading

//     const dataToSend = {
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };

//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';

//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(url, isSignup ? dataToSend : { email: formData.email, password: formData.password });
      
//       if (isSignup && response.status === 200) {
//         setSignupSuccess(true);
//         setError('Signup successful! Please log in.');
//         return;
//       }

//       if (!isSignup && (response.status === 200 || response.status === 201)) {
//         const token = response.data.token;
//         console.log('Login response:', response.data);
//         const loginFirstName = response.data.user.fullName.split(' ')[0] || 'User';
//         localStorage.setItem('token', token);
//         localStorage.setItem('firstName', loginFirstName);

//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });
//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || loginFirstName;
//           setFirstName(firstName);
//           localStorage.setItem('firstName', firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response?.data || userError.message);
//           setFirstName(loginFirstName);
//         }

//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button" disabled={isLoading}>
//             {isLoading ? (
//               <span className="loading-text">
//                 {isSignup ? 'Creating Account' : 'Logging In'} <span className="dots">...</span>
//               </span>
//             ) : (
//               isSignup ? 'Sign Up' : 'Login'
//             )}
//           </button>
//         </form>
//         <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// // ChatScreen component remains unchanged for this update
// const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(false);
//   const chatContentRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     console.log('ChatScreen mounted with firstName:', firstName);
//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(false);
//       setShowTitle(true);
//     }, 3000);
//     return () => clearTimeout(welcomeTimer);
//   }, [firstName]);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [messages, isThinking]);

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;
//     if (!messageToSend.trim()) return;

//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false };
//     if (!retryMessage) {
//       setMessages((prev) => [...prev, newMessage]);
//     }
//     setIsThinking(true);

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Sending message with token:', token);

//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('API Response:', response.data);
//       setMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;
//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         console.log('401 Unauthorized: Token is invalid or expired. Error details:', error.response.data);
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };
//           return updatedMessages;
//         });
//       } else {
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedMessages;
//         });
//       }
//     }
//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);
//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };

//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };

//     recognition.start();
//   };

//   const handleLogout = () => {
//     const token = localStorage.getItem('token');
//     axios.post(
//       'https://aichatbot-backend-hxs8.onrender.com/api/chat/logout',
//       {},
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     ).then(() => {
//       console.log('Logged out successfully');
//     }).catch((err) => {
//       console.error('Logout error:', err);
//     });

//     localStorage.removeItem('token');
//     localStorage.removeItem('firstName');
//     setIsAuthenticated(false);
//     setMessages([]);
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;

//     const sanitizedResponse = DOMPurify.sanitize(response, { USE_PROFILES: { html: true } });

//     if (sanitizedResponse.includes('```')) {
//       const parts = sanitizedResponse.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
//       });
//     }

//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(sanitizedResponse)) {
//       const lines = sanitizedResponse.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               const contentParts = content.split(/<\/?strong>/);
//               let key = '';
//               let rest = content;
//               if (contentParts.length > 1) {
//                 key = contentParts[1];
//                 rest = content.replace(`<strong>${key}</strong>`, '');
//               }
//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">
//                     <strong>{key}</strong>
//                     <span dangerouslySetInnerHTML={{ __html: rest }} />
//                   </span>
//                 </div>
//               );
//             }
//             return <div key={index} dangerouslySetInnerHTML={{ __html: line }} />;
//           })}
//         </div>
//       );
//     }

//     return <div dangerouslySetInnerHTML={{ __html: sanitizedResponse }} />;
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         {showTitle && (
//           <div className="chat-header">
//             <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
//             <h2 className="chat-title">HUBA AI</h2>
//             <button onClick={handleLogout} className="logout-button" title="Logout">
//               <FaSignOutAlt />
//             </button>
//           </div>
//         )}
//         {showWelcome && (
//           <div className="welcome-message">
//             Welcome {firstName || 'User'} to HUBA AI
//           </div>
//         )}
//         <div className="chat-content" ref={chatContentRef}>
//           {messages.map((message, index) => (
//             <div key={index} className="chat-item">
//               <div className="message user-message">
//                 <p>{message.question}</p>
//               </div>
//               {message.answer && (
//                 <div className="message ai-message">
//                   <p>{renderResponse(message.answer)}</p>
//                   {message.error && message.canRetry && (
//                     <button
//                       onClick={handleRetry(message.question)}
//                       className="retry-button"
//                       title="Retry"
//                     >
//                       <FaRedo />
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//           {isThinking && <div className="thinking">Thinking...</div>}
//         </div>
//         <div className="chat-input-bar">
//           <textarea
//             placeholder="Ask anything..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="chat-input"
//             rows="1"
//           />
//           <FaMicrophone
//             className={`chat-icon ${isRecording ? 'recording' : ''}`}
//             onClick={handleVoiceInput}
//           />
//           <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//             <FaPaperPlane />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ThemeToggle = ({ theme, toggleTheme }) => (
//   <div className="theme-toggle" onClick={toggleTheme}>
//     {theme === 'light' ? <FaMoon /> : <FaSun />}
//   </div>
// );

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme || 'light';
//   });
//   const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');

//   useEffect(() => {
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 3000);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 !isAuthenticated ? (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
//                 ) : (
//                   <Navigate to="/chat" />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     firstName={firstName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }

// export default ChatBot;

//////////////////////////////////////////////////////////////
/////////////////////////////////////
//perfect 

// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSignOutAlt, FaRedo, FaCopy, FaHistory, FaSun, FaMoon, FaBars } from 'react-icons/fa';
// import DOMPurify from 'dompurify';
// import './App.css?v=5';

// const SplashScreen = ({ onAnimationEnd }) => (
//   <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//     <h1 className="splash-title">
//       <span className="splash-text">HUBA AI</span>
//     </h1>
//   </div>
// );

// const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const dataToSend = {
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };

//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';

//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(url, isSignup ? dataToSend : { email: formData.email, password: formData.password });
      
//       if (isSignup && response.status === 200) {
//         setSignupSuccess(true);
//         setError('Signup successful! Please log in.');
//         return;
//       }

//       if (!isSignup && (response.status === 200 || response.status === 201)) {
//         const token = response.data.token;
//         console.log('Login response:', response.data);
//         const loginFirstName = response.data.user.fullName.split(' ')[0] || 'User';
//         localStorage.setItem('token', token);
//         localStorage.setItem('firstName', loginFirstName);

//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });
//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || loginFirstName;
//           setFirstName(firstName);
//           localStorage.setItem('firstName', firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response?.data || userError.message);
//           setFirstName(loginFirstName);
//         }

//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button" disabled={isLoading}>
//             {isLoading ? (
//               <span className="loading-text">
//                 {isSignup ? 'Creating Account' : 'Logging In'} <span className="dots">...</span>
//               </span>
//             ) : (
//               isSignup ? 'Sign Up' : 'Login'
//             )}
//           </button>
//         </form>
//         <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const chatContentRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     console.log('ChatScreen mounted with firstName:', firstName);
//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(false);
//       setShowTitle(true);
//     }, 3000);
//     return () => clearTimeout(welcomeTimer);
//   }, [firstName]);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [messages, isThinking]);

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;
//     if (!messageToSend.trim()) return;

//     const timestamp = new Date().toISOString();
//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false, timestamp };
//     if (!retryMessage) {
//       setMessages((prev) => [...prev, newMessage]);
//     }
//     setIsThinking(true);

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Sending message with token:', token);

//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('API Response:', response.data);
//       setMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;
//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         console.log('401 Unauthorized: Token is invalid or expired. Error details:', error.response.data);
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };
//           return updatedMessages;
//         });
//       } else {
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedMessages;
//         });
//       }
//     }
//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);
//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };

//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };

//     recognition.start();
//   };

//   const handleLogout = () => {
//     const token = localStorage.getItem('token');
//     axios.post(
//       'https://aichatbot-backend-hxs8.onrender.com/api/chat/logout',
//       {},
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     ).then(() => {
//       console.log('Logged out successfully');
//     }).catch((err) => {
//       console.error('Logout error:', err);
//     });

//     localStorage.removeItem('token');
//     localStorage.removeItem('firstName');
//     setIsAuthenticated(false);
//     setMessages([]);
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const toggleSidebar = () => {
//     console.log('Toggling sidebar, current state:', isSidebarOpen);
//     setIsSidebarOpen((prev) => !prev);
//   };

//   const closeSidebar = () => {
//     if (isSidebarOpen) {
//       setIsSidebarOpen(false);
//     }
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;

//     const sanitizedResponse = DOMPurify.sanitize(response, { USE_PROFILES: { html: true } });

//     if (sanitizedResponse.includes('```')) {
//       const parts = sanitizedResponse.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
//       });
//     }

//     const tempRegex = /°[CF]|\btemperature\b/i;
//     if (tempRegex.test(sanitizedResponse)) {
//       const parts = sanitizedResponse.split(/in|is|,|\b°C\b|\b°F\b/i).map(part => part.trim());
//       const city = parts[1] || 'Unknown City';
//       const tempMatch = sanitizedResponse.match(/[-?\d]+(\.\d+)?/);
//       const tempUnit = sanitizedResponse.match(/[CF]/i)?.[0] || 'C';
//       const temperature = tempMatch ? `${tempMatch[0]}°${tempUnit}` : 'N/A';
//       const skyDetails = parts[parts.length - 1] || 'N/A';
      
//       return (
//         <div className="temperature-container">
//           <div className="temperature-header">Temperature of</div>
//           <div className="temperature-city">{city}</div>
//           <div className="temperature-value">{temperature}</div>
//           <div className="sky-details">{skyDetails}</div>
//         </div>
//       );
//     }

//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(sanitizedResponse)) {
//       const lines = sanitizedResponse.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               const contentParts = content.split(/<\/?strong>/);
//               let key = '';
//               let rest = content;
//               if (contentParts.length > 1) {
//                 key = contentParts[1];
//                 rest = content.replace(`<strong>${key}</strong>`, '');
//               }
//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">
//                     <strong>{key}</strong>
//                     <span dangerouslySetInnerHTML={{ __html: rest }} />
//                   </span>
//                 </div>
//               );
//             }
//             return <div key={index} dangerouslySetInnerHTML={{ __html: line }} />;
//           })}
//         </div>
//       );
//     }

//     return <div dangerouslySetInnerHTML={{ __html: sanitizedResponse }} />;
//   };

//   const renderHistoryResponse = (response) => {
//     if (!response) return null;

//     const sanitizedResponse = DOMPurify.sanitize(response, { USE_PROFILES: { html: true } });
//     // For history, we'll strip HTML tags and limit the length to avoid clutter
//     const plainText = sanitizedResponse.replace(/<[^>]+>/g, '');
//     return plainText.length > 50 ? `${plainText.substring(0, 50)}...` : plainText;
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
//           <div className="sidebar-header">
//             <FaHistory className="sidebar-icon" onClick={toggleSidebar} />
//             <div className="theme-toggle-sidebar" onClick={toggleTheme}>
//               {theme === 'light' ? <FaMoon /> : <FaSun />}
//             </div>
//           </div>
//           <div className="sidebar-content">
//             <h3>Chat History</h3>
//             <div className="history-list">
//               {messages.length > 0 ? (
//                 messages.map((msg, index) => (
//                   <div key={index} className="history-item" onClick={() => setQuery(msg.question)}>
//                     <span className="history-timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
//                     <div className="history-message">
//                       <p className="history-question">You: {msg.question}</p>
//                       {msg.answer && (
//                         <p className="history-answer">AI: {renderHistoryResponse(msg.answer)}</p>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p>No chat history available.</p>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="chat-main" onClick={closeSidebar}>
//           {showTitle && (
//             <div className="chat-header">
//               <FaBars className="sidebar-toggle-icon" onClick={toggleSidebar} />
//               <h2 className="chat-title">HUBA AI</h2>
//               <div className="header-actions">
//                 <button onClick={handleLogout} className="logout-button" title="Logout">
//                   <FaSignOutAlt />
//                 </button>
//               </div>
//             </div>
//           )}
//           {showWelcome && (
//             <div className="welcome-message">
//               Welcome {firstName || 'User'} to HUBA AI
//             </div>
//           )}
//           <div className="chat-content" ref={chatContentRef}>
//             {messages.map((message, index) => (
//               <div key={index} className="chat-item">
//                 <div className="message user-message">
//                   <p>{message.question}</p>
//                 </div>
//                 {message.answer && (
//                   <div className="message ai-message">
//                     <p>{renderResponse(message.answer)}</p>
//                     {message.error && message.canRetry && (
//                       <button
//                         onClick={handleRetry(message.question)}
//                         className="retry-button"
//                         title="Retry"
//                       >
//                         <FaRedo />
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//             {isThinking && <div className="thinking">Thinking...</div>}
//           </div>
//           <div className="chat-input-bar">
//             <textarea
//               placeholder="Ask anything..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="chat-input"
//               rows="1"
//             />
//             <FaMicrophone
//               className={`chat-icon ${isRecording ? 'recording' : ''}`}
//               onClick={handleVoiceInput}
//             />
//             <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//               <FaPaperPlane />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme || 'light';
//   });
//   const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');

//   useEffect(() => {
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 3000);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 !isAuthenticated ? (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
//                 ) : (
//                   <Navigate to="/chat" />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     firstName={firstName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }

// export default ChatBot;

///////////////////////////////////////////////////////
//  chat screen 
// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSignOutAlt, FaRedo, FaCopy, FaHistory, FaSun, FaMoon, FaBars, FaArrowLeft } from 'react-icons/fa';
// import DOMPurify from 'dompurify';
// import './App.css?v=7';

// const SplashScreen = ({ onAnimationEnd }) => (
//   <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//     <h1 className="splash-title">
//       <span className="splash-text">HUBA AI</span>
//     </h1>
//   </div>
// );

// const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const dataToSend = {
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };

//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';

//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(url, isSignup ? dataToSend : { email: formData.email, password: formData.password });
      
//       if (isSignup && response.status === 200) {
//         setSignupSuccess(true);
//         setError('Signup successful! Please log in.');
//         return;
//       }

//       if (!isSignup && (response.status === 200 || response.status === 201)) {
//         const token = response.data.token;
//         console.log('Login response:', response.data);
//         const loginFirstName = response.data.user.fullName.split(' ')[0] || 'User';
//         localStorage.setItem('token', token);
//         localStorage.setItem('firstName', loginFirstName);

//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });
//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || loginFirstName;
//           setFirstName(firstName);
//           localStorage.setItem('firstName', firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response?.data || userError.message);
//           setFirstName(loginFirstName);
//         }

//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button" disabled={isLoading}>
//             {isLoading ? (
//               <span className="loading-text">
//                 {isSignup ? 'Creating Account' : 'Logging In'} <span className="dots">...</span>
//               </span>
//             ) : (
//               isSignup ? 'Sign Up' : 'Login'
//             )}
//           </button>
//         </form>
//         <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [displayedMessages, setDisplayedMessages] = useState([]);
//   const chatContentRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   // Load messages from localStorage and filter out messages older than 1 day
//   useEffect(() => {
//     const storedMessages = localStorage.getItem('chatHistory');
//     if (storedMessages) {
//       const parsedMessages = JSON.parse(storedMessages);
//       const oneDayInMs = 24 * 60 * 60 * 1000; // 1 day in milliseconds
//       const now = new Date().getTime();

//       // Filter messages that are within the last 24 hours
//       const filteredMessages = parsedMessages.filter((msg) => {
//         const msgTime = new Date(msg.timestamp).getTime();
//         return now - msgTime <= oneDayInMs;
//       });

//       setMessages(filteredMessages);
//       setDisplayedMessages(filteredMessages); // Initially display all messages
//       localStorage.setItem('chatHistory', JSON.stringify(filteredMessages));
//     }

//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(false);
//       setShowTitle(true);
//     }, 3000);
//     return () => clearTimeout(welcomeTimer);
//   }, [firstName]);

//   // Save messages to localStorage whenever they change
//   useEffect(() => {
//     if (messages.length > 0) {
//       localStorage.setItem('chatHistory', JSON.stringify(messages));
//     }
//   }, [messages]);

//   // Scroll to the bottom of the chat content when messages or thinking state changes
//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [displayedMessages, isThinking]);

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;
//     if (!messageToSend.trim()) return;

//     const timestamp = new Date().toISOString();
//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false, timestamp };
//     if (!retryMessage) {
//       setMessages((prev) => [...prev, newMessage]);
//       setDisplayedMessages((prev) => [...prev, newMessage]);
//     }
//     setIsThinking(true);

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Sending message with token:', token);

//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('API Response:', response.data);
//       setMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;
//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedMessages;
//       });
//       setDisplayedMessages((prev) => {
//         const updatedDisplayedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedDisplayedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedDisplayedMessages.length - 1;
//         updatedDisplayedMessages[messageIndex] = {
//           ...updatedDisplayedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedDisplayedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         console.log('401 Unauthorized: Token is invalid or expired. Error details:', error.response.data);
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };
//           return updatedMessages;
//         });
//         setDisplayedMessages((prev) => {
//           const updatedDisplayedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedDisplayedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedDisplayedMessages.length - 1;
//           updatedDisplayedMessages[messageIndex] = {
//             ...updatedDisplayedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };
//           return updatedDisplayedMessages;
//         });
//       } else {
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedMessages;
//         });
//         setDisplayedMessages((prev) => {
//           const updatedDisplayedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedDisplayedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedDisplayedMessages.length - 1;
//           updatedDisplayedMessages[messageIndex] = {
//             ...updatedDisplayedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedDisplayedMessages;
//         });
//       }
//     }
//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);
//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };

//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };

//     recognition.start();
//   };

//   const handleLogout = () => {
//     const token = localStorage.getItem('token');
//     axios.post(
//       'https://aichatbot-backend-hxs8.onrender.com/api/chat/logout',
//       {},
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     ).then(() => {
//       console.log('Logged out successfully');
//     }).catch((err) => {
//       console.error('Logout error:', err);
//     });

//     localStorage.removeItem('token');
//     localStorage.removeItem('firstName');
//     setIsAuthenticated(false);
//     // Do not clear messages on logout to persist history
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const toggleSidebar = () => {
//     console.log('Toggling sidebar, current state:', isSidebarOpen);
//     setIsSidebarOpen((prev) => !prev);
//   };

//   const closeSidebar = () => {
//     if (isSidebarOpen) {
//       setIsSidebarOpen(false);
//     }
//   };

//   const handleHistoryClick = (msg) => {
//     // Display only the selected message in the chat area
//     setDisplayedMessages([msg]);
//     setIsSidebarOpen(false); // Close the sidebar after selection
//   };

//   const handleBackToAllChats = () => {
//     // Reset displayed messages to show all messages
//     setDisplayedMessages(messages);
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;

//     const sanitizedResponse = DOMPurify.sanitize(response, { USE_PROFILES: { html: true } });

//     if (sanitizedResponse.includes('```')) {
//       const parts = sanitizedResponse.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
//       });
//     }

//     const tempRegex = /°[CF]|\btemperature\b/i;
//     if (tempRegex.test(sanitizedResponse)) {
//       const parts = sanitizedResponse.split(/in|is|,|\b°C\b|\b°F\b/i).map(part => part.trim());
//       const city = parts[1] || 'Unknown City';
//       const tempMatch = sanitizedResponse.match(/[-?\d]+(\.\d+)?/);
//       const tempUnit = sanitizedResponse.match(/[CF]/i)?.[0] || 'C';
//       const temperature = tempMatch ? `${tempMatch[0]}°${tempUnit}` : 'N/A';
//       const skyDetails = parts[parts.length - 1] || 'N/A';
      
//       return (
//         <div className="temperature-container">
//           <div className="temperature-header">Temperature of</div>
//           <div className="temperature-city">{city}</div>
//           <div className="temperature-value">{temperature}</div>
//           <div className="sky-details">{skyDetails}</div>
//         </div>
//       );
//     }

//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(sanitizedResponse)) {
//       const lines = sanitizedResponse.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               const contentParts = content.split(/<\/?strong>/);
//               let key = '';
//               let rest = content;
//               if (contentParts.length > 1) {
//                 key = contentParts[1];
//                 rest = content.replace(`<strong>${key}</strong>`, '');
//               }
//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">
//                     <strong>{key}</strong>
//                     <span dangerouslySetInnerHTML={{ __html: rest }} />
//                   </span>
//                 </div>
//               );
//             }
//             return <div key={index} dangerouslySetInnerHTML={{ __html: line }} />;
//           })}
//         </div>
//       );
//     }

//     return <div dangerouslySetInnerHTML={{ __html: sanitizedResponse }} />;
//   };

//   const renderHistoryResponse = (response) => {
//     if (!response) return null;

//     const sanitizedResponse = DOMPurify.sanitize(response, { USE_PROFILES: { html: true } });
//     // For history, we'll strip HTML tags and limit the length to avoid clutter
//     const plainText = sanitizedResponse.replace(/<[^>]+>/g, '');
//     return plainText.length > 50 ? `${plainText.substring(0, 50)}...` : plainText;
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
//           <div className="sidebar-header">
//             <FaHistory className="sidebar-icon" onClick={toggleSidebar} />
//             <div className="theme-toggle-sidebar" onClick={toggleTheme}>
//               {theme === 'light' ? <FaMoon /> : <FaSun />}
//             </div>
//           </div>
//           <div className="sidebar-content">
//             <h3>Chat History</h3>
//             <div className="history-list">
//               {messages.length > 0 ? (
//                 messages.map((msg, index) => (
//                   <div key={index} className="history-item" onClick={() => handleHistoryClick(msg)}>
//                     <span className="history-timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
//                     <div className="history-message">
//                       <p className="history-question">You: {msg.question}</p>
//                       {msg.answer && (
//                         <p className="history-answer">AI: {renderHistoryResponse(msg.answer)}</p>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p>No chat history available.</p>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="chat-main" onClick={closeSidebar}>
//           {showTitle && (
//             <div className="chat-header">
//               {displayedMessages.length !== messages.length ? (
//                 <FaArrowLeft className="back-icon" onClick={handleBackToAllChats} title="Back to All Chats" />
//               ) : (
//                 <FaBars className="sidebar-toggle-icon" onClick={toggleSidebar} />
//               )}
//               <h2 className="chat-title">HUBA AI</h2>
//               <div className="header-actions">
//                 <button onClick={handleLogout} className="logout-button" title="Logout">
//                   <FaSignOutAlt />
//                 </button>
//               </div>
//             </div>
//           )}
//           {showWelcome && (
//             <div className="welcome-message">
//               Welcome {firstName || 'User'} to HUBA AI
//             </div>
//           )}
//           <div className="chat-content" ref={chatContentRef}>
//             {displayedMessages.map((message, index) => (
//               <div key={index} className="chat-item">
//                 <div className="message user-message">
//                   <p>{message.question}</p>
//                 </div>
//                 {message.answer && (
//                   <div className="message ai-message">
//                     <p>{renderResponse(message.answer)}</p>
//                     {message.error && message.canRetry && (
//                       <button
//                         onClick={handleRetry(message.question)}
//                         className="retry-button"
//                         title="Retry"
//                       >
//                         <FaRedo />
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//             {isThinking && <div className="thinking">Thinking...</div>}
//           </div>
//           <div className="chat-input-bar">
//             <textarea
//               placeholder="Ask anything..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="chat-input"
//               rows="1"
//             />
//             <FaMicrophone
//               className={`chat-icon ${isRecording ? 'recording' : ''}`}
//               onClick={handleVoiceInput}
//             />
//             <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//               <FaPaperPlane />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme || 'light';
//   });
//   const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');

//   useEffect(() => {
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 3000);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 !isAuthenticated ? (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
//                 ) : (
//                   <Navigate to="/chat" />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     firstName={firstName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }

// export default ChatBot;


/////////////////////////////////////////////////////////////////
// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSignOutAlt, FaRedo, FaCopy, FaSun, FaMoon } from 'react-icons/fa';
// import DOMPurify from 'dompurify';
// import './App.css?v=9';

// const SplashScreen = ({ onAnimationEnd }) => (
//   <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//     <h1 className="splash-title">
//       <span className="splash-text">HUBA AI</span>
//     </h1>
//   </div>
// );

// const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const dataToSend = {
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };

//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';

//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(url, isSignup ? dataToSend : { email: formData.email, password: formData.password });
      
//       if (isSignup && response.status === 200) {
//         setSignupSuccess(true);
//         setError('Signup successful! Please log in.');
//         return;
//       }

//       if (!isSignup && (response.status === 200 || response.status === 201)) {
//         const token = response.data.token;
//         console.log('Login response:', response.data);
//         const loginFirstName = response.data.user.fullName.split(' ')[0] || 'User';
//         localStorage.setItem('token', token);
//         localStorage.setItem('firstName', loginFirstName);

//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });
//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || loginFirstName;
//           setFirstName(firstName);
//           localStorage.setItem('firstName', firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response?.data || userError.message);
//           setFirstName(loginFirstName);
//         }

//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button" disabled={isLoading}>
//             {isLoading ? (
//               <span className="loading-text">
//                 {isSignup ? 'Creating Account' : 'Logging In'} <span className="dots">...</span>
//               </span>
//             ) : (
//               isSignup ? 'Sign Up' : 'Login'
//             )}
//           </button>
//         </form>
//         <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [displayedMessages, setDisplayedMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(false);
//   const chatContentRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(false);
//       setShowTitle(true);
//       setDisplayedMessages([]);
//     }, 3000);

//     return () => clearTimeout(welcomeTimer);
//   }, [firstName]);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [displayedMessages, isThinking]);

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;
//     if (!messageToSend.trim()) return;

//     const timestamp = new Date().toISOString();
//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false, timestamp };
//     if (!retryMessage) {
//       setDisplayedMessages((prev) => [...prev, newMessage]);
//     }
//     setIsThinking(true);

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Sending message with token:', token);

//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('API Response:', response.data);
//       setDisplayedMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;
//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         console.log('401 Unauthorized: Token is invalid or expired. Error details:', error.response.data);
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         setDisplayedMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };
//           return updatedMessages;
//         });
//       } else {
//         setDisplayedMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedMessages;
//         });
//       }
//     }
//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);
//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };

//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };

//     recognition.start();
//   };

//   const handleLogout = () => {
//     const token = localStorage.getItem('token');
//     axios.post(
//       'https://aichatbot-backend-hxs8.onrender.com/api/chat/logout',
//       {},
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     ).then(() => {
//       console.log('Logged out successfully');
//     }).catch((err) => {
//       console.error('Logout error:', err);
//     });

//     localStorage.removeItem('token');
//     localStorage.removeItem('firstName');
//     setIsAuthenticated(false);
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;

//     const sanitizedResponse = DOMPurify.sanitize(response, { USE_PROFILES: { html: true } });

//     if (sanitizedResponse.includes('```')) {
//       const parts = sanitizedResponse.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
//       });
//     }

//     const tempRegex = /°[CF]|\btemperature\b/i;
//     if (tempRegex.test(sanitizedResponse)) {
//       const parts = sanitizedResponse.split(/in|is|,|\b°C\b|\b°F\b/i).map(part => part.trim());
//       const city = parts[1] || 'Unknown City';
//       const tempMatch = sanitizedResponse.match(/[-?\d]+(\.\d+)?/);
//       const tempUnit = sanitizedResponse.match(/[CF]/i)?.[0] || 'C';
//       const temperature = tempMatch ? `${tempMatch[0]}°${tempUnit}` : 'N/A';
//       const skyDetails = parts[parts.length - 1] || 'N/A';
      
//       return (
//         <div className="temperature-container">
//           <div className="temperature-header">Temperature of</div>
//           <div className="temperature-city">{city}</div>
//           <div className="temperature-value">{temperature}</div>
//           <div className="sky-details">{skyDetails}</div>
//         </div>
//       );
//     }

//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(sanitizedResponse)) {
//       const lines = sanitizedResponse.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               const contentParts = content.split(/<\/?strong>/);
//               let key = '';
//               let rest = content;
//               if (contentParts.length > 1) {
//                 key = contentParts[1];
//                 rest = content.replace(`<strong>${key}</strong>`, '');
//               }
//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">
//                     <strong>{key}</strong>
//                     <span dangerouslySetInnerHTML={{ __html: rest }} />
//                   </span>
//                 </div>
//               );
//             }
//             return <div key={index} dangerouslySetInnerHTML={{ __html: line }} />;
//           })}
//         </div>
//       );
//     }

//     return <div dangerouslySetInnerHTML={{ __html: sanitizedResponse }} />;
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         <div className="chat-main">
//           {showTitle && (
//             <div className="chat-header">
//               <div className="theme-toggle" onClick={toggleTheme}>
//                 {theme === 'light' ? <FaMoon /> : <FaSun />}
//               </div>
//               <h2 className="chat-title">HUBA AI</h2>
//               <div className="header-actions">
//                 <button onClick={handleLogout} className="logout-button" title="Logout">
//                   <FaSignOutAlt />
//                 </button>
//               </div>
//             </div>
//           )}
//           {showWelcome && (
//             <div className="welcome-message">
//               Welcome {firstName || 'User'} to HUBA AI
//             </div>
//           )}
//           <div className="chat-content" ref={chatContentRef}>
//             {!showWelcome && displayedMessages.map((message, index) => (
//               <div key={index} className="chat-item">
//                 <div className="message user-message">
//                   <p>{message.question}</p>
//                 </div>
//                 {message.answer && (
//                   <div className="message ai-message">
//                     <p>{renderResponse(message.answer)}</p>
//                     {message.error && message.canRetry && (
//                       <button
//                         onClick={handleRetry(message.question)}
//                         className="retry-button"
//                         title="Retry"
//                       >
//                         <FaRedo />
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//             {isThinking && <div className="thinking">Thinking...</div>}
//           </div>
//           <div className="chat-input-bar">
//             <textarea
//               placeholder="Ask anything..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="chat-input"
//               rows="1"
//             />
//             <FaMicrophone
//               className={`chat-icon ${isRecording ? 'recording' : ''}`}
//               onClick={handleVoiceInput}
//             />
//             <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//               <FaPaperPlane />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme || 'light';
//   });
//   const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');

//   useEffect(() => {
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 3000);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 !isAuthenticated ? (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
//                 ) : (
//                   <Navigate to="/chat" />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     firstName={firstName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }

// export default ChatBot;

//////////////////////////////////////////////////
// good or bad

// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import DOMPurify from 'dompurify';
// import { FaMicrophone, FaPaperPlane, FaSun, FaMoon, FaSignOutAlt, FaRedo, FaCopy } from 'react-icons/fa';
// import './App.css?v=1';

// const SplashScreen = ({ onAnimationEnd }) => (
//   <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//     <h1 className="splash-title">
//       <span className="splash-text">HUBA AI</span>
//     </h1>
//   </div>
// );

// const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const dataToSend = {
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };

//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';

//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(url, isSignup ? dataToSend : { email: formData.email, password: formData.password });

//       if (isSignup && response.status === 200) {
//         // Signup successful, prompt to login
//         setSignupSuccess(true);
//         setError('Signup successful! Please log in.');
//         return;
//       }

//       if (!isSignup && (response.status === 200 || response.status === 201)) {
//         const token = response.data.token;
//         console.log('Login response:', response.data);
//         const loginFirstName = response.data.user.fullName.split(' ')[0] || 'User'; // Extract first name
       
//         localStorage.setItem('token', token);
//         localStorage.setItem('firstName', loginFirstName);

//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });
//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || loginFirstName;
//           setFirstName(firstName);
//           localStorage.setItem('firstName', firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response?.data || userError.message);
//           setFirstName(loginFirstName);
//         }

//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       setError(errorMessage);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button">
//             {isSignup ? 'Sign Up' : 'Login'}
//           </button>
//         </form>
//         <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(false);
//   const chatContentRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     console.log('ChatScreen mounted with firstName:', firstName);
//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(false);
//       setShowTitle(true);
//     }, 3000);
//     return () => clearTimeout(welcomeTimer);
//   }, [firstName]);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [messages, isThinking]);

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;
//     if (!messageToSend.trim()) return;

//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false };
//     if (!retryMessage) {
//       setMessages((prev) => [...prev, newMessage]);
//     }
//     setIsThinking(true);

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Sending message with token:', token);

//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend },
//         { question: messageToSend }, // Removed history field
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('API Response:', response.data);
//       setMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;
//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         console.log('401 Unauthorized: Token is invalid or expired. Error details:', error.response.data);
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };
//           return updatedMessages;
//         });
//       } else {
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedMessages;
//         });
//       }
//     }
//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);
//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };

//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };

//     recognition.start();
//   };

//   const handleLogout = () => {
//     // Call the logout endpoint to clear session history on the backend
//     const token = localStorage.getItem('token');
//     axios.post(
//       'https://aichatbot-backend-hxs8.onrender.com/api/chat/logout',
//       {},
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     ).then(() => {
//       console.log('Logged out successfully');
//     }).catch((err) => {
//       console.error('Logout error:', err);
//     });

//     localStorage.removeItem('token');
//     localStorage.removeItem('firstName');
//     setIsAuthenticated(false);
//     setMessages([]); // Clear messages on logout to reset context
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;

//     if (response.includes('```')) {
//       const parts = response.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index}>{part}</span>;
//       });
//     }

//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(response)) {
//       const lines = response.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">{content}</span>
//                 </div>
//               );
//             }
//             return <div key={index}>{line}</div>;
//           })}
//         </div>
//       );
//     }

//     return response;
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         {showTitle && (
//           <div className="chat-header">
//             <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
//             <h2 className="chat-title">HUBA AI</h2>
//             <button onClick={handleLogout} className="logout-button" title="Logout">
//               <FaSignOutAlt />
//             </button>
//           </div>
//         )}
//         {showWelcome && (
//           <div className="welcome-message">
//             Welcome {firstName || 'User'} to HUBA AI
//           </div>
//         )}
//         <div className="chat-content" ref={chatContentRef}>
//           {messages.map((message, index) => (
//             <div key={index} className="chat-item">
//               <div className="message user-message">
//                 <p>{message.question}</p>
//               </div>
//               {message.answer && (
//                 <div className="message ai-message">
//                   <p>{renderResponse(message.answer)}</p>
//                   {message.error && message.canRetry && (
//                     <button
//                       onClick={handleRetry(message.question)}
//                       className="retry-button"
//                       title="Retry"
//                     >
//                       <FaRedo />
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//           {isThinking && <div className="thinking">Thinking...</div>}
//         </div>
//         <div className="chat-input-bar">
//           <textarea
//             placeholder="Ask anything..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="chat-input"
//             rows="1"
//           />
//           <FaMicrophone
//             className={`chat-icon ${isRecording ? 'recording' : ''}`}
//             onClick={handleVoiceInput}
//           />
//           <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//             <FaPaperPlane />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ThemeToggle = ({ theme, toggleTheme }) => (
//   <div className="theme-toggle" onClick={toggleTheme}>
//     {theme === 'light' ? <FaMoon /> : <FaSun />}
//   </div>
// );

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme || 'light';
//   });
//   const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');

//   useEffect(() => {
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 3000);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 !isAuthenticated ? (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
//                 ) : (
//                   <Navigate to="/chat" />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     firstName={firstName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }
// export default ChatBot;

////////////////////////////////////////
// all ok

// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSignOutAlt, FaRedo, FaCopy, FaSun, FaMoon } from 'react-icons/fa';
// import DOMPurify from 'dompurify';
// import './App.css?v=9';

// const SplashScreen = ({ onAnimationEnd }) => (
//   <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//     <h1 className="splash-title">
//       <span className="splash-text">HUBA AI</span>
//     </h1>
//   </div>
// );

// const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const dataToSend = {
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };
//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';

//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(url, isSignup ? dataToSend : { email: formData.email, password: formData.password });

//       if (isSignup && response.status === 200) {
//         setSignupSuccess(true);
//         setError('Signup successful! Please log in.');
//         return;
//       }

//       if (!isSignup && (response.status === 200 || response.status === 201)) {
//         const token = response.data.token;
//         console.log('Login response:', response.data);
//         const loginFirstName = response.data.user.fullName.split(' ')[0] || 'User';
//         localStorage.setItem('token', token);
//         localStorage.setItem('firstName', loginFirstName);

//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });
//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || loginFirstName;
//           setFirstName(firstName);
//           localStorage.setItem('firstName', firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response?.data || userError.message);
//           setFirstName(loginFirstName);
//         }
//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button" disabled={isLoading}>
//             {isLoading ? (
//               <span className="loading-text">
//                 {isSignup ? 'Creating Account' : 'Logging In'} <span className="dots">...</span>
//               </span>
//             ) : (
//               isSignup ? 'Sign Up' : 'Login'
//             )}
//           </button>
//         </form>
//         <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [displayedMessages, setDisplayedMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(false);
//   const chatContentRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(false);
//       setShowTitle(true);
//       setDisplayedMessages([]);
//     }, 3000);
//     return () => clearTimeout(welcomeTimer);
//   }, [firstName]);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [displayedMessages, isThinking]);

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;
//     if (!messageToSend.trim()) return;

//     const timestamp = new Date().toISOString();
//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false, timestamp };

//     if (!retryMessage) {
//       setDisplayedMessages((prev) => [...prev, newMessage]);
//     }

//     setIsThinking(true);

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Sending message with token:', token);

//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       console.log('API Response:', response.data);

//       setDisplayedMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;

//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);

//       if (error.response && error.response.status === 401) {
//         console.log('401 Unauthorized: Token is invalid or expired. Error details:', error.response.data);
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);

//         setDisplayedMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;

//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };
//           return updatedMessages;
//         });
//       } else {
//         setDisplayedMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;

//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedMessages;
//         });
//       }
//     }

//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);

//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };

//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };

//     recognition.start();
//   };

//   const handleLogout = () => {
//     const token = localStorage.getItem('token');

//     axios.post(
//       'https://aichatbot-backend-hxs8.onrender.com/api/chat/logout',
//       {},
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     ).then(() => {
//       console.log('Logged out successfully');
//     }).catch((err) => {
//       console.error('Logout error:', err);
//     });

//     localStorage.removeItem('token');
//     localStorage.removeItem('firstName');
//     setIsAuthenticated(false);
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;

//     const sanitizedResponse = DOMPurify.sanitize(response, { USE_PROFILES: { html: true } });

//     if (sanitizedResponse.includes('```')) {
//       const parts = sanitizedResponse.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
//       });
//     }

//     const tempRegex = /°[CF]|\btemperature\b/i;
//     if (tempRegex.test(sanitizedResponse)) {
//       const parts = sanitizedResponse.split(/in|is|,|\b°C\b|\b°F\b/i).map(part => part.trim());
//       const city = parts[1] || 'Unknown City';
//       const tempMatch = sanitizedResponse.match(/[-?\d]+(\.\d+)?/);
//       const tempUnit = sanitizedResponse.match(/[CF]/i)?.[0] || 'C';
//       const temperature = tempMatch ? `${tempMatch[0]}°${tempUnit}` : 'N/A';
//       const skyDetails = parts[parts.length - 1] || 'N/A';

//       return (
//         <div className="temperature-container">
//           <div className="temperature-header">Temperature of</div>
//           <div className="temperature-city">{city}</div>
//           <div className="temperature-value">{temperature}</div>
//           <div className="sky-details">{skyDetails}</div>
//         </div>
//       );
//     }

//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(sanitizedResponse)) {
//       const lines = sanitizedResponse.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               const contentParts = content.split(/<\/?strong>/);
//               let key = '';
//               let rest = content;

//               if (contentParts.length > 1) {
//                 key = contentParts[1];
//                 rest = content.replace(`<strong>${key}</strong>`, '');
//               }

//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">
//                     <strong>{key}</strong>
//                     <span dangerouslySetInnerHTML={{ __html: rest }} />
//                   </span>
//                 </div>
//               );
//             }
//             return <div key={index} dangerouslySetInnerHTML={{ __html: line }} />;
//           })}
//         </div>
//       );
//     }

//     return <div dangerouslySetInnerHTML={{ __html: sanitizedResponse }} />;
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         <div className="chat-main">
//           {showTitle && (
//             <div className="chat-header">
//               <div className="theme-toggle" onClick={toggleTheme}>
//                 {theme === 'light' ? <FaMoon /> : <FaSun />}
//               </div>
//               <h2 className="chat-title">HUBA AI</h2>
//               <div className="header-actions">
//                 <button onClick={handleLogout} className="logout-button" title="Logout">
//                   <FaSignOutAlt />
//                 </button>
//               </div>
//             </div>
//           )}

//           {showWelcome && (
//             <div className="welcome-message">
//               Welcome {firstName || 'User'} to HUBA AI
//             </div>
//           )}

//           <div className="chat-content" ref={chatContentRef}>
//             {!showWelcome && displayedMessages.map((message, index) => (
//               <div key={index} className="chat-item">
//                 <div className="message user-message">
//                   <p>{message.question}</p>
//                 </div>
//                 {message.answer && (
//                   <div className="message ai-message">
//                     <p>{renderResponse(message.answer)}</p>
//                     {message.error && message.canRetry && (
//                       <button
//                         onClick={handleRetry(message.question)}
//                         className="retry-button"
//                         title="Retry"
//                       >
//                         <FaRedo />
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//             {isThinking && <div className="thinking">Thinking...</div>}
//           </div>

//           <div className="chat-input-bar">
//             <textarea
//               placeholder="Ask anything..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="chat-input"
//               rows="1"
//             />
//             <FaMicrophone
//               className={`chat-icon ${isRecording ? 'recording' : ''}`}
//               onClick={handleVoiceInput}
//             />
//             <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//               <FaPaperPlane />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme || 'light';
//   });
//   const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');

//   useEffect(() => {
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 3000);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 !isAuthenticated ? (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
//                 ) : (
//                   <Navigate to="/chat" />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     firstName={firstName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }

// export default ChatBot;
//
//////////////////////////////////////////////////////////////////////////////////////////
// deployed one v2

// import React, { useState, useEffect, useRef } from 'react'; // Ensure useRef is included here
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSignOutAlt, FaRedo, FaCopy, FaSun, FaMoon } from 'react-icons/fa';
// import DOMPurify from 'dompurify';
// import './App.css?v=9';

// const SplashScreen = ({ onAnimationEnd }) => {
//   const [showSlogan, setShowSlogan] = useState(false);

//   useEffect(() => {
//     // Show slogan after 1.2 seconds
//     const sloganTimer = setTimeout(() => {
//       setShowSlogan(true);
//     }, 200);

//     return () => clearTimeout(sloganTimer);
//   }, []);

//   return (
//     <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//       <div className="splash-content">
//         <h1 className="splash-title">HUBA AI</h1>
//         {showSlogan && <p className="splash-slogan">THINK . TALK . SOLVE</p>}
//       </div>
//     </div>
//   );
// };
// // Rest of the code remains unchanged...

// const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const dataToSend = {
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };

//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';

//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(url, isSignup ? dataToSend : { email: formData.email, password: formData.password });

//       if (isSignup && response.status === 200) {
//         setSignupSuccess(true);
//         setError('Signup successful! Please log in.');
//         return;
//       }

//       if (!isSignup && (response.status === 200 || response.status === 201)) {
//         const token = response.data.token;
//         console.log('Login response:', response.data);

//         const loginFirstName = response.data.user.fullName.split(' ')[0] || 'User';
//         localStorage.setItem('token', token);
//         localStorage.setItem('firstName', loginFirstName);

//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });

//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || loginFirstName;
//           setFirstName(firstName);
//           localStorage.setItem('firstName', firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response?.data || userError.message);
//           setFirstName(loginFirstName);
//         }

//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button" disabled={isLoading}>
//             {isLoading ? (
//               <span className="loading-text">
//                 {isSignup ? 'Creating Account' : 'Logging In'} <span className="dots">...</span>
//               </span>
//             ) : (
//               isSignup ? 'Sign Up' : 'Login'
//             )}
//           </button>
//         </form>
//         <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [displayedMessages, setDisplayedMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(false);
//   const chatContentRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(false);
//       setShowTitle(true);
//       setDisplayedMessages([]);
//     }, 3000);

//     return () => clearTimeout(welcomeTimer);
//   }, [firstName]);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [displayedMessages, isThinking]);

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;

//     if (!messageToSend.trim()) return;

//     const timestamp = new Date().toISOString();
//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false, timestamp };

//     if (!retryMessage) {
//       setDisplayedMessages((prev) => [...prev, newMessage]);
//     }

//     setIsThinking(true);

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Sending message with token:', token);

//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       console.log('API Response:', response.data);

//       setDisplayedMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;

//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };

//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);

//       if (error.response && error.response.status === 401) {
//         console.log('401 Unauthorized: Token is invalid or expired. Error details:', error.response.data);
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);

//         setDisplayedMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;

//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };

//           return updatedMessages;
//         });
//       } else {
//         setDisplayedMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;

//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };

//           return updatedMessages;
//         });
//       }
//     }

//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);

//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };

//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };

//     recognition.start();
//   };

//   const handleLogout = () => {
//     const token = localStorage.getItem('token');

//     axios.post(
//       'https://aichatbot-backend-hxs8.onrender.com/api/chat/logout',
//       {},
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     ).then(() => {
//       console.log('Logged out successfully');
//     }).catch((err) => {
//       console.error('Logout error:', err);
//     });

//     localStorage.removeItem('token');
//     localStorage.removeItem('firstName');
//     setIsAuthenticated(false);
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;

//     const sanitizedResponse = DOMPurify.sanitize(response, { USE_PROFILES: { html: true } });

//     if (sanitizedResponse.includes('```')) {
//       const parts = sanitizedResponse.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
//       });
//     }

//     const tempRegex = /°[CF]|\btemperature\b/i;
//     if (tempRegex.test(sanitizedResponse)) {
//       const parts = sanitizedResponse.split(/in|is|,|\b°C\b|\b°F\b/i).map(part => part.trim());
//       const city = parts[1] || 'Unknown City';
//       const tempMatch = sanitizedResponse.match(/[-?\d]+(\.\d+)?/);
//       const tempUnit = sanitizedResponse.match(/[CF]/i)?.[0] || 'C';
//       const temperature = tempMatch ? `${tempMatch[0]}°${tempUnit}` : 'N/A';
//       const skyDetails = parts[parts.length - 1] || 'N/A';

//       return (
//         <div className="temperature-container">
//           <div className="temperature-header">Temperature of</div>
//           <div className="temperature-city">{city}</div>
//           <div className="temperature-value">{temperature}</div>
//           <div className="sky-details">{skyDetails}</div>
//         </div>
//       );
//     }

//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(sanitizedResponse)) {
//       const lines = sanitizedResponse.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               const contentParts = content.split(/<\/?strong>/);
//               let key = '';
//               let rest = content;

//               if (contentParts.length > 1) {
//                 key = contentParts[1];
//                 rest = content.replace(`<strong>${key}</strong>`, '');
//               }

//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">
//                     <strong>{key}</strong>
//                     <span dangerouslySetInnerHTML={{ __html: rest }} />
//                   </span>
//                 </div>
//               );
//             }
//             return <div key={index} dangerouslySetInnerHTML={{ __html: line }} />;
//           })}
//         </div>
//           );
//               }
          
//               return <div dangerouslySetInnerHTML={{ __html: sanitizedResponse }} />;
//             };
          
//             return (
//               <div className="chat-screen">
//                 <div className="chat-container">
//                   <div className="chat-main">
//                     {showTitle && (
//                       <div className="chat-header">
//                         <div className="theme-toggle" onClick={toggleTheme}>
//                           {theme === 'light' ? <FaMoon /> : <FaSun />}
//                         </div>
//                         <h2 className="chat-title">HUBA AI</h2>
//                         <div className="header-actions">
//                           <button onClick={handleLogout} className="logout-button" title="Logout">
//                             <FaSignOutAlt />
//                           </button>
//                         </div>
//                       </div>
//                     )}
          
//                     {showWelcome && (
//                       <div className="welcome-message">
//                         Welcome {firstName || 'User'} to HUBA AI
//                       </div>
//                     )}
          
//                     <div className="chat-content" ref={chatContentRef}>
//                       {!showWelcome && displayedMessages.map((message, index) => (
//                         <div key={index} className="chat-item">
//                           <div className="message user-message">
//                             <p>{message.question}</p>
//                           </div>
//                           {message.answer && (
//                             <div className="message ai-message">
//                               <p>{renderResponse(message.answer)}</p>
//                               {message.error && message.canRetry && (
//                                 <button
//                                   onClick={handleRetry(message.question)}
//                                   className="retry-button"
//                                   title="Retry"
//                                 >
//                                   <FaRedo />
//                                 </button>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                       {isThinking && <div className="thinking">Thinking...</div>}
//                     </div>
          
//                     <div className="chat-input-bar">
//                       <textarea
//                         placeholder="Ask anything..."
//                         value={query}
//                         onChange={(e) => setQuery(e.target.value)}
//                         onKeyPress={handleKeyPress}
//                         className="chat-input"
//                         rows="1"
//                       />
//                       <FaMicrophone
//                         className={`chat-icon ${isRecording ? 'recording' : ''}`}
//                         onClick={handleVoiceInput}
//                       />
//                       <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//                         <FaPaperPlane />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           };
          
//           function ChatBot() {
//             const [isSplash, setIsSplash] = useState(true);
//             const [isAuthenticated, setIsAuthenticated] = useState(false);
//             const [theme, setTheme] = useState(() => {
//               const savedTheme = localStorage.getItem('theme');
//               return savedTheme || 'light';
//             });
//             const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');
          
//             useEffect(() => {
//               setTimeout(() => {
//                 setIsSplash(false);
//               }, 3000);
//             }, []);
          
//             const toggleTheme = () => {
//               const newTheme = theme === 'light' ? 'dark' : 'light';
//               setTheme(newTheme);
//               localStorage.setItem('theme', newTheme);
//             };
          
//             return (
//               <div className={`app ${theme}`}>
//                 {isSplash ? (
//                   <SplashScreen onAnimationEnd={!isSplash} />
//                 ) : (
//                   <Router>
//                     <Routes>
//                       <Route
//                         path="/"
//                         element={
//                           !isAuthenticated ? (
//                             <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
//                           ) : (
//                             <Navigate to="/chat" />
//                           )
//                         }
//                       />
//                       <Route
//                         path="/chat"
//                         element={
//                           isAuthenticated ? (
//                             <ChatScreen
//                               setIsAuthenticated={setIsAuthenticated}
//                               firstName={firstName}
//                               theme={theme}
//                               toggleTheme={toggleTheme}
//                             />
//                           ) : (
//                             <Navigate to="/" />
//                           )
//                         }
//                       />
//                       <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//                     </Routes>
//                   </Router>
//                 )}
//               </div>
//             );
//           }
        
//   export default ChatBot;

///////////////////////////////////////////////////////////////////////////////
// full done with phone screen 

// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSignOutAlt, FaRedo, FaCopy, FaSun, FaMoon } from 'react-icons/fa';
// import DOMPurify from 'dompurify';
// import './App.css?v=9';

// const SplashScreen = ({ onAnimationEnd }) => {
//   const [showSlogan, setShowSlogan] = useState(false);

//   useEffect(() => {
//     const sloganTimer = setTimeout(() => {
//       setShowSlogan(true);
//     }, 200);

//     return () => clearTimeout(sloganTimer);
//   }, []);

//   return (
//     <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//       <div className="splash-content">
//         <h1 className="splash-title">HUBA AI</h1>
//         {showSlogan && <p className="splash-slogan">THINK . TALK . SOLVE</p>}
//       </div>
//     </div>
//   );
// };

// const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const dataToSend = {
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };

//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';

//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(url, isSignup ? dataToSend : { email: formData.email, password: formData.password });

//       if (isSignup && response.status === 200) {
//         setSignupSuccess(true);
//         setError('Signup successful! Please log in.');
//         return;
//       }

//       if (!isSignup && (response.status === 200 || response.status === 201)) {
//         const token = response.data.token;
//         console.log('Login response:', response.data);

//         const loginFirstName = response.data.user.fullName.split(' ')[0] || 'User';
//         localStorage.setItem('token', token);
//         localStorage.setItem('firstName', loginFirstName);

//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });

//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || loginFirstName;
//           setFirstName(firstName);
//           localStorage.setItem('firstName', firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response?.data || userError.message);
//           setFirstName(loginFirstName);
//         }

//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button" disabled={isLoading}>
//             {isLoading ? (
//               <span className="loading-text">
//                 {isSignup ? 'Creating Account' : 'Logging In'} <span className="dots">...</span>
//               </span>
//             ) : (
//               isSignup ? 'Sign Up' : 'Login'
//             )}
//           </button>
//         </form>
//         <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [displayedMessages, setDisplayedMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(false);
//   const chatContentRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(false);
//       setShowTitle(true);
//       setDisplayedMessages([]);
//     }, 3000);

//     return () => clearTimeout(welcomeTimer);
//   }, [firstName]);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [displayedMessages, isThinking]);

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;

//     if (!messageToSend.trim()) return;

//     const timestamp = new Date().toISOString();
//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false, timestamp };

//     if (!retryMessage) {
//       setDisplayedMessages((prev) => [...prev, newMessage]);
//     }

//     setIsThinking(true);

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Sending message with token:', token);

//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       console.log('API Response:', response.data);

//       setDisplayedMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;

//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };

//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);

//       if (error.response && error.response.status === 401) {
//         console.log('401 Unauthorized: Token is invalid or expired. Error details:', error.response.data);
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);

//         setDisplayedMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;

//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };

//           return updatedMessages;
//         });
//       } else {
//         setDisplayedMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;

//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };

//           return updatedMessages;
//         });
//       }
//     }

//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);

//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };

//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };

//     recognition.start();
//   };

//   const handleLogout = () => {
//     const token = localStorage.getItem('token');

//     axios.post(
//       'https://aichatbot-backend-hxs8.onrender.com/api/chat/logout',
//       {},
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     ).then(() => {
//       console.log('Logged out successfully');
//     }).catch((err) => {
//       console.error('Logout error:', err);
//     });

//     localStorage.removeItem('token');
//     localStorage.removeItem('firstName');
//     setIsAuthenticated(false);
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;

//     const sanitizedResponse = DOMPurify.sanitize(response, { USE_PROFILES: { html: true } });

//     if (sanitizedResponse.includes('```')) {
//       const parts = sanitizedResponse.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
//       });
//     }

//     const tempRegex = /°[CF]|\btemperature\b/i;
//     if (tempRegex.test(sanitizedResponse)) {
//       const parts = sanitizedResponse.split(/in|is|,|\b°C\b|\b°F\b/i).map(part => part.trim());
//       const city = parts[1] || 'Unknown City';
//       const tempMatch = sanitizedResponse.match(/[-?\d]+(\.\d+)?/);
//       const tempUnit = sanitizedResponse.match(/[CF]/i)?.[0] || 'C';
//       const temperature = tempMatch ? `${tempMatch[0]}°${tempUnit}` : 'N/A';
//       const skyDetails = parts[parts.length - 1] || 'N/A';

//       return (
//         <div className="temperature-container">
//           <div className="temperature-header">Temperature of</div>
//           <div className="temperature-city">{city}</div>
//           <div className="temperature-value">{temperature}</div>
//           <div className="sky-details">{skyDetails}</div>
//         </div>
//       );
//     }

//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(sanitizedResponse)) {
//       const lines = sanitizedResponse.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               const contentParts = content.split(/<\/?strong>/);
//               let key = '';
//               let rest = content;

//               if (contentParts.length > 1) {
//                 key = contentParts[1];
//                 rest = content.replace(`<strong>${key}</strong>`, '');
//               }

//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">
//                     <strong>{key}</strong>
//                     <span dangerouslySetInnerHTML={{ __html: rest }} />
//                   </span>
//                 </div>
//               );
//             }
//             return <div key={index} dangerouslySetInnerHTML={{ __html: line }} />;
//           })}
//         </div>
//       );
//     }

//     return <div dangerouslySetInnerHTML={{ __html: sanitizedResponse }} />;
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         <div className="chat-main">
//           {showTitle && (
//             <div className="chat-header">
//               <div className="theme-toggle" onClick={toggleTheme}>
//                 {theme === 'light' ? <FaMoon /> : <FaSun />}
//               </div>
//               <h2 className="chat-title">HUBA AI</h2>
//               <div className="header-actions">
//                 <button onClick={handleLogout} className="logout-button" title="Logout">
//                   <FaSignOutAlt />
//                 </button>
//               </div>
//             </div>
//           )}

//           {showWelcome && (
//             <div className="welcome-message">
//               Welcome {firstName || 'User'} to HUBA AI
//             </div>
//           )}

//           <div className="chat-content" ref={chatContentRef}>
//             {!showWelcome && displayedMessages.map((message, index) => (
//               <div key={index} className="chat-item">
//                 <div className="message user-message">
//                   <p>{message.question}</p>
//                 </div>
//                 {message.answer && (
//                   <div className="message ai-message">
//                     <p>{renderResponse(message.answer)}</p>
//                     {message.error && message.canRetry && (
//                       <button
//                         onClick={handleRetry(message.question)}
//                         className="retry-button"
//                         title="Retry"
//                       >
//                         <FaRedo />
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//             {isThinking && <div className="thinking">Thinking...</div>}
//           </div>

//           <div className="chat-input-bar">
//             <textarea
//               placeholder="Ask anything..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="chat-input"
//               rows="1"
//             />
//             <FaMicrophone
//               className={`chat-icon ${isRecording ? 'recording' : ''}`}
//               onClick={handleVoiceInput}
//             />
//             <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//               <FaPaperPlane />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme || 'light';
//   });
//   const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');

//   useEffect(() => {
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 3000);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 !isAuthenticated ? (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
//                 ) : (
//                   <Navigate to="/chat" />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     firstName={firstName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }

// export default ChatBot;
//////////////////////////////////////////


//perfect
//perfect for phone and screen

// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSignOutAlt, FaRedo, FaCopy, FaSun, FaMoon } from 'react-icons/fa';
// import DOMPurify from 'dompurify';
// import './App.css';

// const SplashScreen = ({ onAnimationEnd }) => {
//   const [showSlogan, setShowSlogan] = useState(false);
//   useEffect(() => {
//     const sloganTimer = setTimeout(() => {
//       setShowSlogan(true);
//     }, 200);
//     return () => clearTimeout(sloganTimer);
//   }, []);
//   return (
//     <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//       <div className="splash-content">
//         <h1 className="splash-title">HUBA AI</h1>
//         {showSlogan && <p className="splash-slogan">THINK . TALK . SOLVE</p>}
//       </div>
//     </div>
//   );
// };

// const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const dataToSend = {
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };
//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';
//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(url, isSignup ? dataToSend : { email: formData.email, password: formData.password });
//       if (isSignup && response.status === 200) {
//         setSignupSuccess(true);
//         setError('Signup successful! Please log in.');
//         return;
//       }
//       if (!isSignup && (response.status === 200 || response.status === 201)) {
//         const token = response.data.token;
//         console.log('Login response:', response.data);
//         const loginFirstName = response.data.user.fullName.split(' ')[0] || 'User';
//         localStorage.setItem('token', token);
//         localStorage.setItem('firstName', loginFirstName);
//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });
//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || loginFirstName;
//           setFirstName(firstName);
//           localStorage.setItem('firstName', firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response?.data || userError.message);
//           setFirstName(loginFirstName);
//         }
//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button" disabled={isLoading}>
//             {isLoading ? (
//               <span className="loading-text">
//                 {isSignup ? 'Creating Account' : 'Logging In'} <span className="dots">...</span>
//               </span>
//             ) : (
//               isSignup ? 'Sign Up' : 'Login'
//             )}
//           </button>
//         </form>
//         <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [displayedMessages, setDisplayedMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(false);
//   const chatContentRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(false);
//       setShowTitle(true);
//       setDisplayedMessages([]);
//     }, 3000);
//     return () => clearTimeout(welcomeTimer);
//   }, [firstName]);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [displayedMessages, isThinking]);

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;
//     if (!messageToSend.trim()) return;
//     const timestamp = new Date().toISOString();
//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false, timestamp };
//     if (!retryMessage) {
//       setDisplayedMessages((prev) => [...prev, newMessage]);
//     }
//     setIsThinking(true);
//     try {
//       const token = localStorage.getItem('token');
//       console.log('Sending message with token:', token);
//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('API Response:', response.data);
//       setDisplayedMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;
//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         console.log('401 Unauthorized: Token is invalid or expired. Error details:', error.response.data);
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         setDisplayedMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };
//           return updatedMessages;
//         });
//       } else {
//         setDisplayedMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedMessages;
//         });
//       }
//     }
//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }
//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;
//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };
//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };
//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);
//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };
//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };
//     recognition.start();
//   };

//   const handleLogout = () => {
//     const token = localStorage.getItem('token');
//     axios.post(
//       'https://aichatbot-backend-hxs8.onrender.com/api/chat/logout',
//       {},
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     ).then(() => {
//       console.log('Logged out successfully');
//     }).catch((err) => {
//       console.error('Logout error:', err);
//     });
//     localStorage.removeItem('token');
//     localStorage.removeItem('firstName');
//     setIsAuthenticated(false);
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;
//     const sanitizedResponse = DOMPurify.sanitize(response, { USE_PROFILES: { html: true } });
//     if (sanitizedResponse.includes('```')) {
//       const parts = sanitizedResponse.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
//       });
//     }
//     const tempRegex = /°[CF]|\btemperature\b/i;
//     if (tempRegex.test(sanitizedResponse)) {
//       const parts = sanitizedResponse.split(/in|is|,|\b°C\b|\b°F\b/i).map(part => part.trim());
//       const city = parts[1] || 'Unknown City';
//       const tempMatch = sanitizedResponse.match(/[-?\d]+(\.\d+)?/);
//       const tempUnit = sanitizedResponse.match(/[CF]/i)?.[0] || 'C';
//       const temperature = tempMatch ? `${tempMatch[0]}°${tempUnit}` : 'N/A';
//       const skyDetails = parts[parts.length - 1] || 'N/A';
//       return (
//         <div className="temperature-container">
//           <div className="temperature-header">Temperature of</div>
//           <div className="temperature-city">{city}</div>
//           <div className="temperature-value">{temperature}</div>
//           <div className="sky-details">{skyDetails}</div>
//         </div>
//       );
//     }
//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(sanitizedResponse)) {
//       const lines = sanitizedResponse.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               const contentParts = content.split(/<\/?strong>/);
//               let key = '';
//               let rest = content;
//               if (contentParts.length > 1) {
//                 key = contentParts[1];
//                 rest = content.replace(`<strong>${key}</strong>`, '');
//               }
//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">
//                     <strong>{key}</strong>
//                     <span dangerouslySetInnerHTML={{ __html: rest }} />
//                   </span>
//                 </div>
//               );
//             }
//             return <div key={index} dangerouslySetInnerHTML={{ __html: line }} />;
//           })}
//         </div>
//       );
//     }
//     return <div dangerouslySetInnerHTML={{ __html: sanitizedResponse }} />;
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         <div className="chat-main">
//           {showTitle && (
//             <div className="chat-header">
//               <div className="theme-toggle" onClick={toggleTheme}>
//                 {theme === 'light' ? <FaMoon /> : <FaSun />}
//               </div>
//               <h2 className="chat-title">HUBA AI</h2>
//               <div className="header-actions">
//                 <button onClick={handleLogout} className="logout-button" title="Logout">
//                   <FaSignOutAlt />
//                 </button>
//               </div>
//             </div>
//           )}
//           {showWelcome && (
//             <div className="welcome-message">
//               Welcome {firstName || 'User'} to HUBA AI
//             </div>
//           )}
//           <div className="chat-content" ref={chatContentRef}>
//             {!showWelcome && displayedMessages.map((message, index) => (
//               <div key={index} className="chat-item">
//                 <div className="message user-message">
//                   <p>{message.question}</p>
//                 </div>
//                 {message.answer && (
//                   <div className="message ai-message">
//                     <p>{renderResponse(message.answer)}</p>
//                     {message.error && message.canRetry && (
//                       <button
//                         onClick={handleRetry(message.question)}
//                         className="retry-button"
//                         title="Retry"
//                       >
//                         <FaRedo />
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//             {isThinking && <div className="thinking">Thinking...</div>}
//           </div>
//           <div className="chat-input-bar">
//             <textarea
//               placeholder="Ask anything..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="chat-input"
//               rows="1"
//             />
//             <FaMicrophone
//               className={`chat-icon ${isRecording ? 'recording' : ''}`}
//               onClick={handleVoiceInput}
//             />
//             <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//               <FaPaperPlane />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme || 'light';
//   });
//   const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');

//   useEffect(() => {
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 3000);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 !isAuthenticated ? (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
//                 ) : (
//                   <Navigate to="/chat" />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     firstName={firstName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }

// export default ChatBot;
//////////////////////////////////////////
// time added 
// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSignOutAlt, FaRedo, FaCopy, FaSun, FaMoon } from 'react-icons/fa';
// import DOMPurify from 'dompurify';
// import './App.css';

// const SplashScreen = ({ onAnimationEnd }) => {
//   const [showSlogan, setShowSlogan] = useState(false);
//   useEffect(() => {
//     const sloganTimer = setTimeout(() => {
//       setShowSlogan(true);
//     }, 200);
//     return () => clearTimeout(sloganTimer);
//   }, []);
//   return (
//     <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//       <div className="splash-content">
//         <h1 className="splash-title">HUBA AI</h1>
//         {showSlogan && <p className="splash-slogan">THINK . TALK . SOLVE</p>}
//       </div>
//     </div>
//   );
// };

// const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const dataToSend = {
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };
//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';
//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(url, isSignup ? dataToSend : { email: formData.email, password: formData.password });
//       if (isSignup && response.status === 200) {
//         setSignupSuccess(true);
//         setError('Signup successful! Please log in.');
//         return;
//       }
//       if (!isSignup && (response.status === 200 || response.status === 201)) {
//         const token = response.data.token;
//         console.log('Login response:', response.data);
//         const loginFirstName = response.data.user.fullName.split(' ')[0] || 'User';
//         localStorage.setItem('token', token);
//         localStorage.setItem('firstName', loginFirstName);
//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });
//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || loginFirstName;
//           setFirstName(firstName);
//           localStorage.setItem('firstName', firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response?.data || userError.message);
//           setFirstName(loginFirstName);
//         }
//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button" disabled={isLoading}>
//             {isLoading ? (
//               <span className="loading-text">
//                 {isSignup ? 'Creating Account' : 'Logging In'} <span className="dots">...</span>
//               </span>
//             ) : (
//               isSignup ? 'Sign Up' : 'Login'
//             )}
//           </button>
//         </form>
//         <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [displayedMessages, setDisplayedMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(false);
//   const chatContentRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(false);
//       setShowTitle(true);
//       setDisplayedMessages([]);
//     }, 3000);
//     return () => clearTimeout(welcomeTimer);
//   }, [firstName]);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [displayedMessages, isThinking]);

//   const getLocalTimeAndDate = () => {
//     const now = new Date();
//     const options = {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       timeZoneName: 'short',
//     };
//     return now.toLocaleString(undefined, options);
//   };

//   const handleTimeOrDateQuery = (question) => {
//     const lowerCaseQuestion = question.toLowerCase();
//     if (lowerCaseQuestion.includes('time')) {
//       const now = new Date();
//       const time = now.toLocaleTimeString();
//       const day = now.toLocaleDateString(undefined, { weekday: 'long' });
//       const date = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
//       const response = `Current Time: ${time}, Day: ${day}, Date: ${date}`;
//       const timestamp = new Date().toISOString();
//       const newMessage = { question, answer: response, error: false, canRetry: false, timestamp };
//       setDisplayedMessages((prev) => [...prev, newMessage]);
//       setIsThinking(false);
//       setQuery('');
//       return true;
//     } else if (lowerCaseQuestion.includes('date')) {
//       const now = new Date();
//       const date = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
//       const day = now.toLocaleDateString(undefined, { weekday: 'long' });
//       const time = now.toLocaleTimeString();
//       const response = `Current Date: ${date}, Day: ${day}, Time: ${time}`;
//       const timestamp = new Date().toISOString();
//       const newMessage = { question, answer: response, error: false, canRetry: false, timestamp };
//       setDisplayedMessages((prev) => [...prev, newMessage]);
//       setIsThinking(false);
//       setQuery('');
//       return true;
//     }
//     return false;
//   };

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;
//     if (!messageToSend.trim()) return;

//     // Handle time or date queries locally
//     if (handleTimeOrDateQuery(messageToSend)) return;

//     const timestamp = new Date().toISOString();
//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false, timestamp };
//     if (!retryMessage) {
//       setDisplayedMessages((prev) => [...prev, newMessage]);
//     }
//     setIsThinking(true);
//     try {
//       const token = localStorage.getItem('token');
//       console.log('Sending message with token:', token);
//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('API Response:', response.data);
//       setDisplayedMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;
//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         console.log('401 Unauthorized: Token is invalid or expired. Error details:', error.response.data);
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         setDisplayedMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };
//           return updatedMessages;
//         });
//       } else {
//         setDisplayedMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedMessages;
//         });
//       }
//     }
//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }
//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;
//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };
//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };
//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);
//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };
//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };
//     recognition.start();
//   };

//   const handleLogout = () => {
//     const token = localStorage.getItem('token');
//     axios.post(
//       'https://aichatbot-backend-hxs8.onrender.com/api/chat/logout',
//       {},
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     ).then(() => {
//       console.log('Logged out successfully');
//     }).catch((err) => {
//       console.error('Logout error:', err);
//     });
//     localStorage.removeItem('token');
//     localStorage.removeItem('firstName');
//     setIsAuthenticated(false);
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;
//     const sanitizedResponse = DOMPurify.sanitize(response, { USE_PROFILES: { html: true } });
//     if (sanitizedResponse.includes('```')) {
//       const parts = sanitizedResponse.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
//       });
//     }
//     const tempRegex = /°[CF]|\btemperature\b/i;
//     if (tempRegex.test(sanitizedResponse)) {
//       const parts = sanitizedResponse.split(/in|is|,|\b°C\b|\b°F\b/i).map(part => part.trim());
//       const city = parts[1] || 'Unknown City';
//       const tempMatch = sanitizedResponse.match(/[-?\d]+(\.\d+)?/);
//       const tempUnit = sanitizedResponse.match(/[CF]/i)?.[0] || 'C';
//       const temperature = tempMatch ? `${tempMatch[0]}°${tempUnit}` : 'N/A';
//       const skyDetails = parts[parts.length - 1] || 'N/A';
//       return (
//         <div className="temperature-container">
//           <div className="temperature-header">Temperature of</div>
//           <div className="temperature-city">{city}</div>
//           <div className="temperature-value">{temperature}</div>
//           <div className="sky-details">{skyDetails}</div>
//         </div>
//       );
//     }
//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(sanitizedResponse)) {
//       const lines = sanitizedResponse.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               const contentParts = content.split(/<\/?strong>/);
//               let key = '';
//               let rest = content;
//               if (contentParts.length > 1) {
//                 key = contentParts[1];
//                 rest = content.replace(`<strong>${key}</strong>`, '');
//               }
//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">
//                     <strong>{key}</strong>
//                     <span dangerouslySetInnerHTML={{ __html: rest }} />
//                   </span>
//                 </div>
//               );
//             }
//             return <div key={index} dangerouslySetInnerHTML={{ __html: line }} />;
//           })}
//         </div>
//       );
//     }
//     return <div dangerouslySetInnerHTML={{ __html: sanitizedResponse }} />;
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         <div className="chat-main">
//           {showTitle && (
//             <div className="chat-header">
//               <div className="theme-toggle" onClick={toggleTheme}>
//                 {theme === 'light' ? <FaMoon /> : <FaSun />}
//               </div>
//               <h2 className="chat-title">HUBA AI</h2>
//               <div className="header-actions">
//                 <button onClick={handleLogout} className="logout-button" title="Logout">
//                   <FaSignOutAlt />
//                 </button>
//               </div>
//             </div>
//           )}
//           {showWelcome && (
//             <div className="welcome-message">
//               Welcome {firstName || 'User'} to HUBA AI
//             </div>
//           )}
//           <div className="chat-content" ref={chatContentRef}>
//             {!showWelcome && displayedMessages.map((message, index) => (
//               <div key={index} className="chat-item">
//                 <div className="message user-message">
//                   <p>{message.question}</p>
//                 </div>
//                 {message.answer && (
//                   <div className="message ai-message">
//                     <p>{renderResponse(message.answer)}</p>
//                     {message.error && message.canRetry && (
//                       <button
//                         onClick={handleRetry(message.question)}
//                         className="retry-button"
//                         title="Retry"
//                       >
//                         <FaRedo />
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//             {isThinking && <div className="thinking">Thinking...</div>}
//           </div>
//           <div className="chat-input-bar">
//             <textarea
//               placeholder="Ask anything..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="chat-input"
//               rows="1"
//             />
//             <FaMicrophone
//               className={`chat-icon ${isRecording ? 'recording' : ''}`}
//               onClick={handleVoiceInput}
//             />
//             <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//               <FaPaperPlane />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme || 'light';
//   });
//   const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');

//   useEffect(() => {
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 3000);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 !isAuthenticated ? (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
//                 ) : (
//                   <Navigate to="/chat" />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     firstName={firstName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }

// export default ChatBot;

// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSignOutAlt, FaRedo, FaCopy, FaSun, FaMoon } from 'react-icons/fa';
// import DOMPurify from 'dompurify';
// import './App.css';

// const SplashScreen = ({ onAnimationEnd }) => {
//   const [showSlogan, setShowSlogan] = useState(false);
//   useEffect(() => {
//     const sloganTimer = setTimeout(() => {
//       setShowSlogan(true);
//     }, 200);
//     return () => clearTimeout(sloganTimer);
//   }, []);
//   return (
//     <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//       <div className="splash-content">
//         <h1 className="splash-title">HUBA AI</h1>
//         {showSlogan && <p className="splash-slogan">THINK . TALK . SOLVE</p>}
//       </div>
//     </div>
//   );
// };

// const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const dataToSend = {
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };
//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';
//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(url, isSignup ? dataToSend : { email: formData.email, password: formData.password });
//       if (isSignup && response.status === 200) {
//         setSignupSuccess(true);
//         setError('Signup successful! Please log in.');
//         setFormData({ fullName: '', email: '', password: '' });
//         return;
//       }
//       if (!isSignup && (response.status === 200 || response.status === 201)) {
//         const token = response.data.token;
//         console.log('Login response:', response.data);
//         const loginFirstName = response.data.user.fullName.split(' ')[0] || 'User';
//         localStorage.setItem('token', token);
//         localStorage.setItem('firstName', loginFirstName);
//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });
//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || loginFirstName;
//           setFirstName(firstName);
//           localStorage.setItem('firstName', firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response?.data || userError.message);
//           setFirstName(loginFirstName);
//         }
//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button" disabled={isLoading}>
//             {isLoading ? (
//               <span className="loading-text">
//                 {isSignup ? 'Creating Account' : 'Logging In'} <span className="dots">...</span>
//               </span>
//             ) : (
//               isSignup ? 'Sign Up' : 'Login'
//             )}
//           </button>
//         </form>
//         <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [displayedMessages, setDisplayedMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(true);
//   const chatContentRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     // Show welcome message briefly but allow immediate interaction
//     setShowWelcome(true);
//     setShowTitle(true);
//   }, [firstName]);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [displayedMessages, isThinking]);

//   const getLocalTimeAndDate = () => {
//     const now = new Date();
//     const options = {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       timeZoneName: 'short',
//     };
//     return now.toLocaleString(undefined, options);
//   };

//   const handleTimeOrDateQuery = (question) => {
//     const lowerCaseQuestion = question.toLowerCase().trim();
//     const predefinedQuestions = {
//       "what is today's date": () => {
//         const now = new Date();
//         const date = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
//         return `Today's date is ${date}.`;
//       },
//       "what is date today": () => {
//         const now = new Date();
//         const date = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
//         return `Today's date is ${date}.`;
//       },
//       "what is now time": () => {
//         const now = new Date();
//         const time = now.toLocaleTimeString();
//         return `The current time is ${time}.`;
//       },
//       "what is current time": () => {
//         const now = new Date();
//         const time = now.toLocaleTimeString();
//         return `The current time is ${time}.`;
//       },
//     };

//     if (predefinedQuestions[lowerCaseQuestion]) {
//       const response = predefinedQuestions[lowerCaseQuestion]();
//       const timestamp = new Date().toISOString();
//       const newMessage = { question, answer: response, error: false, canRetry: false, timestamp };
//       setDisplayedMessages((prev) => [...prev, newMessage]);
//       setIsThinking(false);
//       setQuery('');
//       return true;
//     }

//     // If the question contains "time" or "date" but doesn't match predefined questions, let the backend handle it
//     if (lowerCaseQuestion.includes('time') || lowerCaseQuestion.includes('date')) {
//       return false;
//     }

//     return false;
//   };

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;
//     if (!messageToSend.trim()) return;

//     // Handle predefined time or date queries locally
//     if (handleTimeOrDateQuery(messageToSend)) return;

//     const timestamp = new Date().toISOString();
//     const newMessage = { question: messageToSend, answer: null, error: false, canRetry: false, timestamp };
//     if (!retryMessage) {
//       setDisplayedMessages((prev) => [...prev, newMessage]);
//     }
//     setIsThinking(true);
//     try {
//       const token = localStorage.getItem('token');
//       console.log('Sending message with token:', token);
//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         { question: messageToSend },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('API Response:', response.data);
//       setDisplayedMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;
//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         console.log('401 Unauthorized: Token is invalid or expired. Error details:', error.response.data);
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         setDisplayedMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };
//           return updatedMessages;
//         });
//       } else {
//         setDisplayedMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedMessages;
//         });
//       }
//     }
//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }
//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;
//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };
//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };
//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);
//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };
//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };
//     recognition.start();
//   };

//   const handleLogout = () => {
//     const token = localStorage.getItem('token');
//     axios.post(
//       'https://aichatbot-backend-hxs8.onrender.com/api/chat/logout',
//       {},
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     ).then(() => {
//       console.log('Logged out successfully');
//     }).catch((err) => {
//       console.error('Logout error:', err);
//     });
//     localStorage.removeItem('token');
//     localStorage.removeItem('firstName');
//     setIsAuthenticated(false);
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const renderResponse = (response) => {
//     if (!response) return null;
//     const sanitizedResponse = DOMPurify.sanitize(response, { USE_PROFILES: { html: true } });
//     if (sanitizedResponse.includes('```')) {
//       const parts = sanitizedResponse.split('```');
//       return parts.map((part, index) => {
//         if (index % 2 === 1) {
//           return (
//             <div key={index} className="code-block">
//               <button
//                 className="copy-button"
//                 onClick={() => handleCopy(part, index)}
//                 title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//               >
//                 {copiedStates[index] ? 'Copied!' : <FaCopy />}
//               </button>
//               <pre>{part}</pre>
//             </div>
//           );
//         }
//         return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
//       });
//     }
//     const tempRegex = /°[CF]|\btemperature\b/i;
//     if (tempRegex.test(sanitizedResponse)) {
//       const parts = sanitizedResponse.split(/in|is|,|\b°C\b|\b°F\b/i).map(part => part.trim());
//       const city = parts[1] || 'Unknown City';
//       const tempMatch = sanitizedResponse.match(/[-?\d]+(\.\d+)?/);
//       const tempUnit = sanitizedResponse.match(/[CF]/i)?.[0] || 'C';
//       const temperature = tempMatch ? `${tempMatch[0]}°${tempUnit}` : 'N/A';
//       const skyDetails = parts[parts.length - 1] || 'N/A';
//       return (
//         <div className="temperature-container">
//           <div className="temperature-header">Temperature of</div>
//           <div className="temperature-city">{city}</div>
//           <div className="temperature-value">{temperature}</div>
//           <div className="sky-details">{skyDetails}</div>
//         </div>
//       );
//     }
//     const listRegex = /(\d+\.\s|[*-]\s)/;
//     if (listRegex.test(sanitizedResponse)) {
//       const lines = sanitizedResponse.split('\n');
//       return (
//         <div className="options-block">
//           {lines.map((line, index) => {
//             const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//             if (match) {
//               const [, prefix, content] = match;
//               const contentParts = content.split(/<\/?strong>/);
//               let key = '';
//               let rest = content;
//               if (contentParts.length > 1) {
//                 key = contentParts[1];
//                 rest = content.replace(`<strong>${key}</strong>`, '');
//               }
//               return (
//                 <div key={index} className="option-item">
//                   <span className="option-key">{prefix}</span>
//                   <span className="option-content">
//                     <strong>{key}</strong>
//                     <span dangerouslySetInnerHTML={{ __html: rest }} />
//                   </span>
//                 </div>
//               );
//             }
//             return <div key={index} dangerouslySetInnerHTML={{ __html: line }} />;
//           })}
//         </div>
//       );
//     }
//     return <div dangerouslySetInnerHTML={{ __html: sanitizedResponse }} />;
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         <div className="chat-main">
//           {showTitle && (
//             <div className="chat-header">
//               <div className="theme-toggle" onClick={toggleTheme}>
//                 {theme === 'light' ? <FaMoon /> : <FaSun />}
//               </div>
//               <h2 className="chat-title">HUBA AI</h2>
//               <div className="header-actions">
//                 <button onClick={handleLogout} className="logout-button" title="Logout">
//                   <FaSignOutAlt />
//                 </button>
//               </div>
//             </div>
//           )}
//           {showWelcome && (
//             <div className="welcome-message">
//               Welcome {firstName || 'User'} to HUBA AI
//             </div>
//           )}
//           <div className="chat-content" ref={chatContentRef}>
//             {!showWelcome && displayedMessages.length === 0 && (
//               <div className="welcome-message">Start by asking a question!</div>
//             )}
//             {displayedMessages.map((message, index) => (
//               <div key={index} className="chat-item">
//                 <div className="message user-message">
//                   <p>{message.question}</p>
//                 </div>
//                 {message.answer && (
//                   <div className="message ai-message">
//                     <p>{renderResponse(message.answer)}</p>
//                     {message.error && message.canRetry && (
//                       <button
//                         onClick={handleRetry(message.question)}
//                         className="retry-button"
//                         title="Retry"
//                       >
//                         <FaRedo />
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//             {isThinking && <div className="thinking">Thinking...</div>}
//           </div>
//           <div className="chat-input-bar">
//             <textarea
//               placeholder="Ask anything..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="chat-input"
//               rows="1"
//             />
//             <FaMicrophone
//               className={`chat-icon ${isRecording ? 'recording' : ''}`}
//               onClick={handleVoiceInput}
//             />
//             <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//               <FaPaperPlane />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme || 'light';
//   });
//   const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');

//   useEffect(() => {
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 3000);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 !isAuthenticated ? (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
//                 ) : (
//                   <Navigate to="/chat" />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     firstName={firstName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }

// export default ChatBot;

// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMicrophone, FaPaperPlane, FaSignOutAlt, FaRedo, FaCopy, FaSun, FaMoon, FaCamera } from 'react-icons/fa';
// import DOMPurify from 'dompurify';
// import './App.css';

// const SplashScreen = ({ onAnimationEnd }) => {
//   const [showSlogan, setShowSlogan] = useState(false);
//   useEffect(() => {
//     const sloganTimer = setTimeout(() => {
//       setShowSlogan(true);
//     }, 200);
//     return () => clearTimeout(sloganTimer);
//   }, []);
//   return (
//     <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
//       <div className="splash-content">
//         <h1 className="splash-title">HUBA AI</h1>
//         {showSlogan && <p className="splash-slogan">THINK . TALK . SOLVE</p>}
//       </div>
//     </div>
//   );
// };

// const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const dataToSend = {
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password,
//     };
//     const url = isSignup
//       ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
//       : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';
//     try {
//       console.log('Sending data to', url, ':', dataToSend);
//       const response = await axios.post(url, isSignup ? dataToSend : { email: formData.email, password: formData.password });
//       if (isSignup && response.status === 200) {
//         setSignupSuccess(true);
//         setError('Signup successful! Please log in.');
//         setFormData({ fullName: '', email: '', password: '' });
//         return;
//       }
//       if (!isSignup && (response.status === 200 || response.status === 201)) {
//         const token = response.data.token;
//         console.log('Login response:', response.data);
//         const loginFirstName = response.data.user.fullName.split(' ')[0] || 'User';
//         localStorage.setItem('token', token);
//         localStorage.setItem('firstName', loginFirstName);
//         try {
//           const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
//             headers: { 'Authorization': `Bearer ${token}` },
//           });
//           console.log('User details fetched:', userResponse.data);
//           const firstName = userResponse.data.firstName || loginFirstName;
//           setFirstName(firstName);
//           localStorage.setItem('firstName', firstName);
//         } catch (userError) {
//           console.error('Error fetching user details:', userError.response?.data || userError.message);
//           setFirstName(loginFirstName);
//         }
//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
//       console.error('Auth error:', error.response ? error.response.data : error.message);
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="auth-screen">
//       <div className="auth-card">
//         <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
//         {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {isSignup && (
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="auth-input"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="auth-input"
//           />
//           <button type="submit" className="auth-button" disabled={isLoading}>
//             {isLoading ? (
//               <span className="loading-text">
//                 {isSignup ? 'Creating Account' : 'Logging In'} <span className="dots">...</span>
//               </span>
//             ) : (
//               isSignup ? 'Sign Up' : 'Login'
//             )}
//           </button>
//         </form>
//         <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
//           {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
//         </p>
//       </div>
//     </div>
//   );
// };

// const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
//   const [query, setQuery] = useState('');
//   const [displayedMessages, setDisplayedMessages] = useState([]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTitle, setShowTitle] = useState(true);
//   const [showCameraOptions, setShowCameraOptions] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [cameraStream, setCameraStream] = useState(null);
//   const chatContentRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const videoRef = useRef(null);
//   const [copiedStates, setCopiedStates] = useState({});

//   useEffect(() => {
//     setShowWelcome(true);
//     setShowTitle(true);
//   }, [firstName]);

//   useEffect(() => {
//     if (chatContentRef.current) {
//       chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
//     }
//   }, [displayedMessages, isThinking]);

//   const getLocalTimeAndDate = () => {
//     const now = new Date();
//     const options = {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       timeZoneName: 'short',
//     };
//     return now.toLocaleString(undefined, options);
//   };

//   const handleTimeOrDateQuery = (question) => {
//     const lowerCaseQuestion = question.toLowerCase().trim();
//     const predefinedQuestions = {
//       "what is today's date": () => {
//         const now = new Date();
//         const date = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
//         return `Today's date is ${date}.`;
//       },
//       "what is date today": () => {
//         const now = new Date();
//         const date = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
//         return `Today's date is ${date}.`;
//       },
//       "what is now time": () => {
//         const now = new Date();
//         const time = now.toLocaleTimeString();
//         return `The current time is ${time}.`;
//       },
//       "what is current time": () => {
//         const now = new Date();
//         const time = now.toLocaleTimeString();
//         return `The current time is ${time}.`;
//       },
//     };

//     if (predefinedQuestions[lowerCaseQuestion]) {
//       const response = predefinedQuestions[lowerCaseQuestion]();
//       const timestamp = new Date().toISOString();
//       const newMessage = { question, answer: response, error: false, canRetry: false, timestamp };
//       setDisplayedMessages((prev) => [...prev, newMessage]);
//       setIsThinking(false);
//       setQuery('');
//       return true;
//     }

//     if (lowerCaseQuestion.includes('time') || lowerCaseQuestion.includes('date')) {
//       return false;
//     }

//     return false;
//   };

//   const handleCameraClick = () => {
//     setShowCameraOptions(!showCameraOptions);
//   };

//   const handleUploadImage = () => {
//     fileInputRef.current.click();
//     setShowCameraOptions(false);
//   };

//   const handleOpenCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       setCameraStream(stream);
//       setShowCameraOptions(false);
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     } catch (err) {
//       console.error("Error accessing camera:", err);
//       alert("Could not access the camera. Please check permissions or try uploading an image instead.");
//     }
//   };

//   const handleCapturePhoto = () => {
//     const canvas = document.createElement('canvas');
//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//     canvas.toBlob((blob) => {
//       const file = new File([blob], "captured-photo.jpg", { type: "image/jpeg" });
//       setSelectedImage(file);
//       stopCamera();
//     }, "image/jpeg");
//   };

//   const stopCamera = () => {
//     if (cameraStream) {
//       cameraStream.getTracks().forEach(track => track.stop());
//       setCameraStream(null);
//     }
//   };

//   const handleImageSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedImage(file);
//     }
//   };

//   const handleSubmit = async (e, retryMessage = null) => {
//     e.preventDefault();
//     const messageToSend = retryMessage || query;
//     if (!messageToSend.trim() && !selectedImage) return;

//     if (handleTimeOrDateQuery(messageToSend)) return;

//     const timestamp = new Date().toISOString();
//     const newMessage = { question: messageToSend, image: selectedImage ? URL.createObjectURL(selectedImage) : null, answer: null, error: false, canRetry: false, timestamp };
//     if (!retryMessage) {
//       setDisplayedMessages((prev) => [...prev, newMessage]);
//     }
//     setIsThinking(true);
//     try {
//       const token = localStorage.getItem('token');
//       const formData = new FormData();
//       formData.append('question', messageToSend);
//       if (selectedImage) {
//         formData.append('image', selectedImage);
//       }

//       const response = await axios.post(
//         'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
//         formData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );
//       console.log('API Response:', response.data);
//       setDisplayedMessages((prev) => {
//         const updatedMessages = [...prev];
//         const messageIndex = retryMessage
//           ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//           : updatedMessages.length - 1;
//         updatedMessages[messageIndex] = {
//           ...updatedMessages[messageIndex],
//           answer: response.data.response || 'No response data',
//           error: false,
//           canRetry: false,
//         };
//         return updatedMessages;
//       });
//     } catch (error) {
//       console.error('Chat Error:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         setDisplayedMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Your session has expired. Please log in again.',
//             error: true,
//             canRetry: false,
//           };
//           return updatedMessages;
//         });
//       } else {
//         setDisplayedMessages((prev) => {
//           const updatedMessages = [...prev];
//           const messageIndex = retryMessage
//             ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
//             : updatedMessages.length - 1;
//           updatedMessages[messageIndex] = {
//             ...updatedMessages[messageIndex],
//             answer: 'Sorry, something went wrong. Please try again.',
//             error: true,
//             canRetry: true,
//           };
//           return updatedMessages;
//         });
//       }
//     }
//     setIsThinking(false);
//     if (!retryMessage) {
//       setQuery('');
//       setSelectedImage(null);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech Recognition API is not supported in this browser. Please use a modern browser like Chrome.');
//       return;
//     }
//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;
//     recognition.onstart = () => {
//       console.log('Voice recognition started. Speak now.');
//       setIsRecording(true);
//     };
//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log('Voice Input:', transcript);
//       setQuery(transcript);
//     };
//     recognition.onerror = (event) => {
//       console.error('Voice Recognition Error:', event.error);
//       if (event.error === 'no-speech') {
//         alert('No speech detected. Please try again.');
//       } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
//       } else {
//         alert('An error occurred during voice recognition: ' + event.error);
//       }
//     };
//     recognition.onend = () => {
//       console.log('Voice recognition ended.');
//       setIsRecording(false);
//     };
//     recognition.start();
//   };

//   const handleLogout = () => {
//     const token = localStorage.getItem('token');
//     axios.post(
//       'https://aichatbot-backend-hxs8.onrender.com/api/chat/logout',
//       {},
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     ).then(() => {
//       console.log('Logged out successfully');
//     }).catch((err) => {
//       console.error('Logout error:', err);
//     });
//     localStorage.removeItem('token');
//     localStorage.removeItem('firstName');
//     setIsAuthenticated(false);
//   };

//   const handleRetry = (message) => (e) => {
//     handleSubmit(e, message);
//   };

//   const handleCopy = (code, index) => {
//     navigator.clipboard.writeText(code).then(() => {
//       setCopiedStates((prev) => ({ ...prev, [index]: true }));
//       setTimeout(() => {
//         setCopiedStates((prev) => ({ ...prev, [index]: false }));
//       }, 2000);
//     }).catch((err) => {
//       console.error('Failed to copy code:', err);
//       alert('Failed to copy code. Please copy it manually.');
//     });
//   };

//   const renderResponse = (response, message) => {
//     const parts = [];
//     let remainingContent = response;

//     const codeBlockRegex = /```(\w+)?\n([\s\S]*?)\n```/g;
//     const imageRegex = /\/uploads\/[^\s]+/g;

//     let codeMatch;
//     let lastIndex = 0;

//     while ((codeMatch = codeBlockRegex.exec(response)) !== null) {
//       const beforeCode = response.slice(lastIndex, codeMatch.index);
//       const imageMatches = [...beforeCode.matchAll(imageRegex)];

//       let subIndex = 0;
//       for (const imageMatch of imageMatches) {
//         const textBeforeImage = beforeCode.slice(subIndex, imageMatch.index);
//         if (textBeforeImage) {
//           parts.push({ type: "text", value: textBeforeImage });
//         }
//         parts.push({ type: "image", value: imageMatch[0] });
//         subIndex = imageMatch.index + imageMatch[0].length;
//       }
//       const remainingText = beforeCode.slice(subIndex);
//       if (remainingText) {
//         parts.push({ type: "text", value: remainingText });
//       }

//       parts.push({
//         type: "code",
//         language: codeMatch[1] || "text",
//         value: codeMatch[2],
//       });
//       lastIndex = codeMatch.index + codeMatch[0].length;
//     }

//     remainingContent = response.slice(lastIndex);
//     const imageMatches = [...remainingContent.matchAll(imageRegex)];
//     let subIndex = 0;
//     for (const imageMatch of imageMatches) {
//       const textBeforeImage = remainingContent.slice(subIndex, imageMatch.index);
//       if (textBeforeImage) {
//         parts.push({ type: "text", value: textBeforeImage });
//       }
//       parts.push({ type: "image", value: imageMatch[0] });
//       subIndex = imageMatch.index + imageMatch[0].length;
//     }
//     const finalText = remainingContent.slice(subIndex);
//     if (finalText) {
//       parts.push({ type: "text", value: finalText });
//     }

//     if (message.image && !imageMatches.length) {
//       parts.push({ type: "image", value: message.image });
//     }

//     const tempRegex = /°[CF]|\btemperature\b/i;
//     const listRegex = /(\d+\.\s|[*-]\s)/;

//     return (
//       <div className="message-content">
//         {parts.map((part, index) => {
//           if (part.type === "text") {
//             const sanitizedText = DOMPurify.sanitize(part.value, { USE_PROFILES: { html: true } });
//             if (tempRegex.test(sanitizedText)) {
//               const parts = sanitizedText.split(/in|is|,|\b°C\b|\b°F\b/i).map(part => part.trim());
//               const city = parts[1] || 'Unknown City';
//               const tempMatch = sanitizedText.match(/[-?\d]+(\.\d+)?/);
//               const tempUnit = sanitizedText.match(/[CF]/i)?.[0] || 'C';
//               const temperature = tempMatch ? `${tempMatch[0]}°${tempUnit}` : 'N/A';
//               const skyDetails = parts[parts.length - 1] || 'N/A';
//               return (
//                 <div key={index} className="temperature-container">
//                   <div className="temperature-header">Temperature of</div>
//                   <div className="temperature-city">{city}</div>
//                   <div className="temperature-value">{temperature}</div>
//                   <div className="sky-details">{skyDetails}</div>
//                 </div>
//               );
//             }
//             if (listRegex.test(sanitizedText)) {
//               const lines = sanitizedText.split('\n');
//               return (
//                 <div key={index} className="options-block">
//                   {lines.map((line, lineIndex) => {
//                     const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
//                     if (match) {
//                       const [, prefix, content] = match;
//                       const contentParts = content.split(/<\/?strong>/);
//                       let key = '';
//                       let rest = content;
//                       if (contentParts.length > 1) {
//                         key = contentParts[1];
//                         rest = content.replace(`<strong>${key}</strong>`, '');
//                       }
//                       return (
//                         <div key={lineIndex} className="option-item">
//                           <span className="option-key">{prefix}</span>
//                           <span className="option-content">
//                             <strong>{key}</strong>
//                             <span dangerouslySetInnerHTML={{ __html: rest }} />
//                           </span>
//                         </div>
//                       );
//                     }
//                     return <div key={lineIndex} dangerouslySetInnerHTML={{ __html: line }} />;
//                   })}
//                 </div>
//               );
//             }
//             return <div key={index} dangerouslySetInnerHTML={{ __html: sanitizedText }} />;
//           } else if (part.type === "code") {
//             return (
//               <div key={index} className="code-block">
//                 <button
//                   className="copy-button"
//                   onClick={() => handleCopy(part.value, index)}
//                   title={copiedStates[index] ? 'Copied!' : 'Copy code'}
//                 >
//                   {copiedStates[index] ? 'Copied!' : <FaCopy />}
//                 </button>
//                 <pre>{part.value}</pre>
//               </div>
//             );
//           } else if (part.type === "image") {
//             return (
//               <div key={index} className="image-container">
//                 <img
//                   src={part.value.startsWith('blob:') ? part.value : `https://aichatbot-backend-hxs8.onrender.com${part.value}`}
//                   alt="Chat image"
//                   className="chat-image"
//                 />
//               </div>
//             );
//           }
//           return null;
//         })}
//       </div>
//     );
//   };

//   return (
//     <div className="chat-screen">
//       <div className="chat-container">
//         <div className="chat-main">
//           {showTitle && (
//             <div className="chat-header">
//               <div className="theme-toggle" onClick={toggleTheme}>
//                 {theme === 'light' ? <FaMoon /> : <FaSun />}
//               </div>
//               <h2 className="chat-title">HUBA AI</h2>
//               <div className="header-actions">
//                 <button onClick={handleLogout} className="logout-button" title="Logout">
//                   <FaSignOutAlt />
//                 </button>
//               </div>
//             </div>
//           )}
//           {showWelcome && (
//             <div className="welcome-message">
//               Welcome {firstName || 'User'} to HUBA AI
//             </div>
//           )}
//           <div className="chat-content" ref={chatContentRef}>
//             {!showWelcome && displayedMessages.length === 0 && (
//               <div className="welcome-message">Start by asking a question!</div>
//             )}
//             {displayedMessages.map((message, index) => (
//               <div key={index} className="chat-item">
//                 <div className="message user-message">
//                   <p>{message.question}</p>
//                 </div>
//                 {message.answer && (
//                   <div className="message ai-message">
//                     <p>{renderResponse(message.answer, message)}</p>
//                     {message.error && message.canRetry && (
//                       <button
//                         onClick={handleRetry(message.question)}
//                         className="retry-button"
//                         title="Retry"
//                       >
//                         <FaRedo />
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//             {isThinking && <div className="thinking">Thinking...</div>}
//           </div>
//           <div className="chat-input-bar">
//             <div className="camera-wrapper">
//               <FaCamera
//                 className="camera-icon"
//                 onClick={handleCameraClick}
//               />
//               {showCameraOptions && (
//                 <div className="camera-options">
//                   <button
//                     onClick={handleUploadImage}
//                     className="camera-option"
//                   >
//                     Upload Image
//                   </button>
//                   <button
//                     onClick={handleOpenCamera}
//                     className="camera-option"
//                   >
//                     Take Photo
//                   </button>
//                 </div>
//               )}
//               <input
//                 type="file"
//                 accept="image/*"
//                 ref={fileInputRef}
//                 onChange={handleImageSelect}
//                 style={{ display: 'none' }}
//                 capture="environment"
//               />
//             </div>
//             {cameraStream && (
//               <div className="camera-modal">
//                 <video
//                   ref={videoRef}
//                   autoPlay
//                   className="camera-video"
//                 />
//                 <button
//                   onClick={handleCapturePhoto}
//                   className="capture-button"
//                 >
//                   Capture Photo
//                 </button>
//                 <button
//                   onClick={stopCamera}
//                   className="close-camera-button"
//                 >
//                   Close Camera
//                 </button>
//               </div>
//             )}
//             {selectedImage && (
//               <div className="image-preview">
//                 <img
//                   src={URL.createObjectURL(selectedImage)}
//                   alt="Preview"
//                   className="preview-image"
//                 />
//                 <button
//                   onClick={() => setSelectedImage(null)}
//                   className="remove-image-button"
//                 >
//                   Remove
//                 </button>
//               </div>
//             )}
//             <textarea
//               placeholder="Ask anything..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="chat-input"
//               rows="1"
//             />
//             <FaMicrophone
//               className={`chat-icon ${isRecording ? 'recording' : ''}`}
//               onClick={handleVoiceInput}
//             />
//             <button onClick={handleSubmit} disabled={isThinking} className="chat-send-button">
//               <FaPaperPlane />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function ChatBot() {
//   const [isSplash, setIsSplash] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme || 'light';
//   });
//   const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');

//   useEffect(() => {
//     setTimeout(() => {
//       setIsSplash(false);
//     }, 3000);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <div className={`app ${theme}`}>
//       {isSplash ? (
//         <SplashScreen onAnimationEnd={!isSplash} />
//       ) : (
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 !isAuthenticated ? (
//                   <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
//                 ) : (
//                   <Navigate to="/chat" />
//                 )
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 isAuthenticated ? (
//                   <ChatScreen
//                     setIsAuthenticated={setIsAuthenticated}
//                     firstName={firstName}
//                     theme={theme}
//                     toggleTheme={toggleTheme}
//                   />
//                 ) : (
//                   <Navigate to="/" />
//                 )
//               }
//             />
//             <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/"} />} />
//           </Routes>
//         </Router>
//       )}
//     </div>
//   );
// }

// export default ChatBot;

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { FaMicrophone, FaPaperPlane, FaSignOutAlt, FaRedo, FaCopy, FaSun, FaMoon, FaCamera, FaTimes } from 'react-icons/fa';
import DOMPurify from 'dompurify';
import './App.css';

const SplashScreen = ({ onAnimationEnd }) => {
  const [showSlogan, setShowSlogan] = useState(false);
  useEffect(() => {
    const sloganTimer = setTimeout(() => {
      setShowSlogan(true);
    }, 200);
    return () => clearTimeout(sloganTimer);
  }, []);
  return (
    <div className={`splash-screen ${onAnimationEnd ? 'hidden' : ''}`}>
      <div className="splash-content">
        <h1 className="splash-title">HUBA AI</h1>
        {showSlogan && <p className="splash-slogan">THINK . TALK . SOLVE</p>}
      </div>
    </div>
  );
};

const AuthScreen = ({ setIsAuthenticated, setFirstName }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const dataToSend = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    };
    const url = isSignup
      ? 'https://aichatbot-backend-hxs8.onrender.com/api/auth/signup'
      : 'https://aichatbot-backend-hxs8.onrender.com/api/auth/login';
    try {
      console.log('Sending data to', url, ':', dataToSend);
      const response = await axios.post(url, isSignup ? dataToSend : { email: formData.email, password: formData.password });
      if (isSignup && response.status === 200) {
        setSignupSuccess(true);
        setError('Signup successful! Please log in.');
        setFormData({ fullName: '', email: '', password: '' });
        return;
      }
      if (!isSignup && (response.status === 200 || response.status === 201)) {
        const token = response.data.token;
        console.log('Login response:', response.data);
        const loginFirstName = response.data.user.fullName.split(' ')[0] || 'User';
        localStorage.setItem('token', token);
        localStorage.setItem('firstName', loginFirstName);
        try {
          const userResponse = await axios.get('https://aichatbot-backend-hxs8.onrender.com/api/auth/user', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          console.log('User details fetched:', userResponse.data);
          const firstName = userResponse.data.firstName || loginFirstName;
          setFirstName(firstName);
          localStorage.setItem('firstName', firstName);
        } catch (userError) {
          console.error('Error fetching user details:', userError.response?.data || userError.message);
          setFirstName(loginFirstName);
        }
        setIsAuthenticated(true);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
      console.error('Auth error:', error.response ? error.response.data : error.message);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Login'}</h2>
        {error && <p style={{ color: signupSuccess ? 'green' : 'red', textAlign: 'center' }}>{error}</p>}
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
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <span className="loading-text">
                {isSignup ? 'Creating Account' : 'Logging In'} <span className="dots">...</span>
              </span>
            ) : (
              isSignup ? 'Sign Up' : 'Login'
            )}
          </button>
        </form>
        <p onClick={() => { setIsSignup(!isSignup); setSignupSuccess(false); setError(''); }} className="auth-toggle">
          {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
        </p>
      </div>
    </div>
  );
};

const ChatScreen = ({ setIsAuthenticated, firstName, theme, toggleTheme }) => {
  const [query, setQuery] = useState('');
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [showCameraOptions, setShowCameraOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const chatContentRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [copiedStates, setCopiedStates] = useState({});

  useEffect(() => {
    setShowWelcome(true);
    setShowTitle(true);
  }, [firstName]);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [displayedMessages, isThinking]);

  const getLocalTimeAndDate = () => {
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    };
    return now.toLocaleString(undefined, options);
  };

  const handleTimeOrDateQuery = (question) => {
    const lowerCaseQuestion = question.toLowerCase().trim();
    const predefinedQuestions = {
      "what is today's date": () => {
        const now = new Date();
        const date = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        return `Today's date is ${date}.`;
      },
      "what is date today": () => {
        const now = new Date();
        const date = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        return `Today's date is ${date}.`;
      },
      "what is now time": () => {
        const now = new Date();
        const time = now.toLocaleTimeString();
        return `The current time is ${time}.`;
      },
      "what is current time": () => {
        const now = new Date();
        const time = now.toLocaleTimeString();
        return `The current time is ${time}.`;
      },
    };

    if (predefinedQuestions[lowerCaseQuestion]) {
      const response = predefinedQuestions[lowerCaseQuestion]();
      const timestamp = new Date().toISOString();
      const newMessage = { question, answer: response, error: false, canRetry: false, timestamp };
      setDisplayedMessages((prev) => [...prev, newMessage]);
      setIsThinking(false);
      setQuery('');
      return true;
    }

    if (lowerCaseQuestion.includes('time') || lowerCaseQuestion.includes('date')) {
      return false;
    }

    return false;
  };

  const handleCameraClick = () => {
    setShowCameraOptions(!showCameraOptions);
  };

  const handleUploadImage = () => {
    fileInputRef.current.click();
    setShowCameraOptions(false);
  };

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setShowCameraOptions(false);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access the camera. Please check permissions or try uploading an image instead.");
    }
  };

  const handleCapturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const file = new File([blob], "captured-photo.jpg", { type: "image/jpeg" });
      setSelectedImage(file);
      stopCamera();
    }, "image/jpeg");
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async (e, retryMessage = null) => {
    e.preventDefault();
    const messageToSend = retryMessage || query;
    if (!messageToSend.trim() && !selectedImage) return;

    if (handleTimeOrDateQuery(messageToSend)) return;

    const timestamp = new Date().toISOString();
    const newMessage = { question: messageToSend, image: selectedImage ? URL.createObjectURL(selectedImage) : null, answer: null, error: false, canRetry: false, timestamp };
    if (!retryMessage) {
      setDisplayedMessages((prev) => [...prev, newMessage]);
    }
    setIsThinking(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('question', messageToSend);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await axios.post(
        'https://aichatbot-backend-hxs8.onrender.com/api/chat/content',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('API Response:', response.data);
      setDisplayedMessages((prev) => {
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
        setDisplayedMessages((prev) => {
          const updatedMessages = [...prev];
          const messageIndex = retryMessage
            ? updatedMessages.findIndex((msg) => msg.question === retryMessage)
            : updatedMessages.length - 1;
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            answer: 'Your session has expired. Please log in again.',
            error: true,
            canRetry: false,
          };
          return updatedMessages;
        });
      } else {
        setDisplayedMessages((prev) => {
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
      setSelectedImage(null);
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
    const token = localStorage.getItem('token');
    axios.post(
      'https://aichatbot-backend-hxs8.onrender.com/api/chat/logout',
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    ).then(() => {
      console.log('Logged out successfully');
    }).catch((err) => {
      console.error('Logout error:', err);
    });
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    setIsAuthenticated(false);
  };

  const handleRetry = (message) => (e) => {
    handleSubmit(e, message);
  };

  const handleCopy = (code, index) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedStates((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [index]: false }));
      }, 2000);
    }).catch((err) => {
      console.error('Failed to copy code:', err);
      alert('Failed to copy code. Please copy it manually.');
    });
  };

  const handleImageClick = (imageSrc) => {
    setEnlargedImage(imageSrc);
  };

  const handleCloseImage = () => {
    setEnlargedImage(null);
  };

  const renderResponse = (response, message) => {
    const parts = [];
    let remainingContent = response;

    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)\n```/g;
    const imageRegex = /\/uploads\/[^\s]+/g;

    let codeMatch;
    let lastIndex = 0;

    while ((codeMatch = codeBlockRegex.exec(response)) !== null) {
      const beforeCode = response.slice(lastIndex, codeMatch.index);
      const imageMatches = [...beforeCode.matchAll(imageRegex)];

      let subIndex = 0;
      for (const imageMatch of imageMatches) {
        const textBeforeImage = beforeCode.slice(subIndex, imageMatch.index);
        if (textBeforeImage) {
          parts.push({ type: "text", value: textBeforeImage });
        }
        parts.push({ type: "image", value: imageMatch[0] });
        subIndex = imageMatch.index + imageMatch[0].length;
      }
      const remainingText = beforeCode.slice(subIndex);
      if (remainingText) {
        parts.push({ type: "text", value: remainingText });
      }

      parts.push({
        type: "code",
        language: codeMatch[1] || "text",
        value: codeMatch[2],
      });
      lastIndex = codeMatch.index + codeMatch[0].length;
    }

    remainingContent = response.slice(lastIndex);
    const imageMatches = [...remainingContent.matchAll(imageRegex)];
    let subIndex = 0;
    for (const imageMatch of imageMatches) {
      const textBeforeImage = remainingContent.slice(subIndex, imageMatch.index);
      if (textBeforeImage) {
        parts.push({ type: "text", value: textBeforeImage });
      }
      parts.push({ type: "image", value: imageMatch[0] });
      subIndex = imageMatch.index + imageMatch[0].length;
    }
    const finalText = remainingContent.slice(subIndex);
    if (finalText) {
      parts.push({ type: "text", value: finalText });
    }

    if (message.image && !imageMatches.length) {
      parts.push({ type: "image", value: message.image });
    }

    const tempRegex = /°[CF]|\btemperature\b/i;
    const listRegex = /(\d+\.\s|[*-]\s)/;

    return (
      <div className="message-content">
        {parts.map((part, index) => {
          if (part.type === "text") {
            const sanitizedText = DOMPurify.sanitize(part.value, { USE_PROFILES: { html: true } });
            if (tempRegex.test(sanitizedText)) {
              const parts = sanitizedText.split(/in|is|,|\b°C\b|\b°F\b/i).map(part => part.trim());
              const city = parts[1] || 'Unknown City';
              const tempMatch = sanitizedText.match(/[-?\d]+(\.\d+)?/);
              const tempUnit = sanitizedText.match(/[CF]/i)?.[0] || 'C';
              const temperature = tempMatch ? `${tempMatch[0]}°${tempUnit}` : 'N/A';
              const skyDetails = parts[parts.length - 1] || 'N/A';
              return (
                <div key={index} className="temperature-container">
                  <div className="temperature-header">Temperature of</div>
                  <div className="temperature-city">{city}</div>
                  <div className="temperature-value">{temperature}</div>
                  <div className="sky-details">{skyDetails}</div>
                </div>
              );
            }
            if (listRegex.test(sanitizedText)) {
              const lines = sanitizedText.split('\n');
              return (
                <div key={index} className="options-block">
                  {lines.map((line, lineIndex) => {
                    const match = line.match(/^(\d+\.\s|[*-]\s)(.+)/);
                    if (match) {
                      const [, prefix, content] = match;
                      const contentParts = content.split(/<\/?strong>/);
                      let key = '';
                      let rest = content;
                      if (contentParts.length > 1) {
                        key = contentParts[1];
                        rest = content.replace(`<strong>${key}</strong>`, '');
                      }
                      return (
                        <div key={lineIndex} className="option-item">
                          <span className="option-key">{prefix}</span>
                          <span className="option-content">
                            <strong>{key}</strong>
                            <span dangerouslySetInnerHTML={{ __html: rest }} />
                          </span>
                        </div>
                      );
                    }
                    return <div key={lineIndex} dangerouslySetInnerHTML={{ __html: line }} />;
                  })}
                </div>
              );
            }
            return <div key={index} dangerouslySetInnerHTML={{ __html: sanitizedText }} />;
          } else if (part.type === "code") {
            return (
              <div key={index} className="code-block">
                <button
                  className="copy-button"
                  onClick={() => handleCopy(part.value, index)}
                  title={copiedStates[index] ? 'Copied!' : 'Copy code'}
                >
                  {copiedStates[index] ? 'Copied!' : <FaCopy />}
                </button>
                <pre>{part.value}</pre>
              </div>
            );
          } else if (part.type === "image") {
            const imageSrc = part.value.startsWith('blob:') ? part.value : `https://aichatbot-backend-hxs8.onrender.com${part.value}`;
            return (
              <div key={index} className="image-container">
                <img
                  src={imageSrc}
                  alt="Chat image"
                  className="chat-image"
                  onClick={() => handleImageClick(imageSrc)}
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="chat-screen">
      <div className="chat-container">
        <div className="chat-main">
          {showTitle && (
            <div className="chat-header">
              <div className="theme-toggle" onClick={toggleTheme}>
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </div>
              <h2 className="chat-title">HUBA AI</h2>
              <div className="header-actions">
                <button onClick={handleLogout} className="logout-button" title="Logout">
                  <FaSignOutAlt />
                </button>
              </div>
            </div>
          )}
          {showWelcome && (
            <div className="welcome-message">
              Welcome {firstName || 'User'} to HUBA AI
            </div>
          )}
          <div className="chat-content" ref={chatContentRef}>
            {!showWelcome && displayedMessages.length === 0 && (
              <div className="welcome-message">Start by asking a question!</div>
            )}
            {displayedMessages.map((message, index) => (
              <div key={index} className="chat-item">
                <div className="message user-message">
                  <p>{message.question}</p>
                </div>
                {message.answer && (
                  <div className="message ai-message">
                    <p>{renderResponse(message.answer, message)}</p>
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
          {enlargedImage && (
            <div className="image-modal" onClick={handleCloseImage}>
              <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={enlargedImage} alt="Enlarged chat image" className="enlarged-image" />
                <button className="close-image-button" onClick={handleCloseImage}>
                  <FaTimes />
                </button>
              </div>
            </div>
          )}
          <div className="chat-input-bar">
            <div className="camera-wrapper">
              <FaCamera
                className="camera-icon"
                onClick={handleCameraClick}
              />
              {showCameraOptions && (
                <div className="camera-options">
                  <button
                    onClick={handleUploadImage}
                    className="camera-option"
                  >
                    Upload Image
                  </button>
                  <button
                    onClick={handleOpenCamera}
                    className="camera-option"
                  >
                    Take Photo
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageSelect}
                style={{ display: 'none' }}
                capture="environment"
              />
            </div>
            {cameraStream && (
              <div className="camera-modal">
                <video
                  ref={videoRef}
                  autoPlay
                  className="camera-video"
                />
                <button
                  onClick={handleCapturePhoto}
                  className="capture-button"
                >
                  Capture Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="close-camera-button"
                >
                  Close Camera
                </button>
              </div>
            )}
            {selectedImage && (
              <div className="image-preview">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  className="preview-image"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="remove-image-button"
                >
                  Remove
                </button>
              </div>
            )}
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
    </div>
  );
};

function ChatBot() {
  const [isSplash, setIsSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });
  const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');

  useEffect(() => {
    setTimeout(() => {
      setIsSplash(false);
    }, 3000);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
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
                !isAuthenticated ? (
                  <AuthScreen setIsAuthenticated={setIsAuthenticated} setFirstName={setFirstName} />
                ) : (
                  <Navigate to="/chat" />
                )
              }
            />
            <Route
              path="/chat"
              element={
                isAuthenticated ? (
                  <ChatScreen
                    setIsAuthenticated={setIsAuthenticated}
                    firstName={firstName}
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