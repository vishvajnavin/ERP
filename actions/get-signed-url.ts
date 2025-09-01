'use server';

import { createClient } from '@/utils/supabase/server';

export async function getSignedUrl(path: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from('order-images')
    .createSignedUrl(path, 3600); // URL is valid for 1 hour

  if (error) {
    console.error('Error creating signed URL:', error);
    return null;
  }

  return data.signedUrl;
}
