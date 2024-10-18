"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Thought_1 = __importDefault(require("../models/Thought"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// GET all thoughts
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thoughts = yield Thought_1.default.find();
        res.json(thoughts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// GET a single thought by _id
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thoughts = yield Thought_1.default.findById(req.params.id);
        res.json(thoughts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// POST a new thought
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { thoughtText, username, userId } = req.body; // Destructure userId from request body
        // Create the thought
        const thought = yield Thought_1.default.create({ thoughtText, username, userId });
        // Find the user and push the created thought's ID to their thoughts array
        yield User_1.default.findByIdAndUpdate(userId, { $push: { thoughts: thought._id } });
        res.status(201).json(thought);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// PUT to update a thought
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thought = yield Thought_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(thought);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// DELETE to remove a thought
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Thought_1.default.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// POST to create a reaction
router.post('/:thoughtId/reactions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { thoughtId } = req.params;
        const { reactionBody, username } = req.body; // Expecting reaction data in the body
        // Find the thought and push the new reaction to its reactions array
        const thought = yield Thought_1.default.findByIdAndUpdate(thoughtId, { $push: { reactions: { reactionBody, username } } }, { new: true });
        if (!thought) {
            res.status(404).json({ error: 'Thought not found' });
            return;
        }
        res.status(201).json(thought);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// DELETE to remove a reaction by reactionId
router.delete('/:thoughtId/reactions/:reactionId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { thoughtId, reactionId } = req.params;
        // Find the thought and pull the reaction with the given reactionId from its reactions array
        const thought = yield Thought_1.default.findByIdAndUpdate(thoughtId, { $pull: { reactions: { _id: reactionId } } }, // Match reaction by its _id field
        { new: true });
        if (!thought) {
            res.status(404).json({ error: 'Thought not found' });
            return;
        }
        res.json(thought);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
exports.default = router;
