export default async () => {
  try {
    const siteUrl = "https://since2001prediction.netlify.app";

    const hour = new Date().getUTCHours();

    // Run one batch each hour.
    // 9 batches = complete refresh every 9 hours.
    const batchNumber = (hour % 9) + 1;

    const updateUrl =
      `${siteUrl}/.netlify/functions/update-all-forms?batch=${batchNumber}`;

    const response = await fetch(updateUrl);

    const result = await response.text();

    console.log("Automatic form update completed:", {
      batch: batchNumber,
      result,
    });
  } catch (error) {
    console.error("Automatic form update failed:", error);
  }
};

export const config = {
  schedule: "0 * * * *",
};