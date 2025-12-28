import SettingsModel from '../models/settingsModel.js';
import surcharge, { surchargeDefault } from '../config/surchargeRegulations.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SettingsService = {
    // Get all settings data
    getSettings: async () => {
        try {
            const accountCount = await SettingsModel.countAccounts();
            return {
                surcharge: surcharge,
                receptionistCount: accountCount 
            };
        } catch (error) {
            throw new Error('Failed to fetch settings: ' + error.message);
        }
    },

    // Update surcharge settings
    updateSurcharge: async (newSurcharge) => {
        try {
            // Check if values are different
            const isDifferent = 
                surcharge.foreignGuest !== newSurcharge.foreignGuest ||
                surcharge.extraPerson !== newSurcharge.extraPerson ||
                surcharge.holiday !== newSurcharge.holiday;

            if (!isDifferent) {
                return {
                    updated: false,
                    message: 'No changes detected',
                    data: surcharge
                };
            }

            // Update the file
            const filePath = path.join(__dirname, '../config/surchargeRegulations.js');
            const fileContent = `const surcharge = {
    foreignGuest: ${newSurcharge.foreignGuest},
    extraPerson: ${newSurcharge.extraPerson},
    holiday: ${newSurcharge.holiday}
};
const surchargeDefault = {
    foreignGuest: ${surchargeDefault.foreignGuest},
    extraPerson: ${surchargeDefault.extraPerson},
    holiday: ${surchargeDefault.holiday}
};
export default surcharge;
export { surchargeDefault };
`;

            await fs.writeFile(filePath, fileContent, 'utf8');

            // Update in-memory object
            surcharge.foreignGuest = newSurcharge.foreignGuest;
            surcharge.extraPerson = newSurcharge.extraPerson;
            surcharge.holiday = newSurcharge.holiday;

            return {
                updated: true,
                message: 'Surcharge settings updated successfully',
                data: surcharge
            };
        } catch (error) {
            throw new Error('Failed to update surcharge settings: ' + error.message);
        }
    },

    // Reset surcharge to default
    resetSurcharge: async () => {
        try {
            // Check if already at default
            const isAlreadyDefault = 
                surcharge.foreignGuest === surchargeDefault.foreignGuest &&
                surcharge.extraPerson === surchargeDefault.extraPerson &&
                surcharge.holiday === surchargeDefault.holiday;

            if (isAlreadyDefault) {
                return {
                    reset: false,
                    message: 'Surcharge is already at default values',
                    data: surcharge
                };
            }

            // Update the file
            const filePath = path.join(__dirname, '../config/surchargeRegulations.js');
            const fileContent = `const surcharge = {
    foreignGuest: ${surchargeDefault.foreignGuest},
    extraPerson: ${surchargeDefault.extraPerson},
    holiday: ${surchargeDefault.holiday}
};
const surchargeDefault = {
    foreignGuest: ${surchargeDefault.foreignGuest},
    extraPerson: ${surchargeDefault.extraPerson},
    holiday: ${surchargeDefault.holiday}
};
export default surcharge;
export { surchargeDefault };
`;

            await fs.writeFile(filePath, fileContent, 'utf8');

            // Update in-memory object
            surcharge.foreignGuest = surchargeDefault.foreignGuest;
            surcharge.extraPerson = surchargeDefault.extraPerson;
            surcharge.holiday = surchargeDefault.holiday;

            return {
                reset: true,
                message: 'Surcharge reset to default values successfully',
                data: surcharge
            };
        } catch (error) {
            throw new Error('Failed to reset surcharge settings: ' + error.message);
        }
    },

    // Get list of accounts
    getAccounts: async () => {
        try {
            const accounts = await SettingsModel.getAllAccounts();
            return accounts;
        } catch (error) {
            throw new Error('Failed to fetch accounts: ' + error.message);
        }
    },

    // Delete account
    deleteAccount: async (username) => {
        try {
            const deleted = await SettingsModel.deleteAccount(username);
            if (deleted) {
                return { deleted: true, message: `Account '${username}' deleted successfully` };
            }
            return { deleted: false, message: 'Failed to delete account' };
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

export default SettingsService;
