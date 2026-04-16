from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()

def analyze_sentiment(text: str) -> dict:
    """
    Analyzes the sentiment of a given string using vaderSentiment.
    Returns a dictionary with the score and the human-readable label.
    """
    scores = analyzer.polarity_scores(text)
    compound = scores['compound']
    
    if compound >= 0.05:
        label = "Bullish"
    elif compound <= -0.05:
        label = "Bearish"
    else:
        label = "Neutral"
        
    return {
        "score": compound,
        "label": label
    }
