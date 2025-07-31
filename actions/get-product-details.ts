'use server';

import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

const formSchema = z.object({
  id: z.number(),
  type: z.enum(['Sofa', 'Bed']),
});

export default async function getProductDetails(id: number, type: 'Sofa' | 'Bed') {
  const supabase = createClient();

  const validatedFields = formSchema.safeParse({
    id: id,
    type: type,
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const tableName= validatedFields.data.type === 'Sofa' ? 'sofa_products' : 'bed_products';
  console.log('hi')

  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', validatedFields.data.id)
    .single();

  if (error) {
    return {
      errors: {
        database: ['Failed to fetch product details.'],
      },
    };
  }

  return {
    data,
  };
}
