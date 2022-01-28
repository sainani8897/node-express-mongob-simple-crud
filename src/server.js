const express = require("express");
const app = express();
const { MongoClient,ObjectId  } = require("mongodb");
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// MongoClient.connect(`mongodb://localhost:27017/test_crud`, (err, client) => {
//     console.log("DB connected successfully!");
//     if (err) return console.error(err);
//     app.listen(3000,()=>{
//         console.log('Server Started at Port 3000');
//     })

// })

const client = new MongoClient("mongodb://localhost:27017/test_crud");
client
  .connect()
  .then(function (client) {
    app.listen(3000, () => {
      console.log("Server Started at Port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Simple Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});


const collection = client.db().collection("users");

app.get("/user", async (req, res) => {
  const user = await collection.find({}).toArray();
  return res.send({data:user}); 
});

app.post("/user", (req, res) => {
    console.log(req.body);
    collection.insertOne(req.body).then((userInstance)=>{
        res.send(userInstance);
    }).catch((err)=>{
        console.log(err);
        res.send(err.message);
    })
});

app.put('/user/:id',(req,res)=>{
    console.log(req.params.id);

    const user = collection.findOne({_id:new ObjectId(req.params.id)}).then((userInstance)=>{
      if (!userInstance) {
        return res.status(404).send({error:true,message:"No data found"});
      }
      req.body.dob = new Date(req.body.dob);
      collection.findOneAndUpdate({_id:new ObjectId(req.params.id)}, { $set: req.body }).then((result)=>{
        return res.send(result);
      })
    }).catch((err)=>{
      console.log(err);
    }) 
    
})


app.delete('/user/:id',(req,res)=>{
  console.log(req.params.id);

  const user = collection.findOne({_id:new ObjectId(req.params.id)}).then((userInstance)=>{
    if (!userInstance) {
      return res.status(404).send({error:true,message:"No data found"});
    }
    req.body.dob = new Date(req.body.dob);
    collection.deleteOne({_id:new ObjectId(req.params.id)}, { $set: req.body }).then((result)=>{
      return res.send(result);
    })
  }).catch((err)=>{
    console.log(err);
  }) 
  
})