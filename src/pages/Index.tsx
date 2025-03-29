
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sale, TimeFilterPeriod, ChartData, StatCardData } from '@/types';
import {
  sampleData,
  filterSalesByPeriod,
  aggregateByDay,
  calculateTotalSales,
  groupSalesByCurrency,
  calculateConversionRate,
  extractCurrency,
  getPercentChange
} from '@/utils/dataUtils';
import ReportHeader from '@/components/ReportHeader';
import TimeFilter from '@/components/TimeFilter';
import SalesChart from '@/components/SalesChart';
import SalesList from '@/components/SalesList';
import StatCard from '@/components/StatCard';
import { CheckCircle2, Users, Calendar, TrendingUp, CheckCheck, X } from 'lucide-react';
import { datacubeDataRetrieval } from '@/utils/database';

const Index = () => {
  const [period, setPeriod] = useState<TimeFilterPeriod>('1');
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [stats, setStats] = useState<StatCardData[]>([]);
  const [salesByCurrency, setSalesByCurrency] = useState<Record<string, number>>({});
  const [previousPeriodStats, setPreviousPeriodStats] = useState({
    conversions: 0,
    customers: 0,
    totalSales: 0,
    avgPerDay: 0,
    agreed: 0,
    declined: 0
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await datacubeDataRetrieval(
          "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
          "EXPERIENCE_PRODUCT_DB0",
          "DOWELL_ANALYTICS_PRODUCT_DATA",
          {},
          0,0,false
        );
  
        const salesData = res.data.reverse();;

        console.log(salesData);
        
        
        // Filter sales for current period
        const currentSales = filterSalesByPeriod(salesData, period);
        setFilteredSales(currentSales);
        
        // Generate chart data
        const data = aggregateByDay(currentSales);
        setChartData(data);
        
        // Get sales by currency
        const currencyData = groupSalesByCurrency(currentSales);
        setSalesByCurrency(currencyData);
        
        // Calculate previous period stats for comparison
        let previousPeriod: TimeFilterPeriod = 'all';
        if (period !== 'all') {
          const periodDays = parseInt(period);
          const prevPeriodDays = periodDays * 2;
          
          const now = new Date();
          const startPrev = new Date();
          startPrev.setDate(now.getDate() - prevPeriodDays);
          const endPrev = new Date();
          endPrev.setDate(now.getDate() - periodDays);
          
          const previousSales = salesData.filter(sale => {
            const saleDate = new Date(sale.date_time);
            return saleDate >= startPrev && saleDate < endPrev;
          });
          
          const prevTotalSales = calculateTotalSales(previousSales);
          const prevDays = prevPeriodDays;
          const prevAgreedCount = previousSales.filter(s => s.isAgree).length;
          const prevDeclinedCount = previousSales.filter(s => !s.isAgree).length;
          
          setPreviousPeriodStats({
            conversions: calculateConversionRate(previousSales),
            customers: previousSales.filter(s => s.isAgree).length,
            totalSales: prevTotalSales,
            avgPerDay: prevDays > 0 ? prevTotalSales / prevDays : 0,
            agreed: prevAgreedCount,
            declined: prevDeclinedCount
          });
        }
        
        // Count agreed and declined sales
        const agreedCount = currentSales.filter(s => s.isAgree).length;
        const declinedCount = currentSales.filter(s => !s.isAgree).length;
        
        // Calculate current stats
        const totalSales = currentSales.length;
        const conversionRate = calculateConversionRate(currentSales);
        const uniqueCustomers = new Set(currentSales.filter(s => s.isAgree).map(s => s.client_email)).size;
        const periodDays = period === 'all' ? 
          Math.ceil((new Date().getTime() - new Date(Math.min(...currentSales.map(s => new Date(s.date_time).getTime()))).getTime()) / (1000 * 60 * 60 * 24)) : 
          parseInt(period);
        const salesPerDay = periodDays > 0 ? totalSales / periodDays : 0;
        
        setStats([
          {
            title: 'Total Sales',
            value: totalSales,
            percentChange: getPercentChange(totalSales, previousPeriodStats.totalSales),
            icon: <CheckCircle2 size={20} />
          },
          {
            title: 'Agreed',
            value: agreedCount,
            percentChange: getPercentChange(agreedCount, previousPeriodStats.agreed),
            icon: <CheckCheck size={20} />
          },
          {
            title: 'Declined',
            value: declinedCount,
            percentChange: getPercentChange(declinedCount, previousPeriodStats.declined),
            icon: <X size={20} />
          },
          {
            title: 'Conversion Rate',
            value: `${conversionRate.toFixed(1)}%`,
            percentChange: getPercentChange(conversionRate, previousPeriodStats.conversions),
            icon: <TrendingUp size={20} />
          },
          {
            title: 'Unique Customers',
            value: uniqueCustomers,
            percentChange: getPercentChange(uniqueCustomers, previousPeriodStats.customers),
            icon: <Users size={20} />
          },
          {
            title: 'Avg. Contacts per Day',
            value: salesPerDay.toFixed(1),
            percentChange: getPercentChange(salesPerDay, previousPeriodStats.avgPerDay),
            icon: <Calendar size={20} />
          }
        ]);
      } catch (error) {
        console.error("Error fetching or processing sales data:", error);
        
        // Optional: Set error state or show user-friendly error message
        setFilteredSales([]);
        setChartData([]);
        setSalesByCurrency({});
        setStats([]);
        
        // You might want to add a toast or error notification here
      }
    };
  
    // Call the async function
    fetchData();
  }, [
    period, 
    previousPeriodStats.conversions, 
    previousPeriodStats.customers, 
    previousPeriodStats.totalSales, 
    previousPeriodStats.avgPerDay, 
    previousPeriodStats.agreed, 
    previousPeriodStats.declined
  ]);
  // Calculate totals for header
  const totalContacts = filteredSales.length;
  const agreedCount = filteredSales.filter(s => s.isAgree).length;
  const declinedCount = filteredSales.filter(s => !s.isAgree).length;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <ReportHeader 
          totalSales={totalContacts}
          agreementCount={agreedCount}
          declinedCount={declinedCount}
          salesByCurrency={salesByCurrency}
          period={period}
        />
        
        {/* Time Filter */}
        <div className="mb-8">
          <TimeFilter activePeriod={period} onChange={setPeriod} />
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatCard 
              key={index}
              title={stat.title}
              value={stat.value}
              percentChange={stat.percentChange}
              icon={stat.icon}
            />
          ))}
        </div>
        
        {/* Chart Section */}
        <div className="mb-8">
          <SalesChart data={chartData} period={period} />
        </div>
        
        {/* Transactions List */}
        <SalesList sales={filteredSales} />
        
        {/* Footer */}
        <motion.div 
          className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p>Generated on {new Date().toLocaleString()}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
