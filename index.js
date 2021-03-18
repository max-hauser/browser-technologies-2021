const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const session = require('express-session');
const url = require('url'); 
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const MemoryStore = require('memorystore')(session)
require('dotenv').config()
const multer = require('multer')
const upload = multer({dest: 'static/images/uploads/'})

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
.use(express.static(__dirname + '/static'))
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

.get('/viewOrder', async function(req, res){
  if(req.session.bestelling.color){
    try{
      const afbeelding = await db.collection('tshirts').findOne({"kleur" : {$regex : `.*${req.session.bestelling.color}.*`}});
      res.render('viewOrder', {bestelling: req.session.bestelling, img: afbeelding.image})
    }
    catch(error){
      console.error(error);
    }
  }else{
    console.log('something went wrong..');
  }
})

.get('/admin', function(req, res){
  res.render('admin')
})

.get('/register', function(req, res){
  res.render('register')
})

.post('/admin',upload.single('tshirt') ,function(req, res){
  db.collection('tshirts').insertOne({
    image: req.file ? req.file.filename : null,
    kleur: req.body.kleur,
    type: req.body.type
  }, res.render('admin'))
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

.post('/register', async function(req, res){
  console.log(req.body)
  const checkUser = await db.collection('users').findOne({email: req.body.email});
  console.log(checkUser);
  if(checkUser != null){
    console.log("no no no, gebruiker bestaat al!");
  }else{
    db.collection('users').insertOne({
      firstname: req.body.fname,
      email: req.body.email,   
      gender: req.body.gender,   
      password: req.body.wachtwoord,
      land: req.body.land,
      city: req.body.city,
      postal: req.body.postal,
      street: req.body.street,
      housenumber: req.body.housenumber   
    }, res.redirect('/register'))    
  }

})

.listen(PORT, ()=> console.log(`App listening at http://localhost:${PORT}`));