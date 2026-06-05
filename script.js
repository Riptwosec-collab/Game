// --- Data & State ---
let players = JSON.parse(localStorage.getItem('partyPlayers')) || [];
let gamesPlayed = parseInt(localStorage.getItem('partyGamesCount')) || 0;
let customDeck = JSON.parse(localStorage.getItem('partyCustomDeck')) || { truths: [], dares: [], headsup: [] };

const emojis = ['🐶','🐱','🐼','🦊','🦁','🐷','🐸','🐵','🦄','👽','👾','👻','🤠','🤡','🤖'];

// เพิ่มบทลงโทษใหม่เป็น 60+ แบบ
const penalties = [
    "ดื่ม 1 แก้ว 🍺", "เต้นเพลง TikTok 15 วิ 💃", "โพสต์รูปน่าเกลียดลง Story 📸", "จ่ายเข้ากองกลาง 20 บาท 💸", 
    "ให้เพื่อนทางขวาดีดมะกอก 1 ที 🤕", "ทำหน้าตลกให้เพื่อนถ่ายรูป 🤪", "ซิทอัพ 10 ครั้ง 💪", "พูดภาษาต่างดาว 1 นาที 👽", 
    "ห้ามพูด 5 นาที 🤐", "กินของที่เพื่อนผสมให้ 🤢", "วิดพื้น 10 ครั้ง", "โทรหาคนคุยเก่า", "ให้เพื่อนวาดรูปบนหน้า", 
    "ทำท่าเหมือนลิง", "ตะโกนบอกรักคนแรกที่เดินผ่าน", "ดื่มน้ำเปล่ารวดเดียวหมดแก้ว",
    "สารภาพความลับ 1 เรื่อง", "ให้เพื่อนทางซ้ายตบแป้งใส่หน้า", "กระโดดตบ 20 ครั้ง", "ทำท่าสุนัขฉี่",
    "ร้องเพลงชาติด้วยเสียงเป็ด", "เต้นเพลงไก่ย่างถูกเผา", "ให้เพื่อนเลือกสเตตัส Facebook ให้ 1 วัน", "ทักแชทไปบอกรักแฟนเก่า",
    "ดื่มน้ำผสมมะนาว (หรือของเปรี้ยว)", "เล่าเรื่องที่น่าอายที่สุดในชีวิต", "เดินถอยหลัง 1 นาที", "ถูกริบมือถือ 10 นาที",
    "ให้เพื่อนเขียนชื่อบนหน้าผากด้วยปากกา", "กินกระเทียมสด 1 กลีบ", "ทำท่าซอมบี้ 1 นาที", "ให้เพื่อนแคปหน้าจอแชทล่าสุดลงโซเชียล",
    "จ่ายค่าขนม/เครื่องดื่มให้คนทางขวา", "เต้นบัลเล่ต์รอบวง 1 รอบ", "ทำสมาธิ 2 นาทีห้ามขยับ", "พูด 'ขอโทษครับ/ค่ะ' หลังจบทุกประโยค 5 นาที",
    "ร้องไห้แบบไม่มีน้ำตาให้เนียนที่สุด", "ทำท่าเหมือนคนปวดท้องเข้าห้องน้ำ", "ทำท่าเซ็กซี่อ่อยคนทางซ้าย", "โทรหาแม่แล้วบอกว่า 'หนู/ผมท้อง' (หรือทำผู้หญิงท้อง)",
    "กินพริก 1 เม็ด", "อมน้ำเปล่าไว้ในปากห้ามกลืนจนกว่าจะวนถึงตาตัวเอง", "ให้คนทางขวาแต่งหน้าให้", "พูดเร็วๆ รัวๆ 1 นาที",
    "ทำท่าโยคะท่ายาก 30 วินาที", "เล่าเรื่องผี 1 เรื่อง", "พูดชื่อตัวเองแทนคำว่า 'ฉัน/ผม' ตลอด 10 นาที", "ส่งรูปเซลฟี่น่าเกลียดไปในกลุ่มครอบครัว",
    "เป็นทาสรับใช้คนทางซ้าย 10 นาที", "บอกข้อเสียของตัวเอง 3 ข้อ", "บอกข้อดีของเพื่อนทุกคนในวง", "กระโดดขาเดียว 1 นาที",
    "เต้นลีลาศกับเสาหรือเก้าอี้", "ทำเสียงแมวร้องทุกครั้งที่เพื่อนเรียกชื่อ", "ให้เพื่อนค้นกระเป๋าตังค์ได้ 1 นาที", "บอกชื่อคนที่เคยแอบชอบ",
    "ห้ามเล่นมือถือจนกว่าจะจบงาน", "ให้เพื่อน 1 คนตีก้น 1 ที", "ทำท่าเหมือนแมงมุมคลาน", "จ่ายเข้ากองกลาง 50 บาท"
];

// --- Web Audio API & Ambience ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let ambientInterval = null;

function initAudio() { if(!audioCtx) { audioCtx = new AudioContext(); } if(audioCtx.state === 'suspended') { audioCtx.resume(); } }
function playSound(type) {
    if(!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode); gainNode.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    
    if(type === 'correct') { 
        osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gainNode.gain.setValueAtTime(0.5, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'wrong') { 
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
        gainNode.gain.setValueAtTime(0.5, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'boom') { 
        osc.type = 'square'; osc.frequency.setValueAtTime(100, now); osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
        gainNode.gain.setValueAtTime(1, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now); osc.stop(now + 0.5);
    } else if (type === 'tick') { 
        osc.type = 'triangle'; osc.frequency.setValueAtTime(1000, now);
        gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now); osc.stop(now + 0.05);
    }
}
document.addEventListener('click', initAudio, { once: true });

function changeAmbience() {
    initAudio();
    clearInterval(ambientInterval);
    const type = document.getElementById('ambience-select').value;
    if(type === 'heartbeat') {
        ambientInterval = setInterval(() => { playSound('boom'); }, 1200);
    } else if (type === 'crickets') {
        ambientInterval = setInterval(() => {
            if(Math.random() > 0.5 && audioCtx) {
                const osc = audioCtx.createOscillator(); osc.type = 'square';
                osc.frequency.value = 3000 + Math.random()*2000;
                const gain = audioCtx.createGain(); gain.gain.value = 0.02;
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
                osc.connect(gain); gain.connect(audioCtx.destination);
                osc.start(); osc.stop(audioCtx.currentTime + 0.1);
            }
        }, 150);
    }
}

// --- Features & Gimmicks ---
function showToast(msg, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) { container = document.createElement('div'); container.id = 'toast-container'; document.body.appendChild(container); }
    const t = document.createElement('div'); t.className = 'toast';
    t.style.borderColor = type === 'error' ? '#ef4444' : 'var(--neon-blue)';
    t.innerText = msg; container.appendChild(t); setTimeout(() => t.remove(), 3000);
}

let isCampfire = false;
function toggleCampfire() {
    isCampfire = !isCampfire;
    const btn = document.getElementById('btn-campfire');
    if(isCampfire) {
        document.body.classList.add('campfire-mode');
        btn.innerText = "🔥 ปิดโหมดแคมป์";
        btn.style.background = "#d97706";
        showToast("เปิดโหมดประหยัดแบตเตอรี่แล้ว");
    } else {
        document.body.classList.remove('campfire-mode');
        btn.innerText = "🏕️ โหมดแคมป์";
        btn.style.background = "#222";
        showToast("กลับสู่โหมดปกติ");
    }
}

function shareApp() {
    if (navigator.share) {
        navigator.share({ title: 'วงนี้มีเกม 🎮', text: 'มาเล่นเกมปาร์ตี้สนุกๆ ด้วยกันเถอะ!', url: window.location.href })
        .catch(console.error);
    } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('✅ คัดลอกลิงก์เรียบร้อย ส่งให้เพื่อนได้เลย!');
    }
}

function splitTeams() {
    if(players.length < 2) { showToast("ต้องมีผู้เล่นอย่างน้อย 2 คน", "error"); return; }
    let shuffled = [...players].sort(() => 0.5 - Math.random());
    let half = Math.ceil(shuffled.length / 2);
    let teamA = shuffled.slice(0, half).map(p => p.name).join('<br>');
    let teamB = shuffled.slice(half).map(p => p.name).join('<br>');
    
    document.getElementById('team-result').innerHTML = `
        <div style="margin-bottom:15px; background: rgba(239,68,68,0.2); border: 1px solid #ef4444; padding: 10px; border-radius: 8px;">
            <strong style="color:#ef4444; font-size:1.2rem;">🔴 ทีมแดง (Team A)</strong><br><span style="color:white;">${teamA}</span>
        </div>
        <div style="background: rgba(59,130,246,0.2); border: 1px solid #3b82f6; padding: 10px; border-radius: 8px;">
            <strong style="color:#3b82f6; font-size:1.2rem;">🔵 ทีมน้ำเงิน (Team B)</strong><br><span style="color:white;">${teamB}</span>
        </div>
    `;
    document.getElementById('team-modal').classList.remove('hidden');
}

function showPenaltyModal() { initAudio(); document.getElementById('penalty-modal').classList.remove('hidden'); document.getElementById('penalty-result').innerText = 'กดสุ่มเลย!'; }
function showCustomModal() { document.getElementById('custom-modal').classList.remove('hidden'); }
function closeModals() { document.getElementById('penalty-modal').classList.add('hidden'); document.getElementById('custom-modal').classList.add('hidden'); document.getElementById('team-modal').classList.add('hidden'); }
window.rollPenalty = () => { playSound('tick'); const el = document.getElementById('penalty-result'); el.innerText = 'กำลังสุ่ม...'; setTimeout(() => { playSound('boom'); el.innerText = getRandom(penalties); }, 800); };
window.saveCustomData = () => {
    const cat = document.getElementById('custom-category').value;
    const val = document.getElementById('custom-input').value.trim();
    if(val) {
        if(cat === 'tod-truth') customDeck.truths.push(val);
        else if(cat === 'tod-dare') customDeck.dares.push(val);
        else if(cat === 'headsup') customDeck.headsup.push(val);
        localStorage.setItem('partyCustomDeck', JSON.stringify(customDeck));
        showToast('✅ บันทึกคำถามของวงคุณเรียบร้อยแล้ว!'); document.getElementById('custom-input').value = '';
    } else { showToast('กรุณาพิมพ์ข้อความก่อนบันทึก', 'error'); }
};
function flashScreen(type) {
    const overlay = document.getElementById('flash-overlay');
    if(!overlay) return;
    overlay.style.backgroundColor = type === 'green' ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)';
    setTimeout(() => { overlay.style.backgroundColor = 'transparent'; }, 400);
}

// --- Player Management ---
function addPlayer() {
    initAudio(); 
    const input = document.getElementById('new-player-name');
    const name = input.value.trim();
    if (name && players.length < 15) { 
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        players.push({ id: Date.now(), name: `${randomEmoji} ${name}` });
        input.value = ''; localStorage.setItem('partyPlayers', JSON.stringify(players)); renderPlayers();
    } else if (players.length >= 15) { showToast('ผู้เล่นเต็มแล้ว! (สูงสุด 15 คน)', 'error'); }
}
function removePlayer(id) { if(confirm('ต้องการลบผู้เล่นคนนี้?')) { players = players.filter(p => p.id !== id); localStorage.setItem('partyPlayers', JSON.stringify(players)); renderPlayers(); } }
function renderPlayers() {
    const list = document.getElementById('player-list'); list.innerHTML = '';
    players.forEach((p) => {
        const item = document.createElement('div'); item.className = 'player-item';
        item.innerHTML = `<div style="font-weight: 600;">${p.name}</div><div class="score-controls"><button class="score-btn" style="color: #ef4444;" onclick="removePlayer(${p.id})">×</button></div>`;
        list.appendChild(item);
    });
    if(players.length === 0) list.innerHTML = '<p class="text-muted" style="text-align:center; padding: 20px 0;">ยังไม่มีผู้เล่น เพิ่มชื่อด้านบนเลย!</p>';
}

// --- Game Definitions & UI Generation ---
const gameList = [
    { id: 'humsong', name: 'ฮัมเพลงปริศนา', icon: '🎶', color: 'pink' },
    { id: 'telephone', name: 'โทรศัพท์กระซิบ', icon: '📱', color: 'blue' },
    { id: 'bill', name: 'รูเล็ตต์จ่ายบิล', icon: '💸', color: 'purple' },
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
    { id: 'quiz', name: 'Quiz Battle', icon: '🧠', color: 'blue' }
];

function renderGameGrid() {
    const grid = document.getElementById('game-grid'); grid.innerHTML = '';
    gameList.forEach(game => {
        const card = document.createElement('div'); card.className = `game-card`; card.style.borderColor = `var(--neon-${game.color})`;
        card.innerHTML = `<div class="game-icon">${game.icon}</div><div style="font-weight: 600; font-size: 0.95rem;">${game.name}</div>`;
        card.onclick = () => openGame(game.id); grid.appendChild(card);
    });
}

function randomGameSelect() { const randomGame = gameList[Math.floor(Math.random() * gameList.length)]; openGame(randomGame.id); }

let gameInterval, gameTimeout;
function openGame(gameId) {
    initAudio();
    if(players.length < 2 && !['wheel', 'croc', 'tapbattle', 'bill'].includes(gameId)) { showToast("เกมนี้ต้องใช้ผู้เล่นอย่างน้อย 2 คน กรุณาเพิ่มผู้เล่นก่อนครับ", "error"); return; }
    
    gamesPlayed++; localStorage.setItem('partyGamesCount', gamesPlayed.toString());
    const game = gameList.find(g => g.id === gameId);
    document.getElementById('game-title').innerText = `${game.icon} ${game.name}`;
    
    const content = document.getElementById('game-content'); content.innerHTML = ''; 
    content.classList.remove('animate-entrance'); void content.offsetWidth; content.classList.add('animate-entrance');

    switch(gameId) {
        case 'humsong': initHumSong(content); break;
        case 'telephone': initTelephone(content); break;
        case 'bill': initBill(content); break;
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
        case 'quiz': initQuiz(content); break;
    }
    document.getElementById('home-view').classList.add('hidden'); document.getElementById('game-view').classList.remove('hidden');
}

function closeGame() {
    clearInterval(gameInterval); clearTimeout(gameTimeout);
    if(typeof handleHeadsUpTilt !== 'undefined') window.removeEventListener('deviceorientation', handleHeadsUpTilt);
    document.getElementById('game-view').classList.add('hidden'); document.getElementById('home-view').classList.remove('hidden');
}

function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getRandomPlayer() { return getRandom(players).name; }

// --- Game Implementations (New & Old) ---

// 1. ฮัมเพลงปริศนา (Hum the Song)
const humSongs = ["ทรงอย่างแบด", "ซ่อนกลิ่น", "คุ้กกี้เสี่ยงทาย", "เลือดกรุ๊ปบี", "รักติดไซเรน", "สลักจิต", "โต๊ะริม", "ถ้าเราเจอกันอีก", "วัดปะหล่ะ", "วาดไว้", "เพื่อนเล่น ไม่เล่นเพื่อน", "รำคาญกะบอกกันเด้อ", "เลิกคุยทั้งอำเภอ", "ช้ำคือเรา", "หมอกหรือควัน", "ผ้าเช็ดหน้า", "จี่หอย", "ผู้สาวขาเลาะ", "คิดแต่ไม่ถึง", "กอดเสาเถียง"];
const humSyllables = ["ฮัม", "อื้ม", "อ๋า", "งื้อ", "เมี้ยว", "ก้าบ", "ตู้ด", "ปี๊บ", "จิ๊บ", "โฮ่ง"];
function initHumSong(container) {
    container.innerHTML = `
        <div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">🎶</span> <strong>วิธีเล่น:</strong> ฮัมเพลงตามชื่อที่เห็นให้เพื่อนทาย โดยใช้คำที่กำหนดให้ ห้ามร้องเป็นเนื้อเพลง!</div>
        <div class="custom-timer-box"><label>เวลา (วิ):</label><input type="number" id="hum-time" value="30"></div>
        <div id="hum-song" class="display-text glass-card p-4 mb-4" style="color:var(--neon-blue); font-size: 2rem;">กดเริ่มเพื่อสุ่มเพลง</div>
        <div id="hum-word" class="text-muted mb-4" style="font-size: 1.2rem;"></div>
        <div id="hum-timer" class="timer-text mb-4">0</div>
        <div style="display:flex; gap:10px; width: 100%; max-width: 400px;">
            <button class="btn-danger action-btn" onclick="playSound('wrong'); flashScreen('red');">❌ หมดเวลา/ยอมแพ้</button>
            <button class="btn-neon-purple action-btn" onclick="playSound('correct'); flashScreen('green');">✅ ทายถูก!</button>
        </div>
        <button class="btn-neon-pink action-btn mt-4" onclick="startHum()" style="max-width: 200px;">▶ สุ่มใหม่ & เริ่มจับเวลา</button>
    `;
}
window.startHum = () => {
    playSound('tick');
    document.getElementById('hum-song').innerText = `🎵 ${getRandom(humSongs)}`;
    document.getElementById('hum-word').innerHTML = `ต้องฮัมด้วยคำว่า: <strong style="color:var(--neon-pink)">"${getRandom(humSyllables)}"</strong>`;
    let time = parseInt(document.getElementById('hum-time').value) || 30;
    document.getElementById('hum-timer').innerText = time;
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        time--; document.getElementById('hum-timer').innerText = time;
        if(time <= 0) { clearInterval(gameInterval); playSound('boom'); flashScreen('red'); document.getElementById('hum-timer').innerText = "หมดเวลา!"; }
    }, 1000);
}

// 2. โทรศัพท์กระซิบเวอร์ชันพิมพ์ (Broken Telephone Text)
const phonePhrases = ["ยายกินลำไยน้ำลายยายไหลย้อย", "เช้าฟาดผัดฟักเย็นฟาดฟักผัด", "ชามเขียวคว่ำเช้าชามขาวคว่ำค่ำ", "หมู หมึก กุ้ง หุง อุ่น ตุ๋น ต้ม นึ่ง", "ยักษ์ใหญ่ไล่ยักษ์เล็ก ยักษ์เล็กไล่ยักษ์ใหญ่", "กินมันติดเหงือกกินเผือกติดฟัน", "ลิงบนหลังคาปาขี้ใส่หมาหน้าปากซอย"];
let tpPlayers = []; let tpIndex = 0; let tpPhrase = ""; let tpHistory = [];
function initTelephone(container) {
    container.innerHTML = `
        <div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📱</span> <strong>วิธีเล่น:</strong> อ่านประโยค 5 วินาที แล้วพิมพ์ส่งให้คนถัดไป ดูซิว่าคนสุดท้ายจะพิมพ์ออกมาเป็นคำว่าอะไร!</div>
        <div class="custom-timer-box"><label>เวลาอ่าน (วิ):</label><input type="number" id="tp-time" value="5"></div>
        <button class="btn-neon-blue action-btn mt-4" onclick="startTelephone()" style="max-width: 250px;">▶ เริ่มเกม</button>
        <div id="tp-stage" style="width: 100%; margin-top: 20px;"></div>
    `;
}
window.startTelephone = () => {
    tpPlayers = [...players].sort(() => 0.5 - Math.random());
    tpIndex = 0; tpHistory = []; tpPhrase = getRandom(phonePhrases);
    document.getElementById('tp-time').parentElement.style.display = 'none';
    event.target.style.display = 'none';
    renderTpStage();
}
function renderTpStage() {
    const stage = document.getElementById('tp-stage');
    if(tpIndex >= tpPlayers.length) { // จบเกม
        let resultHTML = `<h3 class="mb-3 text-gradient">ประโยคต้นฉบับ: <br>"${tpPhrase}"</h3>`;
        tpHistory.forEach((h, i) => { resultHTML += `<div style="margin-bottom:10px; background:rgba(255,255,255,0.1); padding:10px; border-radius:8px;">${tpPlayers[i].name} พิมพ์ว่า:<br><strong style="color:var(--neon-pink)">"${h}"</strong></div>`; });
        stage.innerHTML = resultHTML + `<button class="btn-neon-blue mt-4 action-btn" onclick="initTelephone(document.getElementById('game-content'))">🔄 เล่นใหม่</button>`;
        return;
    }
    stage.innerHTML = `
        <h3 class="mb-4">ตานี้ของ: <span style="color:var(--neon-blue)">${tpPlayers[tpIndex].name}</span></h3>
        <button class="btn-neon-pink action-btn" id="btn-show-tp" onclick="showTpText()">👀 กดดูข้อความ</button>
        <div id="tp-display" class="display-text glass-card p-4 hidden" style="color:white; font-size:1.5rem;"></div>
        <input type="text" id="tp-input" class="hidden mb-4 mt-4" placeholder="พิมพ์สิ่งที่คุณจำได้...">
        <button class="btn-neon-purple action-btn hidden" id="btn-next-tp" onclick="nextTpPlayer()">ส่งต่อให้คนถัดไป ⏭️</button>
    `;
}
window.showTpText = () => {
    playSound('tick');
    document.getElementById('btn-show-tp').classList.add('hidden');
    let display = document.getElementById('tp-display');
    display.innerText = tpIndex === 0 ? tpPhrase : tpHistory[tpIndex-1];
    display.classList.remove('hidden');
    
    let readTime = parseInt(document.getElementById('tp-time').value) || 5;
    setTimeout(() => {
        playSound('tick');
        display.classList.add('hidden');
        document.getElementById('tp-input').classList.remove('hidden');
        document.getElementById('btn-next-tp').classList.remove('hidden');
    }, readTime * 1000);
}
window.nextTpPlayer = () => {
    playSound('correct');
    let val = document.getElementById('tp-input').value.trim() || "(ส่งกระดาษเปล่า)";
    tpHistory.push(val); tpIndex++; renderTpStage();
}

// 3. รูเล็ตต์มื้อนี้ใครจ่าย (The Bill Roulette)
function initBill(container) {
    container.innerHTML = `
        <div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">💸</span> <strong>วิธีเล่น:</strong> กรอกยอดบิลรวม แล้วสุ่มให้แอปแบ่งสัดส่วนการจ่ายแบบโคตรจะไม่แฟร์!</div>
        <input type="number" id="bill-amount" placeholder="กรอกยอดบิล (บาท)" class="mb-4" style="font-size:1.5rem; text-align:center;">
        <div id="bill-result" class="display-text glass-card p-4 mb-4" style="color:var(--neon-pink); font-size: 1.5rem;">รอสุ่ม...</div>
        <button class="btn-danger action-btn" onclick="spinBill()">🎲 สุ่มคนจ่าย</button>
    `;
}
window.spinBill = () => {
    let amount = parseFloat(document.getElementById('bill-amount').value);
    if(isNaN(amount) || amount <= 0) { showToast("กรุณากรอกยอดบิลให้ถูกต้อง", "error"); return; }
    playSound('tick');
    let target = document.getElementById('bill-result');
    target.innerText = "กำลังสุ่ม...";
    setTimeout(() => {
        playSound('boom'); flashScreen('red');
        let conditions = [
            `จ่ายเต็มจำนวน ${amount} บาท!`, `จ่าย 50% = ${amount*0.5} บาท`, `จ่ายแค่ 10% = ${amount*0.1} บาท รอดไป!`,
            `มื้อนี้กินฟรี!! ไม่ต้องจ่าย`, `รับจบ! จ่าย ${amount} บาท พร้อมแถมทิป`, `หารเท่ากันทุกคนจ้า แฟร์ๆ`
        ];
        target.innerHTML = `ผู้โชคร้าย: <strong style="color:white; font-size:2rem;">${getRandomPlayer()}</strong><br><br>${getRandom(conditions)}`;
    }, 1500);
}

// ทายคำบนหัว (Heads Up)
let huScore = 0; let huWordsList = []; let huCurrentIndex = 0; let isHuPlaying = false; let huReadyForNextTilt = true;
function initHeadsUp(container) {
    huScore = 0; isHuPlaying = false; 
    let catHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📱</span> <strong>วิธีเล่น:</strong> แนบมือถือที่หน้าผาก ✅ <strong>หงายจอขึ้น</strong> = ถูก! ❌ <strong>คว่ำจอลง</strong> = ข้าม!</div>
    <div class="custom-timer-box"><label>เวลา (วิ):</label><input type="number" id="hu-time-input" value="60"></div>
    <h3 class="mb-3 text-gradient">เลือกหมวดหมู่</h3><div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:350px;">`;
    catHTML += `<button class="btn-neon-pink action-btn" onclick="startHeadsUpSensorCheck('custom')">✨ หมวดของวงเรา (Custom)</button>`;
    for (let key in gameData.headsup) { catHTML += `<button class="btn-neon-blue action-btn" onclick="startHeadsUpSensorCheck('${key}')">${gameData.headsup[key].name}</button>`; }
    catHTML += `</div>`; container.innerHTML = catHTML;
}
window.startHeadsUpSensorCheck = (categoryKey) => {
    let time = parseInt(document.getElementById('hu-time-input').value) || 60;
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(permissionState => { startHeadsUpGameLoop(categoryKey, time); }).catch(console.error);
    } else { startHeadsUpGameLoop(categoryKey, time); }
};
window.startHeadsUpGameLoop = (categoryKey, time) => {
    let rawWords = categoryKey === 'custom' ? (customDeck.headsup.length > 0 ? customDeck.headsup : ["ยังไม่มีคำ! ไปเพิ่มที่หน้าแรก"]) : gameData.headsup[categoryKey].words;
    huWordsList = [...rawWords].sort(() => 0.5 - Math.random());
    huCurrentIndex = 0; huScore = 0; let timeLeft = time;
    const container = document.getElementById('game-content');
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; width: 100%; padding: 0 20px;"><div class="text-muted" style="font-size: 1.2rem;">⏱️ <span id="hu-timer">${timeLeft}</span></div><div class="text-muted" style="font-size: 1.2rem;">✅ <span id="hu-score">0</span> คำ</div></div>
        <div class="display-text glass-card p-4" id="hu-word" style="font-size: 4rem; color: var(--neon-pink); width: 100%; word-break: break-word; min-height: 250px;">แนบหน้าผากเลย!</div>
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
        if (b > -20 && b < 45) { huReadyForNextTilt = false; markHeadsUpCorrect(); } else if (b > 135 && b <= 180) { huReadyForNextTilt = false; markHeadsUpPass(); }
    } else { if (b > 60 && b < 120) { huReadyForNextTilt = true; } }
}
window.markHeadsUpCorrect = () => { if (!isHuPlaying) return; playSound('correct'); flashScreen('green'); huScore++; document.getElementById('hu-score').innerText = huScore; loadNextHeadsUpWord(); };
window.markHeadsUpPass = () => { if (!isHuPlaying) return; playSound('wrong'); flashScreen('red'); loadNextHeadsUpWord(); };
function loadNextHeadsUpWord() { huCurrentIndex++; if (huCurrentIndex >= huWordsList.length) { endHeadsUpGame(true); } else { document.getElementById('hu-word').innerText = huWordsList[huCurrentIndex]; } }
function endHeadsUpGame(outOfWords = false) {
    clearInterval(gameInterval); isHuPlaying = false; window.removeEventListener('deviceorientation', handleHeadsUpTilt); playSound('boom');
    document.getElementById('hu-controls').style.display = 'none'; document.getElementById('hu-restart-btn').style.display = 'flex';
    document.getElementById('hu-word').innerHTML = `<span style="font-size: 1.5rem; color: var(--text-main);">${outOfWords ? 'คำหมดแล้ว!' : 'หมดเวลา!'} ทายถูก</span><br><span style="font-size: 5rem;">${huScore}</span> คำ 🎉`;
}

// 5 วินาที (5 Sec Challenge)
function initFiveSec(container) {
    container.innerHTML = `
        <div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> <strong>วิธีเล่น:</strong> ตอบคำถาม 3 ข้อในเวลาที่กำหนด!</div>
        <div class="custom-timer-box"><label>เวลา (วิ):</label><input type="number" id="fs-time-input" value="5"></div>
        <div class="timer-text mb-4" id="fs-timer">0</div><div class="display-text glass-card p-4" id="fs-display" style="font-size:1.2rem; min-height: 60px; width:100%;">...</div>
        <button class="btn-neon-pink mb-4 mt-4 action-btn" onclick="startFiveSec()" id="fs-btn" style="max-width: 200px;">▶ สุ่มโจทย์ & จับเวลา</button>`;
    window.startFiveSec = () => { 
        playSound('correct'); const timerEl = document.getElementById('fs-timer'); const btn = document.getElementById('fs-btn'); 
        document.getElementById('fs-display').innerText = `โจทย์: ${getRandom(gameData.fiveSec)}`; 
        let timeLeft = parseInt(document.getElementById('fs-time-input').value) || 5; timerEl.innerText = timeLeft; btn.disabled = true; 
        clearInterval(gameInterval); gameInterval = setInterval(() => { timeLeft--; timerEl.innerText = timeLeft; playSound('tick'); if(timeLeft <= 0) { clearInterval(gameInterval); playSound('wrong'); flashScreen('red'); timerEl.innerText = "หมดเวลา!"; btn.disabled = false; btn.innerText = "เล่นใหม่"; } }, 1000); 
    };
}

// Hot Potato
function initHotPotato(container) {
    container.innerHTML = `
        <div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> <strong>วิธีเล่น:</strong> ตอบคำถามแล้วส่งมือถือวนไป ระเบิดตู้มที่ใครแพ้!</div>
        <div class="custom-timer-box"><label>เวลาสุ่มสุดที่ (วิ):</label><input type="number" id="hp-time-input" value="15"></div>
        <h3 class="mb-4 text-gradient" id="hp-category">หมวดหมู่: ...</h3><div class="display-text timer-text" id="hp-status">💣</div>
        <button class="btn-danger action-btn mt-4" onclick="startPotato()" id="hp-btn" style="max-width: 200px;">▶ เริ่มเกม</button>`;
    window.startPotato = () => { 
        playSound('tick'); const status = document.getElementById('hp-status'); const btn = document.getElementById('hp-btn'); 
        document.getElementById('hp-category').innerText = `หมวดหมู่: ${getRandom(gameData.categories)}`; status.innerText = "ติ๊ก... ติ๊ก..."; status.style.color = "var(--text-main)"; btn.disabled = true; btn.innerText = "กำลังเล่น..."; 
        let maxTime = parseInt(document.getElementById('hp-time-input').value) || 15;
        const time = Math.floor(Math.random() * (maxTime*1000)) + 3000; 
        clearTimeout(gameTimeout); gameTimeout = setTimeout(() => { playSound('boom'); flashScreen('red'); status.innerText = "💥 BOOM! 💥"; status.style.color = "red"; btn.disabled = false; btn.innerText = "เล่นใหม่"; document.getElementById('hp-category').innerText = `คนถือมือถือโดนทำโทษ!`; }, time); 
    };
}

// ศึกจิ้มไว
let tapRed = 50; let tapBlue = 50; let isTapPlaying = false;
function initTapBattle(container) {
    container.innerHTML = `
        <div class="game-rules-box mb-2"><span style="font-size: 1.2rem;">⚡</span> <strong>วิธีเล่น:</strong> วางมือถือตรงกลาง แข่งกันรัวนิ้วจิ้มฝั่งตัวเองให้ไวที่สุด!</div>
        <div class="custom-timer-box"><label>เวลา (วิ):</label><input type="number" id="tb-time-input" value="10"></div>
        <div id="tb-timer-b" class="timer-text mb-2" style="font-size: 2rem;">0</div>
        <div class="tap-container" id="tap-container"><div class="tap-area tap-red" id="area-red" onpointerdown="doTap('red')">RED</div><div class="tap-area tap-blue" id="area-blue" onpointerdown="doTap('blue')">BLUE</div></div>
        <button class="btn-neon-pink mt-4 action-btn" id="tb-start-b" onclick="startTapBattle()" style="max-width: 200px;">▶ เริ่มรัวนิ้ว</button>`;
}
window.startTapBattle = () => {
    document.getElementById('tb-start-b').style.display = 'none';
    tapRed = 50; tapBlue = 50; isTapPlaying = true; let timeLeft = parseInt(document.getElementById('tb-time-input').value) || 10;
    updateTapUI(); playSound('tick');
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        timeLeft--; document.getElementById('tb-timer-b').innerText = timeLeft;
        if(timeLeft <= 0) {
            clearInterval(gameInterval); isTapPlaying = false; playSound('boom');
            let winner = tapRed > tapBlue ? "❤️ สีแดงชนะ!" : (tapBlue > tapRed ? "💙 สีน้ำเงินชนะ!" : "เสมอ!");
            document.getElementById('tb-timer-b').innerHTML = `<span style="font-size:1.5rem; color:white;">${winner}</span>`;
            document.getElementById('tb-start-b').style.display = 'flex'; document.getElementById('tb-start-b').innerText = 'เล่นใหม่';
        }
    }, 1000);
};
window.doTap = (color) => { if(!isTapPlaying) return; if(color === 'red' && tapRed < 95) { tapRed += 3; tapBlue -= 3; } else if(color === 'blue' && tapBlue < 95) { tapBlue += 3; tapRed -= 3; } updateTapUI(); };
function updateTapUI() { document.getElementById('area-red').style.flexBasis = `${tapRed}%`; document.getElementById('area-blue').style.flexBasis = `${tapBlue}%`; }


// --- เกมอื่นๆ โค้ดเดิม (ตัดย่อเพื่อพื้นที่) ---
function initToD(c) { c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> สุ่มผู้โชคร้าย เลือกว่าจะตอบความจริง หรือทำภารกิจ</div><div id="tod-target" style="font-size: 1.5rem; color: var(--neon-blue); margin-bottom: 20px; font-weight: bold;"></div><div style="display: flex; gap: 10px; width: 100%; max-width: 300px; margin-bottom: 20px;"><button class="btn-neon-purple action-btn" onclick="rollToD('truths')">Truth 😇</button><button class="btn-neon-pink action-btn" onclick="rollToD('dares')">Dare 😈</button></div><div class="display-text glass-card p-4" id="tod-display" style="width: 100%;">...</div>`; window.rollToD = (t) => { playSound('tick'); let pool = gameData.tod[t]; if(t==='truths' && customDeck.truths.length>0) pool = pool.concat(customDeck.truths); if(t==='dares' && customDeck.dares.length>0) pool = pool.concat(customDeck.dares); document.getElementById('tod-target').innerText = `ผู้ถูกเลือก: ${getRandomPlayer()}`; document.getElementById('tod-display').innerText = getRandom(pool); }; }
function initNHIE(c) { c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> อ่านประโยค ใคร "เคยทำ" ต้องโดนทำโทษ!</div><div class="display-text glass-card p-4" id="nhie-display" style="color: var(--neon-blue); width: 100%;">กดปุ่มเพื่อเริ่มสุ่ม</div><button class="btn-neon-blue action-btn mt-4" onclick="playSound('tick'); document.getElementById('nhie-display').innerText = getRandom(gameData.neverHaveIEver)" style="max-width: 250px;">🎲 สุ่มคำถาม</button>`; }
function initMostLikely(c) { c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> นับ 1-2-3 แล้วชี้คนที่ตรงกับคำถามที่สุด!</div><div class="display-text glass-card p-4" id="ml-display" style="color: var(--neon-pink); width: 100%;">...</div><button class="btn-neon-pink action-btn mt-4" onclick="playSound('tick'); document.getElementById('ml-display').innerText = getRandom(gameData.mostLikely)" style="max-width: 250px;">👉 สุ่มคำถาม</button>`; document.getElementById('ml-display').innerText = getRandom(gameData.mostLikely); }
function initWheel(c) { c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> หมุนวงล้อวัดดวง ใครซวยโดนทำโทษ!</div><div class="wheel-container" id="wheel-circle">เตรียมหมุน!</div><button class="btn-neon-purple mt-4 action-btn" onclick="spinWheel()" style="max-width: 200px;">🎡 หมุนวงล้อ</button>`; window.spinWheel = () => { playSound('tick'); const w = document.getElementById('wheel-circle'); w.style.transform = `rotate(${Math.floor(Math.random() * 360) + 1440}deg)`; w.style.animation = 'none'; w.innerText = "กำลังหมุน..."; setTimeout(() => { playSound('correct'); w.innerText = getRandom(gameData.wheelOptions); w.style.transform = `rotate(0deg)`; w.style.animation = 'ring-pulse 2s infinite'; }, 3500); }; }
function initGuessWho(c) { c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> ทุกคนโหวตว่าคำใบ้หมายถึงใคร!</div><div class="display-text glass-card p-4" id="gw-display" style="color: var(--neon-purple); width: 100%;">...</div><button class="btn-neon-purple action-btn mt-4" onclick="playSound('tick'); document.getElementById('gw-display').innerText = getRandom(gameData.guessWho)" style="max-width: 250px;">🕵️ สุ่มคำใบ้</button>`; document.getElementById('gw-display').innerText = getRandom(gameData.guessWho); }
function initQuiz(c) { c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📖</span> ช่วยกันตอบ ถ้าผิดโดนยกวง!</div><div id="quiz-q" class="display-text" style="font-size: 1.2rem;">...</div><div id="quiz-choices" style="width: 100%; max-width: 350px;"></div><button class="btn-neon-blue mt-4 action-btn" onclick="loadQuiz()" style="max-width: 200px;">🔄 สุ่มข้อใหม่</button>`; window.loadQuiz = () => { playSound('tick'); const qData = getRandom(gameData.quiz); document.getElementById('quiz-q').innerText = qData.q; const cDiv = document.getElementById('quiz-choices'); cDiv.innerHTML = ''; qData.choices.forEach((ch, idx) => { const b = document.createElement('button'); b.className = 'choice-btn'; b.innerText = ch; b.onclick = () => { if(idx === qData.ans) { playSound('correct'); flashScreen('green'); b.style.background = 'rgba(34, 197, 94, 0.4)'; b.innerText += " ✅ รอดตัว!"; } else { playSound('wrong'); flashScreen('red'); b.style.background = 'rgba(239, 68, 68, 0.4)'; b.innerText += " ❌ โดนทำโทษ!"; } Array.from(cDiv.children).forEach(btn => btn.disabled = true); }; cDiv.appendChild(b); }); }; loadQuiz(); }
function initCroc(c) { c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">🐊</span> ผลัดกันกดฟันจระเข้ทีละซี่ ส่งวนไปเรื่อยๆ ใครกดโดนซี่กับดัก จระเข้จะงับ (สีแดง) และโดนทำโทษ!</div><div class="croc-grid" id="croc-grid"></div><button class="btn-neon-blue mt-4 action-btn" onclick="initCroc(document.getElementById('game-content'))" style="max-width:200px;">🔄 เริ่มเกมใหม่</button>`; const grid = document.getElementById('croc-grid'); const trapIndex = Math.floor(Math.random() * 10); for(let i=0; i<10; i++) { let btn = document.createElement('button'); btn.className = 'croc-tooth'; btn.onclick = () => { if(i === trapIndex) { playSound('boom'); flashScreen('red'); grid.innerHTML = `<div style="grid-column: span 5; color: red; font-size: 2rem; font-weight: bold; text-align: center; padding: 40px 0;">งับ!! 🐊💥<br><span style="font-size: 1rem; color: white;">โดนทำโทษ!</span></div>`; } else { playSound('tick'); btn.classList.add('pressed'); } }; grid.appendChild(btn); } }
function initSpy(c) { c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">🕵️‍♂️</span> ส่งมือถือให้ทุกคนดูบทบาททีละคน จะมี 1 คนเป็น Spy (ไม่รู้สถานที่) ให้ผลัดกันถามคำถามจับผิด!</div><div id="spy-stage" class="glass-card p-4" style="width:100%; min-height: 200px; display:flex; flex-direction:column; justify-content:center;"></div>`; window.spyLocation = getRandom(gameData.spyLocations); window.spyPlayerIndex = Math.floor(Math.random() * players.length); window.spyCurrentView = 0; renderSpyStage(); }
function renderSpyStage() { const stage = document.getElementById('spy-stage'); if(window.spyCurrentView >= players.length) { playSound('boom'); stage.innerHTML = `<h2 class="text-gradient mb-4">เริ่มจับผิดได้!</h2><p class="text-muted">ผลัดกันถามคำถาม แล้วโหวตว่าใครคือ Spy</p><button class="btn-danger action-btn mt-4" onclick="document.getElementById('spy-stage').innerHTML='<h1 style=color:red>Spy คือ: ${players[window.spyPlayerIndex].name} 🕵️‍♂️</h1>'">เฉลยตัว Spy</button>`; return; } stage.innerHTML = `<h3 class="mb-4">ส่งมือถือให้: <span style="color:var(--neon-pink)">${players[window.spyCurrentView].name}</span></h3><button class="btn-neon-purple action-btn" onclick="showSpyRole()">👀 กดเพื่อดูบทบาท</button>`; }
window.showSpyRole = () => { playSound('tick'); const roleText = (window.spyCurrentView === window.spyPlayerIndex) ? "<span style='color:red; font-size: 2.5rem;'>คุณคือ SPY 🕵️‍♂️</span>" : `สถานที่คือ:<br><span style='color:var(--neon-blue); font-size: 2rem;'>${window.spyLocation}</span>`; document.getElementById('spy-stage').innerHTML = `<div class="mb-4">${roleText}</div><button class="btn-neon-blue action-btn" onclick="window.spyCurrentView++; renderSpyStage();">ซ่อน และส่งต่อ ⏭️</button>`; };
function initTaboo(c) { c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">🤫</span> พยายามใบ้คำหลักให้เพื่อนทายถูก โดย "ห้ามพูดคำต้องห้าม" ที่อยู่ด้านล่างเด็ดขาด ถ้าเผลอพูดโดนปรับแพ้!</div><div id="taboo-content" style="width:100%;"></div><button class="btn-neon-blue mt-4 action-btn" onclick="startTaboo()" style="max-width: 200px;">🎲 สุ่มคำศัพท์</button>`; window.startTaboo = () => { playSound('tick'); const tData = getRandom(gameData.taboo); let forbidHTML = tData.forbidden.map(w => `<div style="background: rgba(239,68,68,0.2); padding: 5px 10px; border-radius: 8px; color: #ef4444; border: 1px solid #ef4444;">❌ ${w}</div>`).join(''); document.getElementById('taboo-content').innerHTML = `<div class="glass-card p-4 text-center mb-4"><div class="text-muted mb-2">คำที่ต้องใบ้:</div><div style="font-size: 3rem; color: var(--neon-blue); font-weight: bold; text-shadow: 0 0 15px rgba(59,130,246,0.5);">${tData.word}</div></div><div class="text-muted mb-2 text-center">ห้ามพูดคำเหล่านี้เด็ดขาด:</div><div style="display:flex; justify-content:center; gap: 10px; flex-wrap: wrap;" class="mb-4">${forbidHTML}</div><div style="display:flex; gap: 10px;"><button class="btn-danger action-btn" onclick="playSound('wrong'); flashScreen('red');">🚨 กดออด (พูดคำห้าม)</button><button class="btn-neon-purple action-btn" onclick="playSound('correct'); flashScreen('green'); startTaboo();">✅ ทายถูก</button></div>`; }; }

// --- Summary ---
function endParty() {
    if(players.length === 0) { showToast('ยังไม่มีข้อมูลผู้เล่นครับ', 'error'); return; }
    document.getElementById('home-view').classList.add('hidden'); document.getElementById('summary-view').classList.remove('hidden');
    let summaryHTML = `<p style="text-align: center; margin-bottom: 20px;">เล่นไปทั้งหมด: <strong style="color: var(--neon-blue);">${gamesPlayed}</strong> เกม</p><h3 style="color: var(--neon-purple); margin-bottom: 20px;">🎉 ผู้รอดชีวิตในวง 🎉</h3>`;
    players.forEach((p, i) => { summaryHTML += `<div style="text-align: center; font-size: 1.2rem; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">${i+1}. ${p.name}</div>`; });
    document.getElementById('summary-content').innerHTML = summaryHTML;
}
function copySummary() { let text = `🎉 สรุปผลปาร์ตี้ "วงนี้มีเกม" 🎉\nเล่นไปทั้งหมด ${gamesPlayed} เกม\n\nผู้ร่วมชะตากรรม:\n`; players.forEach((p, i) => { text += `${i+1}. ${p.name}\n`; }); navigator.clipboard.writeText(text).then(() => { showToast('✅ คัดลอกผลสรุปแล้ว! นำไปแปะในแชทกลุ่มได้เลย'); }); }
function resetAll() { if(confirm('แน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด? (เริ่มใหม่)')) { players = []; gamesPlayed = 0; saveState(); document.getElementById('summary-view').classList.add('hidden'); document.getElementById('home-view').classList.remove('hidden'); showToast('ล้างข้อมูลเรียบร้อยแล้ว'); } }

init();
