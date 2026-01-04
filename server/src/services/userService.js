import UserModel from '../models/userModel.js';

const UserService = {
    getUserProfile: async (username) => {
        try {
            const user = await UserModel.findByUsername(username);
            
            if (!user) return null; 

            return {
                username: user.Username,
                email: user.Email,
                phone: user.Phone,
                accountTypeID: user.AccountTypeID, // Thêm AccountTypeID để client check quyền
                accountTypeName: user.AccountTypeName
            };
        } catch (error) {
            throw new Error('Service Error: ' + error.message);
        }
    }
};

export default UserService;