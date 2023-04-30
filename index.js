
const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const requests = require('requests');
const { json } = require('express');
const { error } = require('console');

const app = express();

app.use('/home',express.static(__dirname)); // '/public' nh dyngy tw '/' is py bydefault files load horhi then
const homeFile = fs.readFileSync("index.html","UTF-8");

const realValues = (htmlData,newvalue)=>{
  let temperature = htmlData;
  temperature = temperature.replace("{%temp%}",newvalue.main.temp);
  temperature = temperature.replace("{%tempmin%}",newvalue.main.temp_min);
  temperature = temperature.replace("{%tempmax%}",newvalue.main.temp_max);
  temperature = temperature.replace("{%city%}",newvalue.name);
  temperature = temperature.replace("{%country%}",newvalue.sys.country);
  temperature = temperature.replace("{%weatherStatus%}",newvalue.weather[0].main);

  return temperature;
}
let url = 'https://api.openweathermap.org/data/2.5/weather?q=Karachi&appid=184b937fbff28f2227b26eb6d36757ae';

app.get('/home/update',(req,res)=>{
  
    requests(url) 
    .on('data',(chunk)=>{
      
      const objdata = JSON.parse(chunk); // convert JSON into Object
      const arrdata = [objdata]; // convert object into array

      let realData = arrdata.map(value => realValues(homeFile,value)).join("");
      
      res.write(realData);
    
    })
    .on('end',(err)=>{
      console.log(err+" error");
      res.end();
    })
})
app.get('/*',(req,res)=>{
  res.send("File not found");
})

app.listen(5000,(req,res)=>{
  console.log("working on port 5000");
})