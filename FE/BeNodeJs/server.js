const express = require('express');
const stream = require('getstream');
const cors = require('cors'); // Thêm dòng này

const app = express();
const port = 3000;

app.use(cors()); // Sử dụng CORS middleware

const apiKey = '6z9r95ahppyg';
const apiSecret = 'ghx7k3pnvfpvpruy79y6mdv99nbv97ghggvxpxq3y5k85eb3xzsfr468b3259pdb';
const client = stream.connect(apiKey, apiSecret);

app.get('/create-token/:userId', (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const token = client.createUserToken(userId);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the token' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
