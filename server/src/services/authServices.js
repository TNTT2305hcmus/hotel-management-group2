import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sql } from '../config/database.js';

// In-memory store for mock OTPs; in production replace with DB/Redis
const otpStore = new Map();

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

// Mock forgot-password flow: verify email exists and return a mock OTP (no email sent)
async function forgotPassword(email) {
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('Email', sql.VarChar(255), email)
            .query('SELECT Username FROM ACCOUNT WHERE Email = @Email');

        if (result.recordset.length === 0) {
            throw new Error('Email not found');
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

        otpStore.set(email, { otp, expiresAt, username: result.recordset[0].Username });

        return {
            message: 'Mock OTP generated. In production, this would be emailed to the user.',
            username: result.recordset[0].Username,
            mockOtp: otp // keep in response for demo; also logged in controller
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

// Verify OTP and reset password
async function resetPasswordWithOtp(email, otp, newPassword) {
    try {
        const entry = otpStore.get(email);

        if (!entry) {
            throw new Error('No OTP requested for this email');
        }

        if (Date.now() > entry.expiresAt) {
            otpStore.delete(email);
            throw new Error('OTP expired');
        }

        if (entry.otp !== otp) {
            throw new Error('Invalid OTP');
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        const pool = await sql.connect();
        await pool.request()
            .input('Email', sql.VarChar(255), email)
            .input('Password', sql.VarChar(255), hashedPassword)
            .query('UPDATE ACCOUNT SET Password = @Password WHERE Email = @Email');

        otpStore.delete(email);

        return { message: 'Password reset successfully' };
    } catch (error) {
        throw new Error(error.message);
    }
}

export default { register, login, forgotPassword, resetPasswordWithOtp };
