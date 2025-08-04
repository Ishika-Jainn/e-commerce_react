import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import "./Home.css";
import { Link, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { CartContext, AuthContext } from '../App';

const Home = () => {
  const [productData, setProductData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const { cart, addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get("https://e-commerce-react-backend-a0bg.onrender.com/")
      .then((res) => {
        let products = res.data.products || [];
        setProductData(products);
        setFiltered(products);
      })
      .catch((err) => {
        setProductData([]);
        setFiltered([]);
      });
  };

  const handleSearch = (query) => {
    if (!query) {
      setFiltered(productData);
      return;
    }
    setFiltered(productData.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    ));
  };

  if (!user) {
   
    return <Navigate to="/login" replace />;
  }

  return (
   <div>
      <Navbar onSearch={handleSearch} />
      <div className="container blue-bg">
        {filtered.length === 0 ? (
          <div className="no-products">No products found.</div>
        ) : (
          filtered.map((elem, index) => {
            const detailLink = user && user.role === 'admin'
              ? `/admin/products/detail/${elem._id}`
              : `/products/detail/${elem._id}`;
            return <div className="card blue-card" key={index}>
              <div className="top">
                <img
                  src={elem.image}
                  alt=""
                />
              </div>
              <div className="bottom">
                <Link to={detailLink}>{elem.title}</Link>
                <p>
                  {elem.description}
                </p>
                <h2>Price : ₹{elem.price}</h2>
                {user && user.role !== 'admin' && (
                  <button className="add-cart-btn blue-btn" onClick={() => addToCart(elem)}>Add to Cart</button>
                )}
              </div>
            </div>;
          })
        )}
      </div>
   </div>
  );
};

export default Home;
