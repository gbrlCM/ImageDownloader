let aws = require('aws-sdk')
let express = require('express')
let multer = require('multer')
let multerS3 = require('multer-s3')
let app = express()
require('dotenv').config();

const { 
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    AWS_BUCKET_NAME,
    AWS_REGION
} = process.env

let s3 = new aws.S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    Bucket: AWS_BUCKET_NAME,
    region: AWS_REGION
 })

 let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket:AWS_BUCKET_NAME,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, Object.assign({}, req.body));
          },
          key: function (req, file, cb) {
            cb(null,  Date.now().toString() + ".jpg");
          }
    })
 })

 app.post('/upload', upload.single('photos'), function (req, res, next) {
    res.send({
        data: req.file,
        msg: 'Successfully uploaded ' + req.file + ' files!'
    })
 })

 app.use(function(req, res, next) {
    var data = Buffer.from([]);
    req.on('data', function(chunk) {
        data = Buffer.concat([data, chunk]);
    });
    req.on('end', function() {
      req.rawBody = data;
      next();
    });
  });

 app.post('/test', function(req, res) {
    
  });

 app.listen(process.env.PORT || 8080, function () {
    console.log('express is online');
 })

