const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
app.use(cors());
app.use(express.json());

console.log(process.env.PORTT);
console.log(process.env.SERVER_USER_NAME);
console.log(process.env.SERVER_USER_PASSWORD);

app.get("/", (req, res) => {
  res.send("Venture Toy Verse Running......");
});

const uri = `mongodb+srv://${process.env.SERVER_USER_NAME}:${process.env.SERVER_USER_PASSWORD}@atlascluster.rh05iiz.mongodb.net/?retryWrites=true&w=majority`;

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
    client.connect();

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

    //Read/Get for all toy by using limit
    app.get("/allToys", async (req, res) => {
      const setLimit = req.query.limit;

      if (!setLimit) {
        let limit = 20;
        const cursor = toysCollection.find().limit(20);
        const result = await cursor.toArray();
        res.send(result);
      } else {
        const cursor = toysCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      }
    });

    //Read/Get the single data
    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    //Read/Get some data
    app.get("/myToys", async (req, res) => {
      const email = req.query.email;
      const sortBy = req.query.sortBy;

      const sort = { price: sortBy };

      //console.log(sort);
      //console.log(email);

      //console.log(sortBy);
      let query = {};
      if (email) {
        query = { sellerEmail: email };
        //console.log(query);
      }
      const result = await toysCollection.find(query).sort(sort).toArray();
      //console.log(result);

      res.send(result);
    });

    //Update
    app.put("/myToys/:id", async (req, res) => {
      const id = req.params.id;
      const toyBody = req.body;

      const {
        name,
        sellerName,
        sellerEmail,
        photoURL,
        subCategory,
        price,
        rating,
        quantity,
        description,
      } = toyBody;

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedToy = {
        $set: {
          name,
          sellerName,
          sellerEmail,
          photoURL,
          subCategory,
          price,
          rating,
          quantity,
          description,
        },
      };
      const result = await toysCollection.updateOne(
        filter,
        updatedToy,
        options
      );
      res.send(result);
    });

    //Delete
    app.delete("/myToys/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(query);
      if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
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
