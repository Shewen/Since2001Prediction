export default async () => {
  try {
    const siteUrl = "https://since2001prediction.netlify.app";

   const now = new Date();
const hoursSinceEpoch = Math.floor(
  now.getTime() / (3 * 60 * 60 * 1000)
);

const batchNumber = (hoursSinceEpoch % 9) + 1;

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
  schedule: "0 */3 * * *",
};