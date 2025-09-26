const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname))); 

app.use(cors());

app.get('/thumbnail', async (req, res) => {
  const videoURL = req.query.url;

  if (!videoURL) {
    return res.status(400).send('Missing URL parameter');
  }

  const videoID = extractVideoID(videoURL);
  if (!videoID) {
    return res.status(400).send('Invalid YouTube URL');
  }

  const imageURL = `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`;

  try {
    const response = await axios.get(imageURL, { responseType: 'stream' });
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${videoID}.jpg"`);
    response.data.pipe(res);
  } catch (error) {
    res.status(500).send('Error fetching thumbnail');
  }
});

function extractVideoID(url) {
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
