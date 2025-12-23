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
    },

    // Delete Receptionist account by username
    deleteReceptionist: async (username) => {
        // First check if user exists and is Receptionist
        const checkQuery = `
            SELECT A.Username, AT.AccountTypeName
            FROM ACCOUNT A
            INNER JOIN ACCOUNT_TYPE AT ON A.AccountTypeID = AT.AccountTypeID
            WHERE A.Username = ?
        `;
        const [checkRows] = await pool.query(checkQuery, [username]);
        
        if (checkRows.length === 0) {
            throw new Error('Account not found');
        }
        
        if (checkRows[0].AccountTypeName !== 'Receptionist') {
            throw new Error('Can only delete Receptionist accounts');
        }
        
        // Delete account
        const deleteQuery = 'DELETE FROM ACCOUNT WHERE Username = ?';
        const [result] = await pool.query(deleteQuery, [username]);
        
        return result.affectedRows > 0;
    }
};

export default SettingsModel;
