import React, { useState, createContext, useEffect } from 'react'
import Navbar from './components/Navbar'
import 'remixicon/fonts/remixicon.css'
import AddProducts from "./Pages/AddProducts"
import { Routes , Route, Navigate, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import ProductDetail from './Pages/ProductDetail'
import Login from './Pages/Login'
import axios from 'axios';

export const CartContext = createContext();
export const AuthContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(item => item._id === product._id);
      if (found) {
        return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const updateQuantity = (id, qty) => {
    setCart(prev => prev.map(item => item._id === id ? { ...item, quantity: qty } : item));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [role, setRole] = useState(() => localStorage.getItem('role') || 'user');

  useEffect(() => {
    if (token) {
      setUser({ email: localStorage.getItem('userEmail'), username: localStorage.getItem('username'), role: localStorage.getItem('role') });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('https://e-commerce-react-backend-a0bg.onrender.com/users/login', { email, password });
      if (res.status === 200) {
        setToken('dummy-token'); 
        setUser({ email: res.data.email, username: res.data.username, role: res.data.role });
        setRole(res.data.role);
        localStorage.setItem('token', 'dummy-token');
        localStorage.setItem('userEmail', res.data.email);
        localStorage.setItem('username', res.data.username);
        localStorage.setItem('role', res.data.role);
      } else {
        throw new Error(res.data.message || 'Login failed');
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    setRole('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute = ({ children, adminOnly }) => {
  const { token, role } = React.useContext(AuthContext);
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (adminOnly && role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Home />} />
          
          {/* --- ADMIN ROUTES --- */}
          <Route path='/admin' element={<ProtectedRoute adminOnly={true}><Home /></ProtectedRoute>} />
          <Route path='/admin/products/add' element={<ProtectedRoute adminOnly={true}><AddProducts /></ProtectedRoute>} />
          <Route path='/admin/products/edit/:productId' element={<ProtectedRoute adminOnly={true}><AddProducts /></ProtectedRoute>} /> {/* --- NEW ROUTE --- */}
          <Route path='/admin/products/detail/:productId' element={<ProtectedRoute adminOnly={true}><ProductDetail /></ProtectedRoute>} />

          {/* --- USER ROUTES --- */}
          <Route path='/products/detail/:productId' element={<ProductDetail />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
