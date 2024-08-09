import { useState } from 'react';
import axios from 'axios';
import imageBox from '../assets/images/imageBox.png';

const UploadCsv = () => {
    const [dragging, setDragging] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploadData, setUploadData] = useState(null);
    const [showPopup, setShowPopup] = useState(false); 

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files).slice(0, 4);
        setFiles(droppedFiles);
    };

    const handleFileUpload = (e) => {
        const uploadedFiles = Array.from(e.target.files).slice(0, 4);
        setFiles(uploadedFiles);
    };

    const handleNextClick = async () => {
        if (files.length === 4) {
            const formData = new FormData();
            files.forEach(file => formData.append('csvFiles', file));

            try {
                const response = await axios.post('http://localhost:3000/nicValidation/nicRoutes/upload-csv', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                setUploadData(response.data.data); 
                setShowPopup(true); 
                setFiles('');
            } catch (error) {
                console.error('Error uploading files:', error);
            }
        } else {
            alert('Please upload exactly 4 CSV files.');
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className='flex flex-col items-center w-full h-full justify-evenly'>
            <div className='flex items-center justify-center mb-6 mt-4'>
                <h1 className='text-6xl font-bold'>Upload CSV Files</h1>
            </div>
            <div
                className={`image-drop-zone ${dragging ? 'dragging' : ''} flex border-4 border-black w-3/4 mt-6 rounded-3xl p-8`}
                onDragOver={handleDragOver}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
            >
                <img src={imageBox} alt='Drop Zone' className='w-40 h-40' />
                {dragging ? (
                    <p className='text-4xl font-semibold ml-24 mt-16'>Drop the files here</p>
                ) : (
                    <p className='text-4xl font-semibold ml-24 mt-14'>Drag and drop up to 4 files here</p>
                )}
            </div>
            <h1 className='text-2xl font-semibold'>Or</h1>
            <div>
                <label className='cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
                    Browse Files
                    <input type='file' className='hidden' onChange={handleFileUpload} multiple />
                </label>
            </div>
            <div className='mt-8'>
                <button
                    className='bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600'
                    onClick={handleNextClick}
                    disabled={files.length !== 4}
                >
                    Next
                </button>
            </div>
            {files.length > 0 && (
                <div className='mt-4'>
                    <h2 className='text-2xl font-semibold'>Selected Files:</h2>
                    <ul>
                        {files.map((file, index) => (
                            <li key={index} className='text-xl'>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {showPopup && (
                <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center'>
                    <div className='bg-white p-6 rounded-lg w-1/2'>
                        <h2 className='text-3xl font-semibold mb-4'>Uploaded NIC Details</h2>
                        <div className='overflow-auto max-h-96'>
                            <ul>
                                {uploadData && uploadData.map((item, index) => (
                                    <li key={index} className='mb-4'>
                                        <p className='text-xl'>NIC: {item.NIC}</p>
                                        <p>Birthday: {item.Birthday}</p>
                                        <p>Age: {item.Age}</p>
                                        <p>Gender: {item.Gender}</p>
                                        <p>File Name: {item.file_name}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button
                            className='mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                            onClick={closePopup}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadCsv;
