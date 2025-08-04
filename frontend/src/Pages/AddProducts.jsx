import React, { useState } from 'react';
import axios from 'axios';
import './AddProducts.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AddProducts = () => {
    const navigate = useNavigate()
    const [title, settitle] = useState('');
    const [image, setimage] = useState('');
    const [description, setdescription] = useState('');
    const [category, setcategory] = useState('');
    const [price, setprice] = useState('');
    const [products, setProducts] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editImage, setEditImage] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get('https://e-commerce-react-backend-a0bg.onrender.com/')
            .then(res => {
                setProducts(res.data.products || []);
            })
            .catch(() => setProducts([]));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        if (editId) {
            // Update mode
            axios.post(`https://e-commerce-react-backend-a0bg.onrender.com/products/update/${editId}`, formData)
                .then((res) => {
                    setEditId(null);
                    setEditImage(null);
                    settitle('');
                    setdescription('');
                    setcategory('');
                    setprice('');
                    setimage('');
                    fetchProducts();
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            // Add mode
            axios.post("https://e-commerce-react-backend-a0bg.onrender.com/products/add", formData)
                .then((res) => {
                    settitle('');
                    setdescription('');
                    setcategory('');
                    setprice('');
                    setimage('');
                    fetchProducts();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const handleDelete = (id) => {
        axios.get(`https://e-commerce-react-backend-a0bg.onrender.com/products/delete/${id}`)
            .then(() => {
                fetchProducts();
            })
            .catch((err) => console.log(err));
    };

    const handleEdit = (product) => {
        setEditId(product._id);
        settitle(product.title);
        setdescription(product.description);
        setcategory(product.category);
        setprice(product.price);
        setEditImage(product.image);
        setimage(''); // reset file input
    };

    return (
        <div className='formContainer'>
            <form onSubmit={handleSubmit}>
                <div className="formGroup">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        placeholder="Enter product title"
                        value={title}
                        onChange={(e) => settitle(e.target.value)}
                        name="title"
                        id="title"
                        required
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="image">Image {editId && <span style={{color:'#aaa', fontSize:'0.9em'}}>(leave blank to keep current)</span>}</label>
                    <input
                        type="file"
                        name="image"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setimage(e.target.files[0])}
                    />
                    {editId && editImage && (
                        <img src={editImage} alt="Current" style={{width:'60px',marginTop:'6px',borderRadius:'6px'}} />
                    )}
                </div>
                <div className="formGroup">
                    <label htmlFor="description">Description</label>
                    <textarea
                        placeholder="Enter product description"
                        name="description"
                        id="description"
                        value={description}
                        onChange={(e) => setdescription(e.target.value)}
                        rows={3}
                        style={{resize: 'vertical', minHeight: '60px', maxHeight: '200px', overflow: 'auto'}}
                        required
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="category">Category</label>
                    <input
                        type="text"
                        placeholder="Enter product category"
                        name="category"
                        id="category"
                        value={category}
                        onChange={(e) => setcategory(e.target.value)}
                        required
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        placeholder="Enter product price"
                        name="price"
                        id="price"
                        value={price}
                        onChange={(e) => setprice(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{editId ? 'Update Product' : 'Add Product'}</button>
                {editId && (
                    <button type="button" className="delete-btn" style={{marginTop:'10px'}} onClick={()=>{setEditId(null);settitle('');setdescription('');setcategory('');setprice('');setimage('');setEditImage(null);}}>Cancel Edit</button>
                )}
            </form>
            <div className="product-list">
                <h3 style={{marginBottom:'16px'}}>All Products</h3>
                {products.length === 0 ? (
                    <div style={{color:'#aaa'}}>No products found.</div>
                ) : (
                    products.map(product => (
                        <div className="product-list-item" key={product._id}>
                            <span className="product-list-title">{product.title}</span>
                            <div>
                                <button className="update-btn" onClick={()=>handleEdit(product)} style={{marginRight:'16px'}}>Update</button>
                                <button className="delete-btn" onClick={()=>handleDelete(product._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AddProducts;