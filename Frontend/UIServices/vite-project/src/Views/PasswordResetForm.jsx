import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:3000/auth/auth/reset-password/${token}`, { newPassword });
            Swal.fire({
                title: 'Success!',
                text: 'Your password has been reset!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            navigate('/');
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Unable to reset password. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded" 
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
