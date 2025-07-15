Blog Summarizer
A Next.js application that scrapes blog content using Axios and Cheerio, generates a simulated AI summary, translates it to Urdu, and stores data in Supabase and MongoDB, with a user-friendly interface built using ShadCN UI.


Overview
Blog Summarizer is a web application that takes a blog URL as input, scrapes its text content using Axios and Cheerio, generates a summary with static logic to simulate AI, and translates the summary into Urdu using a JavaScript dictionary. Summaries are stored in Supabase for real-time access, while full scraped text is saved in MongoDB for persistent storage. The app features a modern interface built with ShadCN UI and is deployed on Vercel for fast, scalable hosting.
Features

Web Scraping: Fetches and extracts blog content using Axios for HTTP requests and Cheerio for HTML parsing (src/lib/scrape.ts).
Simulated AI Summary: Generates concise summaries using static logic to mimic AI summarization (src/lib/summarize.ts, /api/summarize).
Urdu Translation: Translates summaries into Urdu using a JavaScript dictionary (src/lib/translate.ts).
Database Storage:
Supabase: Stores generated summaries for real-time access (src/lib/supabase.ts).
MongoDB Atlas: Saves full scraped text for persistent storage (src/lib/mongodb.ts).


User Interface: A responsive frontend built with ShadCN UI components for URL input and summary display (src/components/BlogSummarizer.tsx).
API: Dynamic API route for processing blog URLs and generating summaries (/api/summarize).
Static Content: Includes a sample static HTML file (public/sample.html).

Tech Stack

Framework: Next.js 15.3.5 with TypeScript
UI Library: ShadCN UI for modern, accessible components
Databases:
Supabase (real-time database for summaries)
MongoDB Atlas (NoSQL database for full text)


Scraping Libraries:
Axios (HTTP requests)
Cheerio (HTML parsing)


Deployment: Vercel
Key Libraries:
@supabase/supabase-js for Supabase integration
mongodb for MongoDB Atlas connectivity
axios and cheerio for web scraping




Installation

Clone the repository:
git clone https://github.com/Nexium-AI/Nexium_Afshan_Assign2.git
cd assignment-2


Install dependencies:
npm install


Set up environment variables (see Environment Variables).

Run the development server:
npm run dev

Open http://localhost:3000 in your browser to view the app.



Usage

Visit the deployed app at: https://assignment-2-a8qrfi5wx-afshann754s-projects.vercel.app

Use the Blog Summarizer interface (BlogSummarizer.tsx) to:

Enter a blog URL to scrape its content using Axios and Cheerio.
View a generated summary (simulated AI logic).
Translate the summary into Urdu.


The summary is saved in Supabase, and the full text is stored in MongoDB.

Test the summarization API directly:
curl -X POST https://assignment-2-a8qrfi5wx-afshann754s-projects.vercel.app/api/summarize -H "Content-Type: application/json" -d '{"url": "https://example.com"}'


Access static content at /sample.html (e.g., https://assignment-2-a8qrfi5wx-afshann754s-projects.vercel.app/sample.html).




Troubleshooting

Scraping Errors: Ensure the blog URL is accessible and Cheerio targets valid HTML elements in scrape.ts.

Supabase Errors: Verify SUPABASE_URL and SUPABASE_KEY are correctly set in Vercel’s environment variables.

MongoDB Errors: Check MONGODB_URI and ensure MongoDB Atlas network access allows Vercel’s servers (e.g., add 0.0.0.0/0 for testing).

CORS Issues: Adjust Supabase CORS settings in the Supabase dashboard if browser requests fail.

API Errors: Test the /api/summarize route and check Vercel logs for runtime errors:
vercel logs assignment-2-a8qrfi5wx-afshann754s-projects.vercel.app



Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

License
MIT License