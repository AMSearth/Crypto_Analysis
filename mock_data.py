import random
from typing import List, Dict

TICKERS = ["BTC", "ETH", "SOL", "DOGE"]

BULLISH_TEMPLATES = [
    "Just bought more {ticker}. The fundamentals are strong! 🚀",
    "{ticker} is breaking out! Technicals look crazy good right now.",
    "Can't spell moon without {ticker}. Call options printing today.",
    "Bears are going to get trapped on {ticker}. Long term hold for sure.",
    "Earnings for {ticker} are going to beat expectations. Mark my words.",
    "HODLing my {ticker} forever. Web3 is the future! 💎🙌",
    "Buying the dip on {ticker}! You'll regret missing these prices."
]

BEARISH_TEMPLATES = [
    "Sold all my {ticker} today. The valuation is completely detached from reality.",
    "{ticker} is looking weak at resistance. Puts are the play right now. 📉",
    "Way too much hype around {ticker}. A major correction is coming soon.",
    "Macro environment is terrible for {ticker}. I would stay away.",
    "Did anyone see that bearish divergence on {ticker}? Time to short.",
    "Looks like a rug pull on {ticker}. Scam coin behavior.",
    "Crypto winter is hitting {ticker} hard right now."
]

NEUTRAL_TEMPLATES = [
    "Watching {ticker} closely today. Let's see if it holds support.",
    "{ticker} is trading sideways. Waiting for a clear direction.",
    "Volume is low on {ticker} today.",
    "Thinking about picking up some {ticker} if it drops another 5%.",
    "Options flow on {ticker} is pretty mixed right now.",
    "Not sure what to make of {ticker} after that latest news."
]

def generate_mock_tweet(ticker: str) -> str:
    """Generates a realistic single retail investor tweet for a ticker."""
    sentiment_choice = random.choices(
        ["bullish", "bearish", "neutral"], 
        weights=[0.4, 0.4, 0.2]
    )[0]
    
    if sentiment_choice == "bullish":
        template = random.choice(BULLISH_TEMPLATES)
    elif sentiment_choice == "bearish":
        template = random.choice(BEARISH_TEMPLATES)
    else:
        template = random.choice(NEUTRAL_TEMPLATES)
        
    return template.format(ticker=ticker)

def generate_tweets_for_ticker(ticker: str, count: int = 15) -> List[Dict[str, str]]:
    """Generates a list of mock tweets for a given ticker."""
    tweets = []
    for _ in range(count):
        # Adding a fake username for realism
        user = f"user_{random.randint(1000, 9999)}"
        text = generate_mock_tweet(ticker)
        tweets.append({"user": user, "text": text})
    return tweets
