import pool from '../config/database.js';

const SettingsModel = {
    // 1. Đếm tổng số tài khoản
    countAccounts: async () => {
        const query = `SELECT COUNT(*) as total FROM ACCOUNT`;
        const [rows] = await pool.query(query);
        return rows[0].total;
    },

    // 2. Lấy danh sách TẤT CẢ tài khoản
    getAllAccounts: async () => {
        const query = `
            SELECT 
                A.Username,
                A.Email,
                A.Phone,
                A.AccountTypeID,
                AT.AccountTypeName
            FROM ACCOUNT A
            INNER JOIN ACCOUNT_TYPE AT ON A.AccountTypeID = AT.AccountTypeID
            ORDER BY A.Username ASC
        `;
        const [rows] = await pool.query(query);
        return rows;
    },

    // 3. Xóa tài khoản
    deleteAccount: async (username) => {
        const checkQuery = `SELECT Username FROM ACCOUNT WHERE Username = ?`;
        const [checkRows] = await pool.query(checkQuery, [username]);
        
        if (checkRows.length === 0) throw new Error('Account not found');
        
        const deleteQuery = 'DELETE FROM ACCOUNT WHERE Username = ?';
        const [result] = await pool.query(deleteQuery, [username]);
        
        return result.affectedRows > 0;
    }
};

export default SettingsModel;