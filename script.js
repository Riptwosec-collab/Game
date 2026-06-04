// --- Data & State ---
let players = JSON.parse(localStorage.getItem('partyPlayers')) || [];
let gamesPlayed = parseInt(localStorage.getItem('partyGamesCount')) || 0;

// --- Game Data (Mock 20+ items each, easily expandable) ---
const gameData = {
    tod: {
        truths: ["เคยแอบชอบคนในวงนี้ไหม?", "เรื่องที่น่าอายที่สุดที่เคยทำต่อหน้าคนเยอะๆ?", "ความลับที่ยังไม่เคยบอกพ่อแม่?", "เคยโกหกเพื่อเอาตัวรอดเรื่องอะไร?", "สเปคคนที่แพ้ทางแบบสุดๆ?", "ร้องไห้ครั้งล่าสุดเพราะเรื่องอะไร?", "แอปในมือถือที่ใช้บ่อยที่สุดรองจากโซเชียล?", "เรื่องที่ภูมิใจที่สุดในชีวิต?", "เคยขโมยของไหม (แม้แต่ยางลบเพื่อน)?", "ถ้าให้สลับร่างกับคนในวงนี้ 1 วัน จะสลับกับใคร?"],
        dares: ["เต้นท่าที่คิดว่าเซ็กซี่ที่สุด 10 วินาที", "ให้คนทางขวาใช้ลิปสติก/ปากกา วาดหน้า", "โทรหาเพื่อนที่ไม่ได้คุยนานแล้วบอกว่า 'คิดถึง'", "ทำหน้าตลกให้ทุกคนถ่ายรูป", "พูดภาษาต่างดาวกับคนทางซ้าย 1 นาที", "ให้คนในวงเลือกเพลงให้ร้อง 1 ท่อน", "ทำท่าเหมือนสัตว์ที่เพื่อนโหวตให้", "ใบ้คำด้วยท่าทางห้ามส่งเสียงจนกว่าเพื่อนจะทายถูก", "ให้คนทางขวาพิมพ์สเตตัสเฟซบุ๊ก/ไอจีให้", "ซิทอัพ 10 ครั้งพร้อมตะโกนว่า 'ฉันแข็งแกร่ง!'"]
    },
    neverHaveIEver: [
        "ฉันไม่เคย โดนเท", "ฉันไม่เคย แอบหลับในห้องเรียน/ที่ทำงาน", "ฉันไม่เคย ไม่อาบน้ำเกิน 2 วัน", "ฉันไม่เคย ส่งข้อความผิดคนจนงานเข้า", "ฉันไม่เคย ร้องไห้ตอนดูหนัง", "ฉันไม่เคย แอบกินขนมเพื่อน", "ฉันไม่เคย ลืมวันเกิดแฟน/คนสำคัญ", "ฉันไม่เคย ตกหลุมรักคนในเน็ต", "ฉันไม่เคย โกหกเรื่องอายุ", "ฉันไม่เคย ทำโทรศัพท์ตกน้ำ"
    ],
    mostLikely: [
        "ใครมีโอกาสรวยเป็นเศรษฐีที่สุด?", "ใครมีโอกาสแต่งงานคนแรก?", "ใครมีโอกาสหลงทางในห้างที่สุด?", "ใครมีโอกาสจะเอาชีวิตรอดในป่าได้นานสุด?", "ใครมีโอกาสถูกหลอกโอนเงินมากที่สุด?", "ใครมีโอกาสเป็นดารา/อินฟลูเอนเซอร์ที่สุด?", "ใครมีโอกาสเมาแล้วเรื้อนที่สุด?", "ใครมีโอกาสกินจุที่สุดแต่น้ำหนักไม่ขึ้น?", "ใครมีโอกาสที่จะนอนตื่นสายในวันสำคัญ?", "ใครมีโอกาสจะอายุยืนที่สุด?"
    ],
   wheelOptions: [
        // หมวด: ทิศทางและตำแหน่ง
        "คนซ้ายมือ โดน! 👈",
        "คนขวามือ โดน! 👉",
        "คนตรงข้าม รับจบ! 🫵",
        "ประกบข้าง! (คนซ้ายและขวาโดนพร้อมกัน) 🥪",
        "ทำตัวเองแท้ๆ (คนหมุนรับจบ!) 🎯",
        "ทุกคนในวงโดน! (ยกเว้นคนหมุนรอด) 🌪️",
        "คนหมุนรอด! แต่มีสิทธิ์ชี้ให้คนอื่นโดนแทน 1 คน 😈",
        "คนหมุนโดน 2 เด้ง! (รับโทษ x2) ☠️",
        "คนซ้ายและขวาของ 'คนตรงข้าม' โดน! (ชิ่งลูกสูตร) 📐",
        "สลับที่นั่งกับคนตรงข้าม! 🔄",

        // หมวด: ลักษณะและสถานะ
        "ใครใส่เสื้อสีดำ/มืดๆ โดน! 🖤",
        "ใครใส่เสื้อสีสว่าง/ขาว โดน! 🤍",
        "ใครใส่แว่นตา โดน! 👓",
        "ใครไม่ได้ใส่นาฬิกาข้อมือ โดน! ⌚",
        "ใครแบตมือถือเหลือน้อยสุด โดน! 🔋",
        "ใครอายุมากสุดในวง รับไปเลยพี่ใหญ่! 👴👵",
        "ใครอายุน้อยสุดในวง โดน! 👶",
        "ใครมาถึงงานสายที่สุด โดน! ⏰",
        "ใครมีแฟนแล้ว โดนหมั่นไส้ โดน! 💘",
        "ใครโสดสนิท โดนปลอบใจ โดน! 💔",

        // หมวด: คะแนนและไอเทม
        "คนแต้มเยอะสุด โดน! (สกัดดาวรุ่ง) 👑",
        "คนแต้มน้อยสุด โดน! (ซ้ำเติม) 🤡",
        "รับแต้มฟรี +3 แต้ม 🎉",
        "โดนหัก -2 แต้ม 📉",
        "ขโมยแต้มจากคนซ้าย 1 แต้ม 🥷",
        "เศรษฐีใจบุญ แจกแต้มให้เพื่อน 2 คน คนละ 1 แต้ม 💸",
        "ได้เกราะป้องกัน! (ใช้ยกเลิกบทลงโทษได้ 1 ครั้ง) 🛡️",
        "สลับคะแนนของตัวเอง กับคนที่มีแต้มเยอะที่สุด! 🔄",
        "ซวยจัด! รีเซ็ตคะแนนตัวเองให้กลับไปเริ่ม 0 ใหม่ 😱",
        "คนหมุนมีสิทธิ์หักคะแนนใครก็ได้ 2 แต้ม ✂️",

        // หมวด: แอคชันและมินิเกม
        "จ่ายเข้ากองกลาง 10 บาท! 💸",
        "เป่ายิ้งฉุบกับคนตรงข้าม ใครแพ้โดน! ✌️✊🖐️",
        "ร้องเพลงท่อนฮุค 1 เพลง ไม่งั้นโดน! 🎤",
        "เต้น 10 วินาทีแบบไม่อาย ไม่งั้นโดน! 💃",
        "ให้คนซ้ายมือเป็นคนเลือกบทลงโทษให้ 🤫",
        "ให้คนขวามือเป็นคนเลือกบทลงโทษให้ 😈",
        "จับคู่กรรม! เลือก 1 คน ถ้าเราโดนตาหน้า เขาต้องโดนด้วย 👯",
        "เล่าเรื่องผีหรือเรื่องฮา 1 เรื่อง ไม่งั้นโดน! 👻",
        "โดนยึดมือถือคว่ำหน้าไว้ 10 นาที 📵",
        "ห้ามพูดคำว่า 'ไม่' 5 นาที ใครเผลอพูด โดน! 🤐",

        // หมวด: จับผิดและปั่นประสาท
        "ใครถือมือถือหรือของกินอยู่ โดน! 📱🥤",
        "ใครเพิ่งไปเข้าห้องน้ำมาล่าสุด โดน! 🚽",
        "ใครยิ้มหรือหัวเราะคนแรกหลังอ่านประโยคนี้จบ โดน! 😂",
        "แข่งกันแตะจมูกตัวเอง ใครทำช้าสุด โดน! 👃",
        "แข่งกันยกมือขึ้นฟ้า ใครยกช้าสุด โดน! 🙋‍♂️",
        "ใครใช้ iPhone โดน! 🍎",
        "ใครใช้ Android โดน! 🤖",
        "ดื่มน้ำเปล่ารวดเดียวครึ่งแก้ว/ครึ่งขวด! 🚰",
        "ทำท่ามินิฮาร์ทส่งรักให้คนตรงข้าม 🫶",
        "แจกจ่ายความป่วน: ชี้ใครก็ได้ให้โดนรวดเดียว 3 คน! 🎯🎯🎯"
    ],,
    guessWho: [
        "คนที่ใช้เวลาตอบแชทนานที่สุด", "คนที่ชอบกินของแปลกๆ", "คนที่มักจะมาสายเสมอ", "คนที่เส้นตื้นที่สุด หัวเราะง่ายสุด", "คนที่ถ่ายรูปเก่งที่สุด", "คนที่บ้างาน/เรียนที่สุด", "คนที่แต่งตัวเก่งที่สุด", "คนที่ชอบบ่นว่าไม่มีเงินแต่ซื้อของตลอด", "คนที่ติ่งเกาหลี/อนิเมะหนักสุด", "คนที่รักสัตว์มากกว่าคน"
    ],
    quiz: [
        {q: "อะไรเอ่ย สูงกว่าภูเขา แต่น้ำหนักเบาหวิว?", choices: ["ก้อนเมฆ", "เครื่องบิน", "อากาศ", "นก"], ans: 0},
        {q: "แมวอะไรอยู่ใต้ดิน?", choices: ["แมวขุด", "แมงมุม", "แมวเหมียว", "มันแกว"], ans: 3},
        {q: "สัตว์อะไรไม่มีกระดูกสันหลัง?", choices: ["ปลา", "งู", "กบ", "หมึก"], ans: 3},
        {q: "ประเทศไทยมีกี่ฤดู?", choices: ["2", "3", "4", "5"], ans: 1},
        {q: "ภาษา HTML ตัว H ย่อมาจากอะไร?", choices: ["Hyper", "Home", "High", "Host"], ans: 0}
    ],
    secretMissions: [
        "ทำให้คนอื่นหัวเราะให้ได้ 1 คน", "แอบชมคนทางขวาโดยไม่ให้เขารู้ตัวว่าทำภารกิจ", "ดื่มน้ำจนหมดแก้วรวดเดียว", "เนียนจับมือคนข้างๆ เป็นเวลา 5 วินาที", "พูดคำว่า 'จริงๆ แล้ว' ทุกครั้งที่เริ่มประโยค 3 ครั้ง", "แกล้งทำของตกแล้วให้เพื่อนเก็บให้", "ชวนเพื่อนเซลฟี่แบบหน้าตลก", "ทำตัวเป็นผู้ฟังที่ดี พยักหน้าตลอด 1 นาที", "เปลี่ยนเรื่องคุยแบบเนียนๆ", "หลอกถามอายุคนในวง"
    ],
    roasts: [
        "คนนี้คือคนที่บอกว่า 'ใกล้ถึงแล้ว' แต่ยังไม่ได้แต่งตัว", "หน้าตาดีนะ แต่แปลกที่ยังโสด... หรือว่านิสัย?", "เพื่อนคนนี้คือ นิยามของคำว่า 'เงินเดือนหรือเงินทอน'", "ความจำดีเยี่ยม... เฉพาะเรื่องของชาวบ้าน", "คนนี้คือคนที่กินเท่าไหร่ก็ไม่อ้วน น่าหมั่นไส้!", "หน้าตาเหมือนคนนอนเต็มอิ่ม แต่จริงๆ นอนเช้า", "เพื่อนคนนี้ไว้ใจได้เสมอ... ยกเว้นเรื่องยืมเงิน", "คนนี้พิมพ์แชทเก่งมาก แต่ตัวจริงเงียบกริบ", "เป็นคนรักสุขภาพมาก... กินสลัดคลุกหมูกรอบ", "คนนี้คือเดอะแบกของกลุ่ม... แบกความฮาและความกาว"
    ]
};

const gameList = [
    { id: 'tod', name: 'Truth or Dare', icon: '🎭', color: 'purple' },
    { id: 'nhie', name: 'Never Have I Ever', icon: '🙅‍♂️', color: 'blue' },
    { id: 'mostlikely', name: 'Most Likely To', icon: '👉', color: 'pink' },
    { id: 'wheel', name: 'Spin the Wheel', icon: '🎡', color: 'purple' },
    { id: 'hotpotato', name: 'Hot Potato', icon: '💣', color: 'blue' },
    { id: 'fivesec', name: '5 Second Challenge', icon: '⏱️', color: 'pink' },
    { id: 'guesswho', name: 'Guess Who', icon: '🕵️', color: 'purple' },
    { id: 'quiz', name: 'Quiz Battle', icon: '🧠', color: 'blue' },
    { id: 'secret', name: 'Secret Mission', icon: '🤫', color: 'pink' },
    { id: 'roast', name: 'AI Roast Friend', icon: '🔥', color: 'purple' }
];

// --- Core Functions ---
function saveState() {
    localStorage.setItem('partyPlayers', JSON.stringify(players));
    localStorage.setItem('partyGamesCount', gamesPlayed.toString());
    renderPlayers();
    renderQuickScore();
}

function init() {
    renderPlayers();
    renderGameGrid();
}

// --- Player Management ---
function addPlayer() {
    const input = document.getElementById('new-player-name');
    const name = input.value.trim();
    if (name && players.length < 15) { // Limit players for UI sanity
        players.push({ id: Date.now(), name: name, score: 0 });
        input.value = '';
        saveState();
    } else if (players.length >= 15) {
        alert('ผู้เล่นเต็มแล้ว! (สูงสุด 15 คน)');
    }
}

function removePlayer(id) {
    if(confirm('ต้องการลบผู้เล่นคนนี้?')) {
        players = players.filter(p => p.id !== id);
        saveState();
    }
}

function updateScore(id, delta) {
    const player = players.find(p => p.id === id);
    if (player) {
        player.score += delta;
        saveState();
    }
}

function renderPlayers() {
    const list = document.getElementById('player-list');
    list.innerHTML = '';
    
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    
    sortedPlayers.forEach((p, index) => {
        const item = document.createElement('div');
        item.className = 'player-item';
        let rankIcon = '';
        if (index === 0 && p.score > 0) rankIcon = '👑 ';
        
        item.innerHTML = `
            <div style="font-weight: 600;">${rankIcon}${p.name} <span style="color: var(--neon-pink); margin-left: 5px;">${p.score} แต้ม</span></div>
            <div class="score-controls">
                <button class="score-btn text-muted" onclick="updateScore(${p.id}, -1)">-</button>
                <button class="score-btn" style="color: var(--neon-blue);" onclick="updateScore(${p.id}, 1)">+</button>
                <button class="score-btn" style="color: #ef4444;" onclick="removePlayer(${p.id})">×</button>
            </div>
        `;
        list.appendChild(item);
    });

    if(players.length === 0) {
        list.innerHTML = '<p class="text-muted" style="text-align:center; padding: 20px 0;">ยังไม่มีผู้เล่น เพิ่มชื่อด้านบนเลย!</p>';
    }
}

function renderQuickScore() {
    const list = document.getElementById('quick-score-list');
    list.innerHTML = '';
    players.forEach(p => {
        const btn = document.createElement('div');
        btn.style.cssText = 'background: #2d2d3a; padding: 5px 12px; border-radius: 20px; white-space: nowrap; display: flex; align-items: center; gap: 5px; cursor: pointer; border: 1px solid var(--text-muted);';
        btn.innerHTML = `
            <span>${p.name} (${p.score})</span>
            <span style="color: var(--neon-blue); font-weight: bold; margin-left:5px;" onclick="updateScore(${p.id}, 1); event.stopPropagation();">+1</span>
        `;
        list.appendChild(btn);
    });
}

// --- Navigation & Game Rendering ---
function renderGameGrid() {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = '';
    gameList.forEach(game => {
        const card = document.createElement('div');
        card.className = `game-card`;
        card.style.borderColor = `var(--neon-${game.color})`;
        card.innerHTML = `
            <div class="game-icon">${game.icon}</div>
            <div style="font-weight: 600; font-size: 0.9rem;">${game.name}</div>
        `;
        card.onclick = () => openGame(game.id);
        grid.appendChild(card);
    });
}

function randomGameSelect() {
    const randomGame = gameList[Math.floor(Math.random() * gameList.length)];
    openGame(randomGame.id);
}

function openGame(gameId) {
    if(players.length < 2 && gameId !== 'wheel') {
        alert("เกมส่วนใหญ่ต้องใช้ผู้เล่นอย่างน้อย 2 คน กรุณาเพิ่มผู้เล่นก่อนครับ");
        return;
    }
    
    gamesPlayed++;
    localStorage.setItem('partyGamesCount', gamesPlayed.toString());
    
    const game = gameList.find(g => g.id === gameId);
    document.getElementById('game-title').innerText = `${game.icon} ${game.name}`;
    
    const content = document.getElementById('game-content');
    content.innerHTML = ''; 

    switch(gameId) {
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

    renderQuickScore();
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('game-view').classList.remove('hidden');
}

function closeGame() {
    clearInterval(gameInterval);
    clearTimeout(gameTimeout);
    document.getElementById('game-view').classList.add('hidden');
    document.getElementById('home-view').classList.remove('hidden');
}

// Helpers
function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getRandomPlayer() { return getRandom(players).name; }
let gameInterval, gameTimeout;

// --- Individual Games Logic ---
function initToD(container) {
    container.innerHTML = `
        <p class="text-muted mb-4">สุ่มผู้เล่นและเลือก Truth (ความจริง) หรือ Dare (กล้า)</p>
        <div id="tod-target" style="font-size: 1.2rem; color: var(--neon-blue); margin-bottom: 20px; font-weight: bold;"></div>
        <div style="display: flex; gap: 10px; width: 100%; max-width: 300px; margin-bottom: 20px;">
            <button class="btn-neon-purple" onclick="rollToD('truths')">Truth 😇</button>
            <button class="btn-neon-pink" onclick="rollToD('dares')">Dare 😈</button>
        </div>
        <div class="display-text" id="tod-display">...</div>
    `;
    window.rollToD = (type) => {
        document.getElementById('tod-target').innerText = `ผู้ถูกเลือก: ${getRandomPlayer()}`;
        document.getElementById('tod-display').innerText = getRandom(gameData.tod[type]);
    };
}

function initNHIE(container) {
    container.innerHTML = `
        <div class="display-text" id="nhie-display" style="color: var(--neon-blue);">กดปุ่มเพื่อสุ่มคำถาม</div>
        <p class="text-muted mb-4">ใครเคยทำสิ่งนี้ ให้ยกมือ/ดื่มน้ำ และกด +1 แต้มด้านล่าง</p>
        <button class="btn-neon-blue" onclick="document.getElementById('nhie-display').innerText = getRandom(gameData.neverHaveIEver)" style="max-width: 250px;">🎲 สุ่ม "ฉันไม่เคย"</button>
    `;
}

function initMostLikely(container) {
    container.innerHTML = `
        <div class="display-text" id="ml-display" style="color: var(--neon-pink);">...</div>
        <p class="text-muted mb-4">นับ 1 2 3 แล้วชี้ไปที่คนที่ตรงกับคำถามที่สุด!</p>
        <button class="btn-neon-pink" onclick="document.getElementById('ml-display').innerText = getRandom(gameData.mostLikely)" style="max-width: 250px;">👉 สุ่มคำถาม</button>
    `;
    document.getElementById('ml-display').innerText = getRandom(gameData.mostLikely);
}

function initWheel(container) {
    container.innerHTML = `
        <div class="wheel-container" id="wheel-circle">เตรียมหมุน!</div>
        <button class="btn-neon-purple mt-4" onclick="spinWheel()" style="max-width: 200px;">🎡 หมุนวงล้อ</button>
    `;
    window.spinWheel = () => {
        const wheel = document.getElementById('wheel-circle');
        const result = getRandom(gameData.wheelOptions);
        wheel.style.transform = `rotate(${Math.floor(Math.random() * 360) + 1080}deg)`;
        wheel.innerText = "กำลังหมุน...";
        setTimeout(() => {
            wheel.innerText = result;
            wheel.style.transform = `rotate(0deg)`;
        }, 3000);
    };
}

function initHotPotato(container) {
    container.innerHTML = `
        <h3 class="mb-2" id="hp-category">หมวดหมู่: ...</h3>
        <div class="display-text timer-text" id="hp-status">💣</div>
        <p class="text-muted mb-4">ส่งมือถือวนไปพร้อมตอบคำถาม ใครถือตอนระเบิด=แพ้!</p>
        <button class="btn-danger" onclick="startPotato()" id="hp-btn" style="max-width: 200px;">▶ เริ่มเกม</button>
    `;
    window.startPotato = () => {
        const status = document.getElementById('hp-status');
        const btn = document.getElementById('hp-btn');
        document.getElementById('hp-category').innerText = `หมวดหมู่: ${getRandom(gameData.categories)}`;
        status.innerText = "ติ๊ก... ติ๊ก...";
        status.style.color = "var(--text-main)";
        btn.disabled = true;
        btn.innerText = "กำลังเล่น...";
        
        const time = Math.floor(Math.random() * 15000) + 5000;
        clearTimeout(gameTimeout);
        gameTimeout = setTimeout(() => {
            status.innerText = "💥 BOOM! 💥";
            status.style.color = "red";
            btn.disabled = false;
            btn.innerText = "เล่นใหม่";
            document.getElementById('hp-category').innerText = `คนถือมือถือโดนทำโทษ!`;
        }, time);
    };
}

function initFiveSec(container) {
    container.innerHTML = `
        <div class="timer-text mb-4" id="fs-timer">5</div>
        <div class="display-text" id="fs-display" style="font-size:1.2rem; min-height: 60px;">...</div>
        <button class="btn-neon-pink mb-4" onclick="startFiveSec()" id="fs-btn" style="max-width: 200px;">▶ สุ่มโจทย์ & เริ่มจับเวลา</button>
    `;
    window.startFiveSec = () => {
        const timerEl = document.getElementById('fs-timer');
        const btn = document.getElementById('fs-btn');
        document.getElementById('fs-display').innerText = `โจทย์: ${getRandom(gameData.fiveSec)}`;
        let timeLeft = 5;
        timerEl.innerText = timeLeft;
        btn.disabled = true;
        
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            timeLeft--;
            timerEl.innerText = timeLeft;
            if(timeLeft <= 0) {
                clearInterval(gameInterval);
                timerEl.innerText = "หมดเวลา!";
                btn.disabled = false;
                btn.innerText = "เล่นใหม่";
            }
        }, 1000);
    };
}

function initGuessWho(container) {
    container.innerHTML = `
        <div class="display-text" id="gw-display" style="color: var(--neon-purple);">...</div>
        <p class="text-muted mb-4">ทุกคนโหวตว่าคำใบ้นี้คือใคร ทายถูกได้แต้ม!</p>
        <button class="btn-neon-purple" onclick="document.getElementById('gw-display').innerText = getRandom(gameData.guessWho)" style="max-width: 250px;">🕵️ สุ่มคำใบ้</button>
    `;
    document.getElementById('gw-display').innerText = getRandom(gameData.guessWho);
}

function initQuiz(container) {
    container.innerHTML = `
        <div id="quiz-q" class="display-text" style="font-size: 1.2rem;">...</div>
        <div id="quiz-choices" style="width: 100%; max-width: 350px;"></div>
        <button class="btn-neon-blue mt-4" onclick="loadQuiz()" style="max-width: 200px;">🔄 สุ่มข้อใหม่</button>
    `;
    window.loadQuiz = () => {
        const qData = getRandom(gameData.quiz);
        document.getElementById('quiz-q').innerText = qData.q;
        const choicesDiv = document.getElementById('quiz-choices');
        choicesDiv.innerHTML = '';
        qData.choices.forEach((c, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerText = c;
            btn.onclick = () => {
                if(index === qData.ans) {
                    btn.style.background = 'green';
                    btn.innerText += " ✅ ถูกต้อง!";
                } else {
                    btn.style.background = 'red';
                    btn.innerText += " ❌ ผิด!";
                }
                Array.from(choicesDiv.children).forEach(b => b.disabled = true);
            };
            choicesDiv.appendChild(btn);
        });
    };
    loadQuiz();
}

function initSecret(container) {
    container.innerHTML = `
        <p class="text-muted mb-4">ส่งมือถือให้ผู้เล่นทีละคน กดเปิดดูภารกิจลับ ห้ามให้คนอื่นเห็น! ทำสำเร็จรับแต้ม</p>
        <div class="display-text hidden" id="sm-display" style="border: 2px dashed var(--neon-pink); padding: 20px; border-radius: 12px;"></div>
        <button class="btn-neon-pink" onclick="toggleSecret()" id="sm-btn" style="max-width: 200px;">👀 เปิดดูภารกิจ</button>
    `;
    window.toggleSecret = () => {
        const display = document.getElementById('sm-display');
        const btn = document.getElementById('sm-btn');
        if(display.classList.contains('hidden')) {
            display.innerText = getRandom(gameData.secretMissions);
            display.classList.remove('hidden');
            btn.innerText = "🙈 ซ่อนภารกิจ";
        } else {
            display.classList.add('hidden');
            btn.innerText = "👀 สุ่มเปิดภารกิจใหม่";
        }
    };
}

function initRoast(container) {
    container.innerHTML = `
        <div id="roast-target" class="timer-text" style="font-size: 2rem; color: var(--neon-blue); margin-bottom: 10px;">...</div>
        <div class="display-text" id="roast-display" style="font-size: 1.2rem; color: var(--text-main);">...</div>
        <button class="btn-neon-purple mt-4" onclick="generateRoast()" style="max-width: 250px;">🔥 สุ่มแซวเพื่อน</button>
    `;
    window.generateRoast = () => {
        document.getElementById('roast-target').innerText = getRandomPlayer();
        document.getElementById('roast-display').innerText = `"${getRandom(gameData.roasts)}"`;
    };
    generateRoast();
}

// --- End Party & Summary ---
function endParty() {
    if(players.length === 0) {
        alert('ยังไม่มีข้อมูลผู้เล่นครับ');
        return;
    }
    
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('summary-view').classList.remove('hidden');
    
    const sorted = [...players].sort((a, b) => b.score - a.score);
    const mvp = sorted[0];
    const lowest = sorted[sorted.length - 1];
    
    let summaryHTML = `
        <p style="text-align: center; margin-bottom: 20px;">เล่นไปทั้งหมด: <strong style="color: var(--neon-blue);">${gamesPlayed}</strong> เกม</p>
        <h3 style="color: gold; margin-bottom: 10px;">👑 MVP ของงาน</h3>
        <p style="text-align: center; font-size: 1.5rem; margin-bottom: 20px;">${mvp.name} (${mvp.score} แต้ม)</p>
        
        <h3 style="color: #ef4444; margin-bottom: 10px;">🤡 คนดวงซวย (แต้มน้อยสุด)</h3>
        <p style="text-align: center; font-size: 1.2rem; margin-bottom: 20px;">${lowest.name} (${lowest.score} แต้ม)</p>
        
        <hr style="border-color: #2d2d3a; margin: 20px 0;">
        <h4 class="mb-2">ตารางคะแนนรวม</h4>
    `;
    
    sorted.forEach((p, i) => {
        summaryHTML += `<div style="display:flex; justify-content: space-between; margin-bottom: 5px;">
            <span>${i+1}. ${p.name}</span>
            <span style="color: var(--neon-pink);">${p.score}</span>
        </div>`;
    });
    
    document.getElementById('summary-content').innerHTML = summaryHTML;
}

function copySummary() {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    let text = `🎉 สรุปผลปาร์ตี้ "วงนี้มีเกม" 🎉\nเล่นไปทั้งหมด ${gamesPlayed} เกม\n\n`;
    text += `👑 MVP: ${sorted[0].name} (${sorted[0].score} แต้ม)\n`;
    text += `🤡 โดนทำโทษบ่อยสุด: ${sorted[sorted.length-1].name} (${sorted[sorted.length-1].score} แต้ม)\n\n`;
    text += `ตารางคะแนน:\n`;
    sorted.forEach((p, i) => { text += `${i+1}. ${p.name}: ${p.score}\n`; });
    
    navigator.clipboard.writeText(text).then(() => {
        alert('คัดลอกผลสรุปแล้ว! นำไปแปะในแชทกลุ่มได้เลย');
    });
}

function resetAll() {
    if(confirm('แน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด? (ผู้เล่นและคะแนนจะหายไป)')) {
        players = [];
        gamesPlayed = 0;
        saveState();
        document.getElementById('summary-view').classList.add('hidden');
        document.getElementById('home-view').classList.remove('hidden');
    }
}

// Initialize App
init();
