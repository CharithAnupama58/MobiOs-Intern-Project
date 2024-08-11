import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
    const [filter, setFilter] = useState('all');
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(filter);
                const response = await axios.get('http://localhost:3000/nicValidation/nicRoutes/reportDetails', {filter});
                setData(response.data);
            } catch (error) {
                console.error('Error fetching NIC data:', error);
            }
        };

        fetchData();
    }, [filter]);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleDownload = () => {
        console.log('Download report');
    };

    return (
        <div className="flex flex-col items-center  w-full h-full bg-gray-100">
            <h1 className="text-4xl font-bold text-center mb-8">Reports</h1>

            <div className="mb-8 flex items-center">
                <label htmlFor="filter" className="mr-4 text-lg">Filter:</label>
                <select id="filter" value={filter} onChange={handleFilterChange} className="p-3 border rounded-lg text-lg">
                    <option value="all">All Users</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            <table className="w-full max-w-5xl  bg-white shadow-lg rounded-lg mb-8 text-lg">
                <thead>
                    <tr className="bg-gray-300">
                        <th className="p-4 text-left">ID</th>
                        <th className="p-4 text-left">Name</th>
                        <th className="p-4 text-left">Gender</th>
                        <th className="p-4 text-left">File Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td className="border p-4">{item.id}</td>
                            <td className="border p-4">{item.name}</td>
                            <td className="border p-4">{item.gender}</td>
                            <td className="border p-4">{item.fileName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button 
                onClick={handleDownload} 
                className="bg-blue-500 text-white p-4 rounded-lg shadow-lg hover:bg-blue-700 text-lg"
            >
                Download Report
            </button>
        </div>
    );
};

export default Reports;
