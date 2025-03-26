
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sale } from '@/types';
import { Check, X } from 'lucide-react';

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
      
      <div className="overflow-hidden">
        <div className="space-y-3">
          {sales.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-6">No transactions in this period</p>
          ) : (
            sales.map((sale, index) => (
              <motion.div
                key={sale._id}
                className="border border-gray-100 dark:border-white/10 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  onClick={() => toggleDetails(sale._id)}
                >
                  <div className="flex flex-col">
                    <div className="font-medium truncate max-w-xs">{sale.client_email}</div>
                    <div className="text-sm text-gray-500">{new Date(sale.date_time).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium">{sale.price}</div>
                      <div className="text-sm">
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
                      </div>
                    </div>
                    <div className="text-gray-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d={expandedId === sale._id ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedId === sale._id && (
                    <motion.div 
                      className="bg-gray-50 dark:bg-white/5 px-4 py-3 text-sm border-t border-gray-100 dark:border-white/10"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-500 mb-1">Product</p>
                          <p>{sale.productName}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">LinkedIn Profile</p>
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SalesList;
