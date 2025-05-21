require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());



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
   
    await client.connect();

    const plantsCollection = client.db('plantDB').collection('plants');


     app.get ('/plants', async(req, res) =>{

      const result = await plantsCollection.find().toArray();
      res.send(result)
    })

    app.post('/plants', async(req,res) =>{
      const newPlant = req.body;
        const result = await plantsCollection.insertOne(newPlant);
            res.send(result);
    })
   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
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