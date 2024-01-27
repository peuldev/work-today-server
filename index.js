const express = require("express");
var cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

//use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.SECRET_NAME}:${process.env.SECRET_KEY}@cluster0.fhewpy9.mongodb.net/?retryWrites=true&w=majority`;

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

    const reviewsCollection = client
      .db("employee_management")
      .collection("reviews");

    const worksheetCollection = client
      .db("employee_management")
      .collection("work_sheet");

    const blogCollection = client.db("employee_management").collection("blog");

    const userCollection = client.db("employee_management").collection("user");

    // reviews
    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });

    // blog
    app.get("/blog", async (req, res) => {
      const result = await blogCollection.find().toArray();
      res.send(result);
    });

    // work-sheet api
    app.post("/work-sheet", async (req, res) => {
      const work = req.body;
      const result = await worksheetCollection.insertOne(work);
      res.send(result);
    });

    // get work-sheet
    app.get("/work-sheet", async (req, res) => {
      const result = await worksheetCollection.find().toArray();
      res.send(result);
    });

    // user api
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    // all user get
    app.get("/user", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // deleted user
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // update fire
    app.patch("/user/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateUser = req.body;
      const updateDoc = {
        $set: {
          status: updateUser.status,
        },
        $set: {
          status: updateUser.status,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // make admin
    app.patch("/user/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("employee menagement server");
});

app.listen(port, () => {
  console.log(`employee menagement server listening ${port}`);
});
