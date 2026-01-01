const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing url parameter'
    });
  }

  try {
    const response = await axios.get('https://nirob.top/dl', {
      params: {
        url: url
      },
      headers: {
        'user-agent':
          'Mozilla/5.0 (Linux; Android 11; RMX3261) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36',
        'referer': 'https://nirob.top/down',
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9'
      }
    });

    const data = response.data;

    // 🔥 FILTER ONLY URLS
    let urls = [];

    const findUrls = (obj) => {
      if (typeof obj === 'string' && obj.startsWith('http')) {
        urls.push(obj);
      } else if (Array.isArray(obj)) {
        obj.forEach(findUrls);
      } else if (typeof obj === 'object' && obj !== null) {
        Object.values(obj).forEach(findUrls);
      }
    };

    findUrls(data);

    return res.json({
      status: 'success',
      total_urls: urls.length,
      urls: urls
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'API failed',
      error: error.message
    });
  }
};
