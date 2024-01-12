const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());
require('dotenv').config(); 
const { OpenAI } = require('openai');


app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// generate a url that asks permissions for the Gmail scope
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});
app.get('/auth/google/url', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    res.send({ url });
  });
  
app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
  
      // Redirect to your '/fetch-emails' route or another page
      res.redirect('http://localhost:3000/');
    } catch (error) {
      console.error('Error during authentication:', error);
      res.status(500).send('Authentication failed');
    }
  });
  

app.get('/fetch-emails', async (req, res) => {

    try {
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        let emailData = await handleEmail(gmail);

        // Send parsed email data as response
        res.json(emailData);
  
    } catch (error) {
      console.error('Error fetching emails:', error);
      res.status(500).send('Error fetching emails');
    }
  });

  const extractInfoFromEmail = async (emailBody) => {
    // Creating separate regex patterns for each piece of information.
    const titlePattern = /Titre : (.*)\r\n/;
    const referencePattern = /Référence : (.*)\r\n/;
    const pricePattern = /Prix : (.*) Euros\r\n/;
    const linkPattern = /Lien direct DOMimmo :\r\n(https:\/\/.*)\r\n/;
    const contactNamePattern = /Nom du contact : (.*)\r\n/;
    const emailPattern = /Email : (.*)\r\n/;
    const phonePattern = /Téléphone : (.*)\r\n/;
  
    // Extracting information using the individual patterns.
    const extract = (pattern) => {
      const match = emailBody.match(pattern);
      return match ? match[1] : null;
    };
  
    return {
      title: extract(titlePattern),
      reference: extract(referencePattern),
      price: extract(pricePattern),
      link: extract(linkPattern),
      contactName: extract(contactNamePattern),
      email: extract(emailPattern),
      phone: extract(phonePattern),
    };
  };
  
async function handleEmail(gmail) {
    const listResponse = await gmail.users.messages.list({
      userId: 'me',
      q: 'subject:DOMimmo - Reponse annonce'
    });
  
    const messages = listResponse.data.messages;
    console.log("Fetched Messages: ", messages); // Log fetched messages
  
    if (!messages) {
      console.log("No emails found");
      return []; // Return an empty array if no messages are found
    }
  
    let emailData = [];
    
    for (let message of messages) {
      console.log("Processing message ID: ", message.id); // Log the ID of the message being processed
  
      const messageResponse = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'full'
      });
  
      const payload = messageResponse.data.payload;
      
      let emailBody = '';

      if (payload.body && payload.body.data) {
        emailBody = Buffer.from(payload.body.data, 'base64').toString();
      } else if (payload.parts) {
        payload.parts.forEach(part => {
            if (part.mimeType === 'text/plain') {
              emailBody += Buffer.from(part.body.data, 'base64').toString();
            }
          });
      }
      
      //console.log("Email Body: ", emailBody); // Log the email body
  
      const emailInfo = await extractInfoFromEmail(emailBody);

      // Add parsed email to array
      emailData.push(emailInfo);
      break
    }
  
    console.log("Final Email Data: ", emailData); // Log final array of email data
    return emailData;
  }
  
async function extractInfoFromEmailChatGPT(emailBody) {

  // Initialize the OpenAI API client
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: generatePrompt(emailBody),
        max_tokens: 150
      });      

      return parseOpenAIResponse(response.choices[0].text);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return null;
  }
}

function generatePrompt(emailBody) {
    return `Parse the following email and extract the information in a JSON format with the fields: Title, Reference, Price, Link, Contact Name, Email, and Phone. \n\nEmail:\n\n${emailBody}\n\nJSON:`;
}
  
  function parseOpenAIResponse(response) {
    try {
      // Find the start of the JSON object
      const jsonStartIndex = response.indexOf('{');
      const jsonResponse = response.substring(jsonStartIndex);
  
      // Parse the JSON string into an object
      let extractedData = JSON.parse(jsonResponse);
  
      // Convert keys to camelCase
      extractedData = Object.keys(extractedData).reduce((newData, key) => {
        const camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1);
        newData[camelCaseKey] = extractedData[key];
        return newData;
      }, {});
  
      return extractedData;
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return null;  // or handle the error as needed
    }
  }
  
  