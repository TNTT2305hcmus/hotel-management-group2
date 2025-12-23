import pool from '../config/database.js';

const SettingsModel = {
    // Count Receptionist accounts
    countReceptionists: async () => {
        const query = `
            SELECT COUNT(*) as total 
            FROM ACCOUNT A
            INNER JOIN ACCOUNT_TYPE AT ON A.AccountTypeID = AT.AccountTypeID
            WHERE AT.AccountTypeName = 'Receptionist'
        `;
        const [rows] = await pool.query(query);
        return rows[0].total;
    },

    // Get list of Receptionist accounts (without password)
    getReceptionists: async () => {
        const query = `
            SELECT 
                A.Username,
                A.Email,
                A.Phone,
                A.AccountTypeID,
                AT.AccountTypeName
            FROM ACCOUNT A
            INNER JOIN ACCOUNT_TYPE AT ON A.AccountTypeID = AT.AccountTypeID
            WHERE AT.AccountTypeName = 'Receptionist'
            ORDER BY A.Username ASC
        `;
        const [rows] = await pool.query(query);
        return rows;
    }
};

export default SettingsModel;
