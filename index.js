const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const session = require('express-session');
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

let db;
const db_key = process.env.URI;
MongoClient.connect(db_key, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
  if(err){
    throw err
  }else{

  }
  db = client.db('mydb');
});


app

.set('view engine', 'ejs')
.use(express.static('static'))
.use(express.json())
.use(express.urlencoded())

.get('/', function(req, res){
  res.render('index')
})

.post('/viewOrder', function(req, res){
  console.log(req.body);
  db.collection('bestelling').insertOne({
    firstname: req.body.fname,
    email: req.body.email,
    gender: req.body.gender,
    size: req.body.size,
    color: req.body.color,
    text: req.body.text,
    font: req.body.font,
    fontColor: req.body.fontColor,
    pos: req.body.pos,
    land: req.body.land,
    city: req.body.city,
    postal: req.body.postal,
    street: req.body.street,
    housenumber: req.body.housenumber
  }, viewOrder)

  function viewOrder(err, data){
    if(err){
      console.log(err)
    }else{
      res.send('/viewOrder')
    }
  }
})

.listen(PORT, ()=> console.log(`App listening at http://localhost:${PORT}`));