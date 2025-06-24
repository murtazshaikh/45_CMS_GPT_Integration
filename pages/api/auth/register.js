import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { hashPassword } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  await dbConnect();

  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashed = await hashPassword(password);
  const user = await User.create({ email, password: hashed });

  res.status(201).json({ message: 'User created', userId: user._id });
}
