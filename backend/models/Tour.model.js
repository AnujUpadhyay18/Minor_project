const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  destination: { type: String, required: true },
  location: { type: String, required: true },
  description: [{ type: String, required: true }],
  image: [{ type: String, required: true }],
  tour: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  price: { type: Number, required: true },
});

const TourPackage = mongoose.model('TourPackage', TourSchema);

module.exports = TourPackage;
