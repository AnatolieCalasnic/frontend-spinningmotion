import React, { useState, useEffect } from 'react';
import { LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

const ViewToggleButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
      active 
        ? 'bg-green-500 text-black' 
        : 'bg-gray-800 text-white hover:bg-gray-700'
    }`}
  >
    {children}
  </button>
);


const SalesChart = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState('daily');
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    // Simulate loading stages
    const loadStages = [33, 66, 100];
    let currentStage = 0;

    const interval = setInterval(() => {
      if (currentStage < loadStages.length) {
        setProgress(loadStages[currentStage]);
        currentStage++;
      } else {
        clearInterval(interval);
        setLoading(false);
      }
    }, 700); // Each stage takes 700ms

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!data) return;

    const aggregateData = () => {
      // Create a Map to store grouped data
      const groupedData = new Map();

      // Process each sale record
      data.forEach(record => {
        const date = new Date(record.purchaseDate);
        let groupKey;

        switch (viewMode) {
          case 'weekly': {
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1);
            const monday = new Date(date);
            monday.setDate(diff);
            groupKey = monday.toISOString().split('T')[0];
            break;
          }
          case 'yearly':
            groupKey = date.getFullYear().toString();
            break;
          default: // daily
            groupKey = date.toISOString().split('T')[0];
        }

        const existingGroup = groupedData.get(groupKey) || {
          date: groupKey,
          sales: 0,
          quantity: 0,
          revenue: 0
        };

        existingGroup.quantity += record.quantity || 0;
        existingGroup.revenue += record.totalAmount || 0;
        existingGroup.sales += 1;

        groupedData.set(groupKey, existingGroup);
      });

      return Array.from(groupedData.values())
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    setProcessedData(aggregateData());
  }, [data, viewMode]);

  const formatDate = (dateStr) => {
    if (viewMode === 'yearly') {
      return dateStr; 
    }
    const date = new Date(dateStr);
      const formatOptions = {
      daily: { month: 'short', day: 'numeric' },
      weekly: { month: 'short', day: 'numeric' },
      monthly: { month: 'short', year: 'numeric' }
    };

    if (viewMode === 'weekly') {
      return date.toLocaleDateString('en-US', formatOptions.weekly);
    }

    return date.toLocaleDateString('en-US', formatOptions[viewMode]);
  };

  return (
    <div className="w-full bg-black p-6 rounded-lg space-y-4">
    <div className="flex gap-2 mb-4">
     <ViewToggleButton 
     active={viewMode === 'daily'} 
     onClick={() => setViewMode('daily')}
   >
     Daily
   </ViewToggleButton>
   <ViewToggleButton 
     active={viewMode === 'weekly'} 
     onClick={() => setViewMode('weekly')}
   >
     Weekly
   </ViewToggleButton>
   <ViewToggleButton 
     active={viewMode === 'monthly'} 
     onClick={() => setViewMode('monthly')}
   >
     Monthly
   </ViewToggleButton>
    <ViewToggleButton 
     active={viewMode === 'yearly'} 
     onClick={() => setViewMode('yearly')}
      >
      Yearly
    </ViewToggleButton>
 </div>
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
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#888' }}
                tickFormatter={formatDate}
                angle={-45}
                textAnchor="end"
                height={60}
              />
               <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666', fontSize: 12 }}
                width={40}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white shadow-lg rounded-lg border p-3 text-sm">
                        <p className="font-semibold mb-1">{formatDate(label)}</p>
                        <p className="text-gray-600">Sales: {payload[0].value}</p>
                        <p className="text-gray-600">Revenue: €{payload[0].payload.revenue.toFixed(2)}</p>
                        <p className="text-gray-600">Items: {payload[0].payload.quantity}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ fill: '#4F46E5', r: 4 }}
                activeDot={{ r: 6, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
      )}
      </div>
    </div>
  );
};

export default SalesChart;