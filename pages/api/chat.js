// /pages/api/chat.js for Coinsbeat AI - Multilingual + Smart Topic Analysis + TradingView Charts (Free Plan)

import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    // CoinGecko Trending Coins
    const coingeckoResponse = await axios.get('https://api.coingecko.com/api/v3/search/trending');
    const trendingCoins = coingeckoResponse.data.coins
      .map((coin) => coin.item.name)
      .slice(0, 5)
      .join(', ');

    // Twitter scraping via Nitter (no auth, free)
    const nitterResponse = await axios.get('https://nitter.net/search?f=tweets&q=' + encodeURIComponent(message), {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const tweets = nitterResponse.data.match(/<p class="tweet-content media-body">(.*?)<\/p>/g)?.slice(0, 3) || [];
    const tweetText = tweets.map((html) => html.replace(/<[^>]*>/g, '').trim()).join(' | ');

    // TradingView Symbol Extraction (if mentioned in message)
    const matchSymbol = message.match(/\b[A-Z]{2,10}\b/);
    let tradingviewLink = '';
    if (matchSymbol) {
      const symbol = matchSymbol[0];
      tradingviewLink = `https://www.tradingview.com/symbols/${symbol}USD/`;
    }

    // Multilingual detection + prompt tuning
    const langPrompt = `Detect the language of this user message: ${message}. If it's French, German, or Russian, answer in that language.`;

    // Compose AI prompt
    const prompt = `You are Coinsbeat AI, a crypto analyst.
User: ${message}
Language: ${langPrompt}
Trending coins: ${trendingCoins}
Related tweets: ${tweetText}
TradingView chart (if applicable): ${tradingviewLink}
Give intelligent response with current insight, news, sentiment, and charts.`;

    const aiResponse = await axios.post('https://chat-api.unofficial.dev/completion', {
      messages: [
        { role: 'system', content: 'You are Coinsbeat AI, a crypto analyst bot with news, tweets, and chart support.' },
        { role: 'user', content: prompt }
      ]
    });

    const reply = aiResponse.data.choices?.[0]?.message?.content || 'Sorry, I could not generate a reply.';
    res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ reply: 'Sorry, failed to fetch data or process your request.' });
  }
}
