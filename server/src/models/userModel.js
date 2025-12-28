import pool from '../config/database.js';

const UserModel = {
    // Tìm user theo username để hiển thị profile
    findByUsername: async (username) => {
        const query = `
            SELECT 
                A.Username, 
                A.Email, 
                A.Phone, 
                A.AccountTypeID,
                AT.AccountTypeName
            FROM ACCOUNT A
            INNER JOIN ACCOUNT_TYPE AT ON A.AccountTypeID = AT.AccountTypeID
            WHERE A.Username = ?
        `;
        
        const [rows] = await pool.query(query, [username]);
        return rows[0] || null;
    },
};

export default UserModel;