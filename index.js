const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

console.log(process.env.DB_User)
app.get('/', (req, res) => {
  res.send('Welcome to My Mongodb Server!')
})



const uri =`mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.p3vuj.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)

    const serviceCollection = client.db("GoblinNetwork").collection("getLink");
    const ordersCollection = client.db("GoblinNetwork").collection("orders");
    const reviewCollection = client.db("GoblinNetwork").collection("reviews");
    const adminCollection = client.db("GoblinNetwork").collection("admin");


    console.log('database connected')
    app.get('/service', (req, res) => {
        serviceCollection.find()
        .toArray((err, product) => {
            res.send(product)
            
        })
    })

    app.post('/addService', (req, res) => {
        const services = req.body;
        serviceCollection.insertOne(services)
        .then(result => {
            console.log('insertCount',result.insertedCount)
            res.send(result.insertedCount > 0)
        })
        console.log('adding new service:', services)
    })

    
    app.post('/addReview', (req, res) => {
        const review = req.body;
        reviewCollection.insertOne(review)
        .then(result => {
            console.log('insertCount',result.insertedCount)
            res.redirect('/review')
            res.send(result.insertedCount > 0)
            
        })
        console.log('adding new review:', review)
       
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            console.log('insertCount',result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/addAdmin', (req, res) => {
        const order = req.body;
        adminCollection.insertOne(order)
        .then(result => {
            console.log('insertCount',result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })
   
    
    app.post('/addedAdmin', (req, res) => {
        const allAdmin = req.body.email;
        adminCollection.find({email: allAdmin})
        .toArray((err, admin) => {
            res.send(admin.length > 0)
            
        })
    })

    app.get('/service', (req, res) => {
        serviceCollection.find()
        .toArray((err, product) => {
            res.send(product)
            
        })
    })

    app.get('/service/:id', (req, res) => {
        serviceCollection.find({_id:  ObjectId(req.params.id)})
        .toArray((err, product) => {
            res.send(product)
            
            
        })
    })

   
    
    app.get('/orderPreview/:email', (req, res)=>{
        ordersCollection.find({email: req.params.email})
        .toArray((err,orderProduct) => {
          res.send(orderProduct)
        })
    })

    app.get('/orderCollection', (req, res)=>{
        ordersCollection.find({})
        .toArray((err, product) => {
          res.send(product)
          })
    })
    app.get('/reviewCollection', (req, res)=>{
        reviewCollection.find({})
        .toArray((err, review) => {
          res.send(review)
          })
    })

    app.delete('ordersCollection/delete/:id', (req, res)=>{
        const id = ObjectId(req.params.id)
        
        console.log('delete this',id)
        ordersCollection.deleteOne({_id: id})
         .then(result => {
           console.log(result)
          res.send(result.deletedCount > 0)
         })
      })

})

app.listen(port)