
import { motion } from 'framer-motion';
import { StatCardData } from '@/types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({ title, value, percentChange, icon }: StatCardData) => {
  const isPositive = percentChange && percentChange > 0;
  const isNegative = percentChange && percentChange < 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-black/40 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-white/10"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        {icon && <div className="text-gray-400 dark:text-gray-500">{icon}</div>}
      </div>
      
      <div className="flex flex-col space-y-1">
        <motion.p 
          className="text-2xl font-semibold tracking-tight"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {value}
        </motion.p>
        
        {percentChange !== undefined && (
          <div className="flex items-center text-sm">
            {isPositive && (
              <span className="flex items-center text-green-600 dark:text-green-400">
                <ArrowUpRight size={16} />
                <span className="ml-1">{Math.abs(percentChange).toFixed(1)}%</span>
              </span>
            )}
            {isNegative && (
              <span className="flex items-center text-red-600 dark:text-red-400">
                <ArrowDownRight size={16} />
                <span className="ml-1">{Math.abs(percentChange).toFixed(1)}%</span>
              </span>
            )}
            {!isPositive && !isNegative && (
              <span className="text-gray-500">0%</span>
            )}
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              vs previous period
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
