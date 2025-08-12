'use server'

import { createClient } from '@/utils/supabase/server'

export async function getOrderItemStageStatus(orderItemId: number) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('order_item_stage_status')
    .select(
      `
      status,
      stages (
        name
      )
    `,
    )
    .eq('order_item_id', orderItemId)

  if (error) {
    console.error('Error fetching order item stage status:', error)
    return []
  }

  return data.map((item: any) => ({
    stage: item.stages.name,
    status: item.status,
  }))
}
