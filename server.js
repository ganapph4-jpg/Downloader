const express = require('express');
const { spawn } = require('child_process');

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

  // Use yt-dlp binary
  const ytdlp = spawn('./yt-dlp', ['-f', 'best', '-o', '-', url]);

  res.header('Content-Disposition', `attachment; filename="video.mp4"`);

  ytdlp.stdout.pipe(res);

  ytdlp.stderr.on('data', (data) => {
    console.error(`yt-dlp error: ${data}`);
  });

  ytdlp.on('close', (code) => {
    console.log(`yt-dlp process exited with code ${code}`);
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
