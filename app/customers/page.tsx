import React from 'react';
import { searchCustomers } from '@/actions/filter-customers'; // Use searchCustomers
import CustomerClientPage from '@/components/customers/customer-client-page';

export const dynamic = 'force-dynamic';

// This Server Component handles the initial data fetching.
const CustomerPage = async ({
    searchParams,
}: {
    // Use a flexible type that allows any string key and marks it as optional
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {
    // Extract filter values from URL search parameters.
    // Extract filter values from URL search parameters.
    const filters = {
        searchTerm: Array.isArray(searchParams?.search) ? searchParams.search[0] : searchParams?.search || '',
        status: Array.isArray(searchParams?.status) ? searchParams.status[0] : searchParams?.status || 'All',
        address: Array.isArray(searchParams?.address) ? searchParams.address[0] : searchParams?.address || '',
    };

    // Fetch the initial list of customers on the server using the searchCustomers action.
    const initialCustomers = await searchCustomers(filters);

    // Render the client component, passing the fetched data and filters as props.
    return <CustomerClientPage initialCustomers={initialCustomers} initialFilters={filters} />;
};

export default CustomerPage;
