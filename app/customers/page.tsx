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
    // Await searchParams to access its properties as per Next.js documentation for Server Components.
    const awaitedSearchParams = await searchParams;
    const filters = {
        searchTerm: Array.isArray(awaitedSearchParams?.search) ? awaitedSearchParams.search[0] : awaitedSearchParams?.search || '',
        status: Array.isArray(awaitedSearchParams?.status) ? awaitedSearchParams.status[0] : awaitedSearchParams?.status || 'All',
        address: Array.isArray(awaitedSearchParams?.address) ? awaitedSearchParams.address[0] : awaitedSearchParams?.address || '',
    };

    // Fetch the initial list of customers on the server using the searchCustomers action.
    const initialCustomers = await searchCustomers(filters);

    // Render the client component, passing the fetched data and filters as props.
    return <CustomerClientPage initialCustomers={initialCustomers} initialFilters={filters} />;
};

export default CustomerPage;
