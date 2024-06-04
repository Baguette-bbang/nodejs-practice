// express 모듈
const express = require('express');
const app = express();
// dotenv 모듈
const dotenv = require('dotenv');
dotenv.config();

const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const cartRouter = require('./routes/carts');
const likeRouter = require('./routes/likes');
const orderRouter = require('./routes/orders');
const categoryRouter = require('./routes/categories');

app.use(express.json());
app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/carts', cartRouter);
app.use('/likes', likeRouter);
app.use('/orders', orderRouter);
app.use('/categories', categoryRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
