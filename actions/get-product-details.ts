'use server';

import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { table } from 'console';

const formSchema = z.object({
  id: z.number(),
  type: z.enum(['sofa', 'bed']),
});

export default async function getProductDetails(id: number, type: 'sofa' | 'bed') {
  const supabase = await createClient();

  const validatedFields = formSchema.safeParse({
    id: id,
    type: type,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const tableName= validatedFields.data.type === 'sofa' ? 'sofa_products' : 'bed_products';
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', validatedFields.data.id)
    .single();

  if (error || !data) {
    return {
      errors: {
        database: ['Failed to fetch product details or product not found.'],
      },
    };
  }

  return {
    data,
  };
}
