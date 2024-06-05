import express from 'express';
import { signUp, signIn, resetPassword } from './auth/authFunctions.js';
import { readFileSync } from 'fs';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

const archetypes = JSON.parse(readFileSync('./data/archetypes.json', 'utf-8'));

// Endpoint to get quiz questions
app.get('/quiz', (req, res) => {
  res.json(archetypes.questions);
});

// Endpoint to handle quiz responses and determine archetype
app.post('/quiz/results', (req, res) => {
  const responses = req.body.responses;
  const archetype = determineArchetype(responses);
  res.json({ archetype: archetype });
});

// Authentication Endpoints
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await signUp(email, password);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await signIn(email, password);
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  try {
    await resetPassword(email);
    res.status(200).json({ message: 'Password reset email sent!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Function to determine archetype based on responses
const determineArchetype = (responses) => {
  const scores = {
    "Problem Solver": 0,
    "Innovator": 0,
    "Leader": 0,
    "Analyst": 0
  };

  responses.forEach(response => {
    switch (response) {
      case "Analyze it thoroughly":
      case "Follow the instructions precisely":
        scores["Analyst"]++;
        break;
      case "Look for creative solutions":
      case "Look at the picture and wing it":
        scores["Innovator"]++;
        break;
      case "Take charge":
        scores["Leader"]++;
        break;
      case "Research extensively":
      case "Taste as I go and adjust":
        scores["Problem Solver"]++;
        break;
    }
  });

  let maxScore = 0;
  let archetype = "Problem Solver";
  for (const key in scores) {
    if (scores[key] > maxScore) {
      maxScore = scores[key];
      archetype = key;
    }
  }

  return archetype;
};

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
