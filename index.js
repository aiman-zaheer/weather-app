const fs = require('fs');
const express = require('express');
const requests = require('requests');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
const homeFile = fs.readFileSync("index.html","UTF-8");
app.use('/',express.static(__dirname)); // '/public' nh dyngy tw '/' is py bydefault files load horhi then


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

app.post('/',(req,res)=>{

  console.log(req.body.cityname);
  let city = req.body.cityname;
  if(city !== ""){
  let url2 = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=184b937fbff28f2227b26eb6d36757ae";

  requests(url2) 
    .on('data',(chunk)=>{
      
      const objdata = JSON.parse(chunk); // convert JSON into Object
      const arrdata = [objdata]; // convert object into array

      let realData = arrdata.map(value => realValues(homeFile,value)).join("");

      res.write(realData);
      
    })
    .on('end',(err)=>{
      console.log(err);
      res.end();
    })
    
  }
  else{
    res.send("Please Enter City Name");
  }
})


app.get('/*',(req,res)=>{
  res.send("File not found");
})

app.listen(7000,(req,res)=>{
  console.log("working on port 7000");
  
})
