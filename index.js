const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000

// connect to mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.krune.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("nokshi");
        const usersCollection = database.collection("users");
        const productsCollection = database.collection("products");
        const ordersCollection = database.collection("orders");
        const reviewsCollection = database.collection("reviews");
        const contactsCollection = database.collection("contacts");

        console.log('database created');

        /* ------------------users section----------------------- */
        //add user 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
        })
        //get all users
        app.get('/users', async (req, res) => {
            const query = {}
            const cursor = usersCollection.find(query)
            const users = await cursor.toArray()
            res.json(users)
        })
        //delete user
        app.delete('/users/:id', async (req, res) => {
            const userId = req.params.id
            const query = { _id: ObjectId(userId) };
            const result = await usersCollection.deleteOne(query);
            res.json(result)
        })
        // update user role
        app.put('/users', async (req, res) => {
            const user = req.body
            console.log(user);
            const filter = { email: user.email }
            const updateDoc = {
                $set: {
                    role: user.role === 'admin' ? 'user' : 'admin'
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result)
        })

        //check user as admin
        app.get('/users/role', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            if (user?.role == 'admin') {
                res.json({ role: 'admin' })
            } else {
                res.json({ role: 'user' })
            }


        })

        //make admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body
            console.log(user.email);
            const filter = { email: user.email }
            const updateDoc = {
                $set: {
                    role: user.role
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result)
        })

        /* ----------------- products section---------------------*/

        // add product
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.json(result)
        })
        // get all product
        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = productsCollection.find(query)
            const products = await cursor.toArray()
            res.json(products)
        })
        // get signle product
        app.get('/products/:id', async (req, res) => {
            const productId = req.params.id;
            const query = { _id: ObjectId(productId) }
            const product = await productsCollection.findOne(query);
            res.json(product)
        })
        //delete product
        app.delete('/products/:id', async (req, res) => {
            const productId = req.params.id
            const query = { _id: ObjectId(productId) };
            const result = await productsCollection.deleteOne(query);
            res.json(result)
        })

        /* ------------------------ orders  ------------------------ */
        // add order
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await ordersCollection.insertOne(newOrder);
            res.json(result)
        })
        // get all order
        app.get('/orders', async (req, res) => {
            const email = req.query.email
            let query = {}
            if (email) {
                query = { email, email }
            }
            const cursor = ordersCollection.find(query)
            const orders = await cursor.toArray()
            res.json(orders)
        })
        //delete order
        app.delete('/orders/:id', async (req, res) => {
            const orderId = req.params.id
            const query = { _id: ObjectId(orderId) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result)
        })

        /* ------------------------ reviews  ------------------------ */
        // add reviews
        app.post('/reviews', async (req, res) => {
            const newReview = req.body;
            const result = await reviewsCollection.insertOne(newReview);
            res.json(result)
        })
        // get all reviews
        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = reviewsCollection.find(query)
            const reviews = await cursor.toArray()
            res.json(reviews)
        })
        /* ----------------------contact data------------------------- */
        app.post('/contactUs', async (req, res) => {
            const newContact = req.body;
            const result = await contactsCollection.insertOne(newContact);
            res.json(result)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);
//middlewares
app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})