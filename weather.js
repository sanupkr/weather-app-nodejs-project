const express = require("express");

const app = express();

const https = require("https");

const body_parser = require("body-parser");

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://sanupkumar:test123>@cluster0.q5vfn.mongodb.net/weather_db",{useNewUrlParser: true, useUnifiedTopology: true});
const intro = "Weather Application";
const about_data = "This is Sanup kumar,I am a Computer Science student of Birla Institute Of Technology, Mesra,and this weather app project is an effort to try and create an api related application";


const city_schema = new mongoose.Schema({
  name:{type:String,unique:true},
  temp:Number,
  desc:String
});

const City = mongoose.model("city",city_schema);

app.set('view engine','ejs');
app.use(express.static("public"));
app.use(body_parser.urlencoded({extended:true}));

const port = process.env.Port || 3000;

app.listen(port);

app.get("/",function(req,res){

  City.find(function(err,cities){
    if(err)
    {
      console.log("some error");
    }
    else{
      for(var i=0;i<cities.length;i++)
      {
        var city_name = cities[i].name;
        var city_id = cities[i]._id;
        const url = "https://api.openweathermap.org/data/2.5/weather?q="+city_name+"&appid=d9066941c215fa5243891e889d4e55a3&units=metric";

        https.get(url,function(response){
          response.on("data",function(data){
            var weather_info = JSON.parse(data);
            var info = weather_info.main.temp;
            var description = weather_info.weather[0].description;
            City.updateOne({_id:city_id},{desc:description,temp:info},function(err){
              if(err){
                console.log("error occured");
              }

            });
          });
        });


      }


      res.render("home",{intro:intro,city_name:cities});
    }

  });

});



app.post("/",function(req,res){
  var city = req.body.city_name;

  const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=d9066941c215fa5243891e889d4e55a3&units=metric";

  https.get(url,function(response){

     response.on("data",function(data){

       const weather_info = JSON.parse(data);
       const image_url = "https:openweathermap.org/img/wn/" + weather_info.weather[0].icon +"@2x.png"
      var info = "Temperature in " + city +  " is "+weather_info.main.temp + " degree celsius";
      var description = weather_info.weather[0].description

      const new_city = new City({
        name:city,
        temp:weather_info.main.temp,
        desc:description
      });

      new_city.save();

       res.render("content",{intro:info,image:image_url});
     });

  });

});


app.post("/home",function(req,res){
  res.redirect("/");
});

app.get("/about",function(req,res){
  res.render("about",{about_text:about_data});
});


app.post("/delete",function(req,res){
  var id = req.body.remove;
  City.deleteOne({_id:id},function(err){
    if(err){
      console.log("error" + id);
    }
    else{
      console.log("successfully deleted");
    }
  });

  res.redirect("/");
});
