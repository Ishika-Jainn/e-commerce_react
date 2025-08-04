import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProducts.css';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AddProducts = () => {
    const { productId } = useParams(); // Get productId from URL if it exists
    const navigate = useNavigate();

    const [isEditMode, setIsEditMode] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');

    useEffect(() => {
        if (productId) {
            setIsEditMode(true);
            axios.get(`https://e-commerce-react-backend-a0bg.onrender.com/products/${productId}`)
                .then(res => {
                    const product = res.data.product;
                    setTitle(product.title);
                    setDescription(product.description);
                    setCategory(product.category);
                    setPrice(product.price);
                    setCurrentImageUrl(product.image);
                })
                .catch(err => {
                    console.error("Failed to fetch product for editing", err);
                    alert("Could not load product data.");
                    navigate('/admin/products/add');
                });
        } else {
            setIsEditMode(false);
        }
    }, [productId, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('price', price);
        if (image) {
            formData.append('image', image);
        }

        const url = isEditMode
            ? `https://e-commerce-react-backend-a0bg.onrender.com/products/update/${productId}`
            : "https://e-commerce-react-backend-a0bg.onrender.com/products/add";

        axios.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(() => {
            alert(`Product ${isEditMode ? 'updated' : 'added'} successfully!`);
            navigate(isEditMode ? `/admin/products/detail/${productId}` : '/admin');
        })
        .catch((err) => {
            console.error("Form submission error:", err);
            alert(`Failed to ${isEditMode ? 'update' : 'add'} product.`);
        });
    };

    return (
        <>
        <Navbar />
        <div className='formContainer'>
            <form onSubmit={handleSubmit}>
                <h2>{isEditMode ? 'Edit Product' : 'Add a New Product'}</h2>
                <div className="formGroup">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        placeholder="Enter product title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        id="title"
                        required
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="image">Image {isEditMode && <span style={{color:'#aaa', fontSize:'0.9em'}}>(leave blank to keep current)</span>}</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    {isEditMode && currentImageUrl && (
                        <img src={currentImageUrl} alt="Current" style={{width:'60px',marginTop:'10px',borderRadius:'6px'}} />
                    )}
                </div>
                <div className="formGroup">
                    <label htmlFor="description">Description</label>
                    <textarea
                        placeholder="Enter product description"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        required
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="category">Category</label>
                    <input
                        type="text"
                        placeholder="Enter product category"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        placeholder="Enter product price"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{isEditMode ? 'Update Product' : 'Add Product'}</button>
                {isEditMode && (
                    <button type="button" className="delete-btn" style={{marginTop:'10px', background: '#555'}} onClick={() => navigate(`/admin/products/detail/${productId}`)}>
                        Cancel Edit
                    </button>
                )}
            </form>
        </div>
        </>
    );
};

export default AddProducts;
