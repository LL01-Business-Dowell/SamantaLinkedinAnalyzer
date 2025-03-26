
import { motion } from 'framer-motion';

interface ReportHeaderProps {
  totalSales: number;
  agreementCount: number;
  declinedCount: number;
  salesByCurrency: Record<string, number>;
  period: string;
}

const ReportHeader = ({ totalSales, agreementCount, declinedCount, salesByCurrency, period }: ReportHeaderProps) => {
  const formatCurrencyData = () => {
    return Object.entries(salesByCurrency)
      .map(([currency, value]) => `${value.toFixed(2)} ${currency}`)
      .join(' | ');
  };

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex justify-between items-center mb-2"
      >
        <h1 className="text-3xl font-bold">DoWell LinkedIn Analyzer</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: '100%' }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-4"
      />
      
      <motion.p 
        className="text-gray-600 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {period === 'all' ? 'All time' : `Last ${period} days`} • {totalSales} total contacts • {agreementCount} agreed • {declinedCount} declined • {formatCurrencyData()}
      </motion.p>
    </motion.div>
  );
};

export default ReportHeader;
