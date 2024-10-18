import mongoose, { Document, Schema } from 'mongoose';
import { format } from 'date-fns';

// Reaction schema
interface IReaction {
  reactionId: mongoose.Types.ObjectId;
  reactionBody: string;
  username: string;
  createdAt: Date;
}

const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp: Date): string => format(new Date(timestamp), 'MM/dd/yyyy HH:mm:ss'),
  }
},
{
  toJSON: {
    getters: true,
  },
  id: false,
});

interface IThought extends Document {
  thoughtText: string;
  createdAt: Date;
  username: string;
  userId: mongoose.Types.ObjectId; // Add userId here
  reactions: IReaction[];
  reactionCount: number;
}

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp: Date): string => format(new Date(timestamp), 'MM/dd/yyyy HH:mm:ss'),
  },
  username: {
    type: String,
    required: true,
  },
  userId: { // Reference to the User model
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Make it required to ensure every thought has a user
  },
  reactions: [reactionSchema],
},
{
  toJSON: {
    getters: true,
  },
  id: false,
});

const Thought = mongoose.model<IThought>('Thought', thoughtSchema);
export default Thought;