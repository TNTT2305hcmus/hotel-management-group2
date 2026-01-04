import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/database.js';

// Mock OTP Store
const otpStore = new Map();

async function register(username, password, email, phone = null, accountTypeID = 2) {
    try {
        // 1. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // 2. MySQL Query: Add Phone column
        const query = `
            INSERT INTO ACCOUNT (Username, Password, Email, Phone, AccountTypeID) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        // 3. Execute query (Remember to pass all 5 parameters in correct order)
        await pool.query(query, [username, hashedPassword, email, phone, accountTypeID]);
        
        return { success: true, message: 'User registered successfully' };
    } catch (error) {
        // Check for duplicate Email or Username (MySQL Error 1062)
        if (error.code === 'ER_DUP_ENTRY') {
             throw new Error('Username or Email already exists!');
        }
        throw new Error('Registration failed: ' + error.message);
    }
}

async function login(username, password) {
    try {
        const query = `
            SELECT a.Username, a.Password, a.AccountTypeID, at.AccountTypeName
            FROM ACCOUNT a
            JOIN ACCOUNT_TYPE at ON a.AccountTypeID = at.AccountTypeID
            WHERE a.Username = ?
        `;
        
        const [rows] = await pool.query(query, [username]);
        
        // Check if user exists
        if (rows.length === 0) {
            throw new Error('Invalid username or password');
        }
        
        const user = rows[0];
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            throw new Error('Invalid username or password');
        }
        
        // Generate Token
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

async function forgotPassword(email) {
    try {
        const query = 'SELECT Username FROM ACCOUNT WHERE Email = ?';
        const [rows] = await pool.query(query, [email]);

        if (rows.length === 0) {
            throw new Error('Email not found');
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = Date.now() + 15 * 60 * 1000;

        otpStore.set(email, { otp, expiresAt, username: rows[0].Username });

        return {
            message: 'Mock OTP generated.',
            username: rows[0].Username,
            mockOtp: otp 
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

async function verifyOtp(email, otp) {
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

        return { message: 'OTP Verified successfully', valid: true };
    } catch (error) {
        throw new Error(error.message);
    }
}

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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const query = 'UPDATE ACCOUNT SET Password = ? WHERE Email = ?';
        await pool.query(query, [hashedPassword, email]);

        otpStore.delete(email);

        return { message: 'Password reset successfully' };
    } catch (error) {
        throw new Error(error.message);
    }
}

// Export default Object as before
export default { register, login, forgotPassword, resetPasswordWithOtp, verifyOtp };