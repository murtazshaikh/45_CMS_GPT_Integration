import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { comparePassword, generateTokens } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  await dbConnect();

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

  const tokens = generateTokens(user);
  res.status(200).json(tokens);
}
