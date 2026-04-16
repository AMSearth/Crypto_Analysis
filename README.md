# Crypto Sentiment Pulse 🚀

A modern, high-performance web dashboard that analyzes real-time sentiment surrounding major cryptocurrencies (BTC, ETH, SOL, DOGE).

## Features
- **FastAPI Backend**: Built for speed and asynchronous polling.
- **VaderSentiment ML**: Instantaneous sentiment classification (Bullish, Bearish, Neutral).
- **Glassmorphic UI**: High-end crypto terminal styling crafted with Tailwind CSS and Vanilla JS.
- **Dynamic Feed**: Real-time polling updates the active ticker without refreshing.

## Getting Started (Local Development)

1. Create a virtual environment and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

3. Open `http://localhost:8000` in your browser.

## Getting Started (Docker)

To run the application in an isolated container:

1. Clone the repository.
2. Spin up the cluster:
   ```bash
   docker compose up --build
   ```
3. Open `http://localhost:8000` in your browser.

## API Key Setup (Live Data)

By default, the application runs in **Simulation Mode** using hyper-realistic mock Twitter data to let you explore the UI immediately.

To connect real Twitter/X data feeds:
1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Insert your Twitter Bearer token into `.env`.
3. The server will automatically detect the key on startup and log `🟢 Live Mode: Twitter API Key detected.`. (Note: The `mock_data.py` logic will need to be hot-swapped for your Tweepy pipeline).
