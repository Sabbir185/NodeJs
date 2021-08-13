const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// page not found, error handling
app.use((req, res, next) => {
    res.status(404).send('<h3>Page not Found</h3>');
});

app.listen(3000);