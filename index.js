const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
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

        console.log('database created');

        //add user 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
        })

        //check user as admin
        app.get('/users/admin', async(req, res)=>{
            const email = req.query.email;
            const query = {email: email}
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if(user.role === 'admin'){
                isAdmin = true
            }
            res.json({admin: isAdmin})
        })

        //make admin
        app.put('/users/admin', async (req, res) => {
            const email = req.body.email;
            console.log(email);
            const filter = {email: email}
            const updateDoc = {
                $set: {
                    role: 'admin'
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
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