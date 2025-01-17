import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressBar = ({ value }) => {
  return (
    <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
      <div 
        className="h-full bg-green-500 transition-all duration-500 ease-out rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};


const SalesChart = ({ }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        // Fetch data from your controller endpoint
        const response = await fetch('http://localhost:8080/purchase-history/all');
        if (!response.ok) {
          throw new Error('Failed to fetch sales data');
        }
        const salesData = await response.json();
        processAndSetData(salesData);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const processAndSetData = (salesData) => {
      // Create a map for the last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
      
      const dateMap = new Map();
      
      // Initialize all dates with zero values
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split('T')[0];
        dateMap.set(dateKey, {
          date: dateKey,
          sales: 0,
          quantity: 0,
          revenue: 0
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Aggregate sales data
      salesData.forEach(record => {
        const purchaseDate = new Date(record.purchaseDate);
        const dateKey = purchaseDate.toISOString().split('T')[0];
        
        if (dateMap.has(dateKey)) {
          const dayData = dateMap.get(dateKey);
          dayData.sales += 1;
          dayData.quantity += record.quantity;
          dayData.revenue += record.totalAmount;
          dateMap.set(dateKey, dayData);
        }
      });

      // Convert map to array and sort by date
      const processedData = Array.from(dateMap.values())
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setProcessedData(processedData);
      setLoading(false);
    };

    // Simulate loading progress
    const loadStages = [33, 66, 100];
    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < loadStages.length) {
        setProgress(loadStages[currentStage]);
        currentStage++;
      } else {
        clearInterval(interval);
      }
    }, 700);

    fetchSalesData();

    return () => clearInterval(interval);
  }, []);
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (error) {
    return (
      <div className="w-full bg-black p-6 rounded-lg">
        <p className="text-red-500">Error loading sales data: {error}</p>
      </div>
    );
  }
  return (
    <div className="w-full bg-black p-6 rounded-lg space-y-4">
    <div className="h-64 w-full relative">
      {loading ? (
        <div className="absolute inset-0 flex flex-col justify-center items-center space-y-4 bg-black">
          <div className="w-full max-w-md">
            <ProgressBar value={progress} />
          </div>
          <p className="text-white">Loading chart data...</p>
        </div>
      ) : (
        <ResponsiveContainer>
          <LineChart 
            data={processedData} 
            margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickLine={false} 
              tick={{ fill: '#888' }} 
              tickFormatter={formatDate}
            />
            <YAxis 
              tickLine={false} 
              tick={{ fill: '#666' }} 
            />
            <Tooltip 
              content={({ active, payload, label }) => active && payload && (
                <div className="bg-white shadow-lg rounded-lg border p-3 text-sm">
                  <p className="font-semibold">{formatDate(label)}</p>
                  <p>Sales: {payload[0].value}</p>
                  <p>Revenue: €{payload[0].payload.revenue.toFixed(2)}</p>
                  <p>Items: {payload[0].payload.quantity}</p>
                </div>
              )} 
            />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#4F46E5" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>
  );
};

export default SalesChart;
