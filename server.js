var express = require("express");
var app = express();
var http = require('http').createServer(app);
//var bodyParser = require("body-parser");



////////////////////////////////////////////
const bp = require('body-parser')
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
require('./db');
const mongoose = require("mongoose");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var bcrypt = require('bcryptjs'); 
////////////////////////////////////////////



var formidable = require('formidable');
var fs = require('fs');
var { getVideoDurationInSeconds } = require("get-video-duration");
var multer = require("multer");

app.use('/views', express.static('views'));
app.set('views', './views');
app.set("view engine", "ejs");

const session = require('express-session');
const flash = require('connect-flash');
const { Int32 } = require("mongodb");

const filePath = "videos/SampleVideo_1280x720_1mb.mp4";


http.listen(9090, function (req, res) {
  console.log("server is start. On http://localhost:9090/");

  app.get("/", function (req, res) {
    res.render("index");
  });


/////////////////////////////////////
/////////////////////////////////////
  const contactSchema = {
    fname: String,
    lname: String,
    Username: String,
    Email: String,
    password: String,
    Role: String
  };
  
  const Contact = mongoose.model("customers", contactSchema);

/////////////////////////////////////
/////////////////////////////////////
  

  app.get("/login", function (req, res) {
    res.render("login");
  });

  
/////////////////////////////////////
/////////////////////////////////////
  app.post("/login", async function (req, res) {
    //console.log(req.body)
    MongoClient.connect(url, async function(err, db) {
      var val = 0;

   
  /////////////////////////////////////////
    const client = new MongoClient(url);
    await client.connect();
    const Course = await client.db("JoodTubeDB").collection("course").find({}).toArray();
   
  /////////////////////////////////////////

  
const item = await Contact.find({})
      const salt = 10;
      const hashpass = bcrypt.hashSync(req.body.password, salt);
      item.forEach(item => {
      check = bcrypt.compareSync (req.body.password , item.password);
        if(req.body.username === item.Email && val === 0){
          if(check == true){
            
            if(item.Role == "Admin"){
                res.redirect('/upload_vdo?'+ item._id)
               val = 1 ;
            }
            if(item.Role == "User"){
              res.redirect('/watch_vdo?'+ item._id)
              val = 1 ;
            }
              console.log("pass");
          }else{
            val = 0 ;
          }
      }else{
             val = 0 ;
        }
      });
      if(val === 0){
        res.render("login");
      }
    });
  });
  /////////////////////////////////////
  /////////////////////////////////////

  app.get("/watch_vdo", function (req, res) {
    res.render("Watch_vdo");
  });

  app.get("/upload_vdo", function (req, res) {
    res.render("Upload_video", { success: '' });
  });

  app.get("/register", function (req, res) {
    res.render("Register");
  });

  /////////////////////////////////////
  /////////////////////////////////////
  app.post("/register", async function (req, res) {
   const saltRounds = 10;
    const hashp = bcrypt.hashSync(req.body.password, saltRounds);
    const contact = new Contact({
      fname: req.body.fname,
      lname: req.body.lname,
      Username: req.body.Username,
      Email: req.body.Email,
      password: hashp,
      Role: "User"
  });
  contact.save(function (err) {
    
      if (err) {
          throw err;
          
          
      }else{
        
        res.render("login");
      } 
  });
  });
  /////////////////////////////////////
  /////////////////////////////////////
 

  app.get("/works-in-chrome", (req, res) => {
    res.setHeader("content-type", "video/mp4");

    fs.stat(filePath, (err, stat) => {
      if (err) {
        console.error(`File stat error for ${filePath}.`);
        console.error(err);
        res.sendStatus(500);
        return;
      }

      res.setHeader("content-length", stat.size);

      const fileStream = fs.createReadStream(filePath);
      fileStream.on("error", error => {
        console.log(`Error reading file ${filePath}.`);
        console.log(error);
        res.sendStatus(500);
      });

      fileStream.pipe(res)
    });
  });

  app.use(session({
    secret: 'upload',
    saveUninitialized: true,
    resave: true
  }));

  app.use(flash());

  var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './videos');
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    }
  });

  var upload = multer({ storage: storage }).single('video');

  app.post('/upload-vdo', function (req, res) {
    upload(req, res, function (err) {
      if (err) {
        console.log(err)
        return res.end("Error uploading file.");
      }
      res.render('Upload_video' , {success:'Uploaded Video Successfully'});
    });
  });

});

