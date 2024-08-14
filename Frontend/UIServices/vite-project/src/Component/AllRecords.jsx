import { useState, useEffect } from 'react';
import axios from 'axios';

const AllRecords = () => {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8; 

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:3000/nicValidation/nicRoutes/nicDetails', {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                        search: searchQuery
                    }
                });
                setItems(response.data.items);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, [currentPage, searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); 
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options); 
    };

    return (
        <div className='flex flex-row w-full h-full justify-center bg-gray-100'>
            <div className='flex flex-col items-center'>
                <h1 className='mt-10 font-bold text-4xl'>All NIC Numbers</h1>
                <div>
                    <label className="font-semibold text-xl">Search Anything:</label>
                    <input 
                        type="text" 
                        className="ml-4 border border-gray-400 px-4 py-0 mt-10 rounded-xl" 
                        placeholder="Search" 
                        onChange={handleSearch} 
                    />
                </div>
                <div className="w-full max-h-96 overflow-y-auto">
                    <table className="table-auto border border-gray-400 mt-10" id='stockTable'>
                        <thead>
                            <tr className='bg-gray-300'>
                                <th className="border border-gray-400 px-10 py-2">ID</th>
                                <th className="border border-gray-400 px-10 py-2">NIC</th>
                                <th className="border border-gray-400 px-12 py-2">Birthday</th>
                                <th className="border border-gray-400 px-10 py-2">Age</th>
                                <th className="border border-gray-400 px-4 py-2">Gender</th>
                                <th className="border border-gray-400 px-4 py-2">File Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 text-center border-r border-gray-400">{item.id}</td>
                                    <td className="px-4 text-center border-r border-gray-400">{item.nic}</td>
                                    <td className="px-4 text-center border-r border-gray-400">{formatDate(item.birthday)}</td>
                                    <td className="px-4 text-center border-r border-gray-400">{item.age}</td>
                                    <td className="px-4 text-center border-r border-gray-400">{item.gender}</td>
                                    <td className="px-4 text-center border-r border-gray-400">{item.file_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex mt-4">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1} 
                        className="px-4 py-2 bg-gray-300 rounded-lg mr-2"
                    >
                        Previous
                    </button>
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages} 
                        className="px-4 py-2 bg-gray-300 rounded-lg"
                    >
                        Next
                    </button>
                </div>
                <p className="mt-2">Page {currentPage} of {totalPages}</p>
            </div>
        </div>
    );
};

export default AllRecords;
