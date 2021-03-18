const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const session = require('express-session');
const url = require('url'); 
const mongo = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
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
  console.log(req.session.user);
  if(req.session.user){
    res.render('login')
  }else{
    res.redirect('home')
  }
})

.get('/viewOrder', async function(req, res){
  if(req.session.bestelling.color){
    try{
      const afbeelding = await db.collection('tshirts').findOne({"kleur" : {$regex : `.*${req.session.bestelling.color}.*`}});
      res.render('viewOrder', {bestelling: req.session.bestelling, img: afbeelding.image, user: req.session.user})
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

.get('/new', function(req, res){
  if(req.session.user){
    res.render('new', {user: req.session.user})
  }else{
    res.render('new',{user: ""})
  }
})

.get('/home', function(req, res){
  res.render('home')
})


.get('/register', function(req, res){
  res.render('register')
})

.get('/login', function(req, res){
  res.render('login')
})

.get('/edit/:id', async function(req, res) {
  const data = await db.collection('bestelling').findOne({_id: ObjectId(req.params.id)});
  res.render('edit', {id: req.body.id, bestelling: data})
})

.get('/userpage', function(req, res){
  console.log(req.session)
  db.collection('bestelling').find({email: req.session.user.email}).toArray(check);

  async function check(err, data) {
    if(err){
      console.log(err)
    }else{
      if(data.length >= 1){
        const designData = [];
          for( const shirt of data) {
          const tshirtKleur = shirt.color;
          const tshirt = await db.collection('tshirts').findOne({"kleur" : {$regex : `.*${tshirtKleur}.*`}});
          const designInfo = {
            id: shirt._id,
            image: tshirt.image,
            size: shirt.size,
            gender: shirt.gender,
            text: shirt.text,
            font: shirt.font,
            fontColor: shirt.fontColor
          };
          designData.push(designInfo);
        }
        if(designData.length >= 1){
          res.render('userpage', {user: req.session.user, bestellingen: designData})
        }
      }else{
        console.log("nog geen bestellingen")
        res.render('userpage', {user: req.session.user})
      }
    }
  }
})

.post('/admin',upload.single('tshirt') ,function(req, res){
  db.collection('tshirts').insertOne({
    image: req.file ? req.file.filename : null,
    kleur: req.body.kleur,
    type: req.body.type
  }, res.render('admin'))
})

.post('/viewOrder', function(req, res){
  if(req.body.fname == undefined){ req.body.fname = req.session.user.firstname;}
  if(req.body.email == undefined){ req.body.email = req.session.user.email;}
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
  const checkUser = await db.collection('users').findOne({email: req.body.email});
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

.post('/login', async function(req, res){
  const query = {
    email: {$eq: req.body.email},
    password: {$eq: req.body.wachtwoord}
  }
  db.collection('users').find(query).toArray(check);

  function check(err, data) {
    if(err){
      console.log(err)
    }else{
      if(data.length >= 1){
        const session_user = data.map(data => data.firstname);
        const session_email = data.map(data => data.email);
        const session_gender = data.map(data => data.gender);
        const session_land = data.map(data => data.land);
        const session_city = data.map(data => data.city);
        const session_postal = data.map(data => data.postal);
        const session_street = data.map(data => data.street);
        const session_housenumber = data.map(data => data.housenumber);
        
        req.session.user = {
          firstname: session_user.toString(),
          email: session_email.toString(),
          gender: session_gender.toString(),
          land: session_land.toString(),
          city: session_city.toString(),
          postal: session_postal.toString(),
          street: session_street.toString(),
          housenumber: session_housenumber.toString()
        }
        res.redirect('/userpage')
      }
    }
  }
})

.post('/edit', function(req, res){
  console.log(req.body.id)
  db.collection('bestelling').updateOne({
    _id: ObjectId(req.body.id)
  }, {
    $set: {
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
    },
  }, updateBestelling)

  function updateBestelling(err, data){
    if(err){
      console.log(err)
    }else{
      res.redirect('/userpage')
    }
  }
})

.post('/userpage', logout)

.listen(PORT, ()=> console.log(`App listening at http://localhost:${PORT}`));


function checkSession(req, res){
  if(!req.session.user){
    res.redirect('/home')
  }
}

function logout(req, res){
  req.session.destroy();
  res.redirect('/home')
}