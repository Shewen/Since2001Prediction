import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async () => {
  try {
    const siteUrl = "https://since2001prediction.netlify.app";

    const { count, error } = await supabase
      .from("teams")
      .select("id", { count: "exact", head: true })
      .not("football_data_id", "is", null);

    if (error) {
      throw error;
    }

    const batchSize = 2;
    const totalBatches = Math.ceil(count / batchSize);

    const now = new Date();

    const hoursSinceEpoch = Math.floor(
      now.getTime() / (3 * 60 * 60 * 1000)
    );

    const batchNumber =
      (hoursSinceEpoch % totalBatches) + 1;

    const updateUrl =
      `${siteUrl}/.netlify/functions/update-all-forms?batch=${batchNumber}`;

    const response = await fetch(updateUrl);
    const result = await response.text();

    console.log("Automatic form update completed:", {
      mappedTeams: count,
      batchSize,
      totalBatches,
      batch: batchNumber,
      result,
    });
  } catch (error) {
    console.error("Automatic form update failed:", error);
  }
};

export const config = {
  schedule: "0 */3 * * *",
};