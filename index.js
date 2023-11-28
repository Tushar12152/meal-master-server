const express = require('express')
const app = express()
const cors = require('cors');
const jwt=require('jsonwebtoken')
require('dotenv').config();
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const packagesCollection = client.db("MealMasterDb").collection("packages");
    const paymentsCollection = client.db("MealMasterDb").collection("payments");
    const requestsCollection = client.db("MealMasterDb").collection("requests");
    const likesCollection = client.db("MealMasterDb").collection("likes");
    const reviewsCollection = client.db("MealMasterDb").collection("reviews");
    const upcomingMealsCollection = client.db("MealMasterDb").collection("upcomingMeals");
    const upcomingLikesCollection = client.db("MealMasterDb").collection("upcomingLikes");
    


      //jwt Api's

      app.post('/jwt',async(req,res)=>{
          const user=req.body
          const token=jwt.sign(user,process.env.Access_Token,{expiresIn:'1h'})
          res.send({token})
      })


      //middleWare

      const verifyToken=(req,res,next)=>{
        console.log('verfy hitted');
        if(!req.headers.authorization) {
             return res.status(401).send({message:'forbidden access'})
        }

        const token=req.headers.authorization.split(' ')[1];
        jwt.verify(token,process.env.Access_Token,(err,decoded)=>{
             if(err){
                return res.status(401).send({message:'forbidden access'})
             }
             req.decoded=decoded;
             next()
        })


      }



    //reviews collection
     app.post('/reviews',async(req,res)=>{
          const review=req.body
          // console.log(review);
          const result=await reviewsCollection.insertOne(review)
          res.send(result)
     })


     app.get('/reviews',async(req,res)=>{
          const result= await reviewsCollection.find().toArray()
          res.send(result)
     })

     app.delete('/reviews/:id',async(req,res)=>{
          const id=req.params.id;
          const result=await reviewsCollection.deleteOne({_id:new ObjectId(id)})
          res.send(result)
     })

   app.get('/reviews/:id',async(req,res)=>{
        const id=req.params.id;
        console.log(id);
        const result= await  reviewsCollection.findOne({_id:new ObjectId(id)})
        res.send(result)
   })

   app.patch('/reviews/:id',async(req,res)=>{
        const id=req.params.id;
        const filter={_id:new ObjectId(id)}
        const options = { upsert: true };
     // console.log(id);
        const updatedReview=req.body;
     //    console.log(updatedReview.review);
        const updatedDoc={
           $set:{

               review:updatedReview.review
           }
        }

        const result=await reviewsCollection.updateOne(filter,updatedDoc,options)
        res.send(result)
   })



   app.delete('/reviews/:id',async(req,res)=>{
        const id =req.params.id;
        const result=await reviewsCollection.deleteOne({_id:new ObjectId(id)})
        res.send(result)
   })


    //likes Collection
    app.post('/likes',async (req,res)=>{
         const likes=req.body;
        //  console.log(likes);
        const result= await likesCollection.insertOne(likes)
        res.send(result)

    })

    app.get('/likes',async (req,res)=>{
         const result =await likesCollection.find().toArray()
         res.send(result)
    })



    //get packages from db
    app.get('/packages',async(req,res)=>{
         const result=await packagesCollection.find().toArray()
         res.send(result)
    })

    app.get('/packages/:packageName',async(req,res)=>{
          const packageName=req.params.packageName;
          // console.log(packageName);
          const result=await packagesCollection.findOne({packageName:packageName})
          res.send(result)

    })



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


     app.get('/users',async(req,res)=>{
         const result= await usersCollection.find().toArray()
         res.send(result)
     })

     app.patch('/users/admin/:id',async(req,res)=>{
         const id=req.params.id;
     //     console.log(id);
         const filter={_id:new ObjectId(id)}
         const role=req.body;
     //     console.log(role.Role);


         const updatedDoc={
             $set:{
                Role: role?.Role
             }
         }

         const result=await usersCollection.updateOne(filter,updatedDoc)
         res.send(result)
           
     })

     app.patch('/users/:id',async(req,res)=>{
      const id=req.params.id;
  //     console.log(id);
      const filter={_id:new ObjectId(id)}
      const badge=req.body;
      // console.log(badge?.packageName);


      const updatedDoc={
          $set:{
            Badge:badge?.packageName
          }
      }

      const result=await usersCollection.updateOne(filter,updatedDoc)
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

     app.get('/meals/:id',async(req,res)=>{
          const id=req.params.id
          const query={_id:new ObjectId(id)}

          const result= await mealCollection.findOne(query)
          res.send(result)
     })



     app.delete('/meals/:id',async(req,res)=>{
             const id=req.params.id;
             const result=await mealCollection.deleteOne({_id:new ObjectId(id)})
             res.send(result)
     })


     app.patch('/meals/:id',async(req,res)=>{
          const id=req.params.id;
          // console.log(id);
          const filter={_id:new ObjectId(id)}
          const options = { upsert: true };
          const meal=req.body;
          // console.log(meal);
 

 
          const updatedDoc={
              $set:{
               Title:meal. Title,
               ingredients:meal. ingredients,
               description:meal.description,
               price:meal.price,
               rating:meal.rating,
               date:meal.date,
               Category:meal.Category,
              }
          }

 
          const result=await mealCollection.updateOne(filter,updatedDoc,options)
          res.send(result)
            
      })





     //payment intent

     app.post('/create_payment-intent',async(req,res)=>{
         const {price}=req.body;
         const amount=parseInt(price*100)

         const paymentIntent=await stripe.paymentIntents.create({
             amount:amount,
             currency:'usd',
             payment_method_types:['card']
         })

         res.send({
          clientSecret:paymentIntent.client_secret
         })
     })



     app.post('/payments',async(req,res)=>{
          const payment=req.body;
          // console.log(payment);
          const result=await paymentsCollection.insertOne(payment)
          res.send(result)
     })




     //request collection

     app.post('/requests',async(req,res)=>{
          const request=req.body;
          // console.log(request);
          const result= await requestsCollection.insertOne(request)
          res.send(result)
     })


     app.get('/requests',async (req,res)=>{
         const result= await requestsCollection.find().toArray()
         res.send(result)
     })

     app.delete('/requests/:id',async(req,res)=>{
          const id=req.params.id;
          const query={_id:new ObjectId(id)}
          const result=await requestsCollection.deleteOne(query)
          res.send(result)

     })



     app.patch('/requests/:id',async(req,res)=>{
          const id=req.params.id;
          // console.log(id);
          const filter={_id:new ObjectId(id)}
          const status=req.body;
          // console.log(status.status);
 
 
          const updatedDoc={
              $set:{
                 
                    status: status?.status
              }
          }
 
          const result=await requestsCollection.updateOne(filter,updatedDoc)
          res.send(result)
            
      })
 



      //upcoming meals


      app.post('/upcoming-meals',async(req,res)=>{
           const upcoming=req.body;
          //  console.log(upcoming);
           const result= await upcomingMealsCollection.insertOne(upcoming);
           res.send(result)
      })


      app.get('/upcoming-meals',async(req,res)=>{
           const result=await upcomingMealsCollection.find().toArray()
           res.send(result)
      })

      app.delete('/upcoming-meals/:id',async(req,res)=>{
             const id=req.params.id;
             const result=await upcomingMealsCollection.deleteOne({_id:new ObjectId(id)})
             res.send(result)
      })







      //upcoming likes

      app.post('/upcoming-likes',async(req,res)=>{
           const info=req.body
          //  console.log(info);
           const result=await upcomingLikesCollection.insertOne(info)
           res.send(result)
      })

      app.get('/upcoming-likes',async (req,res)=>{
            const result= await upcomingLikesCollection.find().toArray()
            res.send(result)
      })







 




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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