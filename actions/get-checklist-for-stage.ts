'use server';

import { createClient } from '@/utils/supabase/server';

export async function getChecklistForStage(orderItemId: number, stageId: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('checks')
    .select(`
      check_id,
      name,
      sequence,
      product_checklist_progress (
        status,
        notes,
        inspected_by,
        updated_at
      )
    `)
    .eq('stage_id', stageId)
    .eq('product_checklist_progress.order_item_id', orderItemId)
    .order('sequence');

  if (error) {
    console.error('Error fetching checklist for stage:', error);
    return [];
  }

  return data.map(item => ({
    ...item,
    status: item.product_checklist_progress[0]?.status || 'pending',
  }));
}
