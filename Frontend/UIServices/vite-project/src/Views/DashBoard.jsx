import { useState, useEffect } from 'react';
import image1 from '../assets/images/id-card-1024x768-removebg-preview.png';
import UploadCsv from '../Component/UploadCsv';
import { useNavigate } from 'react-router-dom';

const BranchEmployee = () => {
    const [dateTime, setDateTime] = useState(new Date());
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [selectedInterface, setSelectedInterface] = useState('UploadCsv');
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        setShowLogoutPopup(true);
    };

    const handleConfirmLogout = () => {
        setShowLogoutPopup(false);
        navigate('/');
    };

    const handleCancelLogout = () => {
        setShowLogoutPopup(false);
    };

    const handleInterfaceChange = (interfaceName) => {
        setSelectedInterface(interfaceName);
    };

    return (
        <section className='flex flex-col h-screen'>
            <div className="flex flex-row flex-grow">
                <div className="flex flex-col w-72 bg-custom-green items-center bg-slate-500">
                    <div className='flex-row'>
                        <img src={image1} alt="logo" className='w-100 h-50' />
                        <h1 className='text-white font-bold text-2xl -mt-6 ml-4'>NIC Validation System</h1>
                    </div>
                    <div className='flex flex-col w-72 justify-center items-center mb-32 mt-12'>
                        <button className={`w-56 h-12 bg-white items-center mb-4 rounded-xl`}>
                            <div className='flex w-56 h-12 bg-white items-center justify-around mb-4 border-2 border-black rounded-xl hover:bg-gray-400' onClick={() => handleInterfaceChange('UploadCsv')}>
                                <h1 className='font-bold text-xl'>Upload Csv's</h1>
                            </div>
                        </button>
                        <button className={`w-56 h-12 bg-white items-center justify-around mb-4 rounded-xl`}>
                            <div className='flex w-56 h-12 bg-white items-center justify-around mb-3 border-2 border-black rounded-xl hover:bg-gray-400' onClick={() => handleInterfaceChange('releaseOrders')}>
                                <h1 className='font-bold text-xl'>All Records</h1>
                            </div>
                        </button>
                        <button className={`w-56 h-12 bg-white items-center justify-around mb-4 rounded-xl`}>
                            <div className='flex w-56 h-12 bg-white items-center justify-around mb-3 border-2 border-black rounded-xl hover:bg-gray-400' onClick={() => handleInterfaceChange('dashboard')}>
                                <h1 className='font-bold text-xl'>Dashboard</h1>
                            </div>
                        </button>
                        <button className={`w-56 h-12 bg-white items-center justify-around mb-4 rounded-xl`}>
                            <div className='flex w-56 h-12 bg-white items-center justify-around mb-3 border-2 border-black rounded-xl hover:bg-gray-400' onClick={() => handleInterfaceChange('reports')}>
                                <h1 className='font-bold text-xl'>Reports</h1>
                            </div>
                        </button>
                    </div>
                    <div className='flex w-56 h-12 bg-white items-center justify-around border-2 border-black rounded-xl hover:bg-gray-400'>
                        <button className='font-bold text-2xl' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center text-black flex-grow">
                    {selectedInterface === 'UploadCsv' && <UploadCsv />}
                    {selectedInterface === 'releaseOrders' && <div>Release Orders Content</div>}
                    {selectedInterface === 'dashboard' && <div>Dashboard Content</div>}
                    {selectedInterface === 'reports' && <div>Reports Content</div>}
                </div>
            </div>

            {showLogoutPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg">
                        <p className="text-lg font-bold mb-4">Are you sure you want to logout?</p>
                        <div className="flex justify-between">
                            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-4" onClick={handleConfirmLogout}>Logout</button>
                            <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md" onClick={handleCancelLogout}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default BranchEmployee;
