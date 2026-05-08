import express from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import db from '../db.js';

const router = express.Router();


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}



router.get('/register', (req, res) => {
    res.render('register', { error: null, oldInput: {} });
});

router.post('/register', async (req, res) => {
    const { userType, email, name, password, city, district } = req.body;

    try {

        const [existingConsumer] = await db.query('SELECT id FROM ConsumerUsers WHERE email = ?', [email]);
        const [existingMarket] = await db.query('SELECT id FROM MarketUsers WHERE email = ?', [email]);

        if (existingConsumer.length > 0 || existingMarket.length > 0) {
            return res.render('register', {
                error: 'This email address is already in use!',
                oldInput: req.body
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const code = generateCode();


        await db.query('DELETE FROM PendingVerifications WHERE email = ?', [email]);


        await db.query(
            'INSERT INTO PendingVerifications (email, code, userType, name, password, city, district) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [email, code, userType, name, hashedPassword, city, district]
        );


        await transporter.sendMail({
            from: '"BGT Market" <gulnihalaydogdu15@gmail.com>',
            to: email,
            subject: 'BGT Market — Verification Code',
            html: `
                <h2>Welcome to BGT Market!</h2>
                <p>Your verification code to complete registration:</p>
                <h1 style="letter-spacing: 8px; color: #2d6a4f;">${code}</h1>
                <p>This code is valid for 10 minutes.</p>
            `
        });


        res.redirect('/verify?email=' + encodeURIComponent(email));

    } catch (error) {
        console.error("Registration Error:", error);
        res.render('register', {
            error: 'An error occurred while signing up.',
            oldInput: req.body
        });
    }
});



router.get('/verify', (req, res) => {
    res.render('verify', { email: req.query.email, error: null });
});

router.post('/verify', async (req, res) => {
    const { email, code } = req.body;

    try {
        const [rows] = await db.query(
            'SELECT * FROM PendingVerifications WHERE email = ? AND code = ?',
            [email, code]
        );

        if (rows.length === 0) {
            return res.render('verify', {
                email,
                error: 'The verification code is incorrect. Please try again.'
            });
        }

        const pending = rows[0];


        if (pending.userType === 'consumer') {
            await db.query(
                'INSERT INTO ConsumerUsers (email, full_name, password, city, district) VALUES (?, ?, ?, ?, ?)',
                [pending.email, pending.name, pending.password, pending.city, pending.district]
            );
        } else if (pending.userType === 'market') {
            await db.query(
                'INSERT INTO MarketUsers (email, market_name, password, city, district) VALUES (?, ?, ?, ?, ?)',
                [pending.email, pending.name, pending.password, pending.city, pending.district]
            );
        }


        await db.query('DELETE FROM PendingVerifications WHERE email = ?', [email]);


       
        res.render('verify-success');

    } catch (error) {
        console.error("Verification Error:", error);
        res.render('verify', { email, error: 'An error occurred. Please try again.' });
    }
});



router.get('/login', (req, res) => {
    const verified = req.query.verified === '1';
    res.render('login', {
        error: null,
        success: verified ? 'Email verified! You can now log in.' : null,
        oldInput: {}
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [consumerResults] = await db.query('SELECT * FROM ConsumerUsers WHERE email = ?', [email]);

        let user = null;
        let userType = null;

        if (consumerResults.length > 0) {
            user = consumerResults[0];
            userType = 'consumer';
        } else {
            const [marketResults] = await db.query('SELECT * FROM MarketUsers WHERE email = ?', [email]);
            if (marketResults.length > 0) {
                user = marketResults[0];
                userType = 'market';
            }
        }

        if (!user) {
            return res.render('login', {
                error: 'No account was found with this email address.',
                success: null,
                oldInput: req.body
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.render('login', {
                error: 'Incorrect password.',
                success: null,
                oldInput: req.body
            });
        }

        req.session.userId = user.id;
        req.session.userType = userType;
        req.session.userName = userType === 'consumer' ? user.full_name : user.market_name;

        if (userType === 'consumer') {
            res.redirect('/');
        } else {
            res.redirect('/market/dashboard');
        }

    } catch (error) {
        console.error("Login Error:", error);
        res.render('login', { error: 'A system error occurred.', success: null, oldInput: {} });
    }
});



router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

export default router;
