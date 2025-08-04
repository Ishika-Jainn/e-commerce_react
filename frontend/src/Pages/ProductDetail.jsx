import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import "./productDetail.css"
import axios from 'axios'
import Navbar from '../components/Navbar'
import { CartContext, AuthContext } from '../App' // Import AuthContext

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext); // Get user from AuthContext

  useEffect(() => {
    getProductDetail();
  }, [productId]); // Added productId as a dependency to refetch if it changes

  const getProductDetail = async () => {
    try {
      const res = await axios.get("https://e-commerce-react-backend-a0bg.onrender.com/products/" + productId);
      setProduct(res.data.product);
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      setProduct(null);
    }
  };

  if (!product) {
    // It's good practice to show a loading state
    return (
        <div>
            <Navbar />
            <div className="no-products">Loading product...</div>
        </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className='product-container blue-bg'>
        <div className="main blue-detail-card">
          <div className="left">
            <img src={product.image} alt={product.title} />
          </div>
          <div className="right">
            <h1>{product.title}</h1>
            <p>{product.description}</p>
            <h2>Price: ₹{product.price}</h2>
            {/* --- CHANGE --- */}
            {/* This button will now only render if the logged-in user is NOT an admin */}
            {user && user.role !== 'admin' && (
              <button className="add-cart-btn blue-btn" onClick={() => addToCart(product)}>Add to Cart</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
