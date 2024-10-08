import { useState } from 'react'
import './App.css';
import Login from './Views/Login.jsx';
import Dashboard from './Views/DashBoard.jsx';
import ProtectedRoute from './Component/ProtectedRoutes.jsx';
import ResetPassword from './Views/PasswordResetForm.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path:'/dashboard',
    element: <ProtectedRoute element={<Dashboard />} />
  },
  {
    path:'/reset-password/:token',
    element: <ResetPassword />
  }
]);



function App() {
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
