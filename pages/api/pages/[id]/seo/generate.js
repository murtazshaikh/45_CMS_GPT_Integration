import dbConnect from "../../../../../lib/dbConnect";
import Page from "../../../../../models/Page";
import authMiddleware from "../../../../../lib/protect";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default authMiddleware(async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { id } = req.query;

  await dbConnect();
  const page = await Page.findById(id);
  if (!page) return res.status(404).json({ message: "Page not found" });

  const { title, content, category } = page;

  try {
    const prompt = `
Generate SEO metadata for the following content.
Title: ${title}
Category: ${category || "General"}
Content: ${content}

Return JSON with meta_title, meta_description, and a list of keywords.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    if (!response || !response.choices || response.choices.length === 0) {
      return res
        .status(500)
        .json({ message: "No response from OpenAI", response });
    }

    const output = response.choices[0].message.content;

    // Try to safely parse JSON from the response
    let seoData;
    try {
      seoData = JSON.parse(output);
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Invalid GPT response format", output });
    }

    // Save the metadata to MongoDB
    page.meta_title = seoData.meta_title;
    page.meta_description = seoData.meta_description;
    page.keywords = seoData.keywords;
    await page.save();

    res.status(200).json({ success: true, seo: seoData });
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    res.status(500).json({ message: "OpenAI error", error: error.message });
  }
});
