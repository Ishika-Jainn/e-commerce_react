import React, { useState, useContext } from 'react'
import "./Navbar.css"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CartContext, AuthContext } from '../App'

const Navbar = ({ onSearch }) => {
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  const handleSearch = () => {
    if (onSearch) onSearch(search);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleCartClick = () => {
    setShowCart((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar-blue">
      <div className="left">
        <Link to={isAdminRoute ? "/admin" : "/"}><h2>Shopy</h2></Link>
      </div>
      <div className='search'>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
        />
        <button className="search-btn" onClick={handleSearch} aria-label="Search">
          <span role="img" aria-label="search">🔍</span>
        </button>
      </div>
      <div className="right">
      
        {user && user.role === 'admin' && (
          <div className="user-actions">
            <Link to="/admin/products/add" className="add-product-link">Add new Product</Link>
            <div className="user-info">
              <span className="user-email">{user.email}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
     
        {user && user.role !== 'admin' && (
          <div className="user-actions">
            <div className="cart-icon" onClick={handleCartClick} tabIndex={0} aria-label="Cart" role="button">
              <span role="img" aria-label="cart">🛒</span>
              {cart.length > 0 && <span className="cart-count">{cart.reduce((a, b) => a + b.quantity, 0)}</span>}
              {showCart && (
                <div className="cart-dropdown">
                  <h4>Cart</h4>
                  {cart.length === 0 ? (
                    <div className="empty">Your cart is empty.</div>
                  ) : (
                    <ul>
                      {cart.map((item) => (
                        <li key={item._id} className="cart-dropdown-item">
                          <img src={item.image} alt={item.title} className="cart-dropdown-img" />
                          <div className="cart-dropdown-info">
                            <div className="cart-dropdown-title">{item.title}</div>
                            <div className="cart-dropdown-price">₹{item.price}</div>
                            <div className="cart-dropdown-qty">
                              <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}>-</button>
                              <span>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                            </div>
                          </div>
                          <button className="cart-dropdown-remove" onClick={() => removeFromCart(item._id)} title="Remove">✕</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div className="user-info">
              <span className="user-email">{user.email}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
      
        {!user && (
          <Link to="/login" className="login-link">Login</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
