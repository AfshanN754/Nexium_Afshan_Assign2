import axios, { AxiosError, AxiosResponse } from "axios";
import { load } from "cheerio";

export async function scrapeBlog(url: string): Promise<string> {
  try {
    console.log("Attempting to scrape:", url);
    const response: AxiosResponse = await axios.get(url, {
      validateStatus: (status) => status >= 200 && status < 300,
    });
    console.log("Scraping successful, status:", response.status); // Moved inside try block
    const $ = load(response.data);
    let text = "";
    $("p").each((index: number, element: cheerio.Element) => {
      text += $(element).text().trim() + " ";
    });
    const result = text.trim() || "No text found";
    console.log("Extracted text:", result);
    return result;
  } catch (error) {
    console.error("Scraping error:", error);
    if (error instanceof AxiosError) {
      console.log("Error response status:", error.response?.status);
      console.log("Error response data:", error.response?.data?.substring(0, 200));
      throw new Error(
        `Failed to scrape blog: ${error.response?.statusText || error.message}`
      );
    } else {
      throw new Error("Failed to scrape blog: Unknown error");
    }
  }
}