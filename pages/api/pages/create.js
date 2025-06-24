import dbConnect from '../../../lib/dbConnect';
import Page from '../../../models/Page';
import authMiddleware from '../../../lib/protect';

export default authMiddleware(async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  await dbConnect();

  const { title, content, category } = req.body;

  const page = await Page.create({
    title,
    content,
    category: category || '',
  });

  res.status(201).json({ success: true, id: page._id });
});
