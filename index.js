const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3gbyspq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{

        const userInformation = client.db('genesys').collection('userInfo');
//save userInformation
        app.post('/users', async(req,res)=>{
            const user = req.body;
            const result = await userInformation.insertOne(user);
            res.send(result);
        })
//get all users
        app.get('/users', async(req,res)=>{
            const query = {};
            const cursor = userInformation.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })
// get user information from email 
        app.get('/users/info',async (req, res)=>{
            const email = req.query.email;
            const query = {
                email : email
            };
            const result = await userInformation.find(query).toArray()
            res.send(result);
        })
    }
    finally{

    }
}

run().catch((err)=>console.log(err))



app.get('/',(req, res) => {
    res.send('server is listening');
});

app.listen(port, ()=>{
    console.log(`Listen on ${port}`);
});