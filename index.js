const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
app.use(cors());
app.use(express.json());

//venturetoy
//losCntunGuJ89fVq

app.get("/", (req, res) => {
  res.send("Venture Toy Verse Running......");
});

const uri =
  "mongodb+srv://venturetoy:losCntunGuJ89fVq@atlascluster.rh05iiz.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("toysDB");
    const toysCollection = database.collection("allToys");

    //Create/Post
    app.post("/toys", async (req, res) => {
      console.log("hitted");
      const toy = req.body;
      const result = await toysCollection.insertOne(toy);
      res.send(result);
    });

    //Read/Get
    app.get("/toys", async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.listen(port, (req, res) => {
  console.log("Your server is running in port:", port);
});
