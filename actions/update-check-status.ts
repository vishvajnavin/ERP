"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { CheckItem } from "./get-qc-checklist"; // Reuse the type

export async function updateCheckStatus(
  orderItemId: number,
  checkId: number,
  newStatus: CheckItem["status"],
  failure_report?: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();

  const updateData: {
    status: CheckItem["status"];
    updated_at: string;
    failure_report?: string;
  } = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (newStatus === "failed" && failure_report) {
    updateData.failure_report = failure_report;
  }

  const { error } = await supabase
    .from("product_checklist_progress")
    .update(updateData)
    .eq("order_item_id", orderItemId)
    .eq("check_id", checkId);

  if (error) {
    console.error("Error updating check status:", error);
    return { success: false, error: "Failed to update check status." };
  }

  // Revalidate the path to ensure the UI updates with the new data
  revalidatePath("/view-orders"); // Adjust the path as needed

  return { success: true, error: null };
}
