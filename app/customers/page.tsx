import React from 'react';
import { getCustomers } from '@/actions/get-customers';
import CustomerClientPage from '@/components/customers/customer-client-page';

// This Server Component handles the initial data fetching.
const CustomerPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) => {
    // Extract filter values from URL search parameters.
    const filters = {
        searchTerm: (searchParams.search as string) || '',
        status: (searchParams.status as string) || 'All',
        address: (searchParams.address as string) || '', // Changed from location
    };

    // Fetch the initial list of customers on the server.
    const initialCustomers = await getCustomers(filters);

    // Render the client component, passing the fetched data and filters as props.
    return <CustomerClientPage initialCustomers={initialCustomers} initialFilters={filters} />;
};

export default CustomerPage;