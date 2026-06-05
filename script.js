// --- Data & State ---
let players = JSON.parse(localStorage.getItem('partyPlayers')) || [];
let gamesPlayed = parseInt(localStorage.getItem('partyGamesCount')) || 0;
let customDeck = JSON.parse(localStorage.getItem('partyCustomDeck')) || { truths: [], dares: [], headsup: [] };

const emojis = ['🐶','🐱','🐼','🦊','🦁','🐷','🐸','🐵','🦄','👽','👾','👻','🤠','🤡','🤖'];
const penalties = ["ดื่ม 1 แก้ว 🍺", "เต้นเพลง TikTok 15 วิ 💃", "โพสต์รูปน่าเกลียดลง Story 📸", "จ่ายเข้ากองกลาง 20 บาท 💸", "ให้เพื่อนทางขวาดีดมะกอก 1 ที 🤕", "ทำหน้าตลกให้เพื่อนถ่ายรูป 🤪", "ซิทอัพ 10 ครั้ง 💪", "พูดภาษาต่างดาว 1 นาที 👽", "ห้ามพูด 5 นาที 🤐", "กินของที่เพื่อนผสมให้ 🤢"];

// --- Web Audio API (Sound Effects) ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function initAudio() { if(!audioCtx) { audioCtx = new AudioContext(); } if(audioCtx.state === 'suspended') { audioCtx.resume(); } }
function playSound(type) {
    if(!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    
    if(type === 'correct') { // ปิ๊งป่อง
        osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gainNode.gain.setValueAtTime(0.5, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'wrong') { // ตื๊ดด
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
        gainNode.gain.setValueAtTime(0.5, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'boom') { // ตู้ม/งับ!
        osc.type = 'square'; osc.frequency.setValueAtTime(100, now); osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
        gainNode.gain.setValueAtTime(1, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now); osc.stop(now + 0.5);
    } else if (type === 'tick') { // ติ๊ก
        osc.type = 'triangle'; osc.frequency.setValueAtTime(1000, now);
        gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now); osc.stop(now + 0.05);
    }
}
document.addEventListener('click', initAudio, { once: true }); // เปิดเสียงเมื่อแตะจอครั้งแรก

// --- Game Data ---
const gameData = {
    tod: {
        truths: ["เคยแอบชอบคนในวงนี้ไหม?", "เรื่องที่น่าอายที่สุด?", "ความลับที่ยังไม่เคยบอกพ่อแม่?", "ถ้าให้สลับร่างกับคนในวงนี้ 1 วัน จะสลับกับใคร?"],
        dares: ["เต้นท่าที่คิดว่าเซ็กซี่ที่สุด 10 วิ", "ให้คนทางขวาใช้ลิปสติกวาดหน้า", "โทรหาเพื่อนที่ไม่ได้คุยนานแล้วบอกว่า 'คิดถึง'", "ซิทอัพ 10 ครั้งพร้อมตะโกนว่า 'ฉันแข็งแกร่ง!'"]
    },
    neverHaveIEver: ["ฉันไม่เคย โดนเท", "ฉันไม่เคย แอบหลับในห้องเรียน", "ฉันไม่เคย ลืมวันเกิดแฟน", "ฉันไม่เคย ตกหลุมรักคนในเน็ต", "ฉันไม่เคย โกหกเรื่องอายุ"],
    mostLikely: ["ใครมีโอกาสรวยเป็นเศรษฐีที่สุด?", "ใครมีโอกาสถูกหลอกโอนเงินมากที่สุด?", "ใครมีโอกาสเมาแล้วเรื้อนที่สุด?", "ใครมีโอกาสกินจุที่สุดแต่น้ำหนักไม่ขึ้น?"],
    wheelOptions: ["คนซ้ายมือ โดน! 👈", "คนขวามือ โดน! 👉", "คนตรงข้าม รับจบ! 🫵", "ประกบข้าง! 🥪", "ทำตัวเองแท้ๆ 🎯", "ทุกคนในวงโดน! 🌪️", "จ่ายเข้ากองกลาง 10 บาท! 💸", "รอดตัว! แถมสั่งเพื่อนได้ 1 คน 🎉", "ซวยจัด! โดนทำโทษ x2 😱"],
    categories: ["ชื่อผลไม้", "จังหวัดในไทย", "ยี่ห้อรถยนต์", "เมนูอาหารไทย", "ชื่อหนังฮีโร่", "ชื่อเพลงฮิต"],
    fiveSec: ["บอกชื่อเพื่อน 3 คน", "บอกเมนูไข่ 3 เมนู", "บอกชื่อแอป 3 แอป", "บอกคำหยาบ 3 คำ (เซ็นเซอร์ด้วย!)", "บอกสิ่งที่ต้องทำตอนเช้า 3 อย่าง"],
    guessWho: ["คนที่ตอบแชทนานที่สุด", "คนที่ชอบกินของแปลกๆ", "คนที่มักจะมาสายเสมอ", "คนที่ติ่งเกาหลี/อนิเมะหนักสุด", "คนที่รักสัตว์มากกว่าคน"],
    quiz: [
        {q: "อะไรเอ่ย สูงกว่าภูเขา แต่น้ำหนักเบาหวิว?", choices: ["ก้อนเมฆ", "เครื่องบิน", "อากาศ", "นก"], ans: 0},
        {q: "แมวอะไรอยู่ใต้ดิน?", choices: ["แมวขุด", "แมงมุม", "แมวเหมียว", "มันแกว"], ans: 3}
    ],
    secretMissions: ["ทำให้คนอื่นหัวเราะให้ได้ 1 คน", "เนียนจับมือคนข้างๆ 5 วินาที", "พูดคำว่า 'จริงๆ แล้ว' ทุกครั้งที่เริ่มประโยค 3 ครั้ง", "แกล้งทำของตกแล้วให้เพื่อนเก็บให้"],
    roasts: ["คนนี้คือคนที่บอกว่า 'ใกล้ถึงแล้ว' แต่ยังไม่ได้แต่งตัว", "หน้าตาเหมือนคนนอนเต็มอิ่ม แต่จริงๆ นอนเช้า", "คนนี้พิมพ์แชทเก่งมาก แต่ตัวจริงเงียบกริบ"],
    taboo: [
        { word: "หมูกระทะ", forbidden: ["ปิ้งย่าง", "หมูสามชั้น", "น้ำจิ้ม"] }, { word: "เราเตอร์ (Router)", forbidden: ["อินเทอร์เน็ต", "สัญญาณ", "ไฟกะพริบ"] },
        { word: "หุ้น", forbidden: ["ลงทุน", "ดอย", "ซื้อขาย"] }, { word: "เชียงใหม่", forbidden: ["ดอย", "ภาคเหนือ", "อากาศหนาว"] }
    ],
    spyLocations: ["โรงพยาบาล", "ค่ายทหาร", "ลานกางเต็นท์เขาใหญ่", "ยอดดอยเชียงใหม่", "สนามโอลด์แทรฟฟอร์ด", "ห้องเซิร์ฟเวอร์", "ร้านหมูกระทะ", "งานเทศกาลดนตรี"],
    headsup: {
        animals: { name: "🐶 สัตว์โลก", words: ["สิงโต", "ช้าง", "ยีราฟ", "แพนด้า", "ฉลาม", "นกฮูก", "สลอธ", "แมวน้ำ", "เพนกวิน", "จิงโจ้", "ฮิปโป", "ไดโนเสาร์"] },
        food: { name: "🍔 ของกิน", words: ["หมูกระทะ", "ชาบู", "ส้มตำ", "ข้าวมันไก่", "ผัดกะเพรา", "ชานมไข่มุก", "บิงซู", "พิซซ่า", "ซูชิ", "ต้มยำกุ้ง"] },
        jobs: { name: "👨‍⚕️ อาชีพ", words: ["หมอ", "พยาบาล", "ตำรวจ", "ทหาร", "โปรแกรมเมอร์", "ยูทูบเบอร์", "ดารา", "นักร้อง", "แม่ค้าออนไลน์", "วิศวกร"] }
    }
};

const gameList = [
    { id: 'headsup', name: 'ทายคำบนหัว', icon: '📱', color: 'pink' },
    { id: 'croc', name: 'จระเข้งับนิ้ว', icon: '🐊', color: 'purple' },
    { id: 'spy', name: 'สปายจับผิด', icon: '🕵️‍♂️', color: 'blue' },
    { id: 'taboo', name: 'ใบ้คำห้ามพูด', icon: '🤫', color: 'pink' },
    { id: 'tapbattle', name: 'ศึกจิ้มไว', icon: '⚡', color: 'purple' },
    { id: 'wheel', name: 'Spin the Wheel', icon: '🎡', color: 'blue' },
    { id: 'hotpotato', name: 'Hot Potato', icon: '💣', color: 'pink' },
    { id: 'tod', name: 'Truth or Dare', icon: '🎭', color: 'purple' },
    { id: 'nhie', name: 'Never Have I Ever', icon: '🙅‍♂️', color: 'blue' },
    { id: 'mostlikely', name: 'Most Likely To', icon: '👉', color: 'pink' },
    { id: 'fivesec', name: '5 Sec Challenge', icon: '⏱️', color: 'purple' },
    { id: 'guesswho', name: 'Guess Who', icon: '🤔', color: 'blue' },
    { id: 'quiz', name: 'Quiz Battle', icon: '🧠', color: 'pink' },
    { id: 'secret', name: 'Secret Mission', icon: '💌', color: 'purple' },
    { id: 'roast', name: 'AI Roast Friend', icon: '🔥', color: 'blue' }
];

// --- Core Functions ---
function saveState() {
    localStorage.setItem('partyPlayers', JSON.stringify(players));
    localStorage.setItem('partyGamesCount', gamesPlayed.toString());
    renderPlayers();
}

function init() {
    renderPlayers();
    renderGameGrid();
}

// --- Player Management ---
function addPlayer() {
    initAudio(); // Initialize audio context on first interact
    const input = document.getElementById('new-player-name');
    const name = input.value.trim();
    if (name && players.length < 15) { 
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        players.push({ id: Date.now(), name: `${randomEmoji} ${name}` });
        input.value = '';
        saveState();
    } else if (players.length >= 15) { alert('ผู้เล่นเต็มแล้ว! (สูงสุด 15 คน)'); }
}

function removePlayer(id) { if(confirm('ต้องการลบผู้เล่นคนนี้?')) { players = players.filter(p => p.id !== id); saveState(); } }

function renderPlayers() {
    const list = document.getElementById('player-list');
    list.innerHTML = '';
    players.forEach((p) => {
        const item = document.createElement('div');
        item.className = 'player-item';
        item.innerHTML = `<div style="font-weight: 600;">${p.name}</div><div class="score-controls"><button class="score-btn" style="color: #ef4444;" onclick="removePlayer(${p.id})">×</button></div>`;
        list.appendChild(item);
    });
    if(players.length === 0) list.innerHTML = '<p class="text-muted" style="text-align:center; padding: 20px 0;">ยังไม่มีผู้เล่น เพิ่มชื่อด้านบนเลย!</p>';
}

// --- Navigation & Game Rendering ---
function renderGameGrid() {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = '';
    gameList.forEach(game => {
        const card = document.createElement('div');
        card.className = `game-card`; card.style.borderColor = `var(--neon-${game.color})`;
        card.innerHTML = `<div class="game-icon">${game.icon}</div><div style="font-weight: 600; font-size: 0.95rem;">${game.name}</div>`;
        card.onclick = () => openGame(game.id);
        grid.appendChild(card);
    });
}

function randomGameSelect() { const randomGame = gameList[Math.floor(Math.random() * gameList.length)]; openGame(randomGame.id); }

function openGame(gameId) {
    initAudio();
    if(players.length < 2 && !['wheel', 'croc', 'tapbattle'].includes(gameId)) { alert("เกมส่วนใหญ่ต้องใช้ผู้เล่นอย่างน้อย 2 คน กรุณาเพิ่มผู้เล่นก่อนครับ"); return; }
    if(gameId === 'tapbattle' && players.length < 2) { alert("ศึกจิ้มไว ต้องใช้ผู้เล่นอย่างน้อย 2 คน"); return; }
    
    gamesPlayed++; localStorage.setItem('partyGamesCount', gamesPlayed.toString());
    const game = gameList.find(g => g.id === gameId);
    document.getElementById('game-title').innerText = `${game.icon} ${game.name}`;
    
    const content = document.getElementById('game-content');
    content.innerHTML = ''; 
    content.classList.remove('animate-entrance'); void content.offsetWidth; content.classList.add('animate-entrance');

    switch(gameId) {
        case 'headsup': initHeadsUp(content); break;
        case 'croc': initCroc(content); break;
        case 'spy': initSpy(content); break;
        case 'taboo': initTaboo(content); break;
        case 'tapbattle': initTapBattle(content); break;
        case 'tod': initToD(content); break;
        case 'nhie': initNHIE(content); break;
        case 'mostlikely': initMostLikely(content); break;
        case 'wheel': initWheel(content); break;
        case 'hotpotato': initHotPotato(content); break;
        case 'fivesec': initFiveSec(content); break;
        case 'guesswho': initGuessWho(content); break;
        case 'quiz': initQuiz(content); break;
        case 'secret': initSecret(content); break;
        case 'roast': initRoast(content); break;
    }
    document.getElementById('home-view').classList.add('hidden'); document.getElementById('game-view').classList.remove('hidden');
}

function closeGame() {
    clearInterval(gameInterval); clearTimeout(gameTimeout);
    window.removeEventListener('deviceorientation', handleHeadsUpTilt);
    document.getElementById('game-view').classList.add('hidden'); document.getElementById('home-view').classList.remove('hidden');
}

// Helpers
function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getRandomPlayer() { return getRandom(players).name; }
let gameInterval, gameTimeout;

// --- Modals (Penalty & Custom) ---
function showPenaltyModal() { initAudio(); document.getElementById('penalty-modal').classList.remove('hidden'); document.getElementById('penalty-result').innerText = '...'; }
function closeModals() { document.getElementById('penalty-modal').classList.add('hidden'); document.getElementById('custom-modal').classList.add('hidden'); }
window.rollPenalty = () => { playSound('tick'); const el = document.getElementById('penalty-result'); el.innerText = 'กำลังสุ่ม...'; setTimeout(() => { playSound('boom'); el.innerText = getRandom(penalties); }, 1000); };
function showCustomModal() { document.getElementById('custom-modal').classList.remove('hidden'); }
window.saveCustomData = () => {
    const cat = document.getElementById('custom-category').value;
    const val = document.getElementById('custom-input').value.trim();
    if(val) {
        if(cat === 'tod-truth') customDeck.truths.push(val);
        else if(cat === 'tod-dare') customDeck.dares.push(val);
        else if(cat === 'headsup') customDeck.headsup.push(val);
        localStorage.setItem('partyCustomDeck', JSON.stringify(customDeck));
        alert('บันทึกคำถามของวงคุณเรียบร้อยแล้ว!'); document.getElementById('custom-input').value = '';
    }
};

// -----------------------------------------------------------------
// --- เกมที่ 1: ทายคำบนหัว (อัปเกรดเซ็นเซอร์ เอฟเฟกต์แสง สี เสียง) ---
// -----------------------------------------------------------------
let huScore = 0; let huWordsList = []; let huCurrentIndex = 0; let isHuPlaying = false; let huReadyForNextTilt = true;

function initHeadsUp(container) {
    huScore = 0; isHuPlaying = false; window.removeEventListener('deviceorientation', handleHeadsUpTilt);
    let catHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📱</span> <strong>วิธีเล่น:</strong> แนบมือถือที่หน้าผาก หันจอให้เพื่อนใบ้<br><br>✅ <strong>หงายจอขึ้น (ชี้ฟ้า)</strong> = ทายถูก!<br>❌ <strong>คว่ำจอลง (ชี้พื้น)</strong> = ข้ามคำ!</div><h3 class="mb-3 text-gradient">เลือกหมวดหมู่</h3><div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:350px;">`;
    catHTML += `<button class="btn-neon-pink action-btn" onclick="startHeadsUpSensorCheck('custom')">✨ หมวดของวงเรา (Custom)</button>`;
    for (let key in gameData.headsup) { catHTML += `<button class="btn-neon-blue action-btn" onclick="startHeadsUpSensorCheck('${key}')">${gameData.headsup[key].name}</button>`; }
    catHTML += `</div>`; container.innerHTML = catHTML;
}

window.startHeadsUpSensorCheck = (categoryKey) => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(permissionState => { startHeadsUpGameLoop(categoryKey); }).catch(console.error);
    } else { startHeadsUpGameLoop(categoryKey); }
};

window.startHeadsUpGameLoop = (categoryKey) => {
    let rawWords = categoryKey === 'custom' ? (customDeck.headsup.length > 0 ? customDeck.headsup : ["ยังไม่มีคำ! ไปเพิ่มที่หน้าแรก"]) : gameData.headsup[categoryKey].words;
    huWordsList = [...rawWords].sort(() => 0.5 - Math.random());
    huCurrentIndex = 0; huScore = 0; let timeLeft = 60;
    
    const container = document.getElementById('game-content');
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; width: 100%; padding: 0 20px;"><div class="text-muted" style="font-size: 1.2rem;">⏱️ <span id="hu-timer">60</span></div><div class="text-muted" style="font-size: 1.2rem;">✅ <span id="hu-score">0</span> คำ</div></div>
        <div class="display-text glass-card p-4" id="hu-word" style="font-size: 4rem; color: var(--neon-pink); width: 100%; word-break: break-word; min-height: 250px; text-shadow: 0 0 20px rgba(236,72,153,0.5);">แนบหน้าผากเลย!</div>
        <div style="display: flex; gap: 10px; width: 100%; max-width: 400px; margin-top: 20px;" id="hu-controls">
            <button class="btn-danger action-btn" onclick="markHeadsUpPass()">คว่ำจอ ข้าม ⏭️</button><button class="btn-neon-purple action-btn" onclick="markHeadsUpCorrect()">หงายจอ ถูก ✅</button>
        </div>
        <button class="btn-neon-blue action-btn mt-4" style="max-width: 250px; display: none;" id="hu-restart-btn" onclick="initHeadsUp(document.getElementById('game-content'))">🔄 เล่นหมวดอื่นต่อ</button>
    `;

    const wordDisplay = document.getElementById('hu-word'); const timerDisplay = document.getElementById('hu-timer'); const controls = document.getElementById('hu-controls');
    controls.style.opacity = '0.5'; controls.style.pointerEvents = 'none';

    wordDisplay.innerText = "3"; playSound('tick'); setTimeout(() => { wordDisplay.innerText = "2"; playSound('tick'); }, 1000); setTimeout(() => { wordDisplay.innerText = "1"; playSound('tick'); }, 2000);
    setTimeout(() => {
        playSound('correct'); controls.style.opacity = '1'; controls.style.pointerEvents = 'auto'; wordDisplay.innerText = huWordsList[huCurrentIndex]; isHuPlaying = true;
        window.addEventListener('deviceorientation', handleHeadsUpTilt);
        clearInterval(gameInterval);
        gameInterval = setInterval(() => { timeLeft--; timerDisplay.innerText = timeLeft; if (timeLeft <= 0) { endHeadsUpGame(); } }, 1000);
    }, 3000);
};

function handleHeadsUpTilt(event) {
    if (!isHuPlaying) return;
    let b = event.beta; 
    if (huReadyForNextTilt) {
        if (b > -20 && b < 45) { huReadyForNextTilt = false; markHeadsUpCorrect(); } 
        else if (b > 135 && b <= 180) { huReadyForNextTilt = false; markHeadsUpPass(); }
    } else {
        if (b > 60 && b < 120) { huReadyForNextTilt = true; }
    }
}

function flashScreen(type) {
    const overlay = document.getElementById('flash-overlay');
    overlay.style.backgroundColor = type === 'green' ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)';
    setTimeout(() => { overlay.style.backgroundColor = 'transparent'; }, 400);
}

window.markHeadsUpCorrect = () => { if (!isHuPlaying) return; playSound('correct'); flashScreen('green'); huScore++; document.getElementById('hu-score').innerText = huScore; loadNextHeadsUpWord(); };
window.markHeadsUpPass = () => { if (!isHuPlaying) return; playSound('wrong'); flashScreen('red'); loadNextHeadsUpWord(); };
function loadNextHeadsUpWord() { huCurrentIndex++; if (huCurrentIndex >= huWordsList.length) { endHeadsUpGame(true); } else { document.getElementById('hu-word').innerText = huWordsList[huCurrentIndex]; } }

function endHeadsUpGame(outOfWords = false) {
    clearInterval(gameInterval); isHuPlaying = false; window.removeEventListener('deviceorientation', handleHeadsUpTilt); playSound('boom');
    document.getElementById('hu-controls').style.display = 'none'; document.getElementById('hu-restart-btn').style.display = 'flex';
    document.getElementById('hu-word').innerHTML = `<span style="font-size: 1.5rem; color: var(--text-main);">${outOfWords ? 'เก่งเกิ๊น คำหมดสต็อก!' : 'หมดเวลา!'} ทายถูก</span><br><span style="font-size: 5rem;">${huScore}</span> คำ 🎉`;
}

// -----------------------------------------------------------------
// --- เกมที่ 2: จระเข้งับนิ้ว (Crocodile Dentist) ---
// -----------------------------------------------------------------
function initCroc(container) {
    container.innerHTML = `
        <div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">🐊</span> <strong>วิธีเล่น:</strong> ผลัดกันกดฟันจระเข้ทีละซี่ ส่งวนไปเรื่อยๆ ใครกดโดนซี่กับดัก จระเข้จะงับ (สีแดง) และโดนทำโทษ!</div>
        <div class="croc-grid" id="croc-grid"></div>
        <button class="btn-neon-blue mt-4 action-btn" onclick="initCroc(document.getElementById('game-content'))" style="max-width:200px;">🔄 เริ่มเกมใหม่</button>
    `;
    const grid = document.getElementById('croc-grid');
    const trapIndex = Math.floor(Math.random() * 10);
    for(let i=0; i<10; i++) {
        let btn = document.createElement('button'); btn.className = 'croc-tooth';
        btn.onclick = () => {
            if(i === trapIndex) { playSound('boom'); flashScreen('red'); grid.innerHTML = `<div style="grid-column: span 5; color: red; font-size: 2rem; font-weight: bold; text-align: center; padding: 40px 0;">งับ!! 🐊💥<br><span style="font-size: 1rem; color: white;">โดนทำโทษ!</span></div>`; } 
            else { playSound('tick'); btn.classList.add('pressed'); }
        };
        grid.appendChild(btn);
    }
}

// -----------------------------------------------------------------
// --- เกมที่ 3: สปายจับผิด (Spyfall) ---
// -----------------------------------------------------------------
let spyLocation = ""; let spyPlayerIndex = 0; let spyCurrentView = 0;
function initSpy(container) {
    spyLocation = getRandom(gameData.spyLocations);
    spyPlayerIndex = Math.floor(Math.random() * players.length);
    spyCurrentView = 0;
    container.innerHTML = `
        <div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">🕵️‍♂️</span> <strong>วิธีเล่น:</strong> ส่งมือถือให้ทุกคนดูบทบาททีละคน จะมี 1 คนเป็น Spy (ไม่รู้สถานที่) ให้ผลัดกันถามคำถาม 1 ประโยค เพื่อจับผิดว่าใครคือ Spy!</div>
        <div id="spy-stage" class="glass-card p-4" style="width:100%; min-height: 200px; display:flex; flex-direction:column; justify-content:center;"></div>
    `;
    renderSpyStage();
}
function renderSpyStage() {
    const stage = document.getElementById('spy-stage');
    if(spyCurrentView >= players.length) {
        playSound('boom');
        stage.innerHTML = `<h2 class="text-gradient mb-4">เริ่มจับผิดได้!</h2><p class="text-muted">ผลัดกันถามคำถาม แล้วโหวตว่าใครคือ Spy</p><button class="btn-danger action-btn mt-4" onclick="document.getElementById('spy-stage').innerHTML='<h1 style=color:red>Spy คือ: ${players[spyPlayerIndex].name} 🕵️‍♂️</h1>'">เฉลยตัว Spy</button>`;
        return;
    }
    stage.innerHTML = `
        <h3 class="mb-4">ส่งมือถือให้: <span style="color:var(--neon-pink)">${players[spyCurrentView].name}</span></h3>
        <button class="btn-neon-purple action-btn" onclick="showSpyRole()">👀 กดเพื่อดูบทบาท</button>
    `;
}
window.showSpyRole = () => {
    playSound('tick');
    const roleText = (spyCurrentView === spyPlayerIndex) ? "<span style='color:red; font-size: 2.5rem;'>คุณคือ SPY 🕵️‍♂️</span>" : `สถานที่คือ:<br><span style='color:var(--neon-blue); font-size: 2rem;'>${spyLocation}</span>`;
    document.getElementById('spy-stage').innerHTML = `<div class="mb-4">${roleText}</div><button class="btn-neon-blue action-btn" onclick="spyCurrentView++; renderSpyStage();">ซ่อน และส่งต่อ ⏭️</button>`;
};

// -----------------------------------------------------------------
// --- เกมที่ 4: ใบ้คำห้ามพูดคำนี้ (Taboo) ---
// -----------------------------------------------------------------
function initTaboo(container) {
    container.innerHTML = `
        <div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">🤫</span> <strong>วิธีเล่น:</strong> พยายามใบ้คำหลักให้เพื่อนทายถูก โดย "ห้ามพูดคำต้องห้าม" ที่อยู่ด้านล่างเด็ดขาด ถ้าเผลอพูดโดนปรับแพ้!</div>
        <div id="taboo-content" style="width:100%;"></div>
        <button class="btn-neon-blue mt-4 action-btn" onclick="startTaboo()" style="max-width: 200px;">🎲 สุ่มคำศัพท์</button>
    `;
    window.startTaboo = () => {
        playSound('tick'); const tData = getRandom(gameData.taboo);
        let forbidHTML = tData.forbidden.map(w => `<div style="background: rgba(239,68,68,0.2); padding: 5px 10px; border-radius: 8px; color: #ef4444; border: 1px solid #ef4444;">❌ ${w}</div>`).join('');
        document.getElementById('taboo-content').innerHTML = `
            <div class="glass-card p-4 text-center mb-4">
                <div class="text-muted mb-2">คำที่ต้องใบ้:</div>
                <div style="font-size: 3rem; color: var(--neon-blue); font-weight: bold; text-shadow: 0 0 15px rgba(59,130,246,0.5);">${tData.word}</div>
            </div>
            <div class="text-muted mb-2 text-center">ห้ามพูดคำเหล่านี้เด็ดขาด:</div>
            <div style="display:flex; justify-content:center; gap: 10px; flex-wrap: wrap;" class="mb-4">${forbidHTML}</div>
            <div style="display:flex; gap: 10px;"><button class="btn-danger action-btn" onclick="playSound('wrong'); flashScreen('red');">🚨 กดออด (พูดคำห้าม)</button><button class="btn-neon-purple action-btn" onclick="playSound('correct'); flashScreen('green'); startTaboo();">✅ ทายถูก</button></div>
        `;
    };
}

// -----------------------------------------------------------------
// --- เกมที่ 5: ศึกจิ้มไว (Tap Battle) ---
// -----------------------------------------------------------------
let tapRed = 50; let tapBlue = 50; let isTapPlaying = false;
function initTapBattle(container) {
    container.innerHTML = `
        <div class="game-rules-box mb-2"><span style="font-size: 1.2rem;">⚡</span> <strong>วิธีเล่น:</strong> วางมือถือตรงกลาง คนนึงสีแดง คนนึงสีน้ำเงิน แข่งกันรัวนิ้วจิ้มฝั่งตัวเองให้ไวที่สุดใน 10 วินาที!</div>
        <div id="tb-timer" class="timer-text mb-2" style="font-size: 2rem;">10</div>
        <div class="tap-container" id="tap-container">
            <div class="tap-area tap-red" id="area-red" onpointerdown="doTap('red')">RED</div>
            <div class="tap-area tap-blue" id="area-blue" onpointerdown="doTap('blue')">BLUE</div>
        </div>
        <button class="btn-neon-pink mt-4 action-btn" id="tb-start" onclick="startTapBattle()" style="max-width: 200px;">▶ เริ่มรัวนิ้ว</button>
    `;
}
window.startTapBattle = () => {
    document.getElementById('tb-start').style.display = 'none';
    tapRed = 50; tapBlue = 50; isTapPlaying = true; let timeLeft = 10;
    updateTapUI(); playSound('tick');
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        timeLeft--; document.getElementById('tb-timer').innerText = timeLeft;
        if(timeLeft <= 0) {
            clearInterval(gameInterval); isTapPlaying = false; playSound('boom');
            let winner = tapRed > tapBlue ? "❤️ สีแดงชนะ!" : (tapBlue > tapRed ? "💙 สีน้ำเงินชนะ!" : "เสมอ!");
            document.getElementById('tb-timer').innerHTML = `<span style="font-size:1.5rem; color:white;">${winner}</span>`;
            document.getElementById('tb-start').style.display = 'flex'; document.getElementById('tb-start').innerText = 'เล่นใหม่';
        }
    }, 1000);
};
window.doTap = (color) => {
    if(!isTapPlaying) return;
    if(color === 'red' && tapRed < 95) { tapRed += 2; tapBlue -= 2; }
    else if(color === 'blue' && tapBlue < 95) { tapBlue += 2; tapRed -= 2; }
    updateTapUI();
};
function updateTapUI() { document.getElementById('area-red').style.flexBasis = `${tapRed}%`; document.getElementById('area-blue').style.flexBasis = `${tapBlue}%`; }

// -----------------------------------------------------------------
// --- เกมเดิมอื่นๆ ---
// -----------------------------------------------------------------
function initToD(container) {
    container.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> <strong>วิธีเล่น:</strong> สุ่มผู้โชคร้าย เลือกว่าจะตอบความจริง หรือทำภารกิจ</div><div id="tod-target" style="font-size: 1.5rem; color: var(--neon-blue); margin-bottom: 20px; font-weight: bold;"></div><div style="display: flex; gap: 10px; width: 100%; max-width: 300px; margin-bottom: 20px;"><button class="btn-neon-purple action-btn" onclick="rollToD('truths')">Truth 😇</button><button class="btn-neon-pink action-btn" onclick="rollToD('dares')">Dare 😈</button></div><div class="display-text glass-card p-4" id="tod-display" style="width: 100%;">...</div>`;
    window.rollToD = (type) => { playSound('tick'); let pool = gameData.tod[type]; if(type==='truths' && customDeck.truths.length>0) pool = pool.concat(customDeck.truths); if(type==='dares' && customDeck.dares.length>0) pool = pool.concat(customDeck.dares); document.getElementById('tod-target').innerText = `ผู้ถูกเลือก: ${getRandomPlayer()}`; document.getElementById('tod-display').innerText = getRandom(pool); };
}
function initNHIE(container) { container.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> <strong>วิธีเล่น:</strong> อ่านประโยค ใคร "เคยทำ" ต้องโดนทำโทษ!</div><div class="display-text glass-card p-4" id="nhie-display" style="color: var(--neon-blue); width: 100%;">กดปุ่มเพื่อเริ่มสุ่ม</div><button class="btn-neon-blue action-btn mt-4" onclick="playSound('tick'); document.getElementById('nhie-display').innerText = getRandom(gameData.neverHaveIEver)" style="max-width: 250px;">🎲 สุ่มคำถาม</button>`; }
function initMostLikely(container) { container.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> <strong>วิธีเล่น:</strong> นับ 1-2-3 แล้วชี้คนที่ตรงกับคำถามที่สุด!</div><div class="display-text glass-card p-4" id="ml-display" style="color: var(--neon-pink); width: 100%;">...</div><button class="btn-neon-pink action-btn mt-4" onclick="playSound('tick'); document.getElementById('ml-display').innerText = getRandom(gameData.mostLikely)" style="max-width: 250px;">👉 สุ่มคำถาม</button>`; document.getElementById('ml-display').innerText = getRandom(gameData.mostLikely); }
function initWheel(container) {
    container.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> <strong>วิธีเล่น:</strong> หมุนวงล้อวัดดวง ใครซวยโดนทำโทษ!</div><div class="wheel-container" id="wheel-circle">เตรียมหมุน!</div><button class="btn-neon-purple mt-4 action-btn" onclick="spinWheel()" style="max-width: 200px;">🎡 หมุนวงล้อ</button>`;
    window.spinWheel = () => { playSound('tick'); const wheel = document.getElementById('wheel-circle'); const result = getRandom(gameData.wheelOptions); wheel.style.transform = `rotate(${Math.floor(Math.random() * 360) + 1440}deg)`; wheel.style.animation = 'none'; wheel.innerText = "กำลังหมุน..."; setTimeout(() => { playSound('correct'); wheel.innerText = result; wheel.style.transform = `rotate(0deg)`; wheel.style.animation = 'ring-pulse 2s infinite'; }, 3500); };
}
function initHotPotato(container) {
    container.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> <strong>วิธีเล่น:</strong> ตอบคำถามตามหมวดแล้วส่งมือถือวนไป ระเบิดตู้มที่ใครแพ้!</div><h3 class="mb-4 text-gradient" id="hp-category">หมวดหมู่: ...</h3><div class="display-text timer-text" id="hp-status">💣</div><button class="btn-danger action-btn mt-4" onclick="startPotato()" id="hp-btn" style="max-width: 200px;">▶ เริ่มเกม</button>`;
    window.startPotato = () => { playSound('tick'); const status = document.getElementById('hp-status'); const btn = document.getElementById('hp-btn'); document.getElementById('hp-category').innerText = `หมวดหมู่: ${getRandom(gameData.categories)}`; status.innerText = "ติ๊ก... ติ๊ก..."; status.style.color = "var(--text-main)"; btn.disabled = true; btn.innerText = "กำลังเล่น..."; const time = Math.floor(Math.random() * 15000) + 5000; clearTimeout(gameTimeout); gameTimeout = setTimeout(() => { playSound('boom'); flashScreen('red'); status.innerText = "💥 BOOM! 💥"; status.style.color = "red"; btn.disabled = false; btn.innerText = "เล่นใหม่"; document.getElementById('hp-category').innerText = `คนถือมือถือโดนทำโทษ!`; }, time); };
}
function initFiveSec(container) {
    container.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> <strong>วิธีเล่น:</strong> ตอบคำถาม 3 ข้อใน 5 วินาที!</div><div class="timer-text mb-4" id="fs-timer">5</div><div class="display-text glass-card p-4" id="fs-display" style="font-size:1.2rem; min-height: 60px; width:100%;">...</div><button class="btn-neon-pink mb-4 mt-4 action-btn" onclick="startFiveSec()" id="fs-btn" style="max-width: 200px;">▶ สุ่มโจทย์ & จับเวลา</button>`;
    window.startFiveSec = () => { playSound('correct'); const timerEl = document.getElementById('fs-timer'); const btn = document.getElementById('fs-btn'); document.getElementById('fs-display').innerText = `โจทย์: ${getRandom(gameData.fiveSec)}`; let timeLeft = 5; timerEl.innerText = timeLeft; btn.disabled = true; clearInterval(gameInterval); gameInterval = setInterval(() => { timeLeft--; timerEl.innerText = timeLeft; playSound('tick'); if(timeLeft <= 0) { clearInterval(gameInterval); playSound('wrong'); timerEl.innerText = "หมดเวลา!"; btn.disabled = false; btn.innerText = "เล่นใหม่"; } }, 1000); };
}
function initGuessWho(container) { container.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> <strong>วิธีเล่น:</strong> ทุกคนโหวตว่าคำใบ้หมายถึงใคร!</div><div class="display-text glass-card p-4" id="gw-display" style="color: var(--neon-purple); width: 100%;">...</div><button class="btn-neon-purple action-btn mt-4" onclick="playSound('tick'); document.getElementById('gw-display').innerText = getRandom(gameData.guessWho)" style="max-width: 250px;">🕵️ สุ่มคำใบ้</button>`; document.getElementById('gw-display').innerText = getRandom(gameData.guessWho); }
function initQuiz(container) {
    container.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> <strong>วิธีเล่น:</strong> ช่วยกันตอบ ถ้าผิดโดนยกวง!</div><div id="quiz-q" class="display-text" style="font-size: 1.2rem;">...</div><div id="quiz-choices" style="width: 100%; max-width: 350px;"></div><button class="btn-neon-blue mt-4 action-btn" onclick="loadQuiz()" style="max-width: 200px;">🔄 สุ่มข้อใหม่</button>`;
    window.loadQuiz = () => { playSound('tick'); const qData = getRandom(gameData.quiz); document.getElementById('quiz-q').innerText = qData.q; const choicesDiv = document.getElementById('quiz-choices'); choicesDiv.innerHTML = ''; qData.choices.forEach((c, index) => { const btn = document.createElement('button'); btn.className = 'choice-btn'; btn.innerText = c; btn.onclick = () => { if(index === qData.ans) { playSound('correct'); flashScreen('green'); btn.style.background = 'rgba(34, 197, 94, 0.4)'; btn.innerText += " ✅ รอดตัว!"; } else { playSound('wrong'); flashScreen('red'); btn.style.background = 'rgba(239, 68, 68, 0.4)'; btn.innerText += " ❌ โดนทำโทษ!"; } Array.from(choicesDiv.children).forEach(b => b.disabled = true); }; choicesDiv.appendChild(btn); }); }; loadQuiz();
}
function initSecret(container) {
    container.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> <strong>วิธีเล่น:</strong> กดดูภารกิจลับแล้วซ่อนไว้ ใครทำไม่สำเร็จโดนปรับ!</div><div class="display-text hidden glass-card p-4" id="sm-display" style="border: 2px dashed var(--neon-pink); border-radius: 12px; width:100%;"></div><button class="btn-neon-pink action-btn mt-4" onclick="toggleSecret()" id="sm-btn" style="max-width: 200px;">👀 เปิดดูภารกิจ</button>`;
    window.toggleSecret = () => { playSound('tick'); const display = document.getElementById('sm-display'); const btn = document.getElementById('sm-btn'); if(display.classList.contains('hidden')) { display.innerText = getRandom(gameData.secretMissions); display.classList.remove('hidden'); btn.innerText = "🙈 ซ่อนภารกิจ"; } else { display.classList.add('hidden'); btn.innerText = "👀 สุ่มใหม่"; } };
}
function initRoast(container) {
    container.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> <strong>วิธีเล่น:</strong> ระบบแซวแบบเจ็บๆ คันๆ สร้างเสียงฮา!</div><div id="roast-target" class="timer-text" style="font-size: 2.5rem; color: var(--neon-blue); margin-bottom: 20px;">...</div><div class="display-text glass-card p-4" id="roast-display" style="font-size: 1.2rem; color: var(--text-main); width: 100%;">...</div><button class="btn-neon-purple mt-4 action-btn" onclick="generateRoast()" style="max-width: 250px;">🔥 สุ่มแซวเพื่อน</button>`;
    window.generateRoast = () => { playSound('boom'); document.getElementById('roast-target').innerText = getRandomPlayer(); document.getElementById('roast-display').innerText = `"${getRandom(gameData.roasts)}"`; }; generateRoast();
}

// --- End Party & Summary ---
function endParty() {
    if(players.length === 0) { alert('ยังไม่มีข้อมูลผู้เล่นครับ'); return; }
    document.getElementById('home-view').classList.add('hidden'); document.getElementById('summary-view').classList.remove('hidden');
    let summaryHTML = `<p style="text-align: center; margin-bottom: 20px;">เล่นไปทั้งหมด: <strong style="color: var(--neon-blue);">${gamesPlayed}</strong> เกม</p><h3 style="color: var(--neon-purple); margin-bottom: 20px;">🎉 ผู้รอดชีวิตในวง 🎉</h3>`;
    players.forEach((p, i) => { summaryHTML += `<div style="text-align: center; font-size: 1.2rem; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">${i+1}. ${p.name}</div>`; });
    document.getElementById('summary-content').innerHTML = summaryHTML;
}
function copySummary() { let text = `🎉 สรุปผลปาร์ตี้ "วงนี้มีเกม" 🎉\nเล่นไปทั้งหมด ${gamesPlayed} เกม\n\nผู้ร่วมชะตากรรม:\n`; players.forEach((p, i) => { text += `${i+1}. ${p.name}\n`; }); navigator.clipboard.writeText(text).then(() => { alert('คัดลอกผลสรุปแล้ว! นำไปแปะในแชทกลุ่มได้เลย'); }); }
function resetAll() { if(confirm('แน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด? (เริ่มใหม่)')) { players = []; gamesPlayed = 0; saveState(); document.getElementById('summary-view').classList.add('hidden'); document.getElementById('home-view').classList.remove('hidden'); } }

init();
