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
let userInfo = "";

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
.use(express.static(__dirname + '/static'))
.use(express.json())
.use(express.urlencoded())
.use(session({resave: false, saveUninitialized: true, secret: '343ji43j4n3jn4jk4n', store: new MemoryStore({ checkPeriod: 86400000})}))

.get('/', check_session, check_status)
.get('/viewOrder', check_session, load_viewOrder)
.get('/admin', check_session, load_admin)
.get('/home', check_session, load_home) 
.get('/register', check_session, load_register)
.get('/login', check_session, load_login)
.get('/edit/:id', check_session, load_edit) 
.get('/new-credentials', check_session, load_new_credentials)
.get('/new-tshirt', check_session, load_new_tshirt)
.get('/new-delivery', check_session, load_new_delivery)
.get('/userpage', check_session, load_userpage)

.post('/succes', async function(req, res){
    console.log(req.session.newOrder)
  db.collection('bestelling').insertOne({
    firstname: req.session.newOrder.firstname,
    email: req.session.newOrder.email,
    gender: req.session.newOrder.gender,
    size: req.session.newOrder.size,
    color: req.session.newOrder.color,
    text: req.session.newOrder.text,
    font: req.session.newOrder.font,
    fontColor: req.session.newOrder.fontColor,
    pos: req.session.newOrder.pos,
    land: req.session.newOrder.land,
    city: req.session.newOrder.city,
    postal: req.session.newOrder.postal,
    street: req.session.newOrder.street,
    housenumber: req.session.newOrder.housenumber,
    image: req.session.newOrder.image
  }, () => {
    res.redirect('home')
  })  
})

.post('/new-tshirt', function(req, res){
  req.session.newOrder = {
    firstname: req.body.fname,
    email: req.body.email,
    gender: "",
    size:  "",
    color:  "",
    text:  "",
    font:  "",
    fontColor:  "",
    pos:  "",
    land:  "",
    city:  "",
    postal:  "",
    street:  "",
    housenumber:  "",
    image: "",
  }
  res.render('new-tshirt', {user: userInfo})
})

.post('/new-delivery', upload.single('afbeelding') , function(req, res){
  req.session.newOrder = {
    firstname: req.session.newOrder.firstname,
    email: req.session.newOrder.email,
    gender: req.body.gender,
    size: req.body.size,
    color: req.body.color,
    text: req.body.text,
    font: req.body.font,
    fontColor: req.body.fontColor,
    pos: req.body.pos,
    land:  "",
    city:  "",
    postal:  "",
    street:  "",
    housenumber:  "",
    image: req.file ? req.file.filename : null
  }
  res.render('new-delivery', {user: userInfo})
})

.post('/check-order', async function(req, res){
  req.session.newOrder = {
    firstname: req.session.newOrder.firstname,
    email: req.session.newOrder.email,
    gender: req.session.newOrder.gender,
    size: req.session.newOrder.size,
    color: req.session.newOrder.color,
    text: req.session.newOrder.text,
    font: req.session.newOrder.font,
    fontColor: req.session.newOrder.fontColor,
    pos: req.session.newOrder.pos,
    land: req.body.land,
    city: req.body.city,
    postal: req.body.postal,
    street: req.body.street,
    housenumber: req.body.housenumber,
    image: req.session.newOrder.image
  }
  const afbeelding = await db.collection('tshirts').findOne({"kleur" : {$regex : `.*${req.session.newOrder.color}.*`}});
  res.render('check-order', {order: req.session.newOrder, img: afbeelding.image, user: userInfo})
})

.post('/admin',upload.single('tshirt') ,function(req, res){
  db.collection('tshirts').insertOne({
    image: req.file ? req.file.filename : null,
    kleur: req.body.kleur,
    type: req.body.type
  }, res.render('admin'))
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
  db.collection('bestelling').updateOne({
    _id: ObjectId(req.body.id)
  }, {
    $set: {
      firstname: req.session.user.firstname,
      email: req.session.user.email,
      gender: req.body.gender,
      size: req.body.size,
      color: req.body.color,
      text: req.body.text,
      font: req.body.font,
      fontColor: req.body.fontColor,
      pos: req.body.pos,
      land: req.session.user.land,
      city: req.session.user.city,
      postal: req.session.user.postal,
      street: req.session.user.street,
      housenumber: req.session.user.housenumber
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





function check_session(req, res, next) {
  if(req.session.user === undefined){
    userInfo = "guest";
  }else{
    userInfo = req.session.user;
  } 
  next();
}

function logout(req, res){
  req.session.destroy();
  res.redirect('/home')
}

// ------------------------------------------------------------------------------------------------------------------
// render page functions
//---------------------------------------------------------------------------------------------------------------------

async function load_viewOrder(req, res, next){
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
}

function check_status(req, res){
  load_home(req, res)
}

function load_admin(req, res){
  res.render('admin')
}

function load_home(req, res, next){
  db.collection("bestelling").find({}).toArray(async function(err, result) {
    if (err) throw err;
    const tshirtDesigns = [];
    for (const shirt in result) {
        const tshirtKleur = result[shirt].color;
        const tshirtText = result[shirt].text;
        const tshirtFont = result[shirt].font;
        const tshirtFontColor = result[shirt].fontColor;
        const tshirtImg = await db.collection('tshirts').findOne({"kleur" : {$regex : `.*${tshirtKleur}.*`}});
        tshirtDesigns.push({
          shirtkleur: tshirtKleur,
          shirtText: tshirtText,
          shirtFont: tshirtFont,
          shirtfontColor: tshirtFontColor,
          shirtImg: tshirtImg.image
        });
    }
    res.render('home', {ontwerpen: tshirtDesigns, user: userInfo});
  });  
}

function load_register(req, res){
  res.render('register', {user: userInfo})
}

function load_login(req, res){
  res.render('login', {user: userInfo})
}

async function load_edit(req, res) {
  const data = await db.collection('bestelling').findOne({_id: ObjectId(req.params.id)});
  res.render('edit', {id: req.body.id, bestelling: data, user: userInfo})
}

function load_new_credentials(req, res){
  res.render('new-credentials', {user: userInfo})
}

function load_new_tshirt(req, res){
  res.render('new-tshirt', {user: userInfo})
}

function load_new_delivery(req, res){
  res.render('new-delivery', {user: userInfo})
}

function load_userpage(req, res){
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
          res.render('userpage', {user: userInfo, bestellingen: designData})
        }else{
          res.render('userpage', {user: userInfo, bestellingen: "nope"})
        }
      }else{
        console.log("nog geen bestellingen")
        res.render('userpage', {user: userInfo, bestellingen: "nope"})
      }
    }
  }
}

app.listen(PORT, ()=> console.log(`App listening at http://localhost:${PORT}`));