import express, { Request, Response } from 'express';
import User from '../models/User';

const router = express.Router();

// GET all users
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await User.find().populate('thoughts').populate('friends');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET a single user by _id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST a new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// PUT to update a user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// DELETE to remove user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST to add a friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req: Request, res: Response): Promise<void> => {
  console.log('POST request received:', req.params);
  try {
    const { userId, friendId } = req.params;

    // Find the user and add the friend's ID to their friends array
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } }, // Use $addToSet to prevent duplicates
      { new: true } // Return the updated user
    ).populate('thoughts').populate('friends');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, friendId } = req.params;

    // Find the user and remove the friend's ID from their friends array
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } }, // Use $pull to remove the friend's ID
      { new: true } // Return the updated user
    ).populate('thoughts').populate('friends');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;