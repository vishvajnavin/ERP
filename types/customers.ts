export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  status: 'VIP' | 'Active' | 'New';
  dateAdded: string;
  totalOrders: number;
  totalSpend: number;
  lastOrder: string;
}
