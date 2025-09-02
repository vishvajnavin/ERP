'use server';

import { createClient } from '@/utils/supabase/server';

export async function getSignedUrl(path: string): Promise<{ data: { signedUrl: string } | null; error: any }> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from('order-images')
    .createSignedUrl(path, 3600); // URL is valid for 1 hour

  if (error) {
    // Suppress "Object not found" errors from console, as they are handled gracefully in the UI.
    // Other errors will still be logged.
    if (error.message !== 'Object not found') {
      console.error('Error creating signed URL for path:', path, 'Error:', error);
    }
    return { data: null, error: error.message || 'Unknown error creating signed URL' };
  }

  return { data, error: null };
}
