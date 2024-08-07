import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../Component/Modal'; // Import the Modal component

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
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
            console.log(response.data);
        } catch (error) {
            setError('Login failed. Please check your email and password.');
            setSuccess('');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            console.log(regEmail, regPassword);
            const response = await axios.post('http://localhost:3000/auth/auth/register', { email: regEmail, password: regPassword });
            console.log('Registration successful');
            setError('');
            setSuccess('Registration successful');
            console.log(response.data);
        } catch (error) {
            setError('Registration failed. Please check your email and password.');
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
        <div className="flex flex-col justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://wallpaper-house.com/data/out/6/wallpaper2you_115490.jpg)' }}>
            <div className="mb-8 text-center">
                <h2 className="text-3xl text-white shadow-md">Welcome to NIC Validation System</h2>
            </div>
            <div className="w-full max-w-sm p-8 bg-white bg-opacity-50 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Login</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="mb-1 font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="mb-1 font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full p-2 bg-green-600 text-white font-bold rounded hover:bg-green-700">Login</button>
                </form>
                <div className="mt-4 text-center">
                    <button className="text-blue-600 hover:underline" onClick={handleRegisterClick}>Register</button>
                </div>
            </div>
            <Modal show={showModal} handleClose={handleCloseModal}>
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="reg-email" className="mb-1 font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            id="reg-email" 
                            name="reg-email" 
                            value={regEmail} 
                            onChange={(e) => setRegEmail(e.target.value)} 
                            className="p-2 border border-gray-300 rounded" 
                            required 
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="reg-password" className="mb-1 font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            id="reg-password" 
                            name="reg-password" 
                            value={regPassword} 
                            onChange={(e) => setRegPassword(e.target.value)} 
                            className="p-2 border border-gray-300 rounded" 
                            required 
                        />
                    </div>
                    <button type="submit" className="w-full p-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Register</button>
                </form>
            </Modal>
        </div>
    );
};

export default Login;
