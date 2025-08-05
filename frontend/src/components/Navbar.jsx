import React, { useState, useContext, useEffect } from 'react';
import './Navbar.css'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext, AuthContext } from '../App';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

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

  const handleCartClick = (e) => {

    e.stopPropagation();
    setShowCart((prev) => !prev);
  };
  

  useEffect(() => {
    const closeCart = () => setShowCart(false);
    document.addEventListener('click', closeCart);
    return () => document.removeEventListener('click', closeCart);
  }, []);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
    
      <div className="navbar-left">
        <Link to={isAdminRoute ? "/admin" : "/"} className="navbar-brand">
          StorePoint
        </Link>
      </div>

      {!isAdminRoute && (
        <div className='navbar-search'>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for products..."
            className="search-input"
          />
          <button className="search-button" onClick={handleSearch} aria-label="Search">
            <SearchIcon />
          </button>
        </div>
      )}

      <div className="navbar-right">
        {user ? (
   
          <div className="navbar-actions">
            {user.role === 'admin' ? (
            
              <>
                <Link to="/admin/products/add" className="navbar-link">Add Product</Link>
                <span className="user-display">Admin: {user.email}</span>
                <button className="navbar-button" onClick={handleLogout}>Logout</button>
              </>
            ) : (
          
              <>
                <span className="user-display">{user.email}</span>
                <div className="cart-container" onClick={handleCartClick}>
                  <div className="cart-icon-wrapper" tabIndex={0} aria-label="Cart" role="button">
                    <CartIcon />
                    {cart.length > 0 && <span className="cart-count">{cart.reduce((a, b) => a + b.quantity, 0)}</span>}
                  </div>
                  {showCart && (
                    <div className="cart-dropdown" onClick={e => e.stopPropagation()}>
                      <h4>Shopping Cart</h4>
                      {cart.length === 0 ? (
                        <div className="cart-empty">Your cart is empty.</div>
                      ) : (
                        <>
                          <ul className="cart-list">
                            {cart.map((item) => (
                              <li key={item._id} className="cart-item">
                                <img src={item.image} alt={item.title} className="cart-item-img" />
                                <div className="cart-item-info">
                                  <div className="cart-item-title">{item.title}</div>
                                  <div className="cart-item-price">₹{item.price}</div>
                                </div>
                                <div className="cart-item-qty">
                                  <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}>-</button>
                                  <span>{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                </div>
                                <button className="cart-item-remove" onClick={() => removeFromCart(item._id)} title="Remove">✕</button>
                              </li>
                            ))}
                          </ul>
                          <div className="cart-total">
                            <strong>Total:</strong> ₹{cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <button className="navbar-button" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        ) : (
         
          <Link to="/login" className="navbar-button">Login</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar;
