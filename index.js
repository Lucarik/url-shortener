require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const http = require('node:https')
const bodyParser = require('body-parser')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const link_array = [];

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/shorturl", function(req,res) {
  try {
  http.get(req.body.url, (result) => {
    const { statusCode } = result;
    if (statusCode !== 200) {
      res.json({ error: err });
    }
    let obj = {original_url: req.body.url , short_url: link_array.length+1};
    let link = link_array.find(e => e.original_url == req.body.url);
    if (typeof link === "undefined") {
      link_array.push(obj);
    }
    res.json(obj);
    
  });}
  catch (err) {
    res.json({ error: "Invalid URL" });
  }
  
});

// Your first API endpoint
app.get('/api/shorturl/:urlm', function(req, res) {
  let num = +req.params.urlm;
  let link = link_array.find(e => e.short_url == num);
  if (!(typeof link === "undefined")) {
    res.writeHead(301, {
      Location: link.original_url
    }).end();
  }
  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
