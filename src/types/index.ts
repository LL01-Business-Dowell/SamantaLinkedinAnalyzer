
export interface Sale {
  _id: string;
  client_email: string;
  client_linkedin_link: string;
  price: string;
  date_time: string;
  isAgree: boolean;
  productName: string;
}

export type TimeFilterPeriod = '7' | '15' | '30' | 'all';

export interface ChartData {
  date: string;
  sales: number;
  value: number;
  currency?: string;
}

export interface StatCardData {
  title: string;
  value: string | number;
  percentChange?: number;
  icon?: React.ReactNode;
}

export interface CurrencyInfo {
  symbol: string;
  code: string;
}
