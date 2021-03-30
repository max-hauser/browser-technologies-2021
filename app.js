const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;
const session = require('express-session');
const url = require('url'); 
const mongo = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const MemoryStore = require('memorystore')(session)
require('dotenv').config()
const multer = require('multer')
const upload = multer({dest: 'public/images/uploads/'})

let db;
const db_key = process.env.URI;
MongoClient.connect(db_key, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
  if(err){
    throw err
  }
  db = client.db('mydb');
});

app
.set('view engine', 'ejs')
.use(express.static(__dirname + '/public'))
.use(express.json())
.use(express.urlencoded())
.use(session({resave: false, saveUninitialized: true, secret: '343ji43j4n3jn4jk4n', store: new MemoryStore({ checkPeriod: 86400000})}))

.get('/', async function(req, res){
  const shirt = await getShirt('male', 'wit');
  res.render('index', {img: shirt, user: "guest"})
})

.get('/details', function(req, res){
	res.render('details', {user: 'guest'});
})

.get('/offline', function(req, res){
	res.render('offline', {user: 'guest'});
})

.get('/logout', function(req, res){
  console.log(req.session)
  res.redirect('/');
})

.get('/orders', function(req, res){
  console.log('ik kom hier wel')
  console.log('session:', req.session.userInfo)
  db.collection('bestelling').find({email: req.session.userInfo.email}).toArray(check);

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
          console.log('Er zijn wel bestellingen')
          console.log(designData)
          res.render('orders', {user: req.session.userInfo, bestellingen: designData})
        }else{
          console.log('Er zijn geen bestellingen')
          res.render('orders', {user: req.session.userInfo, bestellingen: "nope"})
        }
      }else{
        console.log("nog geen bestellingen")
        res.render('orders', {user: req.session.userInfo, bestellingen: "nope"})
      }
    }
  }  
})

.get('/register', function(req, res){
  console.log('get register')
  res.render('/', {user: req.session.userInfo})
})

.post('/register', async function(req, res){
  const checkUser = await db.collection('users').findOne({email: req.body.email});
  if(checkUser != null){
    console.log("no no no, gebruiker bestaat al!");
  }else{
    db.collection('users').insertOne({
      firstname: req.body.firstname,
      email: req.body.email,   
      gender: req.body.gender,   
      password: req.body.password,
      land: req.body.land,
      city: req.body.city,
      postal: req.body.postal,
      street: req.body.street,
      housenumber: req.body.housenumber   
    }),      
    req.session.userInfo = {
      firstname: req.body.firstname,
      email: req.body.email,
      gender: req.body.gender,
      land: req.body.land,
      city: req.body.city,
      postal: req.body.postal,
      street: req.body.street,
      housenumber: req.body.housenumber
    },
    console.log('post register')
    console.log(req.session.userInfo)
    res.render('orders', {user: req.session.userInfo, bestellingen: 'nope'})
  }  
})

.get('/edit/:id', async function(req, res){
  const data = await db.collection('bestelling').findOne({_id: ObjectId(req.params.id)});
  res.render('edit', {id: req.body.id, bestelling: data, user: req.session.userInfo})
})

.get('/checkout', async function(req, res){
  const shirt = await getShirt(req.session.userInfo.gender, req.session.userInfo.color);
  res.render('checkout', {img: shirt, user: req.session.userInfo})
})

.post('/', upload.single('afbeelding'), async function(req, res){
  const shirt = await getShirt(req.body.gender, req.body.color);
  let upload_img;
  if(req.file === undefined){
    if(req.session.userInfo){
      upload_img = req.session.userInfo.image;
    }else{
      console.log('nog steeds niet gevonden')
    }
  }else{
    upload_img = req.file.filename;
  }
  req.session.userInfo = {
    firstname: req.body.naam,
    email: req.body.email,
    gender: req.body.gender,
    size: req.body.size,
    color: req.body.color,
    text: req.body.text,
    font: req.body.font,
    image: upload_img,
    fontColor: req.body.fontColor,
    pos: req.body.pos,    
    land: req.body.land,
    city: req.body.city,
    postal: req.body.postal,
    street: req.body.street,
    housenumber: req.body.housenumber
  }
  if(req.body.actie == "Update"){
  res.render('index', {img: shirt, user: req.session.userInfo})
  }else if(req.body.actie == "Bestellen"){
    res.render('details', {img: shirt, user: req.session.userInfo})
  }
})

.post('/details', async function(req, res){
  const shirt = await getShirt(req.session.userInfo.gender, req.session.userInfo.color);
  req.session.userInfo = {
    firstname: req.body.naam,
    email: req.body.email,
    gender: req.session.userInfo.gender,
    size: req.session.userInfo.size,
    color: req.session.userInfo.color,
    text: req.session.userInfo.text,
    font: req.session.userInfo.font,
    fontColor: req.session.userInfo.fontColor,
    pos: req.session.userInfo.pos, 
    image: req.session.userInfo.image,   
    land: req.body.land,
    city: req.body.city,
    postal: req.body.postal,
    street: req.body.street,
    housenumber: req.body.housenumber    
  }
  
  db.collection('bestelling').insertOne({
    firstname: req.body.naam,
    email: req.body.email,
    gender: req.session.userInfo.gender,
    size: req.session.userInfo.size,
    color: req.session.userInfo.color,
    text: req.session.userInfo.text,
    font: req.session.userInfo.font,
    fontColor: req.session.userInfo.fontColor,
    pos: req.session.userInfo.pos, 
    image: req.session.userInfo.image,   
    land: req.body.land,
    city: req.body.city,
    postal: req.body.postal,
    street: req.body.street,
    housenumber: req.body.housenumber      
  }, () => {
    res.render('checkout', {img: shirt,user: req.session.userInfo})
  })
})

.post('/inloggen', async function(req, res){
  let shirt = await getShirt(req.body.gender, req.body.color);
  if(shirt === null){
     shirt = await getShirt('male', 'wit');
  }
  const query = {
    email: {$eq: req.body.email},
    password: {$eq: req.body.password}
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
        
        req.session.userInfo = {
          firstname: session_user.toString(),
          email: session_email.toString(),
          gender: session_gender.toString(),
          land: session_land.toString(),
          city: session_city.toString(),
          postal: session_postal.toString(),
          street: session_street.toString(),
          housenumber: session_housenumber.toString()
        }
        console.log(req.session.userInfo)
        res.render('index', {img: shirt, user: req.session.userInfo})
      }
    }
  }
})

.post('/edit', function(req, res){
  db.collection('bestelling').updateOne({
    _id: ObjectId(req.body.id)
  }, {
    $set: {
      firstname: req.session.userInfo.firstname,
      email: req.session.userInfo.email,
      gender: req.body.gender,
      size: req.body.size,
      color: req.body.color,
      text: req.body.text,
      font: req.body.font,
      fontColor: req.body.fontColor,
      pos: req.body.pos,
      land: req.session.userInfo.land,
      city: req.session.userInfo.city,
      postal: req.session.userInfo.postal,
      street: req.session.userInfo.street,
      housenumber: req.session.userInfo.housenumber
    },
  }, updateBestelling)

  function updateBestelling(err, data){
    if(err){
      console.log(err)
    }else{
      res.redirect('/orders')
    }
  }
})


.listen(PORT, ()=> console.log(`App listening at http://localhost:${PORT}`))

async function getShirt(gender, color) {
  // get t-shirt by gender and color
  const query = { gender: {$eq: gender}, kleur: {$eq: color}}
  const queryResult = await db.collection('tshirts').findOne(query)
  return queryResult;
}