import { createClient } from "@supabase/supabase-js";
import { MongoClient } from "mongodb";
import { env } from "process";

const supabase = createClient(env.SUPABASE_URL || "", env.SUPABASE_ANON_KEY || "");
const mongoUri = env.MONGODB_URI || "";
const mongoClient = new MongoClient(mongoUri);

export async function saveSummaryAndFullText(
  url: string,
  summary: string,
  urduSummary: string,
  fullText: string
) {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("nexium");
    const fullTextsCollection = db.collection("fullTexts");

    // Check if URL already exists in Supabase
    const { data: existing, error: checkError } = await supabase
      .from("summaries")
      .select("*")
      .eq("url", url)
      .single();

    if (checkError && checkError.code !== "PGRST116") { // PGRST116 = no rows found
      console.error("Supabase check error:", checkError);
      throw checkError;
    }

    if (existing) {
      // Update existing record
      const { error } = await supabase
        .from("summaries")
        .update({ summary, urdu_summary: urduSummary, updated_at: new Date() })
        .eq("url", url);
      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
      console.log("Updated existing record for URL:", url);
    } else {
      // Insert new record
      const { error } = await supabase
        .from("summaries")
        .insert({ url, summary, urdu_summary: urduSummary, created_at: new Date() });
      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }
      console.log("Inserted new record for URL:", url);
    }

    // Save or update full text in MongoDB
    const result = await fullTextsCollection.updateOne(
      { url },
      { $set: { fullText, updatedAt: new Date() } },
      { upsert: true }
    );
    if (!result.acknowledged) {
      console.error("MongoDB update failed:", result);
      throw new Error("MongoDB update not acknowledged");
    }
    console.log("Saved full text for", url);
  } catch (err) {
    console.error("Supabase or MongoDB error details:", err);
    throw new Error(`Failed to save: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
  } finally {
    await mongoClient.close();
  }
}