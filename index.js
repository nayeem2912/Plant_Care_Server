require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6ww4e81.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
 




const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    // await client.connect();

    const plantsCollection = client.db('plantDB').collection('plants');


     app.get ('/plants', async(req, res) =>{

      const {searchParams} = req.query;

    let query = {}

    if(searchParams){
      query= {plantName: {$regex: searchParams, $options: "i"   }}
    }

      const result = await plantsCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/plants/by-user', async (req, res) => {
           
             const email = req.query.email;
             const result = await plantsCollection.find({ email }).toArray();
              res.send(result);
        })

        
         app.get("/plants/latest", async (req, res) => {
      const latest = await plantsCollection.find()
        .sort({ _id: -1 })
        .limit(10)
        .toArray();
      res.send(latest);
    });

     app.get('/plants/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await plantsCollection.findOne(query);
            res.send(result);
        })

       


        

    app.post('/plants', async(req,res) =>{
      const newPlant = req.body;
        const result = await plantsCollection.insertOne(newPlant);
            res.send(result);
    })

     app.put('/plants/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedPlant = req.body;
            const updatedDoc = {
                $set: updatedPlant
            }

            
              const result = await plantsCollection.updateOne(filter, updatedDoc, options);

            res.send(result);
        })

    app.delete('/plants/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await plantsCollection.deleteOne(query);
            res.send(result);
        })
   
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('mango server is getting ready')
})


app.listen(port, ()=>{
    console.log(`mango server is ruining on port ${port}`)
})