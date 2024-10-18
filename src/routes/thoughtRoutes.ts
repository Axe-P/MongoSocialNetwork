import express, { Request, Response } from 'express';
import Thought from '../models/Thought';
import User from '../models/User';

const router = express.Router();

// GET all thoughts
router.get('/', async (_req: Request, res: Response) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET a single thought by _id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const thoughts = await Thought.findById(req.params.id);
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST a new thought
router.post('/', async (req: Request, res: Response) => {
  try {
    const { thoughtText, username, userId } = req.body; // Destructure userId from request body

    // Create the thought
    const thought = await Thought.create({ thoughtText, username, userId });

    // Find the user and push the created thought's ID to their thoughts array
    await User.findByIdAndUpdate(userId, { $push: { thoughts: thought._id } });

    res.status(201).json(thought);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// PUT to update a thought
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(thought);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// DELETE to remove a thought
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await Thought.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST to create a reaction
router.post('/:thoughtId/reactions', async (req: Request, res: Response): Promise<void> => {
  try {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body; // Expecting reaction data in the body

    // Find the thought and push the new reaction to its reactions array
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $push: { reactions: { reactionBody, username } } },
      { new: true }
    );

    if (!thought) {
      res.status(404).json({ error: 'Thought not found' });
      return;
    }

    res.status(201).json(thought);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// DELETE to remove a reaction by reactionId
router.delete('/:thoughtId/reactions/:reactionId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { thoughtId, reactionId } = req.params;

    // Find the thought and pull the reaction with the given reactionId from its reactions array
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $pull: { reactions: { _id: reactionId } } }, // Match reaction by its _id field
      { new: true }
    );

    if (!thought) {
      res.status(404).json({ error: 'Thought not found' });
      return;
    }

    res.json(thought);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;