const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(express.json());

const API_TOKEN = process.env.API_KEY;

const headers = {
  Authorization: `Bearer ${API_TOKEN}`,
  "Content-Type": "application/json",
};

const BASE_URL = "https://api.hubapi.com";

// Read Contacts 

app.get("/contacts", async (req, res) => {
  try {

    const response =
      await axios.get(
        `${BASE_URL}/crm/v3/objects/contacts`,
        {
          headers,
          params: {
            properties:
              "email,firstname,lastname,phone",
          },
        }
      );

    res.status(200).json(response.data);

  } catch (error) {

    res.status(500).json({
      message: "Failed to retrieve contacts",
      error:
        error.response?.data ||
        error.message,
    });

  }
});

app.post("/contacts", async (req, res) => {
  try {

    const response =
      await axios.post(
        `${BASE_URL}/crm/v3/objects/contacts`,
        {
          properties: req.body,
        },
        {
          headers,
        }
      );

    res.status(201).json(response.data);

  } catch (error) {

    res.status(500).json({
      message: "Create failed",
      error:
        error.response?.data ||
        error.message,
    });

  }
});

// Update Entire Contact 

app.put("/contacts/:contactId", async (req, res) => {
  try {

    const { contactId } =
      req.params;

    const response =
      await axios.patch(
        `${BASE_URL}/crm/v3/objects/contacts/${contactId}`,
        {
          properties: req.body,
        },
        {
          headers,
        }
      );

    res.status(200).json(response.data);

  } catch (error) {

    res.status(500).json({
      message: "Update failed",
      error:
        error.response?.data ||
        error.message,
    });

  }
});

// Patch Specific Field 

app.patch("/contacts/:contactId", async (req, res) => {
  try {

    const { contactId } =
      req.params;

    const response =
      await axios.patch(
        `${BASE_URL}/crm/v3/objects/contacts/${contactId}`,
        {
          properties: req.body,
        },
        {
          headers,
        }
      );

    res.status(200).json(response.data);

  } catch (error) {

    res.status(500).json({
      message: "Patch failed",
      error:
        error.response?.data ||
        error.message,
    });

  }
});

app.post("/contacts/upsert", async (req, res) => {
  try {
    const { email } = req.body;

    const search = await axios.post(
      `${BASE_URL}/crm/v3/objects/contacts/search`,
      {
        filterGroups: [
          {
            filters: [
              {
                propertyName: "email",
                operator: "EQ",
                value: email,
              },
            ],
          },
        ],
      },
      { headers }
    );

    const existing = search.data.results?.[0];

    if (existing) {
      const updated = await axios.patch(
        `${BASE_URL}/crm/v3/objects/contacts/${existing.id}`,
        { properties: req.body },
        { headers }
      );

      return res.json({
        message: "Updated",
        data: updated.data,
      });
    }

    const created = await axios.post(
      `${BASE_URL}/crm/v3/objects/contacts`,
      { properties: req.body },
      { headers }
    );

    return res.json({
      message: "Created",
      data: created.data,
    });

  } catch (error) {
    console.log(error.response?.data || error.message);

    return res.status(500).json({
      message: "Upsert failed",
      error: error.response?.data || error.message,
    });
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));