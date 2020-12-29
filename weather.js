const express = require("express");

const app = express();

const https = require("https");

const body_parser = require("body-parser");

app.use(body_parser.urlencoded({extended:true}));

app.listen(3000,function(){
  console.log("server is running on port 3000");
});

app.get("/",function(req,res){
  res.sendfile(__dirname+"/index.html");
});



app.post("/",function(req,res){
  var city = req.body.city_name;

  const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=d9066941c215fa5243891e889d4e55a3&units=metric";

  https.get(url,function(response){

     response.on("data",function(data){

       const weather_info = JSON.parse(data);
       const image_url = "https:openweathermap.org/img/wn/" + weather_info.weather[0].icon +"@2x.png"
      res.write("<h1>temperature in " + city +  " is "+weather_info.main.temp + " degree celsius</h1>");
      res.write("<img src=" + image_url + ">")
       res.send();
     });

  });

});
