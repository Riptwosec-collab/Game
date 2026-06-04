// --- Data & State ---
let players = JSON.parse(localStorage.getItem('partyPlayers')) || [];
let gamesPlayed = parseInt(localStorage.getItem('partyGamesCount')) || 0;

// --- Game Data ---
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
        // หมวด: ไอเทมและแกล้งเพื่อน
        "คนเกิดเดือนนี้ โดน! 🎂",
        "คนเกิดเดือนที่แล้ว โดน! 🤡",
        "รอดตัว! มีสิทธิ์สั่งเพื่อน 1 คนให้โดนแทน 🎉",
        "รอดตัว! แถมได้สั่งเพื่อน 2 คนให้โดนทำโทษ 😈",
        "สลับที่นั่งกับคนทางซ้าย 🔄",
        "สั่งใครก็ได้ให้ลุกขึ้นเต้น 10 วิ 🕺",
        "ได้เกราะป้องกัน! (ใช้ยกเลิกบทลงโทษให้ตัวเองได้ 1 ครั้ง) 🛡️",
        "ชี้ใครก็ได้ให้โดนรวดเดียว 2 คน! ✌️",
        "ซวยจัด! โดนทำโทษควบ 2 แก้ว/2 สเต็ป 😱",
        "คนหมุนสั่งให้ทุกคนทำหน้าตลก ใครหลุดขำก่อน โดน! 😂",
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
    ],
    categories: [
        "ชื่อผลไม้", "ชื่อจังหวัดในไทย", "ยี่ห้อรถยนต์", "ชื่อสัตว์ที่มี 4 ขา", "เมนูอาหารไทย", "ชื่อหนังฮีโร่", "อุปกรณ์เครื่องเขียน", "ชื่อประเทศในเอเชีย", "ยี่ห้อโทรศัพท์มือถือ", "ชื่อเพลงที่กำลังฮิต"
    ],
    fiveSec: [
        "บอกชื่อเพื่อน 3 คน ในวงนี้", "บอกชื่อสัตว์เลี้ยงนม 3 ชนิด", "บอกเมนูไข่ 3 เมนู", "บอกชื่อแอปในมือถือ 3 แอป", "บอกข้อดีของตัวเอง 3 ข้อ", "บอกชื่อหนังผี 3 เรื่อง", "บอกสิ่งของสีแดง 3 อย่าง", "บอกคำหยาบ 3 คำ (เซ็นเซอร์ด้วย!)", "บอกชื่อห้างสรรพสินค้า 3 แห่ง", "บอกสิ่งที่ต้องทำตอนเช้า 3 อย่าง"
    ],
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
}

function init() {
    renderPlayers();
    renderGameGrid();
}

// --- Player Management ---
function addPlayer() {
    const input = document.getElementById('new-player-name');
    const name = input.value.trim();
    if (name && players.length < 15) { 
        players.push({ id: Date.now(), name: name });
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

function renderPlayers() {
    const list = document.getElementById('player-list');
    list.innerHTML = '';
    
    players.forEach((p) => {
        const item = document.createElement('div');
        item.className = 'player-item';
        item.innerHTML = `
            <div style="font-weight: 600; text-shadow: 0 0 10px rgba(255,255,255,0.3);">${p.name}</div>
            <div class="score-controls">
                <button class="score-btn" style="color: #ef4444;" onclick="removePlayer(${p.id})">×</button>
            </div>
        `;
        list.appendChild(item);
    });

    if(players.length === 0) {
        list.innerHTML = '<p class="text-muted" style="text-align:center; padding: 20px 0;">ยังไม่มีผู้เล่น เพิ่มชื่อด้านบนเลย!</p>';
    }
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
            <div style="font-weight: 600; font-size: 0.95rem; text-shadow: 0 0 10px var(--neon-${game.color});">${game.name}</div>
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
    
    // Trigger Animation
    content.classList.remove('animate-entrance');
    void content.offsetWidth; // Force Reflow
    content.classList.add('animate-entrance');

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
        <div id="tod-target" style="font-size: 1.5rem; color: var(--neon-blue); margin-bottom: 20px; font-weight: bold; text-shadow: 0 0 20px rgba(59, 130, 246, 0.8);"></div>
        <div style="display: flex; gap: 10px; width: 100%; max-width: 300px; margin-bottom: 20px;">
            <button class="btn-neon-purple action-btn" onclick="rollToD('truths')">Truth 😇</button>
            <button class="btn-neon-pink action-btn" onclick="rollToD('dares')">Dare 😈</button>
        </div>
        <div class="display-text glass-card p-4" id="tod-display" style="width: 100%;">...</div>
    `;
    window.rollToD = (type) => {
        document.getElementById('tod-target').innerText = `ผู้ถูกเลือก: ${getRandomPlayer()}`;
        document.getElementById('tod-display').innerText = getRandom(gameData.tod[type]);
    };
}

function initNHIE(container) {
    container.innerHTML = `
        <div class="display-text glass-card p-4" id="nhie-display" style="color: var(--neon-blue); width: 100%;">กดปุ่มเพื่อสุ่มคำถาม</div>
        <p class="text-muted mb-4 mt-4">ใครเคยทำสิ่งนี้ ให้ยกมือ/ดื่มน้ำ หรือโดนทำโทษ!</p>
        <button class="btn-neon-blue action-btn" onclick="document.getElementById('nhie-display').innerText = getRandom(gameData.neverHaveIEver)" style="max-width: 250px;">🎲 สุ่ม "ฉันไม่เคย"</button>
    `;
}

function initMostLikely(container) {
    container.innerHTML = `
        <div class="display-text glass-card p-4" id="ml-display" style="color: var(--neon-pink); width: 100%;">...</div>
        <p class="text-muted mb-4 mt-4">นับ 1 2 3 แล้วชี้ไปที่คนที่ตรงกับคำถามที่สุด!</p>
        <button class="btn-neon-pink action-btn" onclick="document.getElementById('ml-display').innerText = getRandom(gameData.mostLikely)" style="max-width: 250px;">👉 สุ่มคำถาม</button>
    `;
    document.getElementById('ml-display').innerText = getRandom(gameData.mostLikely);
}

function initWheel(container) {
    container.innerHTML = `
        <div class="wheel-container" id="wheel-circle">เตรียมหมุน!</div>
        <button class="btn-neon-purple mt-4 action-btn" onclick="spinWheel()" style="max-width: 200px;">🎡 หมุนวงล้อ</button>
    `;
    window.spinWheel = () => {
        const wheel = document.getElementById('wheel-circle');
        const result = getRandom(gameData.wheelOptions);
        wheel.style.transform = `rotate(${Math.floor(Math.random() * 360) + 1440}deg)`;
        wheel.style.animation = 'none';
        wheel.innerText = "กำลังหมุน...";
        setTimeout(() => {
            wheel.innerText = result;
            wheel.style.transform = `rotate(0deg)`;
            wheel.style.animation = 'ring-pulse 2s infinite';
        }, 3500);
    };
}

function initHotPotato(container) {
    container.innerHTML = `
        <h3 class="mb-4 text-gradient" id="hp-category">หมวดหมู่: ...</h3>
        <div class="display-text timer-text" id="hp-status">💣</div>
        <p class="text-muted mb-4 mt-4">ส่งมือถือวนไปพร้อมตอบคำถาม ใครถือตอนระเบิด=แพ้!</p>
        <button class="btn-danger action-btn" onclick="startPotato()" id="hp-btn" style="max-width: 200px;">▶ เริ่มเกม</button>
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
        <div class="display-text glass-card p-4" id="fs-display" style="font-size:1.2rem; min-height: 60px; width:100%;">...</div>
        <button class="btn-neon-pink mb-4 mt-4 action-btn" onclick="startFiveSec()" id="fs-btn" style="max-width: 200px;">▶ สุ่มโจทย์ & จับเวลา</button>
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
        <div class="display-text glass-card p-4" id="gw-display" style="color: var(--neon-purple); width: 100%;">...</div>
        <p class="text-muted mb-4 mt-4">ทุกคนโหวตว่าคำใบ้นี้คือใคร ทายถูกรอดตัว ทายผิดโดน!</p>
        <button class="btn-neon-purple action-btn" onclick="document.getElementById('gw-display').innerText = getRandom(gameData.guessWho)" style="max-width: 250px;">🕵️ สุ่มคำใบ้</button>
    `;
    document.getElementById('gw-display').innerText = getRandom(gameData.guessWho);
}

function initQuiz(container) {
    container.innerHTML = `
        <div id="quiz-q" class="display-text" style="font-size: 1.2rem;">...</div>
        <div id="quiz-choices" style="width: 100%; max-width: 350px;"></div>
        <button class="btn-neon-blue mt-4 action-btn" onclick="loadQuiz()" style="max-width: 200px;">🔄 สุ่มข้อใหม่</button>
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
                    btn.style.background = 'rgba(34, 197, 94, 0.4)';
                    btn.style.borderColor = '#22c55e';
                    btn.innerText += " ✅ รอดตัว!";
                } else {
                    btn.style.background = 'rgba(239, 68, 68, 0.4)';
                    btn.style.borderColor = '#ef4444';
                    btn.innerText += " ❌ โดนทำโทษ!";
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
        <p class="text-muted mb-4">ส่งมือถือให้ผู้เล่นทีละคน กดเปิดดูภารกิจลับ ห้ามให้คนอื่นเห็น! ทำไม่สำเร็จโดนทำโทษ</p>
        <div class="display-text hidden glass-card p-4" id="sm-display" style="border: 2px dashed var(--neon-pink); border-radius: 12px; width:100%;"></div>
        <button class="btn-neon-pink action-btn mt-4" onclick="toggleSecret()" id="sm-btn" style="max-width: 200px;">👀 เปิดดูภารกิจ</button>
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
        <div id="roast-target" class="timer-text" style="font-size: 2.5rem; color: var(--neon-blue); margin-bottom: 20px;">...</div>
        <div class="display-text glass-card p-4" id="roast-display" style="font-size: 1.2rem; color: var(--text-main); width: 100%;">...</div>
        <button class="btn-neon-purple mt-4 action-btn" onclick="generateRoast()" style="max-width: 250px;">🔥 สุ่มแซวเพื่อน</button>
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
    
    let summaryHTML = `
        <p style="text-align: center; margin-bottom: 20px;">เล่นไปทั้งหมด: <strong style="color: var(--neon-blue); text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);">${gamesPlayed}</strong> เกม</p>
        <h3 style="color: var(--neon-purple); margin-bottom: 20px; text-shadow: 0 0 15px rgba(168, 85, 247, 0.5);">🎉 ผู้รอดชีวิตในวง 🎉</h3>
    `;
    
    players.forEach((p, i) => {
        summaryHTML += `<div style="text-align: center; font-size: 1.2rem; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
            ${i+1}. ${p.name}
        </div>`;
    });
    
    document.getElementById('summary-content').innerHTML = summaryHTML;
}

function copySummary() {
    let text = `🎉 สรุปผลปาร์ตี้ "วงนี้มีเกม" 🎉\nเล่นไปทั้งหมด ${gamesPlayed} เกม\n\n`;
    text += `ผู้ร่วมชะตากรรม:\n`;
    players.forEach((p, i) => { text += `${i+1}. ${p.name}\n`; });
    
    navigator.clipboard.writeText(text).then(() => {
        alert('คัดลอกผลสรุปแล้ว! นำไปแปะในแชทกลุ่มได้เลย');
    });
}

function resetAll() {
    if(confirm('แน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด? (เริ่มใหม่)')) {
        players = [];
        gamesPlayed = 0;
        saveState();
        document.getElementById('summary-view').classList.add('hidden');
        document.getElementById('home-view').classList.remove('hidden');
    }
}

// Initialize App
init();
