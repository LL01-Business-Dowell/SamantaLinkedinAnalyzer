
import { Sale, ChartData, TimeFilterPeriod, CurrencyInfo } from '@/types';

export const sampleData: Sale[] = [
  {
    _id: "67e38d0792c52dbaacb05e19",
    client_email: "mdashsharma95@gmail.com",
    client_linkedin_link: "https://www.linkedin.com/in/manish-dash-sharma-0082b8185/",
    price: "269.53 INR",
    date_time: "2025-03-26T05:13:41.383Z",
    isAgree: true,
    productName: "Linkedin Analyzer"
  },
  {
    _id: "67e38dc7e3d6e37cdc07f48e",
    client_email: "mdashsharma95@gmail.com",
    client_linkedin_link: "https://www.linkedin.com/in/manish-dash-sharma-0082b8185/",
    price: "269.53 INR",
    productName: "Linkedin Analyzer",
    date_time: "2025-03-26T05:16:54.132Z",
    isAgree: false
  },
  {
    _id: "67e39581e3d6e37cdc07f490",
    client_email: "kashinathg212@gmail.com",
    client_linkedin_link: "https://www.linkedin.com/in/kashinath-g-2a86b32b5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    price: "269.53 INR",
    productName: "Linkedin Analyzer",
    date_time: "2025-03-26T05:49:50.884Z",
    isAgree: true
  }
];

export const filterSalesByPeriod = (data: Sale[], period: TimeFilterPeriod): Sale[] => {
  if (period === 'all') return data;
  
  const now = new Date();
  const startDate = new Date();
  startDate.setDate(now.getDate() - parseInt(period));
  
  return data.filter(sale => {
    const saleDate = new Date(sale.date_time);
    return saleDate >= startDate && saleDate <= now;
  });
};

export const extractPriceValue = (priceString: string): number => {
  const match = priceString.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

export const extractCurrency = (priceString: string): string => {
  const match = priceString.match(/[^\d.]+/);
  return match ? match[0].trim() : '';
};

export const getCurrencyInfo = (currencyCode: string): CurrencyInfo => {
  const currencyMap: Record<string, CurrencyInfo> = {
    'INR': { symbol: '₹', code: 'INR' },
    'USD': { symbol: '$', code: 'USD' },
    'EUR': { symbol: '€', code: 'EUR' },
    'GBP': { symbol: '£', code: 'GBP' },
    // Add more currencies as needed
  };
  
  return currencyMap[currencyCode] || { symbol: currencyCode, code: currencyCode };
};

export const formatPrice = (amount: number, currency: string): string => {
  const currencyInfo = getCurrencyInfo(currency);
  return `${amount.toFixed(2)} ${currencyInfo.code}`;
};

export const aggregateByDay = (sales: Sale[]): ChartData[] => {
  const grouped = sales.reduce((acc: {[key: string]: {count: number, value: number, currencies: Set<string>}}, sale) => {
    const date = new Date(sale.date_time).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { count: 0, value: 0, currencies: new Set() };
    }
    
    if (sale.isAgree) {
      acc[date].count += 1;
      acc[date].value += extractPriceValue(sale.price);
      acc[date].currencies.add(extractCurrency(sale.price));
    }
    
    return acc;
  }, {});
  
  return Object.entries(grouped).map(([date, data]) => {
    const currencies = Array.from(data.currencies);
    return {
      date,
      sales: data.count,
      value: data.value,
      currency: currencies.length === 1 ? currencies[0] : 'Mixed'
    };
  }).sort((a, b) => a.date.localeCompare(b.date));
};

export const calculateTotalSales = (sales: Sale[]): number => {
  return sales.filter(sale => sale.isAgree).length;
};

export const groupSalesByCurrency = (sales: Sale[]): Record<string, number> => {
  return sales.filter(sale => sale.isAgree).reduce((acc: Record<string, number>, sale) => {
    const currency = extractCurrency(sale.price);
    if (!acc[currency]) {
      acc[currency] = 0;
    }
    acc[currency] += extractPriceValue(sale.price);
    return acc;
  }, {});
};

export const calculateConversionRate = (sales: Sale[]): number => {
  if (sales.length === 0) return 0;
  const agreed = sales.filter(sale => sale.isAgree).length;
  return (agreed / sales.length) * 100;
};

export const getPercentChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};
