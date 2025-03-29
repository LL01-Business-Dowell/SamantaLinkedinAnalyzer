import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sale } from '@/types';
import { Check, X, ExternalLink } from 'lucide-react';

interface SalesListProps {
  sales: Sale[];
}

const SalesList = ({ sales }: SalesListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleDetails = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <motion.div 
      className="w-full bg-white dark:bg-black/40 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/5 text-left">
              <th className="p-3 border-b border-gray-100 dark:border-white/10">Sl No.</th>
              <th className="p-3 border-b border-gray-100 dark:border-white/10">Client</th>
              <th className="p-3 border-b border-gray-100 dark:border-white/10">Date</th>
              <th className="p-3 border-b border-gray-100 dark:border-white/10">Price</th>
              <th className="p-3 border-b border-gray-100 dark:border-white/10">Status</th>
              <th className="p-3 border-b border-gray-100 dark:border-white/10">LinkedIn</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-gray-500 dark:text-gray-400 text-center py-6">No transactions in this period</td>
              </tr>
            ) : (
              sales.map((sale, index) => (
                <>
                  <motion.tr
                    key={`row-${sale._id}`}
                    className="border-b border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">
                      <div className="font-medium truncate max-w-xs">{sale.client_email}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">{new Date(sale.date_time).toLocaleDateString()}</div>
                    </td>
                    <td className="p-3 font-medium">{sale.price}</td>
                    <td className="p-3">
                      {sale.isAgree ? (
                        <span className="flex items-center text-green-600">
                          <Check size={14} className="mr-1" />
                          Agreed
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <X size={14} className="mr-1" />
                          Declined
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <a 
                        href={sale.client_linkedin_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        View LinkedIn
                      </a>
                    </td>
                  </motion.tr>
                  {expandedId === sale._id && (
                    <motion.tr
                      key={`details-${sale._id}`}
                      className="bg-gray-50 dark:bg-white/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td colSpan={6} className="p-3 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-500 mb-1">Product</p>
                            <p>{sale.productName}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">LinkedIn Profile URL</p>
                            <a 
                              href={sale.client_linkedin_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                            >
                              {sale.client_linkedin_link}
                            </a>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default SalesList;