import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

const SalesChart = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

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

  // Process data to daily format
  const processedData = data?.reduce((acc, curr) => {
    const date = new Date(curr.purchaseDate).toISOString().split('T')[0];
    
    if (!acc[date]) {
      acc[date] = {
        date,
        sales: 0,
        quantity: curr.quantity || 0,
        revenue: curr.totalAmount || 0
      };
    } else {
      acc[date].quantity += curr.quantity || 0;
      acc[date].revenue += curr.totalAmount || 0;
      acc[date].sales += 1;
    }
    
    return acc;
  }, {});

  const chartData = Object.values(processedData || {}).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="w-full bg-black p-6 rounded-lg h-[300px]">
    <div className="h-full w-full relative">
      {loading ? (
          <div className="absolute inset-0 flex flex-col justify-center items-center space-y-4 bg-black">
          <div className="w-full max-w-md">
            <ProgressBar value={progress} />
          </div>
          <p className="text-white">Loading chart data...</p>
        </div>
      ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#333"
                opacity={0.1}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#888' }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const date = new Date(label);
                    return (
                      <div className="bg-white text-black p-2 rounded-lg text-sm shadow-lg border border-gray-200">
                        <p className="font-bold">
                          {date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p>Sales: {payload[0].value}</p>
                        <p>Revenue: €{payload[0].payload.revenue.toFixed(2)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="sales"
                fill="#4ade80"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
      )}
      </div>
    </div>
  );
};

export default SalesChart;