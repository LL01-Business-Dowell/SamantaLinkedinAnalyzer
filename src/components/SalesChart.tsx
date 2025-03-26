
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChartData, TimeFilterPeriod } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesChartProps {
  data: ChartData[];
  period: TimeFilterPeriod;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium">{formatDate(label)}</p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Sales:</span> {payload[0].value}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Value:</span> {payload[1].value.toFixed(2)} {payload[1].payload.currency || ''}
        </p>
      </div>
    );
  }
  return null;
};

const SalesChart = ({ data, period }: SalesChartProps) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  
  useEffect(() => {
    // Add animation by gradually revealing data points
    const timer = setTimeout(() => {
      setChartData(data);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <motion.div 
      className="w-full bg-white dark:bg-black/40 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-lg font-medium mb-4">Sales Overview</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#888888"
              tick={{ fill: '#888888', fontSize: 12 }}
            />
            <YAxis yAxisId="left" stroke="#888888" tick={{ fill: '#888888', fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" stroke="#888888" tick={{ fill: '#888888', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              stroke="#000000"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#000000" }}
              animationDuration={1500}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="value"
              stroke="#888888"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#888888" }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesChart;
