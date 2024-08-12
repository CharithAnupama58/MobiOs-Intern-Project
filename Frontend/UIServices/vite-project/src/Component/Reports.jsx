import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
    const addTemplate = (doc, title, pageNumber, totalPages) => {
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
    
       
        const fontSize = 16;
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 102, 204); 
    
        
        const textWidth = doc.getStringUnitWidth(title) * fontSize / doc.internal.scaleFactor;
        const xPos = (pageWidth - textWidth) / 2;
        const yPos = 10; 
        doc.text(title, xPos, yPos);
    
       
        const logoWidth = 30;
        const logoHeight = 30;
        const logoXPos = (pageWidth - logoWidth) / 2;
        const logoYPos = yPos + 10; 
        doc.addImage(image, 'PNG', logoXPos, logoYPos, logoWidth, logoHeight);
    
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0); 
        const footerText = `Page ${pageNumber} of ${totalPages}`;
        const footerYPos = pageHeight - 10;
        doc.text(footerText, pageWidth / 2, footerYPos, { align: 'center' });
    
        
        doc.setDrawColor(0, 102, 204); 
        doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    };
    
    const handleDownload = () => {
        const doc = new jsPDF();
        let title = '';
            if (filter === 'all') {
                title = 'NIC Data Report - All Users';
            } else if (filter === 'male') {
                title = 'NIC Data Report - Male Users';
            } else if (filter === 'female') {
                title = 'NIC Data Report - Female Users';
            }
    
        
        const table = document.getElementById('table-to-pdf');
        doc.autoTable({
            html: table,
            startY: 60, 
            didDrawPage: function (data) {
                const pageNumber = doc.internal.getNumberOfPages();
                const totalPages = doc.internal.getNumberOfPages();
    
                addTemplate(doc, title, pageNumber, totalPages);
            },
            styles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0], 
                lineColor: [0, 102, 204], 
                lineWidth: 0.1,
            },
            headStyles: {
                fillColor: [0, 102, 204],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240], 
            },
        });
    
        doc.save('nic_report.pdf');
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
