const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config()
const port =process.env.PORT || 5000;
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u15fw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run(){
    try{
        await client.connect()
        const database = client.db('assignment');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');

        app.get('/services', async(req, res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        // Add orders API

        app.post('/orders', async(req, res)=>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result)
        })

        // get order review API

        app.get('/orders', async(req, res)=>{
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders)
        })

        // delete data from API

        app.delete('/orders/:id', async (req, res)=>{
            const id = req.params.id
            const query = {_id:ObjectId(id)}
            const result = await ordersCollection.deleteOne(query)
            res.json(result)
        })


        // add new service

        app.post('/services', async(req, res)=>{
            const services = req.body;
            const result = await servicesCollection.insertOne(services);
            res.json(result)
        });

        

        
    }
    finally{
        // await client.close() 
    }
}
run().catch(console.dir)


app.get('/', (req, res)=>{
    res.send('running to live server')
})

app.listen(port, ()=>{
    console.log('running port', port)
})

// hellow