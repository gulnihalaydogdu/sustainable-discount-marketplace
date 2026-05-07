import express from 'express';
import db from '../db.js';
import multer from 'multer'; 
import path from 'path';     

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) ?? "";
    const name = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${name}${ext}`);
  }
});
const upload = multer({ storage });



router.get('/dashboard', async (req, res) => {
    if (!req.session.userId || req.session.userType !== 'market') {
        return res.redirect('/login');
    }

    try {
       
        const [products] = await db.query(
            'SELECT * FROM Products WHERE market_id = ? ORDER BY created_at DESC',
            [req.session.userId]
        );

        res.render('market-dashboard', { 
            user: req.session, 
            products: products 
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.send("An error occurred while loading the dashboard.");
    }
});


router.get('/add-product', (req, res) => {
    if (!req.session.userId || req.session.userType !== 'market') {
        return res.redirect('/login');
    }
    res.render('add-product', { user: req.session });
});


router.post('/add-product', upload.single('image'), async (req, res) => {
    if (!req.session.userId || req.session.userType !== 'market') {
        return res.redirect('/login');
    }

    
    const { name, description, stock, original_price, discounted_price, expiration_date } = req.body;
    const market_id = req.session.userId; 
    const image_url = req.file ? '/uploads/' + req.file.filename : null;

    try {
        
        await db.query(
            'INSERT INTO Products (market_id, name, description, stock, original_price, discounted_price, expiration_date, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [market_id, name, description, stock, original_price, discounted_price, expiration_date, image_url]
        );
        res.redirect('/market/dashboard');
    } catch (error) {
        console.error("Product Add Error:", error);
        res.send("A database error occurred while adding the product.");
    }
});


router.post('/edit-product/:id', upload.single('image'), async (req, res) => {
    if (!req.session.userId || req.session.userType !== 'market') {
        return res.redirect('/login');
    }

    const productId = req.params.id;
    const marketId = req.session.userId;
    
    const { name, description, stock, original_price, discounted_price, expiration_date } = req.body;

    try {
        if (req.file) {
            const new_image_url = '/uploads/' + req.file.filename;
            await db.query(
                'UPDATE Products SET name=?, description=?, stock=?, original_price=?, discounted_price=?, expiration_date=?, image_url=? WHERE id=? AND market_id=?',
                [name, description, stock, original_price, discounted_price, expiration_date, new_image_url, productId, marketId]
            );
        } else {
            await db.query(
                'UPDATE Products SET name=?, description=?, stock=?, original_price=?, discounted_price=?, expiration_date=? WHERE id=? AND market_id=?',
                [name, description, stock, original_price, discounted_price, expiration_date, productId, marketId]
            );
        }
        res.redirect('/market/dashboard');
    } catch (error) {
        console.error("Product Update Error:", error);
        res.send("An error occurred while updating the product.");
    }
});


router.get('/delete-product/:id', async (req, res) => {
    
    if (!req.session.userId || req.session.userType !== 'market') {
        return res.redirect('/login');
    }

    const productId = req.params.id; 
    const marketId = req.session.userId; 

    try {
        
        await db.query(
            'DELETE FROM Products WHERE id = ? AND market_id = ?', 
            [productId, marketId]
        );
        
        
        res.redirect('/market/dashboard');
    } catch (error) {
        console.error("Product Delete Error:", error);
        res.send("An error occurred while deleting the product.");
    }
});


router.get('/profile', async (req, res) => {
    if (!req.session.userId || req.session.userType !== 'market') {
        return res.redirect('/login');
    }

    try {
       
        const [market] = await db.query('SELECT * FROM MarketUsers WHERE id = ?', [req.session.userId]);
        
        res.render('market-profile', { 
            user: req.session, 
            marketInfo: market[0],
            success: req.query.success === '1' 
        });
    } catch (error) {
        console.error("Profile Load Error:", error);
        res.send("An error occurred while loading the profile.");
    }
});


router.post('/profile', async (req, res) => {
    if (!req.session.userId || req.session.userType !== 'market') {
        return res.redirect('/login');
    }

    const { market_name, city, district } = req.body;

    try {
        
        await db.query(
            'UPDATE MarketUsers SET market_name = ?, city = ?, district = ? WHERE id = ?',
            [market_name, city, district, req.session.userId]
        );
        
       
        req.session.userName = market_name;

        
        res.redirect('/market/profile?success=1');
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.send("A database error occurred while updating the profile.");
    }
});


router.get('/edit-product/:id', async (req, res) => {
    if (!req.session.userId || req.session.userType !== 'market') {
        return res.redirect('/login');
    }

    try {
        const productId = req.params.id;
        const marketId = req.session.userId;

        
        const [product] = await db.query(
            'SELECT * FROM Products WHERE id = ? AND market_id = ?',
            [productId, marketId]
        );

        if (product.length === 0) {
            return res.send("Product not found or you do not have permission to edit it.");
        }

        res.render('edit-product', { user: req.session, product: product[0] });

    } catch (error) {
        console.error("Edit Page Error:", error);
        res.send("An error occurred while loading the page.");
    }
});


router.post('/edit-product/:id', upload.single('image'), async (req, res) => {
    if (!req.session.userId || req.session.userType !== 'market') {
        return res.redirect('/login');
    }

    const productId = req.params.id;
    const marketId = req.session.userId;
    const { name, description, original_price, discounted_price, expiration_date } = req.body;

    try {
        if (req.file) {
            
            const new_image_url = '/uploads/' + req.file.filename;
            await db.query(
                'UPDATE Products SET name=?, description=?, original_price=?, discounted_price=?, expiration_date=?, image_url=? WHERE id=? AND market_id=?',
                [name, description, original_price, discounted_price, expiration_date, new_image_url, productId, marketId]
            );
        } else {
           
            await db.query(
                'UPDATE Products SET name=?, description=?, original_price=?, discounted_price=?, expiration_date=? WHERE id=? AND market_id=?',
                [name, description, original_price, discounted_price, expiration_date, productId, marketId]
            );
        }

        res.redirect('/market/dashboard');

    } catch (error) {
        console.error("Product Update Error:", error);
        res.send("An error occurred while updating the product.");
    }
});

export default router;