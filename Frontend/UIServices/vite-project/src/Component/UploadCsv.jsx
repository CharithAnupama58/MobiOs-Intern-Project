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
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(droppedFiles);
    };

    const handleFileUpload = (e) => {
        const uploadedFiles = Array.from(e.target.files);
        setFiles(uploadedFiles);
    };

    const handleNextClick = async () => {
        if (files.length >= 4) { 
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
                setFiles([]);
            } catch (error) {
                console.error('Error uploading files:', error);
            }
        } else {
            alert('Please upload at least 4 CSV files.');
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="flex flex-col items-center w-full h-full justify-evenly p-4 md:p-8">
            <div className="flex items-center justify-center mb-4 md:mb-6">
                <h1 className="text-3xl md:text-6xl font-bold text-center">Upload CSV Files</h1>
            </div>
            <div
                className={`image-drop-zone ${dragging ? 'dragging' : ''} flex flex-col md:flex-row border-4 border-black w-full md:w-3/4 mt-4 md:mt-6 rounded-3xl p-4 md:p-8`}
                onDragOver={handleDragOver}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
            >
                <img src={imageBox} alt='Drop Zone' className="w-20 h-20 md:w-40 md:h-40 mx-auto md:mx-0" />
                {dragging ? (
                    <p className="text-2xl ml-10 md:text-4xl font-semibold text-center md:text-left mt-4 md:mt-16">Drop the files here</p>
                ) : (
                    <p className="text-2xl ml-10 md:text-4xl font-semibold text-center md:text-left mt-4 md:mt-14">Drag and drop your files here</p>
                )}
            </div>
            <h1 className="text-xl md:text-2xl font-semibold mt-4">Or</h1>
            <div className="mt-4">
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Browse Files
                    <input type="file" className="hidden" onChange={handleFileUpload} multiple />
                </label>
            </div>
            <div className="mt-6 md:mt-8">
                <button
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                    onClick={handleNextClick}
                    disabled={files.length < 4}  
                >
                    Next
                </button>
            </div>
            {files.length > 0 && (
                <div className="mt-4 w-full md:w-3/4">
                    <h2 className="text-lg md:text-2xl font-semibold">Selected Files:</h2>
                    <ul className="list-disc list-inside">
                        {files.map((file, index) => (
                            <li key={index} className="text-base md:text-xl">{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {showPopup && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center p-4">
                    <div className="bg-white p-6 rounded-lg w-full md:w-1/2">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Uploaded NIC Details</h2>
                        <div className="overflow-auto max-h-72 md:max-h-96">
                            <ul>
                                {uploadData && uploadData.map((item, index) => (
                                    <li key={index} className="mb-4">
                                        <p className="text-lg md:text-xl">NIC: {item.NIC}</p>
                                        <p>Birthday: {item.Birthday}</p>
                                        <p>Age: {item.Age}</p>
                                        <p>Gender: {item.Gender}</p>
                                        <p>File Name: {item.file_name}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
