const express = require('express');
const ytdl = require('ytdl-core');

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
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, '_');
    res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
    ytdl(url, { quality: 'highestvideo' }).pipe(res);
  } catch (err) {
    res.send('Error: ' + err.message);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
