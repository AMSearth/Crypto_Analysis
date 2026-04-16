document.addEventListener('DOMContentLoaded', () => {
    fetchTrending();
});

async function fetchTrending() {
    try {
        const response = await fetch('/api/trending');
        const data = await response.json();
        
        document.getElementById('loadingStates').classList.add('hidden');
        renderTrendingCards(data.trending);
        
        // Auto-select the first one
        if (data.trending.length > 0) {
            selectTicker(data.trending[0].ticker);
        }
    } catch (error) {
        console.error('Error fetching trending stocks:', error);
        document.getElementById('loadingStates').innerHTML = '<p class="text-red-400">Failed to connect to real-time feed.</p>';
    }
}

function renderTrendingCards(trendingData) {
    const container = document.getElementById('trendingContainer');
    container.innerHTML = '';
    container.classList.remove('hidden');

    let activeCard = null;

    trendingData.forEach(item => {
        const isBullish = item.average_score >= 0.05;
        const isBearish = item.average_score <= -0.05;
        
        let sentimentColor = 'text-slate-400';
        let barColor = 'bg-slate-500';
        let glowClass = '';
        let iconHtml = '';
        
        if (isBullish) {
            sentimentColor = 'neon-green';
            barColor = 'bg-green-500';
            glowClass = 'shadow-[0_0_15px_rgba(34,197,94,0.15)]';
            iconHtml = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>';
        } else if (isBearish) {
            sentimentColor = 'neon-red';
            barColor = 'bg-red-500';
            glowClass = 'shadow-[0_0_15px_rgba(239,68,68,0.15)]';
            iconHtml = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>';
        }

        // Convert score (-1 to 1) to percentage (0 to 100) for progress bar
        // 0 -> 50%, -1 -> 0%, 1 -> 100%
        const scorePercentage = ((item.average_score + 1) / 2) * 100;

        const card = document.createElement('div');
        card.className = `glass-panel rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-slate-500 ${glowClass}`;
        card.dataset.ticker = item.ticker;
        
        card.onclick = () => {
            // Remove active state from previous
            if (activeCard) activeCard.classList.remove('ring-2', 'ring-indigo-500', 'bg-slate-800/80');
            // Set active state on this
            card.classList.add('ring-2', 'ring-indigo-500', 'bg-slate-800/80');
            activeCard = card;
            selectTicker(item.ticker);
        };

        card.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-200 border border-slate-700">
                        ${item.ticker.charAt(0)}
                    </div>
                    <div>
                        <h3 class="font-bold text-lg heading-font leading-tight text-white">${item.ticker}</h3>
                        <p class="text-xs text-slate-400 font-medium">${item.total_tweets} tweets analyzed</p>
                    </div>
                </div>
                <div class="flex flex-col items-end">
                    <span class="font-bold text-sm ${sentimentColor} flex items-center gap-1">
                        ${item.overall_sentiment} ${iconHtml}
                    </span>
                    <span class="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Prediction</span>
                </div>
            </div>
            
            <div class="w-full bg-slate-800 rounded-full h-1.5 mt-4 overflow-hidden border border-slate-700/50">
                <div class="${barColor} h-1.5 rounded-full progress-bar-fill" style="width: 0%"></div>
            </div>
            <div class="flex justify-between text-[10px] text-slate-500 mt-1.5 font-medium">
                <span>Strong Sell</span>
                <span>Strong Buy</span>
            </div>
        `;

        container.appendChild(card);
        
        // Trigger animation
        setTimeout(() => {
            card.querySelector('.progress-bar-fill').style.width = `${scorePercentage}%`;
        }, 100);
    });
}

async function selectTicker(ticker) {
    document.getElementById('selectedTickerHeader').innerHTML = `Live Feed for <span class="text-indigo-400">${ticker}</span>`;
    
    const container = document.getElementById('tweetsContainer');
    container.innerHTML = `
        <div class="flex justify-center p-12">
            <div class="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    `;

    try {
        const response = await fetch(`/api/tweets/${ticker}`);
        const data = await response.json();
        
        document.getElementById('tweetCountLabel').innerText = data.tweets.length;
        renderTweets(data.tweets);
    } catch (error) {
        console.error('Error fetching tweets:', error);
        container.innerHTML = '<p class="text-red-400 p-4">Failed to fetch tweets.</p>';
    }
}

function renderTweets(tweets) {
    const container = document.getElementById('tweetsContainer');
    container.innerHTML = '';

    tweets.forEach((tweet, index) => {
        const isBullish = tweet.sentiment_score >= 0.05;
        const isBearish = tweet.sentiment_score <= -0.05;
        
        let sentimentColor = 'text-slate-400';
        let sentimentBg = 'bg-slate-800/50';
        let borderClass = 'border-slate-700/50';
        let iconHtml = '<div class="w-2 h-2 rounded-full bg-slate-500"></div>';
        
        if (isBullish) {
            sentimentColor = 'text-green-400';
            sentimentBg = 'bg-green-500/10';
            borderClass = 'border-green-500/20';
            iconHtml = '<svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>';
        } else if (isBearish) {
            sentimentColor = 'text-red-400';
            sentimentBg = 'bg-red-500/10';
            borderClass = 'border-red-500/20';
            iconHtml = '<svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>';
        }

        const domNode = document.createElement('div');
        domNode.className = `glass-panel rounded-xl p-5 border-l-4 ${isBullish ? 'border-l-green-500' : isBearish ? 'border-l-red-500' : 'border-l-slate-600'} opacity-0 translate-y-4 transition-all duration-500`;
        
        domNode.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                    </div>
                    <div>
                        <p class="font-bold text-sm text-slate-200">@${tweet.user}</p>
                        <p class="text-[10px] text-slate-500">Just now</p>
                    </div>
                </div>
                <div class="flex items-center gap-1 px-2 py-1 rounded-md ${sentimentBg} border ${borderClass}">
                    ${iconHtml}
                    <span class="text-xs font-bold leading-none ${sentimentColor}">${tweet.sentiment_label}</span>
                </div>
            </div>
            <p class="text-slate-300 text-sm mt-3 leading-relaxed">
                ${tweet.text}
            </p>
        `;

        container.appendChild(domNode);
        
        // Staggered animation
        setTimeout(() => {
            domNode.classList.remove('opacity-0', 'translate-y-4');
        }, index * 50);
    });
}
