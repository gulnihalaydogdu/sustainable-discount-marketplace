import express from 'express';
import db from '../db.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const searchQuery = req.query.q || '';
        const page = parseInt(req.query.page) || 1; 
        const limit = 4; 
        const offset = (page - 1) * limit; 

        let consumerCity = null;
        let consumerDistrict = null;
        
        if (req.session.userId && req.session.userType === 'consumer') {
            const [user] = await db.query('SELECT city, district FROM ConsumerUsers WHERE id = ?', [req.session.userId]);
            if (user.length > 0) {
                consumerCity = user[0].city;
                consumerDistrict = user[0].district;
            }
        }

        
        let whereClause = `Products.expiration_date >= CURDATE()`;
        let queryParams = [];

        if (consumerCity) {
            whereClause += ` AND MarketUsers.city = ?`;
            queryParams.push(consumerCity);
        }

        if (searchQuery) {
            const searchTerm = `%${searchQuery}%`;
            whereClause += ` AND (Products.name LIKE ? OR Products.description LIKE ?)`;
            queryParams.push(searchTerm, searchTerm);
        }

        
        const countSql = `
            SELECT COUNT(*) as total 
            FROM Products 
            JOIN MarketUsers ON Products.market_id = MarketUsers.id 
            WHERE ${whereClause}
        `;
        const [countResult] = await db.query(countSql, queryParams);
        const totalProducts = countResult[0].total;
        const totalPages = Math.ceil(totalProducts / limit); 

       
        let sqlQuery = `
            SELECT Products.*, MarketUsers.market_name, MarketUsers.city as market_city, MarketUsers.district as market_district
            FROM Products
            JOIN MarketUsers ON Products.market_id = MarketUsers.id
            WHERE ${whereClause}
        `;

        if (consumerDistrict) {
            sqlQuery += ` ORDER BY (MarketUsers.district = ?) DESC, Products.created_at DESC`;
            
            let orderParams = [...queryParams, consumerDistrict, limit, offset];
            sqlQuery += ` LIMIT ? OFFSET ?`;
            var [products] = await db.query(sqlQuery, orderParams);
        } else {
            sqlQuery += ` ORDER BY Products.created_at DESC LIMIT ? OFFSET ?`;
            let limitParams = [...queryParams, limit, offset];
            var [products] = await db.query(sqlQuery, limitParams);
        }

        
        res.render('index', { 
            user: req.session, 
            products: products,
            searchQuery: searchQuery,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (error) {
        console.error("Home Page Error:", error);
        res.send("An error occurred while loading products.");
    }
});


router.post('/cart/add', async (req, res) => {
    if (!req.session.userId || req.session.userType !== 'consumer') {
        return res.status(401).json({ success: false, message: 'You must log in.' });
    }

    const { product_id } = req.body;
    const consumer_id = req.session.userId;

    try {
        
        const [productData] = await db.query('SELECT stock FROM Products WHERE id = ?', [product_id]);
        const stock = productData[0].stock;

        if (stock <= 0) {
            return res.json({ success: false, message: 'Sorry, this product is sold out.' });
        }

        
        const [existing] = await db.query('SELECT * FROM Cart WHERE consumer_id = ? AND product_id = ?', [consumer_id, product_id]);

        if (existing.length > 0) {
            
            if (existing[0].quantity + 1 > stock) {
                return res.json({ success: false, message: `In stock: Just ${stock} items available. You can't add more.` });
            }
            
            await db.query('UPDATE Cart SET quantity = quantity + 1 WHERE consumer_id = ? AND product_id = ?', [consumer_id, product_id]);
        } else {
            
            await db.query('INSERT INTO Cart (consumer_id, product_id) VALUES (?, ?)', [consumer_id, product_id]);
        }

        res.json({ success: true, message: 'Product added to cart!' });

    } catch (error) {
        console.error("Cart Error:", error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});


router.get('/cart', async (req, res) => {
    if (!req.session.userId || req.session.userType !== 'consumer') {
        return res.redirect('/login');
    }

    try {
        
        const [items] = await db.query(`
            SELECT Cart.id as cart_id, Cart.quantity, Products.*
            FROM Cart
            JOIN Products ON Cart.product_id = Products.id
            WHERE Cart.consumer_id = ?
            ORDER BY Cart.added_at DESC
        `, [req.session.userId]);

        
        const total = items.reduce((sum, item) => sum + (item.discounted_price * item.quantity), 0);

        res.render('cart', { user: req.session, items, total });

    } catch (error) {
        console.error("Cart Error:", error);
        res.send("An error occurred while loading the cart.");
    }
});

router.get('/cart/remove/:cartId', async (req, res) => {
    if (!req.session.userId || req.session.userType !== 'consumer') {
        return res.redirect('/login');
    }

    await db.query(
        'DELETE FROM Cart WHERE id = ? AND consumer_id = ?',
        [req.params.cartId, req.session.userId]
    );

    res.redirect('/cart');
});
router.post('/cart/update-ajax', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ success: false });

    const { cartId, action } = req.body;
    try {
        const [cartItems] = await db.query('SELECT Cart.*, Products.stock, Products.discounted_price FROM Cart JOIN Products ON Cart.product_id = Products.id WHERE Cart.id = ? AND Cart.consumer_id = ?', [cartId, req.session.userId]);
        if (cartItems.length === 0) return res.json({ success: false, message: 'Product not found.' });
        
        const item = cartItems[0];
        let newQuantity = item.quantity;

        if (action === 'increase') {
            if (newQuantity + 1 > item.stock) return res.json({ success: false, message: `In stock: Just ${item.stock} items available.` });
            newQuantity++;
        } else if (action === 'decrease') {
            if (newQuantity - 1 <= 0) return res.json({ success: false, message: 'Quantity cannot be less than 1. Use the Remove button to delete it.' });
            newQuantity--;
        }

        await db.query('UPDATE Cart SET quantity = ? WHERE id = ?', [newQuantity, cartId]);
        
        
        const [allItems] = await db.query(`SELECT Cart.quantity, Products.discounted_price FROM Cart JOIN Products ON Cart.product_id = Products.id WHERE Cart.consumer_id = ?`, [req.session.userId]);
        const total = allItems.reduce((sum, item) => sum + (item.discounted_price * item.quantity), 0);

        res.json({ success: true, newQuantity, itemTotal: (newQuantity * item.discounted_price).toFixed(2), newTotal: total.toFixed(2) });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});


router.post('/cart/remove-ajax', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ success: false });
    
    try {
        await db.query('DELETE FROM Cart WHERE id = ? AND consumer_id = ?', [req.body.cartId, req.session.userId]);
        
        
        const [allItems] = await db.query(`SELECT Cart.quantity, Products.discounted_price FROM Cart JOIN Products ON Cart.product_id = Products.id WHERE Cart.consumer_id = ?`, [req.session.userId]);
        const total = allItems.reduce((sum, item) => sum + (item.discounted_price * item.quantity), 0);
        
        res.json({ success: true, newTotal: total.toFixed(2), cartIsEmpty: allItems.length === 0 });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});


router.post('/cart/checkout-ajax', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ success: false });

    const consumer_id = req.session.userId;
    try {
        const [items] = await db.query(`SELECT Cart.quantity, Products.id as product_id, Products.discounted_price, Products.stock FROM Cart JOIN Products ON Cart.product_id = Products.id WHERE Cart.consumer_id = ?`, [consumer_id]);
        if (items.length === 0) return res.json({ success: false, message: 'Your cart is empty.' });

        
        for (const item of items) {
            if (item.quantity > item.stock) return res.json({ success: false, message: `Some products do not have enough stock!` });
        }

        const total = items.reduce((sum, item) => sum + (item.discounted_price * item.quantity), 0);
        const [orderResult] = await db.query('INSERT INTO Orders (consumer_id, total_price) VALUES (?, ?)', [consumer_id, total]);
        const order_id = orderResult.insertId;

        for (const item of items) {
            await db.query('INSERT INTO OrderItems (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)', [order_id, item.product_id, item.quantity, item.discounted_price]);
            
            await db.query('UPDATE Products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
        }

        await db.query('DELETE FROM Cart WHERE consumer_id = ?', [consumer_id]);
        res.json({ success: true, orderId: order_id });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Order error.' });
    }
});


router.get('/orders/:id', async (req, res) => {
    if (!req.session.userId || req.session.userType !== 'consumer') {
        return res.redirect('/login');
    }

    try {
        const [orders] = await db.query(
            'SELECT * FROM Orders WHERE id = ? AND consumer_id = ?',
            [req.params.id, req.session.userId]
        );

        if (orders.length === 0) return res.redirect('/');

        const [orderItems] = await db.query(`
            SELECT OrderItems.quantity, OrderItems.unit_price, Products.name, Products.image_url
            FROM OrderItems
            JOIN Products ON OrderItems.product_id = Products.id
            WHERE OrderItems.order_id = ?
        `, [req.params.id]);

        res.render('order-confirm', { 
            user: req.session, 
            order: orders[0], 
            items: orderItems 
        });

    } catch (error) {
        console.error("Order Detail Error:", error);
        res.send("An error occurred while loading order details.");
    }
});


router.get('/profile', async (req, res) => {
    if (!req.session.userId || req.session.userType !== 'consumer') {
        return res.redirect('/login');
    }

    try {
        const [consumer] = await db.query('SELECT * FROM ConsumerUsers WHERE id = ?', [req.session.userId]);
        
        res.render('consumer-profile', { 
            user: req.session, 
            consumerInfo: consumer[0],
            success: req.query.success === '1' 
        });
    } catch (error) {
        console.error("Profile Load Error:", error);
        res.send("An error occurred while loading the profile.");
    }
});


router.post('/profile', async (req, res) => {
    if (!req.session.userId || req.session.userType !== 'consumer') {
        return res.redirect('/login');
    }

    const { full_name, city, district } = req.body;

    try {
        await db.query(
            'UPDATE ConsumerUsers SET full_name = ?, city = ?, district = ? WHERE id = ?',
            [full_name, city, district, req.session.userId]
        );
        
        
        req.session.userName = full_name;

        res.redirect('/profile?success=1');
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.send("An error occurred while updating the profile.");
    }
});

export default router;