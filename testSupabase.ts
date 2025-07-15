import { saveSummaryAndFullText } from "./src/lib/supabase";
//import { saveSummaryAndFullText } from "@/lib/supabase";
async function test() {
  try {
   await saveSummaryAndFullText(
    "https://example-test-" + Date.now() + ".com",  // Make it unique
    "Test summary",
    "فیصلہ خلاصہ",
    "This is the full text of the blog post..."
);
    console.log("Summary and full text saved successfully");
  } catch (error) {
    console.error("Test Error:", error);
  }
}

test();