const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tgzt8q2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const usersCollection = client.db("MealMasterDb").collection("users");
    const mealCollection = client.db("MealMasterDb").collection("meals");
    





    //users collections operation
     app.post('/users',async(req,res)=>{
           const user=req.body;
           
           const result=await usersCollection.insertOne(user)
           res.send(result)
     })

     app.get('/users/:email',async(req,res)=>{
          const  email=req.params.email;
        //    console.log(email);
           const query={email:email}
           const result= await usersCollection.findOne(query)
           res.send(result)
     })


     //meals collections
     app.post('/meals',async(req,res)=>{
            const meal=req.body;
            // console.log(meal);
            const result= await mealCollection.insertOne(meal)
            res.send(result)
     })


     app.get('/meals',async(req,res)=>{
         const result=await mealCollection.find().toArray()
         res.send(result)
     })












    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);











app.get('/', (req, res) => {
    res.send('Meal Master comming soon..............')
  })
  
  app.listen(port, () => {
    console.log(`this server is going on port  ${port}`);
  })