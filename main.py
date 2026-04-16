from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Dict

from sentiment import analyze_sentiment
from mock_data import TICKERS, generate_tweets_for_ticker
from config import settings

app = FastAPI(title="Stock Sentiment API")

@app.on_event("startup")
async def startup_event():
    if settings.twitter_bearer_token:
        print("🟢 Live Mode: Twitter API Key detected. (Real data integration ready)")
    else:
        print("🟡 Simulation Mode: No Twitter API Key found. Generating mock data.")

# Mount the static directory for the frontend
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def read_index():
    return FileResponse('static/index.html')

class TweetSentiment(BaseModel):
    user: str
    text: str
    sentiment_score: float
    sentiment_label: str

class TickerSummary(BaseModel):
    ticker: str
    average_score: float
    overall_sentiment: str
    total_tweets: int
    tweets: List[TweetSentiment]

@app.get("/api/trending")
async def get_trending_stocks():
    """
    Returns a list of trending tickers and their aggregated sentiment.
    In a real app, this would query a database of recently parsed tweets.
    """
    trending = []
    
    for ticker in TICKERS:
        raw_tweets = generate_tweets_for_ticker(ticker, count=10)
        
        scores = []
        analyzed_tweets = []
        
        for rt in raw_tweets:
            analysis = analyze_sentiment(rt["text"])
            scores.append(analysis["score"])
            analyzed_tweets.append({
                "user": rt["user"],
                "text": rt["text"],
                "sentiment_score": analysis["score"],
                "sentiment_label": analysis["label"]
            })
            
        avg_score = sum(scores) / len(scores) if scores else 0
        if avg_score >= 0.1:
            overall = "Bullish"
        elif avg_score <= -0.1:
            overall = "Bearish"
        else:
            overall = "Neutral"
            
        trending.append({
            "ticker": ticker,
            "average_score": avg_score,
            "overall_sentiment": overall,
            "total_tweets": len(analyzed_tweets),
            "tweets": analyzed_tweets
        })
        
    # Sort by absolute sentiment magnitude (most polarizing first)
    trending.sort(key=lambda x: abs(x["average_score"]), reverse=True)
        
    return {"trending": trending}

@app.get("/api/tweets/{ticker}", response_model=TickerSummary)
async def get_ticker_tweets(ticker: str):
    """
    Returns detailed tweets and sentiment for a specific ticker.
    """
    raw_tweets = generate_tweets_for_ticker(ticker.upper(), count=20)
    
    scores = []
    analyzed_tweets = []
    
    for rt in raw_tweets:
        analysis = analyze_sentiment(rt["text"])
        scores.append(analysis["score"])
        analyzed_tweets.append(TweetSentiment(
            user=rt["user"],
            text=rt["text"],
            sentiment_score=analysis["score"],
            sentiment_label=analysis["label"]
        ))
        
    avg_score = sum(scores) / len(scores) if scores else 0
    if avg_score >= 0.1:
        overall = "Bullish"
    elif avg_score <= -0.1:
        overall = "Bearish"
    else:
        overall = "Neutral"
        
    return TickerSummary(
        ticker=ticker.upper(),
        average_score=avg_score,
        overall_sentiment=overall,
        total_tweets=len(analyzed_tweets),
        tweets=analyzed_tweets
    )
