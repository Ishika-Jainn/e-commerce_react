import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./productDetail.css";
import axios from 'axios';
import Navbar from '../components/Navbar';
import { CartContext, AuthContext } from '../App';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getProductDetail();
  }, [productId]);

  const getProductDetail = async () => {
    try {
      const res = await axios.get(`https://e-commerce-react-backend-a0bg.onrender.com/products/${productId}`);
      setProduct(res.data.product);
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      setProduct(null);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
        try {
            await axios.get(`https://e-commerce-react-backend-a0bg.onrender.com/products/delete/${productId}`);
            alert("Product deleted successfully!");
            navigate('/admin'); // Navigate back to the admin home page
        } catch (error) {
            console.error("Failed to delete product:", error);
            alert("Failed to delete product.");
        }
    }
  };

  const handleUpdate = () => {
    navigate(`/admin/products/edit/${productId}`);
  };

  if (!product) {
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
            
            {/* --- CHANGES START --- */}
            {user && user.role === 'admin' ? (
              <div className="admin-actions">
                <button className="update-btn" onClick={handleUpdate}>Update Product</button>
                <button className="delete-btn" onClick={handleDelete}>Delete Product</button>
              </div>
            ) : (
              <button className="add-cart-btn blue-btn" onClick={() => addToCart(product)}>Add to Cart</button>
            )}
            {/* --- CHANGES END --- */}

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
