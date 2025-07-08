// app/order/page.tsx
// This file will act as your Server Component wrapper

import { createClient as createServerClientForPage } from '@/utils/supabase/server'; // Import your server-side Supabase client
import OrderPageClient from '@/components/order-page-client'; // Import your client component

// --- Interfaces for Data (keep these consistent with your DB schema) ---
// Assuming these interfaces match your Supabase table structures

// This is the **Server Component** responsible for fetching data
export default async function OrderPageServer() {
  const supabase = createServerClientForPage(); // Use the server client for data fetching

  // Fetch data directly on the server
  const { data: customerData, error: customerError } = await supabase.from('customer_details').select('*');
  const { data: sofaData, error: sofaError } = await supabase.from('sofa_products').select('id, model_name'); // Select only necessary fields
  const { data: bedData, error: bedError } = await supabase.from('bed_products').select('id, model_name'); // Select only necessary fields

  // Basic error logging (you might want more robust error handling)
  if (customerError) console.error('Error fetching customers:', customerError.message);
  if (sofaError) console.error('Error fetching sofa models:', sofaError.message);
  if (bedError) console.error('Error fetching bed models:', bedError.message);

  // Pass the fetched data as props to your client component
  return (
    <OrderPageClient // Renamed to clearly indicate it's the client component
      initialCustomers={customerData || []}
      initialSofaModels={sofaData || []}
      initialBedModels={bedData || []}
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