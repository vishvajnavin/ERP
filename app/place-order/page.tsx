// app/place-order/page.tsx
// This file will act as your Server Component wrapper

import { createClient as createServerClientForPage } from '@/utils/supabase/server';
import PlaceOrderPage from '@/components/place-order/order-page-client'; // Corrected import path
import { Customer } from '@/types/customers';
import { Product } from '@/types/products';

type ProductModel = Product & { id: string; model_name: string };

// This is the **Server Component** responsible for fetching data
export default async function OrderPageServer() {
  const supabase = createServerClientForPage();

  // Fetch data directly on the server
  const { data: customerData, error: customerError } = await supabase.from('customer_details').select('*');
  const { data: sofaData, error: sofaError } = await supabase.from('sofa_products').select('id,model_name');
  const { data: bedData, error: bedError } = await supabase.from('bed_products').select('id,model_name');


  // Basic error logging
  if (customerError) console.error('Error fetching customers:', customerError.message);
  if (sofaError) console.error('Error fetching sofa models:', sofaError.message);
  if (bedError) console.error('Error fetching bed models:', bedError.message);

  // Type assertion for safety, assuming the data structure is correct
  const customers: Customer[] = customerData || [];
  const sofaModels: ProductModel[] = sofaData as ProductModel[] || [];
  const bedModels: ProductModel[] = bedData as ProductModel[] || [];


  // Pass the fetched data as props to your client component
  return (
    <PlaceOrderPage
      initialCustomers={customers}
      initialSofaModels={sofaModels}
      initialBedModels={bedModels}
    />
  );
}

// Optional: Add generateMetadata for SEO
export async function generateMetadata() {
  return {
    title: 'Place New Order',
    description: 'Create and submit new customer orders.',
  };
}
