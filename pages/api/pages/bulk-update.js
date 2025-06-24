import dbConnect from "../../../lib/dbConnect";
import Page from "../../../models/Page";
import authMiddleware from "../../../lib/protect";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default authMiddleware(async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { ids, prompt } = req.body;

  if (!Array.isArray(ids) || !prompt) {
    return res
      .status(400)
      .json({ message: "Invalid input: provide ids and prompt" });
  }

  await dbConnect();
  const pages = await Page.find({ _id: { $in: ids } });

  if (!pages.length)
    return res.status(404).json({ message: "No pages found for given IDs" });

  // Create batch prompt
  const pagesText = pages
    .map((p, i) => `Page ${i + 1}:\nTitle: ${p.title}\nContent: ${p.content}\n`)
    .join("\n");

  const fullPrompt = `
${prompt}

Here are the pages:
${pagesText}

For each page, return updated JSON in the following format:
[
  {
    "index": 1,
    "meta_title": "...",
    "meta_description": "...",
    "keywords": [...],
    "title": "...",              // (optional)
    "content": "..."             // (optional)
  },
  ...
]
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: fullPrompt }],
    });

    const output = response.choices[0].message.content;

    let updates;
    try {
      updates = JSON.parse(output);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Invalid GPT response format", output });
    }

    // Prepare bulk updates
    const ops = updates.map((item) => {
      const pageIndex = item.index - 1;
      const pageId = pages[pageIndex]._id;

      const updateDoc = {};
      if (item.meta_title) updateDoc.meta_title = item.meta_title;
      if (item.meta_description)
        updateDoc.meta_description = item.meta_description;
      if (item.keywords) updateDoc.keywords = item.keywords;
      if (item.title) updateDoc.title = item.title;
      if (item.content) updateDoc.content = item.content;

      return {
        updateOne: {
          filter: { _id: pageId },
          update: { $set: updateDoc },
        },
      };
    });

    await Page.bulkWrite(ops);

    res.status(200).json({ success: true, updatedCount: ops.length });
  } catch (error) {
    console.error("Bulk GPT Error:", error.message);
    res.status(500).json({ message: "OpenAI error", error: error.message });
  }
});
