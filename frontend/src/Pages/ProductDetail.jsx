import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import "./productDetail.css"
import axios from 'axios'
import Navbar from '../components/Navbar'
import { CartContext } from '../App'

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    getProductDetail();
  }, []);

  const getProductDetail = async () => {
    await axios.get("https://e-commerce-react-backend-a0bg.onrender.com/products/" + productId)
      .then((res) => {
        setProduct(res.data.product);
      })
      .catch(() => {
        setProduct(null);
      });
  };

  if (!product) return <div className="no-products">Product not found.</div>;

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
            <button className="add-cart-btn blue-btn" onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
