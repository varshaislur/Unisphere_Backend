import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    const { username, email, password, isCommittee } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword, isCommittee });
        
        res.json({ success: true, message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.json({ success: false, message: 'Registration failed', error });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id, isCommittee: user.isCommittee }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login failed', error });
    }
};
