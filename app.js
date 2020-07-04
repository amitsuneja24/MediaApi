const express=require('express');
const app=express();
const mongoose=require('mongoose');
const Grid= require('gridfs-stream');
const crypto=require('crypto');
const path= require('path');
const GridFsStorage= require('multer-gridfs-storage');
const multer=require('multer');

//app.use(fileUpload());

//Mongo Uri
const mongoURI= 'mongodb+srv://amitsuneja24:75036688260@videos.cx5oy.mongodb.net/video_uploads?retryWrites=true&w=majority';

//Creating Connection
const conn=mongoose.createConnection(mongoURI, { useUnifiedTopology: true,useNewUrlParser: true });

//Init gfs
let gfs;
conn.once('open',()=>{
    //Init Stream
    gfs=Grid(conn.db,mongoose.mongo);
    gfs.collection('uploads');
})

//Create Storage Engine
var storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });


//Routes GET
app.get('/',(req,res)=>{
    res.status(200).json('Upload a Video');
})


//Routes Post
app.post('/upload',upload.single(`video`),(req,res)=>{
    const file=req.file;
    console.log(file);
    res.json({
        success: true,
        message: 'File Uploaded',
        file_name:req.file.originalname
    })

})

app.listen(3000,()=>console.log('Started on port 3000'));