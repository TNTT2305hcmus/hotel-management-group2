import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql } from '../config/database.js';

async function register(username, password, accountTypeID = 2) {
    try {
        // Encrypt password
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        // Insert into database
        const pool = await sql.connect();
        await pool.request()
            .input('Username', sql.VarChar(50), username)
            .input('Password', sql.VarChar(255), hashedPassword)
            .input('AccountTypeID', sql.Int, accountTypeID)
            .query('INSERT INTO ACCOUNT (Username, Password, AccountTypeID) VALUES (@Username, @Password, @AccountTypeID)');
        
        return { success: true, message: 'User registered successfully' };
    } catch (error) {
        throw new Error('Registration failed: ' + error.message);
    }
}

async function login(username, password) {
    try {
        // Query user from database
        const pool = await sql.connect();
        const result = await pool.request()
            .input('Username', sql.VarChar(50), username)
            .query(`
                SELECT a.Username, a.Password, a.AccountTypeID, at.AccountTypeName
                FROM ACCOUNT a
                JOIN ACCOUNT_TYPE at ON a.AccountTypeID = at.AccountTypeID
                WHERE a.Username = @Username
            `);
        
        // Check if user exists
        if (result.recordset.length === 0) {
            throw new Error('Invalid username or password');
        }
        
        const user = result.recordset[0];
        
        // Verify password
        const isPasswordValid = bcrypt.compareSync(password, user.Password);
        if (!isPasswordValid) {
            throw new Error('Invalid username or password');
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                username: user.Username, 
                accountTypeID: user.AccountTypeID,
                accountTypeName: user.AccountTypeName
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
        
        return {
            token,
            accountTypeID: user.AccountTypeID,
            accountTypeName: user.AccountTypeName
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

export default { register, login };