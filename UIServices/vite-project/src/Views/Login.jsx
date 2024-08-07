import React, { useState } from 'react';
import axios from 'axios';
import '../CSS/Login.css'; 
import { useNavigate } from 'react-router-dom';
import Modal from '../Component/Modal';  // Import the Modal component

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(email, password);
            const response = await axios.post('http://localhost:3000/auth/auth/login', { email, password });
            setSuccess('Login successful');
            setError('');
            navigate('/dashboard');
            // Store the token or handle the successful login response here
            console.log(response.data);
        } catch (error) {
            setError('Login failed. Please check your email and password.');
            setSuccess('');
        }
    };

    const handleRegisterClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="login-container">
            <div className="welcome-text">
                <h2>Welcome to NIC Validation System</h2>
            </div>
            <div className="login-box">
                <h1>Login</h1>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                <div className="google-login">
                    <button className="google-button" onClick={handleRegisterClick}>
                        Register
                    </button>
                </div>
            </div>
            <Modal show={showModal} handleClose={handleCloseModal}>
                <h2>Register</h2>
                <form>
                    <div className="input-group">
                        <label htmlFor="reg-email">Email</label>
                        <input type="email" id="reg-email" name="reg-email" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="reg-password">Password</label>
                        <input type="password" id="reg-password" name="reg-password" required />
                    </div>
                    <button type="submit" className="register-button">Register</button>
                </form>
            </Modal>
        </div>
    );
};

export default Login;
