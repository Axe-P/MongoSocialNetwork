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
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// GET all users
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find().populate('thoughts').populate('friends');
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// GET a single user by _id
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id).populate('thoughts').populate('friends');
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// POST a new user
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.create(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// PUT to update a user
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// DELETE to remove user
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User_1.default.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// POST to add a friend to a user's friend list
router.post('/:userId/friends/:friendId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST request received:', req.params);
    try {
        const { userId, friendId } = req.params;
        // Find the user and add the friend's ID to their friends array
        const user = yield User_1.default.findByIdAndUpdate(userId, { $addToSet: { friends: friendId } }, // Use $addToSet to prevent duplicates
        { new: true } // Return the updated user
        ).populate('thoughts').populate('friends');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, friendId } = req.params;
        // Find the user and remove the friend's ID from their friends array
        const user = yield User_1.default.findByIdAndUpdate(userId, { $pull: { friends: friendId } }, // Use $pull to remove the friend's ID
        { new: true } // Return the updated user
        ).populate('thoughts').populate('friends');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
exports.default = router;
