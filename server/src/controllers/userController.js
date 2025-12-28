import UserService from '../services/userService.js';

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) return res.status(400).json({ success: false, message: 'Username is required' });

        const userProfile = await UserService.getUserProfile(username);

        if (!userProfile) return res.status(404).json({ success: false, message: 'User not found' });

        return res.status(200).json({ success: true, data: userProfile });

    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};