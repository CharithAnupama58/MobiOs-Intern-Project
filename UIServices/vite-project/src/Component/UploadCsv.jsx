import { useState } from 'react';
import imageBox from '../assets/images/imageBox.png';

const UploadCsv = () => {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
    };

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
    };

    const handleNextClick = () => {
        // Handle the next button click event
    };

    return (
        <div className='flex flex-col items-center  w-full h-full justify-evenly'>
            <div className='flex items-center justify-center mb-6  mt-4'>
                <h1 className='text-6xl font-bold'>Upload Csv File</h1>
            </div>
            <div
                className={`image-drop-zone ${dragging ? 'dragging' : ''} flex border-4 border-black w-3/4 mt-6 rounded-3xl  p-8`}
                onDragOver={handleDragOver}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
            >
                <img src={imageBox} alt='Drop Zone' className='w-40 h-40 justify-start disabled:' />
                {dragging ? (
                    <p className='text-4xl font-semibold ml-24 mt-16'>Drop the file here</p>
                ) : (
                    <p className='text-4xl font-semibold ml-24 mt-14'>Drag and drop a file here</p>
                )}
            </div>
            <h1 className='text-2xl font-semibold'>Or</h1>
            <div >
                <label className='cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
                    Browse File
                    <input type='file' className='hidden' onChange={handleFileUpload} />
                </label>
            </div>
            <div className='mt-8'>
                <button
                    className='bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600'
                    onClick={handleNextClick}
                    disabled={!file}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UploadCsv;
