import  { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import image from '../assets/images/id-card-1024x768-removebg-preview.png';

const Reports = () => {
    const [filter, setFilter] = useState('all');
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 
    const limit = 5; 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/nicValidation/nicRoutes/reportDetails', {
                    params: { filter, page: currentPage, limit }
                });                
                setData(response.data.items);
                setTotalPages(response.data.totalPages); 
            } catch (error) {
                console.error('Error fetching NIC data:', error);
            }
        };

        fetchData();
    }, [filter, currentPage]); 

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
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
    
    const handleDownload = async () => {
        try {
            const response = await axios.get('http://localhost:3000/nicValidation/nicRoutes/reportDetails', {
                params: { filter, page: 1, limit: 10000 } 
            });
            const allData = response.data.items;
    
            const doc = new jsPDF();
            let title = '';
            if (filter === 'all') {
                title = 'NIC Data Report - All Users';
            } else if (filter === 'male') {
                title = 'NIC Data Report - Male Users';
            } else if (filter === 'female') {
                title = 'NIC Data Report - Female Users';
            }
    
            let rows = allData.map(item => [
                item.id,
                item.nic,
                item.gender,
                formatDate(item.birthday),
                item.age,
                item.file_name
            ]);
    
            const tableHeaders = ["ID", "NIC", "Gender", "Birthday", "Age", "File Name"];
            doc.autoTable({
                head: [tableHeaders],
                body: rows,
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
        } catch (error) {
            console.error('Error fetching all NIC data for report:', error);
        }
    };
    

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="flex flex-col items-center w-full h-full bg-gray-100">
            <h1 className="mt-5 text-4xl font-bold text-center mb-8">Reports</h1>

            <div className="mb-8 flex items-center">
                <label htmlFor="filter" className="mr-4 text-lg">Filter:</label>
                <select id="filter" value={filter} onChange={handleFilterChange} className="p-3 border rounded-lg text-lg">
                    <option value="all">All Users</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            <div className="overflow-y-auto max-w-max max-h-96 mt-1 items-center justify-center">
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
                                <td className="border p-4">{formatDate(item.birthday)}</td>
                                <td className="border p-4">{item.age}</td>
                                <td className="border p-4">{item.file_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between w-full max-w-2xl mt-4">
                <button 
                    onClick={handlePreviousPage} 
                    disabled={currentPage === 1} 
                    className="bg-blue-500 text-white p-4 rounded-lg shadow-lg hover:bg-blue-700 text-lg"
                >
                    Previous
                </button>
                <span className="text-lg p-4">
                    Page {currentPage} of {totalPages}
                </span>
                <button 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages} 
                    className="bg-blue-500 text-white p-4 rounded-lg shadow-lg hover:bg-blue-700 text-lg"
                >
                    Next
                </button>
            </div>

            <button 
                onClick={handleDownload} 
                className="bg-blue-500 ml-6 mt-3 text-white p-4 rounded-lg shadow-lg hover:bg-blue-700 text-lg"
            >
                Download Report
            </button>
        </div>
    );
};

export default Reports;
