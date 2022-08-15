//jshint esversion:6

const express = require("express");
const app = express();
const https = require('https');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  const appid = "appid";
  const units = "imperial";
  const city = req.body.city;
  const url = "https://api.openweathermap.org/data/2.5/forecast?units=" + units + "&q="+ city + "&appid=" + appid;
  https.get(url, function(response){
    var stringData = '';
    response.on("data", function(data){
      stringData += data;
    });

    response.on("end", function() {
      weatherData = JSON.parse(stringData);
      const temp = weatherData.list[0].main.temp;
      const weatherDescription = weatherData.list[0].weather[0].description;
      const icon = weatherData.list[1].weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";

      res.write("<h1>The temperature in " + city + " is " +temp+" degrees fahrenheit</h1>");
      res.write("<h1>The weather is " +weatherDescription+"</h1>");
      res.write("<img src=" + imageURL+">");

      res.send();

    });
  });
});

app.listen(3000, function(){
  console.log("Server is running on port 3000");
});
