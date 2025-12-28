import SettingsService from '../services/settingsService.js';

// Lấy thông tin cài đặt chung (Surcharge + Số lượng Account)
export const getSettings = async (req, res) => {
    try {
        const settings = await SettingsService.getSettings();
        
        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error fetching settings:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch settings',
            error: error.message
        });
    }
};

// Cập nhật quy định phụ thu
export const updateSurcharge = async (req, res) => {
    try {
        const { foreignGuest, extraPerson, holiday } = req.body;
        
        // Validate input
        if (!foreignGuest || !extraPerson || !holiday) {
            return res.status(400).json({
                success: false,
                message: 'All surcharge values are required (foreignGuest, extraPerson, holiday)'
            });
        }

        // Validate numbers
        if (foreignGuest <= 0 || extraPerson <= 0 || holiday <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Surcharge values must be greater than 0'
            });
        }

        const updatedSurcharge = await SettingsService.updateSurcharge({
            foreignGuest,
            extraPerson,
            holiday
        });
        
        res.status(200).json({
            success: true,
            message: 'Surcharge settings updated successfully',
            data: updatedSurcharge
        });
    } catch (error) {
        console.error('Error updating surcharge:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to update surcharge settings',
            error: error.message
        });
    }
};

// Reset phụ thu về mặc định
export const resetSurcharge = async (req, res) => {
    try {
        const result = await SettingsService.resetSurcharge();
        
        res.status(200).json({
            success: true,
            message: result.message,
            data: result
        });
    } catch (error) {
        console.error('Error resetting surcharge:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to reset surcharge settings',
            error: error.message
        });
    }
};

export const getAccounts = async (req, res) => {
    try {
        const accounts = await SettingsService.getAccounts();
        res.status(200).json({ success: true, data: accounts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch account list', error: error.message });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) return res.status(400).json({ success: false, message: 'Username is required' });
        
        const result = await SettingsService.deleteAccount(username);
        res.status(200).json({ success: true, message: result.message, data: result });
    } catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({ success: false, message: error.message });
    }
};