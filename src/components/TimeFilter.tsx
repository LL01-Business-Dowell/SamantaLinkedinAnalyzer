
import { motion } from 'framer-motion';
import { TimeFilterPeriod } from '@/types';

interface TimeFilterProps {
  activePeriod: TimeFilterPeriod;
  onChange: (period: TimeFilterPeriod) => void;
}

const TimeFilter = ({ activePeriod, onChange }: TimeFilterProps) => {
  const periods: {label: string; value: TimeFilterPeriod}[] = [
    { label: 'Last 24 hours', value: '1' },
    { label: 'Last 7 days', value: '7' },
    { label: 'Last 15 days', value: '15' },
    { label: 'Last 30 days', value: '30' },
    { label: 'All time', value: 'all' }
  ];

  return (
    <motion.div 
      className="flex space-x-2 bg-gray-100 dark:bg-black/20 p-1 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            activePeriod === period.value 
              ? 'text-gray-800 dark:text-white' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
          }`}
        >
          {activePeriod === period.value && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 bg-white dark:bg-gray-800 rounded-md shadow-sm"
              transition={{ type: "spring", duration: 0.5 }}
              style={{ zIndex: -1 }}
            />
          )}
          {period.label}
        </button>
      ))}
    </motion.div>
  );
};

export default TimeFilter;
