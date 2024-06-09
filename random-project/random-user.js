const { faker } = require('@faker-js/faker');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const {num} = req.query;
    const generateFakeUser = () => ({
        email: faker.internet.email(),
        password: faker.internet.password(),
        fullName: faker.person.fullName(),
        contact: faker.phone.number()
    });

    if (num) {
        const fakerUsers = Array.from({length:num}, generateFakeUser)
        return res.status(200).json(fakerUsers);
    } else {
        return res.status(200).json(generateFakeUser());
    } 
});

module.exports = router;