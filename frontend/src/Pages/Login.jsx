import React, { useState, useContext } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import axios from 'axios';

const Login = () => {
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

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
        {isSignup && (
          <>
            <label>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </>
        )}
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        {isSignup && (
          <>
            <label>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            <label>Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </>
        )}
        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}
        <button type="submit" disabled={loading}>{loading ? (isSignup ? 'Signing up...' : 'Logging in...') : (isSignup ? 'Sign Up' : 'Login')}</button>
        <div className="login-toggle">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <span className="login-link-btn" onClick={() => { setIsSignup(false); setError(''); setSuccess(''); }}>Login</span>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <span className="login-link-btn" onClick={() => { setIsSignup(true); setError(''); setSuccess(''); }}>Sign Up</span>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;