import { useState, useEffect } from 'react';
import axios from 'axios';

const AllRecords = () => {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:3000/nicValidation/nicRoutes/nicDetails');
                setItems(response.data.items);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options); // You can specify 'en-US' for MM/DD/YYYY or 'en-GB' for DD/MM/YYYY
    };

    const filteredItems = items.filter(item =>
        (typeof item.id === 'string' && item.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.nic === 'string' && item.nic.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.birthday === 'string' && item.birthday.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.age === 'string' && item.age.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.gender === 'string' && item.gender.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.file_name === 'string' && item.file_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className='flex flex-row w-full h-full justify-center bg-gray-100'>
            <div className='flex flex-col items-center'>
                <h1 className='mt-10 font-bold text-4xl'>All NIC Numbers</h1>
                <div>
                    <label className="font-semibold text-xl">Search Anything:</label>
                    <input type="text" className="ml-4 border border-gray-400 px-4 py-0 mt-10 rounded-xl" placeholder="Search" onChange={handleSearch} />
                </div>
                <div className="w-full max-h-96 overflow-y-auto">
                    <table className="table-auto border  border-gray-400 mt-10" id='stockTable'>
                        <thead>
                            <tr className='bg-gray-300'>
                                <th className="border border-gray-400 px-10 py-2">ID</th>
                                <th className="border border-gray-400 px-10 py-2">Nic</th>
                                <th className="border border-gray-400 px-12 py-2">Birthday</th>
                                <th className="border border-gray-400 px-10 py-2">Age</th>
                                <th className="border border-gray-400 px-4 py-2">Gender</th>
                                <th className="border border-gray-400 px-4 py-2">File Name</th>
                            </tr>
                        </thead>
                        <tbody className='flex-row justify-center items-center'>
                            {filteredItems.map((item, index) => (
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
            </div>
        </div>
    );
};

export default AllRecords;
