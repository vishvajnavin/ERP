"use server";

import { createClient } from "@/utils/supabase/server";

// Define the structure of a single check item
export interface CheckItem {
  check_id: number;
  name: string;
  status: "pending" | "passed" | "failed" | "skipped";
}

// Define the structure for the entire checklist, grouped by stage
export type QcChecklist = Record<string, CheckItem[]>;

// NEW: Define a type for the joined 'stages' object
interface JoinedStage {
  name: string;
}

// NEW: Define the type for an item in the stageStatuses array.
// The 'stages' property is an object or null if the join fails.
interface StageStatusItem {
  stage_id: number;
  stages: JoinedStage | null;
}

export async function getQcChecklist(
  orderItemId: number
): Promise<{ data: QcChecklist | null; error: string | null }> {
  const supabase = createClient();

  // Fetch the active stages for this order item
  // MODIFIED: Use type assertion to tell TypeScript the shape of the data
  const { data: stageStatuses, error: stageError } = (await supabase
    .from("order_item_stage_status")
    .select("stage_id, stages!inner ( name )")
    .eq("order_item_id", orderItemId)
    .eq("status", "active")) as { data: StageStatusItem[] | null; error: unknown };

  if (stageError) {
    console.error("Error fetching active stages:", stageError);
    return { data: null, error: "Failed to fetch active stages." };
  }

  if (!stageStatuses || stageStatuses.length === 0) {
    return { data: {}, error: null }; // No active stages to check
  }

  // The rest of the code works correctly now because stageStatuses is typed
  const activeStageIds = stageStatuses.map((s) => s.stage_id);

  // Fetch all the checklist progress items for those active stages
  // Assuming the `checks` type inference is correct, no changes needed here.
  const { data: checks, error: checksError } = await supabase
    .from("checks")
    .select(
      `
      check_id,
      name,
      stage_id,
      product_checklist_progress (
        status
      )
    `
    )
    .in("stage_id", activeStageIds);

  if (checksError) {
    console.error("Error fetching checklist:", checksError);
    return { data: null, error: "Failed to fetch checklist items." };
  }

  // Group the checks by stage name
  const groupedChecklist: QcChecklist = {};

  stageStatuses.forEach((stageStatus) => {
    if (stageStatus.stages) {
      const stageName = stageStatus.stages.name;
      groupedChecklist[stageName] = [];
    }
  });
  checks.forEach((item) => {
    const stageName =
      stageStatuses.find((s) => s.stage_id === item.stage_id)?.stages?.name ||
      "Unknown Stage";
    if (groupedChecklist[stageName]) {
      groupedChecklist[stageName].push({
        check_id: item.check_id,
        name: item.name,
        status:
          (item.product_checklist_progress[0]?.status as CheckItem["status"]) ||
          "pending",
      });
    }
  });

  return { data: groupedChecklist, error: null };
}
