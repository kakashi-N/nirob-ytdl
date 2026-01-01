const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing url parameter'
      });
    }

    const response = await axios.get('https://nirob.top/dl', {
      params: { url },
      timeout: 15000,
      headers: {
        'user-agent':
          'Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Mobile Safari/537.36',
        'referer': 'https://nirob.top/down'
      }
    });

    let urls = [];

    const safeExtract = (data) => {
      if (!data) return;

      if (typeof data === 'string') {
        // ✅ ONLY YTDOWN URL
        if (data.includes('YTDown.com')) {
          urls.push(data);
        }
        return;
      }

      if (Array.isArray(data)) {
        for (const item of data) safeExtract(item);
        return;
      }

      if (typeof data === 'object') {
        for (const key in data) safeExtract(data[key]);
      }
    };

    safeExtract(response.data);

    return res.status(200).json({
      status: 'success',
      total: urls.length,
      urls
    });

  } catch (err) {
    console.error('API ERROR:', err.message);

    return res.status(500).json({
      status: 'error',
      message: 'Serverless function crashed',
      error: err.message
    });
  }
};
