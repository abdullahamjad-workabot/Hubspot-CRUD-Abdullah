const axios = require("axios");
require("dotenv").config();

const API_TOKEN = process.env.API_KEY;

const headers = {
  Authorization: `Bearer ${API_TOKEN}`,
  "Content-Type": "application/json",
};

const BASE_URL = "https://api.hubapi.com";


app.listen(3000, () => console.log('Listening on http://localhost:3000'));