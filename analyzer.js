// Texting Style Analyzer Logic
let currentMessages = [];
let analysisHistory = JSON.parse(localStorage.getItem('textingHistory') || '[]');
let conversationHistory = [];

// Play notification sound for bot responses
function playNotificationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create a pleasant two-tone notification
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        console.log('Audio not supported');
    }
}

// Confetti Animation
function createConfetti() {
    const colors = ['#ff6b9d', '#c77dff', '#e0aaff', '#ffd60a', '#06ffa5', '#00b4d8'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Floating Emojis
function createFloatingEmojis() {
    const emojis = ['😂', '🤣', '😊', '😎', '🔥', '💬', '✨', '🎉', '💯', '👌'];
    const container = document.getElementById('floatingEmojis');
    
    for (let i = 0; i < 15; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.top = Math.random() * 100 + '%';
        emoji.style.animationDelay = Math.random() * 5 + 's';
        emoji.style.animationDuration = (10 + Math.random() * 10) + 's';
        container.appendChild(emoji);
    }
}

// Avatar Face Expressions
function setAvatarExpression(score) {
    const avatarFace = document.getElementById('avatarFace');
    
    // Remove all expression classes
    avatarFace.classList.remove('avatar-happy', 'avatar-neutral', 'avatar-sad', 'avatar-excited');
    
    if (score >= 80) {
        avatarFace.classList.add('avatar-excited');
    } else if (score >= 60) {
        avatarFace.classList.add('avatar-happy');
    } else if (score >= 30) {
        avatarFace.classList.add('avatar-neutral');
    } else {
        avatarFace.classList.add('avatar-sad');
    }
}

// Motivational Toast for Low Scores
let toastTimeout;

function showMotivationalToast(score) {
    if (score >= 40) return; // Only show for low scores
    
    const funnyMessages = [
        "You can do better! Add some spice! 🌶️",
        "That's drier than the Sahara! 🏜️ Try some emojis!",
        "Snooze fest! 😴 Wake up those texts!",
        "Even my grandma texts funnier! 👵 Step it up!",
        "Is this a eulogy? 💀 Bring some life!",
        "More boring than watching paint dry! 🎨 Add some LOLs!",
        "Your text needs CPR! 🚑 Revive it with some emojis!",
        "That's flatter than a pancake! 🥞 Add some flavor!",
        "Yawn! 🥱 Make it pop with some exclamation marks!",
        "This ain't it chief! 🤦 Try adding some personality!"
    ];
    
    const toast = document.getElementById('motivationalToast');
    const message = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    document.getElementById('toastMessage').textContent = message;
    
    // Clear any existing timeout
    if (toastTimeout) clearTimeout(toastTimeout);
    
    // Show toast
    toast.classList.add('show');
    
    // Auto-hide after 5 seconds
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

function closeToast() {
    const toast = document.getElementById('motivationalToast');
    toast.classList.remove('show');
    if (toastTimeout) clearTimeout(toastTimeout);
}

// Custom Confirmation Modal
let confirmCallback = null;

function showConfirmModal(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    confirmCallback = onConfirm;
    document.getElementById('confirmModal').style.display = 'flex';
}

function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    confirmCallback = null;
}

function confirmYes() {
    if (confirmCallback) {
        confirmCallback();
    }
    closeConfirmModal();
}

// Initialize Yes button
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('confirmYesBtn').onclick = confirmYes;
});

// Tab Navigation
function switchTab(tabName) {
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tabName + '-module').classList.add('active');
    
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const itemText = item.querySelector('.menu-text').textContent.toLowerCase();
        if (itemText.includes(tabName.replace('-', ' '))) {
            item.classList.add('active');
        }
    });
    
    // Close menu on mobile after selection
    if (window.innerWidth < 768) {
        toggleMenu();
    }
    
    if (tabName === 'challenge') {
        newChallenge();
    } else if (tabName === 'history') {
        loadHistory();
    } else if (tabName === 'chat') {
        initChat();
    }
}

// Initialize Chat Module
function initChat() {
    const chatMessages = document.getElementById('chatMessages');
    // Only add welcome message if chat is empty (besides typing indicator)
    if (chatMessages.children.length === 1) {
        chatMessages.innerHTML += `<div class="message bot" style="color: white !important;">Hey! 👋 I'm FunBot! Send me a message and I'll analyze your vibe! 🚀</div>`;
    }
}


function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    menu.classList.toggle('open');
}

function analyzeText() {
    const text = document.getElementById('textInput').value.trim();
    
    if (!text) {
        alert('Please enter some text to analyze!');
        return;
    }

    showConfirmModal(
        'Ready to Analyze? 🔍',
        'Analyze your texting style now?',
        () => {
            const analysis = performAnalysis(text);
            displayResults(analysis);
        }
    );
}

function clearAnalyzeText() {
    showConfirmModal(
        'Clear Text? 🗑️',
        'Are you sure you want to clear all text?',
        () => {
            document.getElementById('textInput').value = '';
            document.getElementById('results').classList.add('hidden');
        }
    );
}

function performAnalysis(text) {
    const metrics = {
        emojiCount: 0,
        laughterCount: 0,
        exclamationCount: 0,
        capsCount: 0,
        punctuationVariety: 0,
        averageWordLength: 0,
        shortResponseCount: 0,
        slangCount: 0,
        expressiveWords: 0,
        questionCount: 0,
        totalWords: 0,
        totalSentences: 0
    };

    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    metrics.emojiCount = (text.match(emojiRegex) || []).length;

    const laughterRegex = /\b(lol|lmao|haha|hehe|rofl|lmfao|😂|🤣|😆)/gi;
    metrics.laughterCount = (text.match(laughterRegex) || []).length;

    metrics.exclamationCount = (text.match(/!/g) || []).length;

    const capsRegex = /\b[A-Z]{2,}\b/g;
    metrics.capsCount = (text.match(capsRegex) || []).length;

    metrics.questionCount = (text.match(/\?/g) || []).length;

    const slangWords = ['gonna', 'wanna', 'gotta', 'kinda', 'sorta', 'omg', 'tbh', 'ngl', 'fr', 'bruh', 'yeet', 'lit', 'af', 'lowkey', 'highkey'];
    const slangRegex = new RegExp('\\b(' + slangWords.join('|') + ')\\b', 'gi');
    metrics.slangCount = (text.match(slangRegex) || []).length;

    const expressiveWords = ['amazing', 'awesome', 'terrible', 'hilarious', 'crazy', 'insane', 'literally', 'totally', 'absolutely', 'definitely'];
    const expressiveRegex = new RegExp('\\b(' + expressiveWords.join('|') + ')\\b', 'gi');
    metrics.expressiveWords = (text.match(expressiveRegex) || []).length;

    const words = text.match(/\b\w+\b/g) || [];
    metrics.totalWords = words.length;
    
    if (words.length > 0) {
        metrics.averageWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    }

    const lines = text.split('\n').filter(line => line.trim());
    metrics.shortResponseCount = lines.filter(line => line.trim().split(/\s+/).length <= 3).length;

    const uniquePunctuation = new Set(text.match(/[!?.,;:]/g) || []);
    metrics.punctuationVariety = uniquePunctuation.size;

    metrics.totalSentences = Math.max(1, (text.match(/[.!?]+/g) || []).length);

    const funnyScore = calculateFunnyScore(metrics, text);
    const dryScore = 100 - funnyScore;

    return {
        metrics,
        funnyScore,
        dryScore,
        text
    };
}

function calculateFunnyScore(metrics, text) {
    let score = 0;
    const wordCount = metrics.totalWords || 1;

    // Emoji contribution (up to 20 points)
    score += Math.min(20, metrics.emojiCount * 4);
    
    // Laughter words (up to 20 points)
    score += Math.min(20, metrics.laughterCount * 5);
    
    // Exclamation marks (up to 15 points)
    const exclamationRatio = metrics.exclamationCount / metrics.totalSentences;
    score += Math.min(15, exclamationRatio * 20);

    // CAPS usage (up to 10 points)
    score += Math.min(10, metrics.capsCount * 3);

    // Slang words (up to 15 points)
    const slangRatio = metrics.slangCount / wordCount;
    score += Math.min(15, slangRatio * 100);

    // Expressive words (up to 10 points)
    const expressiveRatio = metrics.expressiveWords / wordCount;
    score += Math.min(10, expressiveRatio * 80);

    // Punctuation variety (up to 5 points)
    score += Math.min(5, metrics.punctuationVariety * 1);

    // Questions (up to 5 points)
    const questionRatio = metrics.questionCount / metrics.totalSentences;
    score += Math.min(5, questionRatio * 10);

    // Penalties for very dry text
    if (metrics.averageWordLength < 4 && metrics.shortResponseCount > 2) {
        score -= 15;
    }

    if (wordCount < 10 && metrics.emojiCount === 0 && metrics.laughterCount === 0) {
        score -= 10;
    }

    console.log('Analysis Debug:', {
        metrics,
        wordCount,
        score,
        text: text.substring(0, 50)
    });

    return Math.max(0, Math.min(100, score));
}

function displayResults(analysis) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.classList.remove('hidden');
    
    resultsDiv.classList.add('pulse');
    setTimeout(() => resultsDiv.classList.remove('pulse'), 500);

    // Trigger confetti for high scores!
    if (analysis.funnyScore >= 70) {
        createConfetti();
    }
    
    // Update avatar expression based on score
    setAvatarExpression(analysis.funnyScore);
    
    // Show motivational toast for low scores
    showMotivationalToast(analysis.funnyScore);

    let category, emoji, description;
    if (analysis.funnyScore >= 70) {
        category = "🎉 Very Funny Texter!";
        emoji = "😂";
        description = "You're the life of the chat! Your texts are full of energy, emojis, and personality.";
    } else if (analysis.funnyScore >= 50) {
        category = "😊 Moderately Funny";
        emoji = "🙂";
        description = "You have a balanced texting style with some personality and humor mixed in.";
    } else if (analysis.funnyScore >= 30) {
        category = "📱 Casual Texter";
        emoji = "😐";
        description = "Your texting style is fairly neutral - not too dry, not too expressive.";
    } else if (analysis.funnyScore >= 15) {
        category = "📋 Pretty Dry";
        emoji = "😶";
        description = "Your texts tend to be straightforward and minimal. You get to the point quickly.";
    } else {
        category = "🏜️ Very Dry Texter";
        emoji = "💀";
        description = "Your texting style is extremely dry and minimal. You keep it short and simple.";
    }

    document.getElementById('resultTitle').textContent = category;

    // Animated score bars
    const scoreBar = document.getElementById('scoreBar');
    const funnyPercent = Math.round(analysis.funnyScore);
    const dryPercent = Math.round(analysis.dryScore);
    
    scoreBar.innerHTML = `
        <div class="score-label">😂 Funny Score: <strong>${funnyPercent}%</strong></div>
        <div class="score-bar-container">
            <div class="score-bar funny" style="width: 0%;" id="funnyBar"></div>
        </div>
        <div class="score-label" style="margin-top: 15px;">😐 Dry Score: <strong>${dryPercent}%</strong></div>
        <div class="score-bar-container">
            <div class="score-bar dry" style="width: 0%;" id="dryBar"></div>
        </div>
    `;

    // Animate bars after a brief delay
    setTimeout(() => {
        document.getElementById('funnyBar').style.width = `${analysis.funnyScore}%`;
        document.getElementById('dryBar').style.width = `${analysis.dryScore}%`;
    }, 100);

    document.getElementById('scoreText').textContent = description;

    const breakdown = document.getElementById('breakdown');
    breakdown.innerHTML = `
        <div class="metric">
            <div class="metric-label">Emojis</div>
            <div class="metric-value">${analysis.metrics.emojiCount}</div>
        </div>
        <div class="metric">
            <div class="metric-label">Laughter (lol, haha, etc.)</div>
            <div class="metric-value">${analysis.metrics.laughterCount}</div>
        </div>
        <div class="metric">
            <div class="metric-label">Exclamation Marks</div>
            <div class="metric-value">${analysis.metrics.exclamationCount}</div>
        </div>
        <div class="metric">
            <div class="metric-label">Slang Words</div>
            <div class="metric-value">${analysis.metrics.slangCount}</div>
        </div>
        <div class="metric">
            <div class="metric-label">CAPS Words</div>
            <div class="metric-value">${analysis.metrics.capsCount}</div>
        </div>
        <div class="metric">
            <div class="metric-label">Total Words</div>
            <div class="metric-value">${analysis.metrics.totalWords}</div>
        </div>
    `;

    const characteristics = generateCharacteristics(analysis);
    const charList = document.getElementById('characteristicsList');
    charList.innerHTML = characteristics.map(char => `<li>${char}</li>`).join('');

    const tips = generateTips(analysis);
    document.getElementById('tipsText').innerHTML = tips;

    const achievements = generateAchievements(analysis);
    const badgesList = document.getElementById('badgesList');
    badgesList.innerHTML = achievements.map((badge, index) => 
        `<div class="badge" style="animation-delay: ${index * 0.1}s">${badge}</div>`
    ).join('');

    const celebrity = getCelebrityMatch(analysis);
    document.getElementById('celebrityMatch').textContent = celebrity;
    
    saveToHistory(analysis);
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function generateCharacteristics(analysis) {
    const chars = [];
    const m = analysis.metrics;

    if (m.emojiCount > 3) chars.push("Heavy emoji user");
    else if (m.emojiCount > 0) chars.push("Occasional emoji user");
    else chars.push("No emoji usage");

    if (m.laughterCount > 2) chars.push("Expresses laughter frequently");
    else if (m.laughterCount > 0) chars.push("Some laughter expressions");

    if (m.exclamationCount > 3) chars.push("Very enthusiastic punctuation");
    else if (m.exclamationCount === 0) chars.push("Minimal punctuation");

    if (m.slangCount > 2) chars.push("Uses lots of slang and informal language");
    else if (m.slangCount === 0) chars.push("Formal language style");

    if (m.averageWordLength < 4) chars.push("Tends to use short, simple words");
    else if (m.averageWordLength > 6) chars.push("Uses longer, more complex words");

    if (m.capsCount > 1) chars.push("Uses CAPS for emphasis");

    if (m.questionCount > 2) chars.push("Asks lots of questions");

    return chars;
}

function generateTips(analysis) {
    const puns = [
        "Text-pectations are everything! 📱",
        "Don't be afraid to emoji-fy your messages! 😄",
        "LOL-ing is a lost art - bring it back! 🎨",
        "Exclamation points are punct-YOU-ation! ❗",
        "CAPS LOCK is cruise control for cool! 🚀",
        "Emojis speak louder than words! 🔊😂",
        "You've got mail... and personality! 💌",
        "Text me maybe? More like text me definitely! 📲",
        "Autocorrect can't fix a dry personality! 🏜️",
        "Keep calm and text on! ✌️",
        "Sending good vibes, one text at a time! ⚡",
        "Your texts are un-be-leaf-able! 🍃 (or they could be!)"
    ];
    
    const randomPun = puns[Math.floor(Math.random() * puns.length)];
    let tip = "";
    
    if (analysis.funnyScore >= 70) {
        tip = "You're already a fun texter! Just make sure to match the energy of who you're texting with. Not everyone appreciates the same level of enthusiasm in every situation.";
    } else if (analysis.funnyScore >= 50) {
        tip = "Your texting style is well-balanced! You could add more emojis or expressive language if you want to seem more enthusiastic, or keep it as is for a natural approach.";
    } else if (analysis.funnyScore >= 30) {
        tip = "To come across as funnier, try adding more emojis, using 'haha' or 'lol' when something's funny, and using exclamation marks to show enthusiasm. Don't be afraid to express emotion!";
    } else {
        tip = "Your texts might come across as disinterested or curt to some people. Consider adding emojis, punctuation variety, and expressive words to show you're engaged. Even a simple '😊' or 'haha' can make a big difference!";
    }
    
    return `<div style="margin-bottom: 15px; font-weight: 600; color: #667eea; font-size: 1.1em;">${randomPun}</div>${tip}`;
}

function generateAchievements(analysis) {
    const badges = [];
    const m = analysis.metrics;

    if (m.emojiCount >= 5) badges.push("🎨 Emoji Master");
    if (m.laughterCount >= 3) badges.push("😂 Comedy King/Queen");
    if (m.exclamationCount >= 5) badges.push("❗ Enthusiasm Expert");
    if (m.slangCount >= 3) badges.push("💬 Slang Specialist");
    if (m.capsCount >= 2) badges.push("📢 CAPS LOCK ENTHUSIAST");
    if (analysis.funnyScore >= 80) badges.push("🌟 Life of the Party");
    if (analysis.dryScore >= 80) badges.push("🎯 Straight to the Point");
    if (m.totalWords > 50) badges.push("📝 Storyteller");
    if (m.questionCount >= 3) badges.push("❓ Curious Mind");
    if (m.emojiCount === 0 && m.exclamationCount === 0) badges.push("🗿 Stone Cold Texter");
    if (m.expressiveWords >= 3) badges.push("💎 Expressive Soul");

    return badges.length > 0 ? badges : ["🏅 First Analysis Complete!"];
}

function getCelebrityMatch(analysis) {
    if (analysis.funnyScore >= 80) {
        const celebs = ["Ryan Reynolds", "Kevin Hart", "Ellen DeGeneres", "Dwayne 'The Rock' Johnson", "Chrissy Teigen"];
        return celebs[Math.floor(Math.random() * celebs.length)] + " - Always bringing the humor! 🌟";
    } else if (analysis.funnyScore >= 60) {
        const celebs = ["Jennifer Lawrence", "Chris Pratt", "Mindy Kaling", "John Mulaney", "Awkwafina"];
        return celebs[Math.floor(Math.random() * celebs.length)] + " - Fun but knows when to be serious 😊";
    } else if (analysis.funnyScore >= 40) {
        const celebs = ["Emma Watson", "Tom Hanks", "Natalie Portman", "Keanu Reeves", "Zendaya"];
        return celebs[Math.floor(Math.random() * celebs.length)] + " - Balanced and thoughtful 🎭";
    } else if (analysis.funnyScore >= 20) {
        const celebs = ["Elon Musk", "Mark Zuckerberg", "Bill Gates", "Tim Cook", "Sheryl Sandberg"];
        return celebs[Math.floor(Math.random() * celebs.length)] + " - Professional and to the point 💼";
    } else {
        const celebs = ["Clint Eastwood", "Samuel L. Jackson", "Tommy Lee Jones", "Kristen Stewart", "Aubrey Plaza"];
        return celebs[Math.floor(Math.random() * celebs.length)] + " - Minimal words, maximum impact 😎";
    }
}

function shareResults() {
    const resultTitle = document.getElementById('resultTitle').textContent;
    const scoreText = document.getElementById('scoreText').textContent;
    
    const shareText = `I just analyzed my texting style! 📱\n\n${resultTitle}\n${scoreText}\n\nTry it yourself!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Texting Style',
            text: shareText
        }).catch(() => {
            copyToClipboard(shareText);
            showCopyModal();
        });
    } else {
        copyToClipboard(shareText);
        showCopyModal();
    }
}

function copyResults() {
    const resultTitle = document.getElementById('resultTitle').textContent;
    const scoreText = document.getElementById('scoreText').textContent;
    const badges = Array.from(document.querySelectorAll('.badge')).map(b => b.textContent).join(', ');
    const celebrity = document.getElementById('celebrityMatch').textContent;
    
    const copyText = `My Texting Style Analysis 📱\n\n${resultTitle}\n${scoreText}\n\nAchievements: ${badges}\n\nYou text like: ${celebrity}`;
    
    copyToClipboard(copyText);
    showCopyModal();
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// Chat Simulator
function generateResponse(userMessage, analysis) {
    const msg = userMessage.toLowerCase();
    const currentScore = Math.round(analysis.funnyScore);
    const metrics = analysis.metrics;
    
    // Use actual analysis metrics
    const hasEmojis = metrics.emojiCount > 0;
    const hasLaughter = metrics.laughterCount > 0;
    const hasExclamation = metrics.exclamationCount > 0;
    const hasSlang = metrics.slangCount > 0;
    const hasCaps = metrics.capsCount > 0;
    const isShort = metrics.totalWords < 4;
    const hasQuestion = metrics.questionCount > 0;
    
    let responses = [];
    
    // Detailed analysis-based responses
    if (currentScore > 70) {
        responses = [
            `${hasEmojis ? '😄 ' + metrics.emojiCount + ' emojis! ' : ''}haha i love your energy! you're definitely on the fun side of texting with a ${currentScore}% funny score!`,
            `you're killing it with the vibes rn! ${hasLaughter ? 'all that laughter (' + metrics.laughterCount + ' times!) tells me you know how to have a good time 😂' : 'super fun energy!'}`,
            `okay i see you!! texting style is ${currentScore}% funny ${hasExclamation ? 'and you used ' + metrics.exclamationCount + ' exclamation marks? amazing!' : ''}`,
            `ngl your texts are giving main character energy 🌟 ${hasCaps ? 'that CAPS usage though! 🔥' : ''} keep it up!`,
            `loving this! ${hasSlang ? 'the slang, ' : ''}${hasEmojis ? 'the emojis, ' : ''} everything is on point! you've got that perfect balance of fun and authentic`
        ];
    } else if (currentScore < 40) {
        responses = [
            `hmm you're being pretty dry rn 😅 only ${currentScore}% funny score... ${hasEmojis ? '' : 'try adding some emojis! '}${hasExclamation ? '' : 'maybe some exclamation marks?'}`,
            `i mean... ${metrics.averageWordLength > 5 ? 'using fancy words, ' : ''}${isShort ? 'super short messages, ' : ''} it's giving corporate email vibes lol. loosen up a bit!`,
            `your funny score is ${currentScore}% 😬 ${metrics.emojiCount === 0 ? 'no emojis, ' : ''}${metrics.laughterCount === 0 ? 'no lols or hahas, ' : ''} texts are kinda flat ngl`,
            `not gonna lie, ${currentScore}% funny score means chatting with you feels like reading an instruction manual 📋 spice it up!`,
            `your texting style is giving 😐 energy (${currentScore}% funny). ${hasQuestion ? 'at least you ask questions!' : 'throw in some excitement!'}`
        ];
    } else {
        responses = [
            `you're right in the middle at ${currentScore}%! ${hasEmojis ? 'the ' + metrics.emojiCount + ' emojis help a lot' : 'maybe try some emojis?'} 😊`,
            `pretty balanced texting style! ${hasQuestion ? 'i like that you ask questions (' + metrics.questionCount + '!)' : 'could use more questions tho'} currently at ${currentScore}%`,
            `you're doing decent at ${currentScore}%! ${hasLaughter ? 'the laughter (' + metrics.laughterCount + ' times) is nice' : 'maybe add a lol or haha?'} to keep it light`,
            `solid middle ground! ${hasExclamation ? 'those ' + metrics.exclamationCount + ' exclamation marks add energy' : 'try some exclamation marks for more energy!'} (${currentScore}% funny)`,
            `not too dry, not too extra - ${currentScore}% is chillin in the sweet spot 👌 ${hasSlang ? 'love the slang btw' : ''}`
        ];
    }
    
    // Topic-based responses with analysis
    if (msg.includes('how are you') || msg.includes('sup') || msg.includes('what\'s up')) {
        return `i'm good! just analyzing your vibe 😎 you're at ${currentScore}% ${currentScore > 60 ? 'and bringing good energy!' : 'you could bring more energy tho!'}`;
    }
    if (msg.includes('boring') || msg.includes('dry')) {
        return `oof calling yourself out? 😅 well your score is ${currentScore}% so... ${currentScore > 50 ? 'you\'re actually not that dry!' : 'yeah maybe you are a bit lol'} ${metrics.emojiCount === 0 ? 'try using emojis!' : ''}`;
    }
    if (msg.includes('funny') || msg.includes('fun')) {
        return `${currentScore > 65 ? 'yeah you ARE pretty funny! your ' + currentScore + '% score proves it 😂' : 'hmm idk if i\'d call it funny... your score is only ' + currentScore + '%'} ${hasLaughter ? 'you did laugh ' + metrics.laughterCount + ' times tho!' : ''}`;
    }
    if (msg.includes('bye') || msg.includes('later') || msg.includes('gtg')) {
        return `aw bye! final score: ${currentScore}% ${currentScore > 60 ? 'this was fun, you\'re a great texter! ✨' : 'work on that texting style tho! 📱'}`;
    }
    if (msg.includes('score') || msg.includes('rate')) {
        return `your current funny score is ${currentScore}%! ${metrics.emojiCount} emojis, ${metrics.laughterCount} lols/hahas, ${metrics.exclamationCount} exclamation marks ${currentScore > 60 ? '- looking good! 🔥' : '- room for improvement! 💪'}`;
    }
    if (hasQuestion) {
        const questionResponses = [
            `that's actually a good question! ${hasEmojis ? 'love the emoji usage btw (' + metrics.emojiCount + ')' : 'btw you should use more emojis 😊'}`,
            `hmm let me think... ${currentScore > 60 ? 'but first, can we talk about your ' + currentScore + '% funny score?? 🔥' : 'also at ' + currentScore + '% your texts could use more personality ngl'}`,
            `interesting question! ${hasLaughter ? 'also love that you keep things light with all that laughter!' : 'try keeping things lighter with some lols or hahas'}`,
            `ooh good one! ${hasExclamation ? 'and i love the enthusiasm (' + metrics.exclamationCount + ' exclamation marks!)' : 'you could show more enthusiasm tho!!'}`
        ];
        return questionResponses[Math.floor(Math.random() * questionResponses.length)];
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML += `<div class="message user" style="color: white !important;">${message}</div>`;
    currentMessages.push(message);
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Show and update score
    document.getElementById('liveScoreContainer').style.display = 'block';
    const fullText = currentMessages.join(' ');
    const analysis = performAnalysis(fullText);
    const score = Math.round(analysis.funnyScore);
    document.getElementById('liveScore').textContent = `Funny Score: ${score}%`;
    
    // Update avatar expression in chat
    setAvatarExpression(score);
    
    // Show motivational toast for low scores in chat
    showMotivationalToast(score);
    
    // Show typing indicator
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.classList.add('active');
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Hide typing indicator
    typingIndicator.classList.remove('active');
    
    const botResponse = generateResponse(message, analysis);
    
    chatMessages.innerHTML += `<div class="message bot" style="color: white !important;">${botResponse}</div>`;
    playNotificationSound();
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// Text Enhancer
function enhanceText() {
    const text = document.getElementById('enhancerInput').value.trim();
    if (!text) {
        alert('Please enter some text to enhance!');
        return;
    }
    
    showConfirmModal(
        'Enhance Text? ✨',
        'Ready to make your text more fun?',
        () => {
            const enhanced = [
                {
                    title: "🎉 Super Enthusiastic",
                    text: addEnthusiasm(text)
                },
                {
                    title: "😊 Friendly & Warm",
                    text: addFriendliness(text)
                },
                {
                    title: "😂 Funny & Playful",
                    text: addHumor(text)
                }
            ];
            
            const resultsDiv = document.getElementById('enhancerResults');
            resultsDiv.classList.remove('hidden');
            
            const enhancedTexts = document.getElementById('enhancedTexts');
            enhancedTexts.innerHTML = enhanced.map(opt => `
                <div class="enhanced-option">
                    <h4>${opt.title}</h4>
                    <p>${opt.text}</p>
                    <button class="copy-enhanced" onclick="copyEnhanced('${opt.text.replace(/'/g, "\\'")}')">Copy This</button>
                </div>
            `).join('');
        }
    );
}

function addEnthusiasm(text) {
    // Rewrite with enthusiastic variations
    const transformations = {
        'ok': 'Sounds amazing',
        'okay': 'Perfect',
        'yes': 'Absolutely',
        'yeah': 'For sure',
        'no': 'Nah',
        'maybe': 'Possibly',
        'good': 'fantastic',
        'nice': 'incredible',
        'fine': 'wonderful',
        'thanks': 'Thank you so much',
        'bye': 'Talk soon'
    };
    
    let enhanced = text;
    Object.keys(transformations).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        enhanced = enhanced.replace(regex, transformations[key]);
    });
    
    // Replace periods with exclamation marks
    enhanced = enhanced.replace(/\./g, '!');
    
    // Add energetic opening if missing
    if (!enhanced.match(/^(hey|hi|hello|omg)/i)) {
        const openings = ['OMG', 'Yesss', 'Wow'];
        enhanced = openings[Math.floor(Math.random() * openings.length)] + '! ' + enhanced;
    }
    
    // Add closing emoji
    const emojis = ['🎉', '✨', '🔥', '💯', '🌟', '⚡'];
    enhanced += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
    
    return enhanced;
}

function addFriendliness(text) {
    // Rewrite with friendly, conversational variations
    const transformations = {
        'ok': 'sounds good to me',
        'okay': 'sure thing',
        'yes': 'definitely',
        'yeah': 'for sure',
        'no': 'not really',
        'maybe': 'I\'m thinking about it',
        'thanks': 'thanks a bunch',
        'good': 'great',
        'bye': 'talk to you later'
    };
    
    let enhanced = text;
    Object.keys(transformations).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        enhanced = enhanced.replace(regex, transformations[key]);
    });
    
    // Add friendly greeting if missing
    if (!enhanced.match(/^(hey|hi|hello)/i)) {
        const greetings = ['Hey there!', 'Hi!', 'Hey friend!'];
        enhanced = greetings[Math.floor(Math.random() * greetings.length)] + ' ' + enhanced;
    }
    
    // Add casual filler words
    if (!enhanced.includes('just')) {
        enhanced = enhanced.replace(/I /i, 'I just ');
    }
    
    // Add friendly emoji
    const emojis = ['😊', '🙂', '😄', '💙'];
    enhanced += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
    
    return enhanced;
}

function addHumor(text) {
    // Rewrite with playful, humorous variations
    const transformations = {
        'ok': 'lol okay',
        'okay': 'alright alright',
        'yes': 'heck yeah',
        'yeah': 'yup yup',
        'no': 'nope nope nope',
        'maybe': 'hmm idk maybe',
        'good': 'pretty dope',
        'nice': 'sick',
        'thanks': 'thanks fam',
        'bye': 'catch ya later'
    };
    
    let enhanced = text;
    Object.keys(transformations).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        enhanced = enhanced.replace(regex, transformations[key]);
    });
    
    // Add laughter expressions
    const laughs = [' lol', ' haha', ' lmao'];
    enhanced += laughs[Math.floor(Math.random() * laughs.length)];
    
    // Add playful additions
    const additions = [' that\'s wild', ' no cap', ' fr fr', ' honestly'];
    if (Math.random() > 0.5) {
        enhanced += additions[Math.floor(Math.random() * additions.length)];
    }
    
    // Add funny emoji
    const emojis = ['😂', '🤣', '💀', '😭'];
    enhanced += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
    
    return enhanced;
}

function copyEnhanced(text) {
    copyToClipboard(text);
    showCopyModal();
}

function showCopyModal() {
    document.getElementById('copyModal').style.display = 'flex';
}

function closeCopyModal() {
    document.getElementById('copyModal').style.display = 'none';
}

// Compare Function
function compareTexts() {
    const textA = document.getElementById('compareA').value.trim();
    const textB = document.getElementById('compareB').value.trim();
    
    if (!textA || !textB) {
        alert('Please enter text for both people!');
        return;
    }
    
    showConfirmModal(
        'Compare Texting Styles? ⚖️',
        'Ready to see who texts funnier?',
        () => {
            const analysisA = performAnalysis(textA);
            const analysisB = performAnalysis(textB);
            
            const resultsDiv = document.getElementById('compareResults');
            resultsDiv.classList.remove('hidden');
            
            const winnerA = analysisA.funnyScore > analysisB.funnyScore;
            const winnerB = analysisB.funnyScore > analysisA.funnyScore;
            
            resultsDiv.innerHTML = `
                <div class="compare-result-card">
                    <h3>Person A ${winnerA ? '🏆' : ''}</h3>
                    <p><strong>Funny Score:</strong> ${Math.round(analysisA.funnyScore)}%</p>
                    <p><strong>Emojis:</strong> ${analysisA.metrics.emojiCount}</p>
                    <p><strong>Laughter:</strong> ${analysisA.metrics.laughterCount}</p>
                    <p><strong>Slang:</strong> ${analysisA.metrics.slangCount}</p>
                    ${winnerA ? '<div class="winner-badge">Funnier! 🎉</div>' : ''}
                </div>
                <div class="compare-result-card">
                    <h3>Person B ${winnerB ? '🏆' : ''}</h3>
                    <p><strong>Funny Score:</strong> ${Math.round(analysisB.funnyScore)}%</p>
                    <p><strong>Emojis:</strong> ${analysisB.metrics.emojiCount}</p>
                    <p><strong>Laughter:</strong> ${analysisB.metrics.laughterCount}</p>
                    <p><strong>Slang:</strong> ${analysisB.metrics.slangCount}</p>
                    ${winnerB ? '<div class="winner-badge">Funnier! 🎉</div>' : ''}
                </div>
            `;
            
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
        }
    );
}

// Challenge System
const challenges = [
    {
        title: "The Flaky Friend",
        description: "Your friend canceled plans last minute again",
        scenario: "Your friend texts: 'Hey sorry can't make it tonight, something came up'",
        goal: "dry"
    },
    {
        title: "Exciting News!",
        description: "Your friend just got their dream job",
        scenario: "Your friend texts: 'OMG I GOT THE JOB!!! 🎉'",
        goal: "funny"
    },
    {
        title: "The Awkward Question",
        description: "Someone asks if you like their haircut (you don't)",
        scenario: "They text: 'What do you think of my new haircut? 💇'",
        goal: "balanced"
    },
    {
        title: "Weekend Plans",
        description: "Make exciting weekend plans with a friend",
        scenario: "Your friend asks: 'Want to do something this weekend?'",
        goal: "funny"
    },
    {
        title: "Professional Response",
        description: "Your boss asks about a project deadline",
        scenario: "Boss: 'Can you have the report done by Friday?'",
        goal: "dry"
    }
];

let currentChallenge = null;

function newChallenge() {
    currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    document.getElementById('challengeTitle').textContent = currentChallenge.title;
    document.getElementById('challengeDescription').textContent = currentChallenge.description;
    document.getElementById('challengeScenario').textContent = currentChallenge.scenario;
    document.getElementById('challengeResponse').value = '';
    document.getElementById('challengeResult').classList.add('hidden');
}

function submitChallenge() {
    const response = document.getElementById('challengeResponse').value.trim();
    if (!response) {
        alert('Please type a response!');
        return;
    }
    
    showConfirmModal(
        'Submit Challenge? 🎯',
        'Ready to see how you did?',
        () => {
            const analysis = performAnalysis(response);
            const resultDiv = document.getElementById('challengeResult');
            resultDiv.classList.remove('hidden');
            
            let feedback = '';
            let passed = false;
            
            if (currentChallenge.goal === 'funny' && analysis.funnyScore >= 60) {
                feedback = '🎉 Perfect! You nailed the fun, enthusiastic vibe!';
                passed = true;
                createConfetti(); // Celebrate success!
            } else if (currentChallenge.goal === 'dry' && analysis.funnyScore <= 30) {
                feedback = '✅ Great! Professional and to the point!';
                passed = true;
                createConfetti(); // Celebrate success!
            } else if (currentChallenge.goal === 'balanced' && analysis.funnyScore >= 40 && analysis.funnyScore <= 60) {
                feedback = '👍 Nice balance! Friendly but not over the top!';
                passed = true;
                createConfetti(); // Celebrate success!
            } else {
                feedback = `Try again! Aim for a ${currentChallenge.goal} response. Your score: ${Math.round(analysis.funnyScore)}%`;
            }
            
            resultDiv.innerHTML = `
                <h4>${passed ? '🏆 Challenge Complete!' : '🎯 Keep Trying!'}</h4>
                <p>${feedback}</p>
                <p><strong>Your Funny Score:</strong> ${Math.round(analysis.funnyScore)}%</p>
            `;
        }
    );
}

// Example Analysis
function analyzeExample(button) {
    const text = button.parentElement.querySelector('p').textContent;
    document.getElementById('textInput').value = text;
    switchTab('analyze');
    setTimeout(() => analyzeText(), 100);
}

// History Functions
function saveToHistory(analysis) {
    const historyItem = {
        date: new Date().toISOString(),
        funnyScore: Math.round(analysis.funnyScore),
        dryScore: Math.round(analysis.dryScore),
        textPreview: analysis.text.substring(0, 50) + '...'
    };
    
    analysisHistory.unshift(historyItem);
    if (analysisHistory.length > 20) analysisHistory.pop();
    
    localStorage.setItem('textingHistory', JSON.stringify(analysisHistory));
}

function loadHistory() {
    const historyList = document.getElementById('historyList');
    
    if (analysisHistory.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #999;">No analyses yet. Start analyzing to build your history!</p>';
        document.getElementById('totalAnalyses').textContent = '0';
        document.getElementById('avgScore').textContent = '0%';
        document.getElementById('highestScore').textContent = '0%';
        return;
    }
    
    const total = analysisHistory.length;
    const avg = Math.round(analysisHistory.reduce((sum, item) => sum + item.funnyScore, 0) / total);
    const highest = Math.max(...analysisHistory.map(item => item.funnyScore));
    
    document.getElementById('totalAnalyses').textContent = total;
    document.getElementById('avgScore').textContent = avg + '%';
    document.getElementById('highestScore').textContent = highest + '%';
    
    historyList.innerHTML = analysisHistory.map(item => {
        return `
            <div class="history-item">
                <div class="history-item-header">
                    <span>Funny: ${item.funnyScore}% | Dry: ${item.dryScore}%</span>
                </div>
                <p>${item.textPreview}</p>
            </div>
        `;
    }).join('');
}

function clearHistory() {
    document.getElementById('clearHistoryModal').style.display = 'flex';
}

function confirmClearHistory() {
    analysisHistory = [];
    localStorage.removeItem('textingHistory');
    loadHistory();
    closeClearHistoryModal();
}

function closeClearHistoryModal() {
    document.getElementById('clearHistoryModal').style.display = 'none';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize floating emojis
    createFloatingEmojis();
    
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});
