const User = require('../models/Game');

exports.createUser = async (req, res) => {
    const { username, grid } = req.body;

    const user = new User({
        username,
        grid,
        cutNumbers: [],
    });

    try {
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create user', error });
    }
};

exports.generateRandomNumber = (req, res) => {
    const randomNumber = Math.floor(Math.random() * 9) + 1;
    res.status(200).json({ randomNumber });
};

exports.cutNumber = async (req, res) => {
    const { userId, number } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.cutNumbers.push(number);
        await user.save();

        res.status(200).json({ message: 'Number cut' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to cut number', error });
    }
};

exports.onDatabaseChange = (io) => {
    const userCollection = User.watch();

    userCollection.on('change', async (change) => {
        if (change.operationType === 'update') {
            const user = await User.findById(change.documentKey._id);
            if (checkWin(user)) {
                io.emit('winner', { username: user.username });
            }
        }
    });
};

const checkWin = (user) => {
    const { grid, cutNumbers } = user;
    const isRowComplete = grid.some(row => row.every(num => cutNumbers.includes(num)));
    const isColumnComplete = [0, 1, 2].some(col => grid.every(row => cutNumbers.includes(row[col])));

    return isRowComplete || isColumnComplete;
};
