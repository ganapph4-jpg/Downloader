const express = require('express');
const ytdlp = require('yt-dlp-exec');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send(`
    <h2>Simple YouTube Downloader</h2>
    <form method="GET" action="/download">
      <input name="url" placeholder="YouTube URL" style="width:300px"/>
      <button>Download</button>
    </form>
  `);
});

app.get('/download', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.send('Please provide a URL!');

  try {
    // Generate a safe filename
    const title = `video.mp4`; // optional: you can make dynamic using yt-dlp metadata

    res.header('Content-Disposition', `attachment; filename="${title}"`);

    // Stream video directly
    const stream = ytdlp(url, {
      format: 'best',
      output: '-'
    });

    stream.stdout.pipe(res);

    stream.on('close', () => console.log('Download finished!'));
  } catch (err) {
    res.send('Error: ' + err.message);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
