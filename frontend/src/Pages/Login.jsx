import React, { useState, useContext } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App'; // Make sure this path is correct
import axios from 'axios';

// --- Navbar Component (with updated links for scrolling) ---
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">StorePoint</div>
      <div className="navbar-links">
        <a href="/">Home</a>
        <a href="#about">About Us</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
};

// --- About Us Section Component ---
const AboutUsSection = () => {
  return (
    // Added id="about" for scroll navigation
    <section id="about" className="about-us-section">
      <div className="hero-image-container">
        <img 
          src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1974&auto=format&fit=crop" 
          alt="A library of books" 
          className="hero-image"
        />
     
      </div>
      <div className="about-us-content">
        <h2>About Us</h2>
        <h3>Welcome to StorePoint</h3>
        <p className="about-us-subtitle">Your Trusted Online Marketplace for Everything You Need</p>
        <p>At StorePoint, we bring you a seamless shopping experience with a wide variety of products – all in one place. From daily essentials to fashion, electronics, books, and more, StorePoint is your go-to destination for buying and selling with ease. Founded in 2021 with a mission to make quality products accessible to everyone, we’ve grown from a local idea to a full-scale digital marketplace trusted by thousands.</p>
      </div>
    </section>
  );
};

// --- New Commitment Section ---
const CommitmentSection = () => {
  return (
    <section className="commitment-section">
      <h2>Our Commitment</h2>
      <p>At StorePoint, we’re dedicated to creating a welcoming, trusted, and inspiring space for all kinds of shoppers and sellers. Whether you’re searching for the latest gadget, a stylish outfit, home essentials, or a great book, we’re here to make your shopping journey smooth and enjoyable.</p>
      <p>Our team — both online and across our physical branches — is committed to helping you find exactly what you need, offering support, suggestions, and a hassle-free experience. We believe in the power of choice, accessibility, and community-driven commerce.</p>
      <p>Whether you’re buying or selling, visiting us in-store or browsing online, StorePoint is here to support you — every step of the way.</p>
    </section>
  );
};

// --- New Contact Section ---
const ContactSection = () => {
  return (
    // Added id="contact" for scroll navigation
    <section id="contact" className="contact-section">
      <h2>Contact Us</h2>
      <h3>We're Here to Help — Anytime, Anywhere</h3>
      <p>At StorePoint, your satisfaction is our priority. Whether you have a question, need help with an order, or want to give feedback — we’d love to hear from you!</p>
    </section>
  );
};


// --- Icon Components ---
const EyeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>);
const AtSignIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>);
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);


const Login = () => {
  // --- State Management (Functionality unchanged) ---
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Form Submission Logic (Functionality unchanged) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (isSignup) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      try {
        await axios.post('https://e-commerce-react-backend-a0bg.onrender.com/users/register', {
          username: name,
          email,
          password,
          role
        });
        setSuccess('Registration successful! Please login.');
        setIsSignup(false);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await login(email, password, role);
        navigate('/');
      } catch (err) {
        setError(err.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const toggleForm = () => {
      setIsSignup(!isSignup);
      setError('');
      setSuccess('');
      setEmail('');
      setPassword('');
      setName('');
      setConfirmPassword('');
  }

  // --- Render Method (Updated to include all sections) ---
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <AboutUsSection />
        
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>{isSignup ? 'Create an Account' : 'Login to Your Account!'}</h2>
            
            {isSignup && (
              <div className="input-wrapper">
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Enter Name"/>
                <div className="input-icon"><UserIcon /></div>
              </div>
            )}

            <div className="input-wrapper">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter Email" autoFocus />
              <div className="input-icon"><AtSignIcon /></div>
            </div>

            <div className="input-wrapper">
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter Password"/>
              <div className="input-icon" style={{cursor: 'pointer'}} onClick={() => setShowPassword(!showPassword)}><EyeIcon /></div>
            </div>

            {isSignup && (
              <>
                <div className="input-wrapper">
                  <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Confirm Password"/>
                  <div className="input-icon" style={{cursor: 'pointer'}} onClick={() => setShowConfirmPassword(!showConfirmPassword)}><EyeIcon /></div>
                </div>
                <div className="input-wrapper">
                  <select value={role} onChange={e => setRole(e.target.value)} required>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}

            {error && <div className="login-error">{error}</div>}
            {success && <div className="login-success">{success}</div>}

            <button type="submit" disabled={loading}>{loading ? (isSignup ? 'Signing up...' : 'Logging in...') : (isSignup ? 'Sign Up' : 'Login')}</button>
          </form>

          <div className="login-toggle-container">
              <div className="login-toggle">
              {isSignup ? (
                  <>
                  Already have an account?{' '}
                  <span className="login-link-btn" onClick={toggleForm}>Login</span>
                  </>
              ) : (
                  <>
                  Don't you have an account?{' '}
                  <span className="login-link-btn" onClick={toggleForm}>Sign up</span>
                  </>
              )}
              </div>
          </div>
        </div>

        <CommitmentSection />
        <ContactSection />
      </div>
    </>
  );
};

export default Login;
