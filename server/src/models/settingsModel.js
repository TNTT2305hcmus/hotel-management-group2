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
    }
};

export default SettingsModel;
