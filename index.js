const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const session = require('express-session');
const url = require('url'); 
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const MemoryStore = require('memorystore')(session)
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
.use(session({
  resave: false,
  saveUninitialized: true,
  secret: '343ji43j4n3jn4jk4n',
  store: new MemoryStore({
    checkPeriod: 86400000
  })
}))

.get('/', function(req, res){
  res.render('index')
})

.get('/viewOrder', function(req, res){
  res.render('viewOrder', {bestelling: req.session.bestelling})
})

.post('/viewOrder', function(req, res){
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
      req.session.bestelling = {
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
      }
      res.redirect('/viewOrder')
    }
  }
})

.listen(PORT, ()=> console.log(`App listening at http://localhost:${PORT}`));