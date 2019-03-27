const Joi = require("joi");
const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 5,
    maxlength: 50,
    unique: true
  }
});

const City = mongoose.model("City", citySchema);

function validateCity(city) {
  const schema = {
    name: Joi.string()
      .regex(/^[a-zA-Z]/)
      .min(3)
      .required()
  };

  return Joi.validate(city, schema);
}

exports.City = City;
exports.citySchema = citySchema;
exports.validate = validateCity;
