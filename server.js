const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
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

app.get('/download', (req, res) => {
  const url = req.query.url;
  if (!url) return res.send('Please provide a URL!');

  const tempPath = path.join('/tmp', 'video.mp4');

  // Delete old temp file if exists
  if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

  // Download video to /tmp/video.mp4
  const ytdlp = spawn('./yt-dlp', ['-f', 'best', '-o', tempPath, url]);

  ytdlp.stderr.on('data', (data) => {
    console.error(`yt-dlp error: ${data}`);
  });

  ytdlp.on('close', (code) => {
    if (code === 0 && fs.existsSync(tempPath)) {
      // Send file to client
      res.download(tempPath, 'video.mp4', (err) => {
        if (err) console.error(err);
        fs.unlinkSync(tempPath); // clean up
      });
    } else {
      res.send('Failed to download video. Maybe the link is invalid or not supported.');
    }
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
