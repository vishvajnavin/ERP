export interface CustomerSearchResult {
  id: string;
  name: string;
  company?: string;
  address: string;
  avatar?: string;
  status: 'VIP' | 'Active' | 'New';
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  status: 'VIP' | 'Active' | 'New';
  dateadded: string;
  totalorders: number;
  totalspend: number;
  lastorder: string;
}
