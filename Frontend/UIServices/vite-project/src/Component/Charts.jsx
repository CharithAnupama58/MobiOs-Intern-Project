import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Charts = () => {
  const [totalRecords, setTotalRecords] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/nicValidation/nicRoutes/chartDetails');
            const data = response.data;
            setTotalRecords(data.totalRecords);
            setMaleCount(data.maleCount);
            setFemaleCount(data.femaleCount);
        } catch (error) {
            console.error('Error fetching NIC data stats:', error);
        }
    };
    
    fetchData();
  }, []);

  const barChartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: '# of Records',
        data: [maleCount, femaleCount],
        backgroundColor: ['#4f46e5', '#f43f5e'],
      },
    ],
  };

  const pieChartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [maleCount, femaleCount],
        backgroundColor: ['#4f46e5', '#f43f5e'],
      },
    ],
  };

  return (
    <div className="min-h-screen w-full h-full bg-gray-100 ">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>
      <div className="max-w-md mx-auto mb-8 p-4 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-lg font-semibold">Total Records of nic_data Table</h2>
        <p className="text-2xl font-bold text-indigo-600">{totalRecords}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold text-center mb-4">Gender Distribution (Bar Chart)</h3>
          <Bar data={barChartData} />
        </div>
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold text-center mb-4">Gender Distribution (Pie Chart)</h3>
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  );
};

export default Charts;
