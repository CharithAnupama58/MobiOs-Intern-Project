import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import image from '../assets/images/id-card-1024x768-removebg-preview.png';

const Reports = () => {
    const [filter, setFilter] = useState('all');
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(filter);
                const response = await axios.get('http://localhost:3000/nicValidation/nicRoutes/reportDetails', {
                    params: { filter }
                });                
                setData(response.data.items);
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
        const input = document.getElementById('table-to-pdf');
    
        html2canvas(input).then((canvas) => {
            const imgWidth = 200; 
            const pageHeight = 200; 
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const pdf = new jsPDF('p', 'mm', 'a4');
            let heightLeft = imgHeight;
            let position = 3;
    
            let reportTitle = '';
            if (filter === 'all') {
                reportTitle = 'NIC Data Report - All Users';
            } else if (filter === 'male') {
                reportTitle = 'NIC Data Report - Male Users';
            } else if (filter === 'female') {
                reportTitle = 'NIC Data Report - Female Users';
            }
    
           
            pdf.setFontSize(18);
            pdf.text(reportTitle, 10, 20);
            position = 30;
    
            
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, pageHeight);
            heightLeft -= pageHeight;
    
            while (heightLeft > 0) {
                position = heightLeft - pageHeight;
                const pageCanvas = document.createElement('canvas');
                pageCanvas.width = canvas.width;
                pageCanvas.height = canvas.height - pageHeight;
    
                const ctx = pageCanvas.getContext('2d');
                ctx.drawImage(canvas, 0, -position);
    
                const imgData = pageCanvas.toDataURL('image/png');
    
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, pageHeight);
                heightLeft -= pageHeight;
            }
    
            pdf.save('reports.pdf');
        });
    };
    
    
    

    return (
        <div className="flex flex-col items-center w-full h-full bg-gray-100">
            <h1 className="mt-10 text-4xl font-bold text-center mb-8">Reports</h1>

            <div className="mb-8 flex items-center">
                <label htmlFor="filter" className="mr-4 text-lg">Filter:</label>
                <select id="filter" value={filter} onChange={handleFilterChange} className="p-3 border rounded-lg text-lg">
                    <option value="all">All Users</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            <div className="overflow-y-auto max-h-96 mt-8 items-center justify-center">
                <table id="table-to-pdf" className="min-w-96 bg-white shadow-lg rounded-lg mb-8 text-lg">
                    <thead>
                        <tr className="bg-gray-300">
                            <th className="p-4 text-left">ID</th>
                            <th className="p-4 text-left">NIC</th>
                            <th className="p-4 text-left">Gender</th>
                            <th className="p-4 text-left">Birthday</th>
                            <th className="p-4 text-left">Age</th>
                            <th className="p-4 text-left">File Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td className="border p-4">{item.id}</td>
                                <td className="border p-4">{item.nic}</td>
                                <td className="border p-4">{item.gender}</td>
                                <td className="border p-4">{item.birthday}</td>
                                <td className="border p-4">{item.age}</td>
                                <td className="border p-4">{item.file_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button 
                onClick={handleDownload} 
                className="bg-blue-500 mt-10 text-white p-4 rounded-lg shadow-lg hover:bg-blue-700 text-lg"
            >
                Download Report
            </button>
        </div>
    );
};

export default Reports;
