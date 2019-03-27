const { City, validate } = require("../models/cities");
const mongoose = require("mongoose");
var request = require("request-promise");
const express = require("express");
const router = express.Router();
//if (message)
router.get("/", async (req, res) => {
  let weather_jdata = [];
  console.log("inside get");
  weather_jdata = await gettemp();
  res.render("index", { message: weather_jdata });
});

router.post("/", async (req, res) => {
  let weather_jdata = [];
  weather_jdata = await gettemp();
  console.log("inside post", req.body);
  const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);
  if (error)
    return res.status(400).render("index", {
      message: weather_jdata,
      error: error.details[0].message
    });

  let city = await City.findOne({ name: req.body.name.toLowerCase() });

  if (city) {
    return res.status(400).render("index", {
      message: weather_jdata,
      error: "city is already listed"
    });
  } else {
    try {
      var url = `http://api.openweathermap.org/data/2.5/weather?q=${req.body.name.toLowerCase()}&units=imperial&appid=05846e6dfa42e2f2c6cd37d12d0677e3`;
      var city_weather = await request(url);
      city = new City({ name: req.body.name.toLowerCase() });
      city = await city.save();
    } catch (error) {
      return res.status(400).render("index", {
        message: weather_jdata,
        error: "City not found"
      });
    }
  }

  //res.send(city);
  res.redirect("/api/weather");
});

async function gettemp() {
  const cities = await City.find().sort("name");
  // console.log(cities);
  var weather_data = [];

  for (c of cities) {
    var city = c.name;
    //console.log(city);
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=05846e6dfa42e2f2c6cd37d12d0677e3`;

    try {
      var city_weather = await request(url);

      //console.log("getting city bject", city_weather);
      var data_json = JSON.parse(city_weather);

      var weather = {
        city: city,
        temp: data_json.main.temp,
        desc: data_json.weather[0].description,
        icon: data_json.weather[0].icon,
        id: c._id
      };

      weather_data.push(weather);
    } catch (error) {
      return res.status(500).render("index", {
        message: weather_data,
        error: "Internal Error"
      });
      console.log("in catch : ", error);
    }
  }
  return weather_data;
}

router.delete("/:id", async (req, res) => {
  console.log("inside delete", req.params.id);
  let query = { _id: req.params.id };
  const city = await City.findByIdAndRemove(req.params.id);

  //   if (!genre)
  //     return res.status(404).send("The genre with the given ID was not found.");

  res.send("success");
});

module.exports = router;
