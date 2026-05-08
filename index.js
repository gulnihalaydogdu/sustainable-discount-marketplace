//Gulnihal Aydogdu - 22301734
//Ozum Beril Kilic - 22302277
//Tunahan Akkus - 22403722

import express from 'express';
import mysql from 'mysql2';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import consumerRoutes from './routes/consumerRoutes.js';


dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use(session({
    secret: process.env.SESSION_SECRET || 'cok_gizli_bir_anahtar', 
    resave: false,
    saveUninitialized: false
}));

app.use('/', authRoutes);
app.use('/market', marketRoutes);
app.use('/', consumerRoutes);


const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


db.getConnection((err, connection) => {
    if (err) {
        console.error('Could not connect to database:', err);
    } else {
        console.log('Connected to MySQL database successfully!');
        connection.release();
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}.`);
});
