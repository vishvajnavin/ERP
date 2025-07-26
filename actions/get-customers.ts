'use server';

import { createClient } from '@/utils/supabase/server';
import { Customer } from '@/types/customers'; // Assuming this type is updated or compatible

export async function getCustomers(filters: {
    searchTerm: string;
    status: string;
    address: string;
    // Note: minSpend and maxSpend are not in the DB schema, so they are omitted here.
    // You would need to add a 'total_spend' column to filter by it.
}) {
    const supabase = createClient();
    
    // Start building the query.
    let query = supabase
        .from('customer_details')
        .select(`
            id,
            customer_name,
            email,
            company,
            address,
            mobile_number,
            customer_type,
            created_at
        `);

    // Apply search term filter across multiple fields.
    if (filters.searchTerm) {
        // The 'or' filter allows searching across multiple columns for the same term.
        query = query.or(
            `customer_name.ilike.%${filters.searchTerm}%,` +
            `company.ilike.%${filters.searchTerm}%,` +
            `email.ilike.%${filters.searchTerm}%`
        );
    }

    // Apply address filter. 'ilike' is used for case-insensitive matching.
    if (filters.address) {
        query = query.ilike('address', `%${filters.address}%`);
    }
    
    // Note: The 'status' filter from the original component is not applied here
    // because there is no 'status' column in your 'customer_details' table schema.
    // To implement this, you would need to add a 'status' column to the table.

    // Execute the query and order by creation date.
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error('Supabase fetch error:', error);
        throw new Error('Could not fetch customer data.');
    }

    // Map the database response to your 'Customer' type.
    // This is an important step to ensure data consistency.
    const customers: Customer[] = data.map(c => ({
        id: c.id,
        name: c.customer_name,
        email: c.email,
        company: c.company || 'N/A',
        address: c.address, // Changed from location
        phone: c.mobile_number,
        customerType: c.customer_type,
        dateAdded: new Date(c.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        // The fields below are not in your DB schema.
        // You would need to calculate or store them to display them.
        avatar: `https://i.pravatar.cc/150?u=${c.id}`, // Placeholder
        totalOrders: 0, // Placeholder
        totalSpend: 0, // Placeholder
        lastOrder: 'N/A', // Placeholder
        status: 'Active' // Placeholder
    }));
    
    return customers;
}
