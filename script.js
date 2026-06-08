// ==========================================
// 1. Data, State Management & Theme
// ==========================================
let players = JSON.parse(localStorage.getItem('partyPlayers')) || [];
let gamesPlayed = parseInt(localStorage.getItem('partyGamesCount')) || 0;
let customDeck = JSON.parse(localStorage.getItem('partyCustomDeck')) || { truths: [], dares: [], headsup: [] };

const emojis = ['🐶','🐱','🐼','🦊','🦁','🐷','🐸','🐵','🦄','👽','👾','👻','🤠','🤡','🤖'];
const penalties = ["ดื่ม 1 แก้ว 🍺", "เต้นเพลง TikTok 15 วิ", "จ่ายเข้ากองกลาง 20 บาท", "ให้เพื่อนทางขวาดีดมะกอก", "ซิทอัพ 10 ครั้ง", "ห้ามพูด 5 นาที", "ดื่มน้ำรวดเดียวหมดแก้ว", "สารภาพความลับ 1 เรื่อง", "กระโดดตบ 20 ครั้ง", "ให้เพื่อนแคปหน้าจอแชทลงโซเชียล", "เต้นไก่ย่างถูกเผา", "บอกรักคนแรกที่เดินผ่าน", "ทำท่าลิง 1 นาที", "ถูกริบมือถือ 10 นาที", "กินกระเทียม/พริก 1 ชิ้น", "วิดพื้น 10 ครั้ง", "โทรหาคนคุยเก่า", "ให้เพื่อนวาดรูปบนหน้า", "ร้องเพลงชาติด้วยเสียงเป็ด", "เต้นบัลเล่ต์รอบวง 1 รอบ", "พูด 'ขอโทษครับ' หลังประโยค 5 นาที", "ทำท่าเหมือนคนปวดท้องเข้าห้องน้ำ", "ทำท่าเซ็กซี่อ่อยคนทางซ้าย", "โทรหาแม่บอกว่าท้อง", "อมน้ำเปล่าไว้ในปากจนกว่าจะถึงตาตัวเอง", "พูดเร็วๆ รัวๆ 1 นาที", "ทำท่าโยคะท่ายาก 30 วินาที", "ส่งเซลฟี่น่าเกลียดลงกลุ่ม", "เป็นทาสรับใช้คนทางซ้าย 10 นาที", "บอกข้อเสียของตัวเอง 3 ข้อ"];
const drawWords = ["ช้างบินได้", "คนกำลังอกหัก", "ผีดิบ", "ไก่ย่างถูกเผา", "ซูเปอร์แมน", "นางเงือก", "มนุษย์ต่างดาว", "แมวกินปลา", "ไดโนเสาร์ขี่จักรยาน", "นินจา", "หมูกระทะ", "คนเมา", "รถไฟเหาะ", "นักบินอวกาศ", "คนกำลังอาบน้ำ", "จระเข้", "โจรปล้นธนาคาร", "แฮร์รี่พอตเตอร์", "ตำรวจจับผู้ร้าย", "คนกำลังจาม", "ช่างตัดผม", "เต่าคลาน", "กอริลล่า", "คอมพิวเตอร์พัง", "คนตาบอด", "คนกำลังร้องไห้", "แมงมุมยักษ์", "ผีเสื้อสมุทร", "หมอผี", "เศรษฐี", "คนถูกหวย", "แวมไพร์", "ซอมบี้วิ่งหนีคน", "นักเตะโดนใบแดง", "สิงโตคำราม", "คนหิวข้าว", "ซานตาคลอส", "คนปวดขี้", "คนกำลังเซลฟี่", "เครื่องบินตก", "เรือไททานิค", "สไปเดอร์แมน", "แบตมือถือหมด", "หมอดู", "คนแอบหลับ", "คนล้มคลุกฝุ่น", "นักกล้าม", "คนถูกผีหลอก", "เด็กทารก", "ลิงกินกล้วย"];
const textBombSyllables = ["ใจ", "รัก", "การ", "ความ", "ดอย", "แคมป์", "หุ้น", "เน็ต", "กิน", "นอน", "นก", "ปลา", "แมว", "น้ำ", "ไฟ", "ดิน", "ฟ้า", "ดาว", "เดือน", "ปี", "วัน", "เวลา", "บ้าน", "รถ", "ถนน", "เมือง", "ทอง", "เงิน", "คน", "ผี", "ลม", "ฝน", "แดด", "ร้อน", "หนาว", "ดำ", "ขาว", "แดง", "เหลือง", "เขียว", "ฟ้า", "ทะเล", "ภูเขา", "ป่า", "หญ้า", "ดอก", "ไม้", "ใบ", "ราก", "ผล", "หวาน", "เปรี้ยว", "เผ็ด", "เค็ม", "ขม"];
const spyLocations = ["โรงพยาบาล", "ค่ายทหาร", "ลานกางเต็นท์", "ดอยเชียงใหม่", "โอลด์แทรฟฟอร์ด", "ห้องเซิร์ฟเวอร์", "ร้านหมูกระทะ", "งานเทศกาลดนตรี", "สนามบิน", "สถานีตำรวจ", "โรงเรียน", "มหาวิทยาลัย", "ร้านกาแฟ", "ห้างสรรพสินค้า", "โรงหนัง", "สวนสัตว์", "พิพิธภัณฑ์", "ธนาคาร", "ร้านทำผม", "ยิม", "เรือสำราญ", "สถานีอวกาศ", "เรือดำน้ำ", "เหมืองแร่", "คาสิโน", "สวนสนุก", "ผับ/บาร์", "ร้านนวด", "สปา", "ตลาดนัด", "วัด", "ศาลเจ้า", "โบสถ์", "งานแต่งงาน", "งานศพ", "คอนเสิร์ต", "สนามบอล", "สระว่ายน้ำ", "ทะเล", "น้ำตก", "ภูเขาไฟ", "ถ้ำ", "ป่าช้า", "โรงงาน", "สถานีดับเพลิง", "ห้องน้ำสาธารณะ", "รถเมล์", "รถไฟฟ้า", "เครื่องบิน", "เรือข้ามฟาก"];

const gameData = {
    categories: ["ชื่อผลไม้", "จังหวัดในไทย", "ยี่ห้อรถยนต์", "เมนูอาหารไทย", "ชื่อหนังฮีโร่", "ชื่อเพลงฮิต", "อุปกรณ์แคมป์ปิ้ง", "คำสั่งโปรแกรมมิ่ง", "ชื่อทีมฟุตบอล", "สัตว์ 4 ขา", "สีต่างๆ", "ประเทศในเอเชีย", "ยี่ห้อมือถือ", "ชื่อดอกไม้", "อวัยวะในร่างกาย", "อุปกรณ์เครื่องเขียน", "กีฬาต่างๆ", "ยี่ห้อขนม", "ชื่อดาราไทย", "อาชีพ", "ชื่อปลา", "ชื่อนก", "สถานที่ท่องเที่ยว", "ชื่อวัด", "ยี่ห้อเครื่องใช้ไฟฟ้า", "เครื่องดื่ม", "ของหวาน", "ของใช้ในห้องน้ำ", "เสื้อผ้า", "ยี่ห้อรองเท้า", "ชื่อจังหวัดภาคเหนือ", "ชื่อจังหวัดภาคอีสาน", "ชื่อจังหวัดภาคใต้", "ชื่อซีรีส์เกาหลี", "ชื่อการ์ตูนญี่ปุ่น", "เมนูเครื่องดื่มคาเฟ่", "ชนิดของผัก", "อวัยวะภายใน", "ชื่อโรค", "ของใช้ในครัว"],
    fiveSec: ["บอกชื่อเพื่อน 3 คน", "บอกเมนูไข่ 3 เมนู", "บอกชื่อแอป 3 แอป", "บอกคำหยาบ 3 คำ", "บอกสิ่งที่ต้องทำตอนเช้า 3 อย่าง", "บอกชื่อจังหวัด 3 จังหวัด", "บอกผลไม้สีแดง 3 ชนิด", "บอกสัตว์เลี้ยงลูกด้วยนม 3 ชนิด", "บอกยี่ห้อรถ 3 ยี่ห้อ", "บอกชื่อหนังผี 3 เรื่อง", "บอกข้อดีของตัวเอง 3 ข้อ", "บอกสีที่ชอบ 3 สี", "บอกประเทศที่อยากไป 3 ประเทศ", "บอกเมนูอาหารเช้า 3 เมนู", "บอกชื่อเพลงฮิต 3 เพลง", "บอกชื่อนักเตะ 3 คน", "บอกสถานที่เที่ยว 3 ที่", "บอกยี่ห้อเต็นท์ 3 ยี่ห้อ", "บอกชื่อหุ้น 3 ตัว", "บอกของใช้ในห้องน้ำ 3 อย่าง"],
    guessWho: ["คนที่ตอบแชทนานที่สุด", "คนที่ชอบกินของแปลกๆ", "คนที่มักจะมาสายเสมอ", "คนที่ใช้เงินเก่งที่สุด", "คนที่บ่นเก่งที่สุด", "คนที่หัวเราะเสียงดังที่สุด", "คนที่เงียบที่สุด", "คนที่ขี้เมาที่สุด", "คนที่คอแข็งที่สุด", "คนที่ชอบเซลฟี่ที่สุด", "คนที่แต่งตัวเก่งที่สุด", "คนที่ชอบอยู่ติดบ้านที่สุด", "คนที่ชอบเที่ยวที่สุด", "คนที่บ้างานที่สุด", "คนที่ขี้เกียจที่สุด", "คนที่เจ้าระเบียบที่สุด", "คนที่ซกมกที่สุด", "คนที่มีโอกาสแต่งงานคนแรก", "คนที่มีโอกาสหลงทางในห้างที่สุด", "คนที่มีโอกาสถูกหลอกโอนเงินมากที่สุด"],
    tod: { 
        truths: ["เคยแอบชอบคนในวงนี้ไหม?", "เรื่องที่น่าอายที่สุด?", "ความลับที่ยังไม่เคยบอกพ่อแม่?", "ถ้าให้สลับร่างกับคนในวงนี้ 1 วัน จะสลับกับใคร?", "แอปในมือถือที่เข้าบ่อยที่สุด?", "เคยโกหกเพื่อนในวงนี้เรื่องอะไร?", "ร้องไห้ครั้งล่าสุดเพราะอะไร?", "คนที่คิดว่าหน้าตาดีที่สุดในวง?", "เคยขโมยของไหม?", "สเปคที่แพ้ทางสุดๆ?", "เรื่องที่ภูมิใจที่สุด?", "เคยมีแฟนพร้อมกันกี่คน?", "ถ้าต้องทิ้งเพื่อน 1 คนในวงนี้ จะทิ้งใคร?", "สิ่งที่กลัวที่สุด?", "เคยแอบอ่านแชทแฟนไหม?", "ความฝันที่แปลกที่สุด?", "เคยแกล้งเพื่อนจนร้องไห้ไหม?", "เรื่องที่โดนด่าบ่อยสุด?", "เคยชอบแฟนเพื่อนไหม?", "สัตว์เลี้ยงที่อยากเลี้ยงที่สุด?"], 
        dares: ["เต้นท่าที่คิดว่าเซ็กซี่ที่สุด 10 วิ", "ให้คนทางขวาใช้ลิปสติกวาดหน้า", "โทรหาเพื่อนที่ไม่ได้คุยนานแล้วบอกว่า 'คิดถึง'", "ซิทอัพ 10 ครั้งพร้อมตะโกนว่า 'ฉันแข็งแกร่ง!'", "พูดภาษาต่างดาวกับคนทางซ้าย 1 นาที", "ให้คนในวงเลือกเพลงให้ร้อง 1 ท่อน", "ทำท่าเหมือนสัตว์ที่เพื่อนโหวตให้", "ใบ้คำด้วยท่าทางห้ามส่งเสียงจนกว่าเพื่อนจะทายถูก", "ให้คนทางขวาพิมพ์สเตตัสเฟซบุ๊กให้", "ดื่มน้ำ 1 แก้วรวดเดียว", "วิดพื้น 5 ครั้ง", "กระโดดตบ 20 ครั้ง", "เต้นเพลงไก่ย่าง", "ทำท่าเหมือนลิง", "ตะโกนคำว่า 'ฉันสวย/หล่อ' 3 ครั้ง", "เดินแบบเหมือนนางแบบ/นายแบบ", "ทำหน้าตลกให้เพื่อนถ่ายรูป", "ให้เพื่อนจี้เอว 10 วินาที", "ร้องเพลงชาติด้วยเสียงเด็ก", "สโลว์โมชั่น 1 นาที"] 
    },
    headsup: { 
        animals: { name: "🐶 สัตว์โลก", words: ["สิงโต", "ช้าง", "ยีราฟ", "แพนด้า", "ฉลาม", "นกฮูก", "สลอธ", "แมวน้ำ", "เพนกวิน", "จิงโจ้", "ฮิปโป", "ไดโนเสาร์", "จระเข้", "งูหลาม", "แมงมุม", "หมาป่า", "นกแก้ว", "ลิง", "โลมา", "เต่า", "ม้าลาย", "แรด", "นกกระจอกเทศ", "ปลาหมึก", "ปลาดาว", "กุ้งมังกร", "ปูม้า", "แมงกะพรุน", "หมีขั้วโลก", "อูฐ", "จิ้งจอก", "เม่น", "กระรอก", "ค้างคาว", "กบ", "คางคก", "งูจงอาง", "ตะขาบ", "แมงป่อง", "แมลงสาบ"] }, 
        food: { name: "🍔 ของกิน", words: ["หมูกระทะ", "ชาบู", "ส้มตำ", "ข้าวมันไก่", "ผัดกะเพรา", "ชานมไข่มุก", "บิงซู", "พิซซ่า", "ซูชิ", "ต้มยำกุ้ง", "แซลมอนดอง", "ก๋วยเตี๋ยวเรือ", "ข้าวเหนียวมะม่วง", "หมูปิ้ง", "ยำแซลมอน", "หมาล่า", "ปาท่องโก๋", "โรตี", "ขนมจีน", "สลัดโรล", "ผัดไทย", "ข้าวซอย", "น้ำพริกหนุ่ม", "ไส้อั่ว", "แคบหมู", "ลาบหมู", "น้ำตกหมู", "ซุปหน่อไม้", "ไก่ย่าง", "ข้าวเหนียว", "แกงเขียวหวาน", "มัสมั่น", "ต้มข่าไก่", "ไข่เจียวหมูสับ", "ไข่ดาว", "เบอร์เกอร์", "เฟรนช์ฟรายส์", "ฮอทดอก", "สเต็ก", "สปาเก็ตตี้"] } 
    }
};

const gameList = [
    { id: 'touch', name: 'แตะนิ้วเสี่ยงทาย', icon: '👆', color: 'pink' },
    { id: 'russian', name: 'รูเล็ตต์ลูกโม่', icon: '🔫', color: 'blue' },
    { id: 'duel', name: 'ดวลปืนคาวบอย', icon: '🤠', color: 'purple' },
    { id: 'hilow', name: 'ไพ่สูงหรือต่ำ', icon: '🃏', color: 'pink' },
    { id: 'twotruths', name: 'จับตอแหล (2T1L)', icon: '🤥', color: 'blue' },
    { id: 'draw', name: 'จิตรกรเอก (วาด)', icon: '🎨', color: 'purple' },
    { id: 'kingscup', name: 'ไพ่พระราชา', icon: '🃏', color: 'pink' },
    { id: 'wheel', name: 'รูเล็ตต์ตามใจฉัน', icon: '🎡', color: 'blue' },
    { id: 'croc', name: 'จระเข้งับนิ้ว', icon: '🐊', color: 'purple' },
    { id: 'textbomb', name: 'พิมพ์ทะลุนรก', icon: '💣', color: 'pink' },
    { id: 'headsup', name: 'ทายคำบนหัว', icon: '📱', color: 'blue' },
    { id: 'tapbattle', name: 'ศึกจิ้มไว', icon: '⚡', color: 'purple' },
    { id: 'spy', name: 'สปายจับผิด', icon: '🕵️‍♂️', color: 'pink' },
    { id: 'hotpotato', name: 'Hot Potato', icon: '💣', color: 'blue' },
    { id: 'tod', name: 'Truth or Dare', icon: '🎭', color: 'purple' },
    { id: 'fivesec', name: '5 Sec Challenge', icon: '⏱️', color: 'pink' },
    { id: 'guesswho', name: 'Guess Who', icon: '🤔', color: 'blue' },
    { id: 'humsong', name: 'ฮัมเพลงปริศนา', icon: '🎶', color: 'purple' }
];

// โหลดและตั้งค่า Theme
window.setTheme = (themeName) => {
    document.body.className = ''; 
    if(themeName !== 'default') document.body.classList.add('theme-' + themeName);
    localStorage.setItem('partyTheme', themeName);
    showToast(`เปลี่ยนเป็นธีม ${themeName} แล้ว!`);
};
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('partyTheme');
    if(savedTheme) setTheme(savedTheme);
});

// ==========================================
// 2. Audio, General UI & HP
// ==========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx; let ambientInterval = null;
function initAudio() { if(!audioCtx) audioCtx = new AudioContext(); if(audioCtx.state === 'suspended') audioCtx.resume(); }
function playSound(type) {
    if(!audioCtx) return; const osc = audioCtx.createOscillator(); const gainNode = audioCtx.createGain(); osc.connect(gainNode); gainNode.connect(audioCtx.destination); const now = audioCtx.currentTime;
    if(type === 'correct') { osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1); gainNode.gain.setValueAtTime(0.5, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3); osc.start(now); osc.stop(now + 0.3); } 
    else if (type === 'wrong') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.2); gainNode.gain.setValueAtTime(0.5, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3); osc.start(now); osc.stop(now + 0.3); } 
    else if (type === 'boom') { osc.type = 'square'; osc.frequency.setValueAtTime(100, now); osc.frequency.exponentialRampToValueAtTime(40, now + 0.5); gainNode.gain.setValueAtTime(1, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5); osc.start(now); osc.stop(now + 0.5); } 
    else if (type === 'tick') { osc.type = 'triangle'; osc.frequency.setValueAtTime(1000, now); gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05); osc.start(now); osc.stop(now + 0.05); }
    else if (type === 'gun') { osc.type = 'square'; osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(20, now + 0.4); gainNode.gain.setValueAtTime(1, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4); osc.start(now); osc.stop(now + 0.4); }
}
document.addEventListener('click', initAudio, { once: true });
window.changeAmbience = () => { initAudio(); clearInterval(ambientInterval); const t = document.getElementById('ambience-select').value; if(t === 'heartbeat') ambientInterval = setInterval(() => playSound('boom'), 1200); else if (t === 'crickets') ambientInterval = setInterval(() => { if(Math.random() > 0.5 && audioCtx) { const osc = audioCtx.createOscillator(); osc.type = 'square'; osc.frequency.value = 3000 + Math.random()*2000; const gain = audioCtx.createGain(); gain.gain.value = 0.02; gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1); osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.1); } }, 150); }
function showToast(msg, type = 'success') { let container = document.getElementById('toast-container'); const t = document.createElement('div'); t.className = 'toast'; t.style.borderColor = type === 'error' ? '#ef4444' : 'var(--neon-blue)'; t.innerText = msg; container.appendChild(t); setTimeout(() => t.remove(), 3000); }
function flashScreen(type) { const overlay = document.getElementById('flash-overlay'); if(!overlay) return; overlay.style.backgroundColor = type === 'green' ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'; setTimeout(() => { overlay.style.backgroundColor = 'transparent'; }, 400); }
let isCampfire = false; window.toggleCampfire = () => { isCampfire = !isCampfire; const btn = document.getElementById('btn-campfire'); if(isCampfire) { document.body.classList.add('campfire-mode'); btn.innerText = "🔥 ปิดโหมดแคมป์"; btn.style.background = "#d97706"; } else { document.body.classList.remove('campfire-mode'); btn.innerText = "🏕️ โหมดแคมป์"; btn.style.background = "transparent"; } }
window.shareApp = () => { if (navigator.share) navigator.share({ title: 'วงนี้มีเกม 🎮', url: window.location.href }).catch(console.error); else { navigator.clipboard.writeText(window.location.href); showToast('✅ คัดลอกลิงก์เรียบร้อย!'); } }
window.togglePlayerList = () => { const list = document.getElementById('player-manage-section'); const icon = document.getElementById('player-toggle-icon'); if(list.style.display === 'none') { list.style.display = 'block'; icon.innerText = '▼'; } else { list.style.display = 'none'; icon.innerText = '▶'; } }
window.showPenaltyModal = () => { initAudio(); document.getElementById('penalty-modal').classList.remove('hidden'); document.getElementById('penalty-result').innerText = 'กดสุ่มเลย!'; }
window.splitTeams = () => { if(players.length < 2) { showToast("ต้องมีผู้เล่นอย่างน้อย 2 คน", "error"); return; } let shuffled = [...players].sort(() => 0.5 - Math.random()); let half = Math.ceil(shuffled.length / 2); document.getElementById('team-result').innerHTML = `<div style="margin-bottom:15px; background: rgba(239,68,68,0.2); border: 1px solid #ef4444; padding: 10px; border-radius: 8px;"><strong style="color:#ef4444; font-size:1.2rem;">🔴 ทีมแดง</strong><br><span style="color:white;">${shuffled.slice(0, half).map(p => p.name).join('<br>')}</span></div><div style="background: rgba(59,130,246,0.2); border: 1px solid #3b82f6; padding: 10px; border-radius: 8px;"><strong style="color:#3b82f6; font-size:1.2rem;">🔵 ทีมน้ำเงิน</strong><br><span style="color:white;">${shuffled.slice(half).map(p => p.name).join('<br>')}</span></div>`; document.getElementById('team-modal').classList.remove('hidden'); }
window.closeModals = () => { document.getElementById('penalty-modal').classList.add('hidden'); document.getElementById('team-modal').classList.add('hidden'); }
window.rollPenalty = () => { playSound('tick'); const el = document.getElementById('penalty-result'); el.innerText = 'กำลังสุ่ม...'; setTimeout(() => { playSound('boom'); el.innerText = penalties[Math.floor(Math.random() * penalties.length)]; }, 800); };

function saveState() { localStorage.setItem('partyPlayers', JSON.stringify(players)); localStorage.setItem('partyGamesCount', gamesPlayed.toString()); renderPlayers(); renderMiniHP(); }
window.addPlayer = () => { initAudio(); const input = document.getElementById('new-player-name'); const name = input.value.trim(); if (name && players.length < 15) { players.push({ id: Date.now(), name: `${emojis[Math.floor(Math.random() * emojis.length)]} ${name}`, hp: 3 }); input.value = ''; saveState(); } else if (players.length >= 15) { showToast('ผู้เล่นเต็มแล้ว!', 'error'); } }
window.removePlayer = (id) => { if(confirm('ต้องการลบผู้เล่นคนนี้?')) { players = players.filter(p => p.id !== id); saveState(); } }
window.updateHP = (id, change) => { let p = players.find(x => x.id === id); if(p) { p.hp += change; if(p.hp < 0) p.hp = 0; if(p.hp > 5) p.hp = 5; saveState(); } }
function renderPlayers() {
    const list = document.getElementById('player-list'); list.innerHTML = ''; document.getElementById('player-count').innerText = players.length;
    players.forEach((p) => { 
        const isZ = p.hp <= 0; const item = document.createElement('div'); item.className = `player-item ${isZ ? 'zombie' : ''}`; 
        item.innerHTML = `<div style="font-weight: 600; text-align: left; flex:1; font-size:0.9rem;">${p.name}<br><span style="font-size:0.75rem; color:var(--text-muted);">${isZ ? '🧟 ซอมบี้' : '❤️'.repeat(p.hp)}</span></div><div class="hp-controls"><button class="hp-btn" onclick="updateHP(${p.id}, -1)">-</button><button class="hp-btn" onclick="updateHP(${p.id}, 1)">+</button><button class="hp-btn" style="color: #ef4444; margin-left: 5px;" onclick="removePlayer(${p.id})">×</button></div>`; list.appendChild(item); 
    });
}
function renderMiniHP() {
    const bar = document.getElementById('mini-hp-bar'); bar.innerHTML = '';
    if(players.length === 0) { bar.innerHTML = `<span class="text-muted" style="padding-left:10px;">ยังไม่มีผู้เล่น...</span>`; return; }
    players.forEach(p => { const div = document.createElement('div'); div.className = `mini-hp-item ${p.hp <= 0 ? 'mini-hp-zombie' : ''}`; div.innerText = `${p.name} ${p.hp>0 ? '❤️'+p.hp : '🧟'}`; bar.appendChild(div); });
}

// ==========================================
// 3. Core Engine
// ==========================================
function renderGameGrid() { const grid = document.getElementById('game-grid'); grid.innerHTML = ''; gameList.forEach(game => { const card = document.createElement('div'); card.className = `game-card`; card.style.borderColor = `var(--neon-${game.color})`; card.innerHTML = `<div class="game-icon">${game.icon}</div><div style="font-weight: 600; font-size: 0.85rem;">${game.name}</div>`; card.onclick = () => openGame(game.id); grid.appendChild(card); }); }
window.randomGameSelect = () => { openGame(gameList[Math.floor(Math.random() * gameList.length)].id); }
let gameInterval, gameTimeout;

window.openGame = (gameId) => {
    initAudio(); 
    if(players.length < 2 && !['wheel', 'croc', 'tapbattle', 'draw', 'kingscup', 'touch', 'russian', 'hilow', 'duel'].includes(gameId)) { showToast("ต้องใช้ผู้เล่นอย่างน้อย 2 คน", "error"); return; }
    gamesPlayed++; saveState();
    const game = gameList.find(g => g.id === gameId); document.getElementById('game-title').innerText = `${game.icon} ${game.name}`;
    const content = document.getElementById('game-content'); content.innerHTML = ''; content.classList.remove('animate-entrance'); void content.offsetWidth; content.classList.add('animate-entrance');

    switch(gameId) {
        case 'touch': initTouchRoulette(content); break;
        case 'russian': initRussianRoulette(content); break;
        case 'duel': initReactionDuel(content); break;
        case 'hilow': initHiLow(content); break;
        case 'twotruths': initTwoTruths(content); break;
        case 'draw': initDrawGuess(content); break;
        case 'kingscup': initKingsCup(content); break;
        case 'wheel': initCustomWheel(content); break;
        case 'croc': initCroc(content); break;
        case 'textbomb': initTextBomb(content); break;
        case 'headsup': initHeadsUp(content); break;
        case 'tapbattle': initTapBattle(content); break;
        case 'spy': initSpy(content); break;
        case 'hotpotato': initHotPotato(content); break;
        case 'tod': initToD(content); break;
        case 'fivesec': initFiveSec(content); break;
        case 'guesswho': initGuessWho(content); break;
        case 'humsong': initHumSong(content); break;
    }
    document.getElementById('home-view').classList.add('hidden'); document.getElementById('game-view').classList.remove('hidden');
}

window.closeGame = () => { clearInterval(gameInterval); clearTimeout(gameTimeout); document.getElementById('touch-roulette-overlay').classList.add('hidden'); document.getElementById('game-view').classList.add('hidden'); document.getElementById('home-view').classList.remove('hidden'); }
function getRandomPlayer() { return players.length ? players[Math.floor(Math.random() * players.length)].name : "ไม่ระบุ"; }
function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ==========================================
// 4. Game Implementations (18 Games)
// ==========================================

// 1. Touch Roulette
let touchTimeout;
function initTouchRoulette(c) {
    c.innerHTML = `
        <div class="game-rules-box mb-3">👆 <strong>วิธีเล่น:</strong> ให้ทุกคนเอานิ้วแตะค้างไว้บนหน้าจอพร้อมกัน (สูงสุด 5 นิ้ว) รอจนกว่าระบบจะสุ่มเหลือนิ้วเดียว!</div>
        <div class="display-text text-gradient" style="font-size:2rem; margin-top:30px;">กดปุ่มด้านล่างเพื่อเริ่ม!</div>
        <button class="btn-neon-pink action-btn mt-4" style="max-width:300px; padding: 20px;" onclick="startTouchRoulette()">▶ เริ่มแตะนิ้ว</button>
    `;
}
window.startTouchRoulette = () => {
    playSound('tick'); const overlay = document.getElementById('touch-roulette-overlay'); overlay.classList.remove('hidden');
    overlay.innerHTML = '<div style="color:white; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:1.5rem; text-align:center; pointer-events:none;">แตะนิ้วค้างไว้ที่หน้าจอพร้อมกัน<br><span style="font-size:1rem; color:#aaa;">(แตะซ้ำเพื่อออก)</span></div>';
    let selecting = false; const colors = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#a855f7'];
    
    const handleTouch = (e) => {
        if(selecting) return; e.preventDefault(); overlay.innerHTML = '';
        if(e.touches.length === 0) { clearTimeout(touchTimeout); overlay.innerHTML = '<div style="color:white; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:1.5rem; pointer-events:none;">ยกเลิกแล้ว แตะใหม่เพื่อเริ่ม</div>'; return; }
        
        Array.from(e.touches).forEach((t, i) => {
            const div = document.createElement('div'); div.className = 'touch-circle';
            div.style.left = t.clientX + 'px'; div.style.top = t.clientY + 'px';
            div.style.color = colors[i % colors.length]; overlay.appendChild(div);
        });

        clearTimeout(touchTimeout);
        if(e.touches.length > 1) {
            touchTimeout = setTimeout(() => {
                selecting = true; playSound('tick');
                let circles = document.querySelectorAll('.touch-circle');
                let times = 0; let spin = setInterval(() => {
                    circles.forEach(c => c.style.opacity = '0.3');
                    circles[times % circles.length].style.opacity = '1';
                    playSound('tick'); times++;
                    if(times > 10) {
                        clearInterval(spin); playSound('boom'); flashScreen('red');
                        let winnerIdx = Math.floor(Math.random() * circles.length);
                        circles.forEach((c, idx) => { if(idx !== winnerIdx) c.style.display = 'none'; else { c.style.transform = 'translate(-50%, -50%) scale(2)'; c.style.boxShadow = '0 0 50px currentColor, inset 0 0 50px currentColor'; }});
                        setTimeout(() => { overlay.classList.add('hidden'); initTouchRoulette(document.getElementById('game-content')); }, 3000);
                    }
                }, 150);
            }, 2000);
        }
    };
    overlay.ontouchstart = handleTouch; overlay.ontouchmove = handleTouch; overlay.ontouchend = handleTouch; overlay.onclick = () => { if(!selecting) overlay.classList.add('hidden'); };
}

// 2. Russian Roulette
let cylinder = [];
function initRussianRoulette(c) {
    cylinder = [0,0,0,0,0,1].sort(() => 0.5 - Math.random());
    c.innerHTML = `
        <div class="game-rules-box mb-3">🔫 <strong>วิธีเล่น:</strong> ผลัดกันถือมือถือแล้วเหนี่ยวไก ในรังเพลิงมีกระสุน 1 นัด โดนใครเสีย HP!</div>
        <div class="display-text" style="font-size:1.5rem; color:var(--text-muted);">กระสุนที่เหลือ: <span id="rr-shots" style="color:var(--text-main);">6</span>/6</div>
        <div style="font-size: 5rem; margin: 20px 0;">🔫</div>
        <button class="btn-danger action-btn mb-4" style="max-width:250px; font-size:1.5rem; padding:20px;" onclick="pullTrigger()">💥 เหนี่ยวไก 💥</button>
        <button class="btn-neon-blue action-btn" style="max-width:200px;" onclick="initRussianRoulette(document.getElementById('game-content'))">🔄 สับลูกโม่ใหม่</button>
    `;
}
window.pullTrigger = () => {
    if(cylinder.length === 0) return showToast('กระสุนหมดแล้ว สับลูกโม่ใหม่เลย', 'error');
    const shot = cylinder.pop(); document.getElementById('rr-shots').innerText = cylinder.length;
    if(shot === 1) { playSound('gun'); flashScreen('red'); showToast('💥 ปัง!! คุณโดนยิง โดนหัก 1 HP!', 'error'); cylinder = []; } 
    else { playSound('tick'); showToast('แกร็ก... รอดตัว! ส่งต่อให้เพื่อนเลย'); }
}

// 3. Reaction Duel
let duelState = 'idle';
function initReactionDuel(c) {
    c.innerHTML = `
        <div class="game-rules-box mb-3" style="position:relative; z-index:100;">🤠 <strong>วิธีเล่น:</strong> วางมือถือตรงกลาง รอจนหน้าจอขึ้น "ยิง!!" ใครแตะฝั่งตัวเองไวกว่าชนะ (แตะก่อนฟาวล์)</div>
        <button class="btn-neon-purple action-btn mt-4" style="position:relative; z-index:100; max-width:250px;" onclick="startDuel()">▶ เริ่มดวล</button>
        <div id="duel-arena" class="hidden" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:50;">
            <div class="duel-zone duel-top" onpointerdown="duelTap('แดง')">รอ...</div>
            <div class="duel-zone duel-bottom" onpointerdown="duelTap('น้ำเงิน')">รอ...</div>
        </div>
    `;
}
window.startDuel = () => {
    document.getElementById('duel-arena').classList.remove('hidden'); duelState = 'waiting';
    document.querySelectorAll('.duel-zone').forEach(el => { el.innerText = "รอ..."; el.style.background = el.classList.contains('duel-top') ? '#ef4444' : '#3b82f6'; });
    const waitTime = Math.floor(Math.random() * 4000) + 2000; playSound('tick'); clearTimeout(gameTimeout);
    gameTimeout = setTimeout(() => { duelState = 'shoot'; playSound('correct'); flashScreen('green'); document.querySelectorAll('.duel-zone').forEach(el => { el.innerText = "ยิง!!"; el.style.background = '#10b981'; }); }, waitTime);
}
window.duelTap = (color) => {
    if(duelState === 'waiting') { clearTimeout(gameTimeout); duelState = 'ended'; playSound('wrong'); alert(`❌ ฟาวล์! ฝั่งสี${color} แตะก่อนสัญญาณ ถือว่าแพ้!`); initReactionDuel(document.getElementById('game-content')); } 
    else if (duelState === 'shoot') { duelState = 'ended'; playSound('gun'); flashScreen('red'); alert(`🔫 สี${color} ยิงไวกว่า ชนะดวล!!`); initReactionDuel(document.getElementById('game-content')); }
}

// 4. Hi Low
let hlDeck = [], curCard = null; const hlValues = {'A':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, 'J':11, 'Q':12, 'K':13};
function initHiLow(c) {
    hlDeck = []; ['♠', '♥', '♦', '♣'].forEach(s => Object.keys(hlValues).forEach(r => hlDeck.push({r, s, val: hlValues[r]}))); hlDeck = hlDeck.sort(() => 0.5 - Math.random()); curCard = hlDeck.pop();
    c.innerHTML = `
        <div class="game-rules-box mb-2">🃏 ทายว่าไพ่ใบต่อไปจะมีแต้ม <strong>สูงกว่า</strong> หรือ <strong>ต่ำกว่า</strong> ใบนี้!</div>
        <div class="card-container" style="margin: 10px auto;"><div class="playing-card flipped" id="hl-card"><div class="card-front ${curCard.s==='♥'||curCard.s==='♦'?'card-red':'card-black'}"><div class="card-rank">${curCard.r}</div><div class="card-suit">${curCard.s}</div></div></div></div>
        <div style="display:flex; gap:10px; width:100%; max-width:300px; margin-top:20px;">
            <button class="btn-danger action-btn" onclick="guessHiLow('lower')">🔽 ต่ำกว่า</button>
            <button class="btn-neon-green action-btn" onclick="guessHiLow('higher')" style="border-color:#10b981; color:#10b981;">🔼 สูงกว่า</button>
        </div>
    `;
}
window.guessHiLow = (guess) => {
    if(hlDeck.length === 0) return showToast("ไพ่หมดแล้ว", "error");
    const nextC = hlDeck.pop(); const cObj = document.getElementById('hl-card');
    cObj.innerHTML = `<div class="card-front ${nextC.s==='♥'||nextC.s==='♦'?'card-red':'card-black'}"><div class="card-rank">${nextC.r}</div><div class="card-suit">${nextC.s}</div></div>`;
    setTimeout(() => {
        if(nextC.val === curCard.val) { playSound('wrong'); showToast('แต้มเท่ากัน! ถือว่าแพ้ โดนทำโทษ!', 'error'); } 
        else if ((guess === 'higher' && nextC.val > curCard.val) || (guess === 'lower' && nextC.val < curCard.val)) { playSound('correct'); showToast('✅ ทายถูก! รอดตัว ส่งต่อให้คนถัดไป'); } 
        else { playSound('wrong'); flashScreen('red'); showToast('❌ ทายผิด! โดนทำโทษหัก HP เลย!', 'error'); }
        curCard = nextC;
    }, 300);
}

// 5. Two Truths 1 Lie
function initTwoTruths(c) {
    c.innerHTML = `
        <div class="game-rules-box mb-3">🤥 ผู้ถูกเลือกต้องเล่าเรื่องจริง 2 โกหก 1. เพื่อนมีเวลา 2 นาทีจับผิด ถ้าเพื่อนทายผิด เพื่อนโดนหัก HP เรียบ!</div>
        <div class="display-text" style="color:var(--neon-blue); font-size:1.5rem; margin-bottom:5px;">ผู้ถูกเลือกให้ตอแหล:</div>
        <div class="timer-text mb-4" style="font-size:3rem; color:var(--neon-pink);">${getRandomPlayer()}</div>
        <div id="2t1l-timer" class="timer-text mb-4 hidden" style="font-size: 4rem;">120</div>
        <button id="btn-2t1l-start" class="btn-neon-purple action-btn mt-4" style="max-width:250px;" onclick="startTwoTruths()">⏱️ เริ่มจับเวลาซักค้าน</button>
        <button class="btn-neon-blue mt-2 action-btn" style="max-width:200px;" onclick="initTwoTruths(document.getElementById('game-content'))">🔄 สุ่มคนใหม่</button>
    `;
}
window.startTwoTruths = () => {
    playSound('tick'); document.getElementById('btn-2t1l-start').style.display = 'none'; document.getElementById('2t1l-timer').classList.remove('hidden');
    let t = 120; clearInterval(gameInterval);
    gameInterval = setInterval(() => { t--; document.getElementById('2t1l-timer').innerText = t; if(t <= 0) { clearInterval(gameInterval); playSound('boom'); flashScreen('red'); document.getElementById('2t1l-timer').innerText = "หมดเวลาโหวต!"; } }, 1000);
}

// 6. Draw & Guess (Upgraded)
let drawCtx, isDrawing = false, curColor = '#111', drawRound = 1, drawMax = 3, drawImages = [], curDrawWord = "";
function initDrawGuess(c) {
    drawImages = []; drawRound = 1;
    c.innerHTML = `
        <div class="game-rules-box mb-3">🎨 <strong>โหมดส่งต่อ:</strong> คนแรกวาด -> ถัดไปดูรูป 3 วิแล้ววาดต่อ -> คนสุดท้ายทาย! เวลาจะลดลงเรื่อยๆ</div>
        <div id="draw-settings" class="glass-card p-3 mb-3" style="width:100%; max-width:400px; text-align:left;">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;"><label>จำนวนคนเล่น/รอบ:</label><input type="number" id="draw-max-p" value="3" style="width:60px; padding:5px;"></div>
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;"><label>เวลาคนแรก (วิ):</label><input type="number" id="draw-base-t" value="30" style="width:60px; padding:5px;"></div>
            <div style="display:flex; justify-content:space-between;"><label>ลดรอบละ (วิ):</label><input type="number" id="draw-red-t" value="5" style="width:60px; padding:5px;"></div>
        </div>
        <button id="start-draw-btn" class="btn-neon-pink action-btn" onclick="startDrawFlow()">▶ เริ่มเกมวาดรูป</button>
        <div id="draw-flow-area" class="hidden" style="width:100%; display:flex; flex-direction:column; align-items:center;">
            <h4 class="text-gradient">ส่งให้คนที่ <span id="draw-round-display">1</span></h4>
            <div id="draw-view-img" class="hidden mb-3"><img id="draw-prev-img" src="" style="width:100%; max-width:350px; background:white; border-radius:10px;"><p class="text-muted mt-2">จำรูปนี้ให้ดี! มีเวลา 3 วิ</p></div>
            <h1 id="draw-word" class="mb-2" style="color:var(--neon-pink); font-size:2rem;">???</h1>
            <div id="draw-timer" class="timer-text mb-2" style="font-size: 2.5rem;">30</div>
            <canvas id="canvas-container"></canvas>
            <div class="draw-tools" id="draw-toolbar">
                <button class="color-btn active" style="background:#111;" onclick="setDrawColor('#111', this)"></button>
                <button class="color-btn" style="background:#ef4444;" onclick="setDrawColor('#ef4444', this)"></button>
                <button class="color-btn" style="background:#3b82f6;" onclick="setDrawColor('#3b82f6', this)"></button>
                <button class="color-btn" style="background:#10b981;" onclick="setDrawColor('#10b981', this)"></button>
                <button class="btn-neon-purple" style="width:auto; padding:5px 10px; font-size:0.8rem;" onclick="setDrawColor('#fff', this)">🧼 ยางลบ</button>
                <button class="btn-danger" style="width:auto; padding:5px 10px; font-size:0.8rem;" onclick="clearCanvas()">🗑️ ล้าง</button>
            </div>
            <button id="draw-next-btn" class="btn-neon-blue action-btn mt-4" style="max-width:300px;" onclick="finishDrawTurn()">✅ วาดเสร็จแล้ว / ถัดไป</button>
        </div>
    `;
}
window.startDrawFlow = () => {
    drawMax = parseInt(document.getElementById('draw-max-p').value) || 3; curDrawWord = getRandom(drawWords);
    document.getElementById('draw-settings').style.display = 'none'; document.getElementById('start-draw-btn').style.display = 'none'; document.getElementById('draw-flow-area').classList.remove('hidden');
    const canvas = document.getElementById('canvas-container'); canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    drawCtx = canvas.getContext('2d'); drawCtx.lineCap = 'round'; drawCtx.lineJoin = 'round'; drawCtx.lineWidth = 4; curColor = '#111';
    
    const getPos = (e) => { const r = canvas.getBoundingClientRect(); const x = e.touches ? e.touches[0].clientX : e.clientX; const y = e.touches ? e.touches[0].clientY : e.clientY; return { x: x - r.left, y: y - r.top }; };
    const startDraw = (e) => { isDrawing = true; const pos = getPos(e); drawCtx.beginPath(); drawCtx.moveTo(pos.x, pos.y); e.preventDefault(); };
    const draw = (e) => { if(!isDrawing) return; const pos = getPos(e); drawCtx.strokeStyle = curColor; drawCtx.lineWidth = curColor === '#fff' ? 20 : 4; drawCtx.lineTo(pos.x, pos.y); drawCtx.stroke(); e.preventDefault(); };
    const stopDraw = () => { isDrawing = false; drawCtx.closePath(); };

    canvas.addEventListener('mousedown', startDraw); canvas.addEventListener('mousemove', draw); canvas.addEventListener('mouseup', stopDraw); canvas.addEventListener('mouseleave', stopDraw);
    canvas.addEventListener('touchstart', startDraw, {passive: false}); canvas.addEventListener('touchmove', draw, {passive: false}); canvas.addEventListener('touchend', stopDraw);
    prepDrawTurn();
}
function prepDrawTurn() {
    clearCanvas(); document.getElementById('draw-round-display').innerText = drawRound;
    if(drawRound > drawMax) { 
        document.getElementById('draw-flow-area').innerHTML = `<h2 class="text-gradient">คนสุดท้าย!</h2><p class="text-muted">ทายซิว่ารูปนี้คืออะไร?</p><img src="${drawImages[drawImages.length-1]}" style="width:100%; max-width:350px; background:white; border-radius:10px; margin:20px 0;"><h3 style="color:var(--neon-pink);">เฉลย: ${curDrawWord}</h3><button class="btn-neon-blue mt-4 action-btn" onclick="initDrawGuess(document.getElementById('game-content'))">🔄 เล่นใหม่</button>`; return; 
    }
    let base = parseInt(document.getElementById('draw-base-t').value) || 30; let red = parseInt(document.getElementById('draw-red-t').value) || 5;
    let t = base - ((drawRound - 1) * red); if(t < 5) t = 5;
    document.getElementById('draw-timer').innerText = t; document.getElementById('canvas-container').style.display = 'block'; document.getElementById('draw-toolbar').style.display = 'flex'; document.getElementById('draw-next-btn').style.display = 'flex';
    
    if(drawRound === 1) { document.getElementById('draw-word').innerText = `วาด: ${curDrawWord}`; startDrawTimer(t); } 
    else {
        document.getElementById('draw-word').innerText = "จำรูปเพื่อน!"; document.getElementById('canvas-container').style.display = 'none'; document.getElementById('draw-toolbar').style.display = 'none'; document.getElementById('draw-next-btn').style.display = 'none';
        const imgV = document.getElementById('draw-view-img'); imgV.classList.remove('hidden'); document.getElementById('draw-prev-img').src = drawImages[drawRound-2];
        playSound('tick'); setTimeout(() => { imgV.classList.add('hidden'); document.getElementById('draw-word').innerText = "วาดเลย!"; document.getElementById('canvas-container').style.display = 'block'; document.getElementById('draw-toolbar').style.display = 'flex'; document.getElementById('draw-next-btn').style.display = 'flex'; startDrawTimer(t); }, 3000);
    }
}
function startDrawTimer(t) { clearInterval(gameInterval); gameInterval = setInterval(() => { t--; document.getElementById('draw-timer').innerText = t; if(t <= 0) { clearInterval(gameInterval); playSound('boom'); finishDrawTurn(); } }, 1000); }
window.finishDrawTurn = () => { clearInterval(gameInterval); drawImages.push(document.getElementById('canvas-container').toDataURL()); drawRound++; prepDrawTurn(); }
window.setDrawColor = (c, btn) => { curColor = c; document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active')); if(btn.classList.contains('color-btn')) btn.classList.add('active'); }
window.clearCanvas = () => { if(drawCtx) drawCtx.clearRect(0, 0, 1000, 1000); }

// 7. Croc (Upgraded)
function initCroc(c) {
    c.innerHTML = `
        <div class="game-rules-box mb-3">🐊 ผลัดกันกดฟันจระเข้ทีละซี่ โดนงับ = หัก 1 HP!</div>
        <div id="croc-status" class="display-text text-gradient mb-2" style="font-size:1.2rem; min-height:40px;">เลืออกดฟันได้เลย!</div>
        <div class="croc-mouth-bg" style="position:relative; width:100%; max-width:350px; margin: 0 auto;">
            <div class="croc-jaw" id="croc-top-jaw"></div>
            <div style="height:40px; background:#111; margin:5px 0; border-radius:10px; box-shadow:0 0 10px #000;"></div>
            <div class="croc-jaw" id="croc-bottom-jaw"></div>
        </div>
        <button class="btn-neon-blue mt-4 action-btn" style="max-width:200px;" onclick="initCroc(document.getElementById('game-content'))">🔄 สุ่มใหม่</button>
    `;
    const top = document.getElementById('croc-top-jaw'); const bottom = document.getElementById('croc-bottom-jaw');
    const trap = Math.floor(Math.random() * 16) + 1;
    for(let i=1; i<=16; i++) {
        let btn = document.createElement('div'); btn.innerText = i;
        if(i <= 8) { btn.className = 'croc-tooth-top'; top.appendChild(btn); } else { btn.className = 'croc-tooth-bottom'; bottom.appendChild(btn); }
        btn.onclick = () => {
            if(btn.classList.contains('pressed')) return;
            if(i === trap) { playSound('boom'); flashScreen('red'); document.getElementById('croc-status').innerHTML = `<span style="color:red; font-size:1.5rem;">งับ!! โดนซี่ที่ ${i} (เสีย HP)</span>`; document.querySelectorAll('.croc-tooth-top, .croc-tooth-bottom').forEach(b => b.classList.add('pressed')); } 
            else { playSound('tick'); btn.classList.add('pressed'); document.getElementById('croc-status').innerHTML = `<span style="color:var(--neon-green);">รอดตัว! กดซี่ที่ ${i}</span>`; }
        };
    }
}

// 8. TextBomb
let tbTime = 0;
function initTextBomb(c) { c.innerHTML = `<div class="game-rules-box mb-3">💣 พิมพ์คำที่มีคำว่า... ประกอบอยู่ แล้วส่งต่อ (เวลาถูกซ่อนอยู่)</div><div id="tb-settings" class="custom-timer-box"><label>สุ่มเวลาสูงสุด (วิ):</label><input type="number" id="tb-max-t" value="30"></div><div id="tb-syl" class="timer-text mb-4" style="color:var(--neon-pink); font-size: 3rem; margin-top:20px;">...</div><input type="text" id="tb-input" placeholder="พิมพ์คำตอบ..." class="mb-4 text-center" style="font-size:1.2rem;" disabled><button id="tb-sub" class="btn-danger action-btn mb-4" onclick="submitTB()" disabled>ส่ง! 💣</button><button class="btn-neon-blue action-btn mt-2" id="tb-start" onclick="startTB()">▶ เริ่มเกม</button>`; }
window.startTB = () => { playSound('tick'); document.getElementById('tb-start').style.display = 'none'; document.getElementById('tb-settings').style.display = 'none'; document.getElementById('tb-input').disabled = false; document.getElementById('tb-sub').disabled = false; document.getElementById('tb-input').value = ''; document.getElementById('tb-syl').innerText = getRandom(textBombSyllables); let max = parseInt(document.getElementById('tb-max-t').value) || 30; tbTime = Math.floor(Math.random() * (max - 10)) + 10; clearInterval(gameInterval); gameInterval = setInterval(() => { tbTime--; if(tbTime <= 0) { clearInterval(gameInterval); playSound('boom'); flashScreen('red'); document.getElementById('tb-syl').innerText = "💥 ตู้มมม! 💥"; document.getElementById('tb-input').disabled = true; document.getElementById('tb-sub').disabled = true; document.getElementById('tb-start').style.display = 'flex'; document.getElementById('tb-settings').style.display = 'flex'; } }, 1000); }
window.submitTB = () => { let val = document.getElementById('tb-input').value.trim(); let syl = document.getElementById('tb-syl').innerText; if(val.includes(syl) && val.length > syl.length) { playSound('correct'); flashScreen('green'); document.getElementById('tb-input').value = ""; document.getElementById('tb-syl').innerText = getRandom(textBombSyllables); } else { playSound('wrong'); showToast('คำไม่ถูกต้อง!', 'error'); } }

// 9. Kings Cup
function initKingsCup(c) {
    let kcDeck = []; ['♠', '♥', '♦', '♣'].forEach(s => [{r:'A',n:'น้ำตก',d:'ทุกคนดื่มต่อกันห้ามหยุด!'},{r:'2',n:'คุณ',d:'สั่งให้ใครก็ได้ 1 คนดื่ม'},{r:'3',n:'ฉัน',d:'คนจั่วต้องดื่มเอง'},{r:'4',n:'พื้น',d:'เอามือแตะพื้น คนสุดท้ายดื่ม!'},{r:'5',n:'ผู้ชาย',d:'ผู้ชายทุกคนดื่ม'},{r:'6',n:'ผู้หญิง',d:'ผู้หญิงทุกคนดื่ม'},{r:'7',n:'สวรรค์',d:'ชูมือขึ้นฟ้า คนสุดท้ายดื่ม!'},{r:'8',n:'บัดดี้',d:'จับคู่ 1 คน คุณดื่มเขาต้องดื่มด้วย'},{r:'9',n:'คล้องจอง',d:'พูดคำคล้องจองวนไป ใครคิดไม่ออกดื่ม'},{r:'10',n:'หมวดหมู่',d:'ตั้งหมวดหมู่ ใครตอบซ้ำ/ไม่ได้ ดื่ม'},{r:'J',n:'ตั้งกฎ',d:'ตั้งกฎใหม่ 1 ข้อ ใครฝ่าฝืนดื่ม'},{r:'Q',n:'คำถาม',d:'คุณคือ Question Master ห้ามตอบคำถามคุณ ใครเผลอดื่ม'},{r:'K',n:'พระราชา',d:'เทเครื่องดื่มลงแก้วกลาง... ใครได้ K ใบที่ 4 ดื่มแก้วกลางให้หมด!'}].forEach(r => kcDeck.push({...r, suit: s}))); kcDeck = kcDeck.sort(() => 0.5 - Math.random()); let kings = 0;
    c.innerHTML = `<div class="game-rules-box mb-2">🃏 ผลัดกันจั่วไพ่แล้วทำตามกติกา! ระวัง K ใบที่ 4!</div><div style="font-size: 1rem; margin-bottom: 5px;">ไพ่เหลือ: <span id="deck-c" style="color:var(--neon-blue);">52</span> | 👑 King: <span id="king-c" style="color:gold;">0</span>/4</div><div class="card-container" id="kc-box"><div class="playing-card" id="kc-cobj"><div class="card-back"></div><div class="card-front hidden"><div class="card-rank" id="kc-r">A</div><div class="card-suit" id="kc-s">♠</div></div></div></div><div id="kc-r-box" class="glass-card p-3 hidden mt-3" style="width:100%; max-width:350px;"><h4 id="kc-rn" class="text-gradient mb-1">Rule</h4><p id="kc-rd" style="font-size: 0.95rem;"></p></div><button class="btn-neon-blue action-btn mt-3" onclick="initKingsCup(document.getElementById('game-content'))">🔄 สับไพ่ใหม่</button>`;
    document.getElementById('kc-box').onclick = () => { if(kcDeck.length===0) return; playSound('tick'); const cObj = document.getElementById('kc-cobj'); cObj.classList.remove('flipped'); setTimeout(()=>{ const card = kcDeck.pop(); document.getElementById('deck-c').innerText = kcDeck.length; const f = cObj.querySelector('.card-front'); f.className = `card-front ${card.suit==='♥'||card.suit==='♦'?'card-red':'card-black'}`; document.getElementById('kc-r').innerText = card.r; document.getElementById('kc-s').innerText = card.suit; document.getElementById('kc-rn').innerText = `ไพ่ ${card.r} : ${card.n}`; document.getElementById('kc-rd').innerText = card.d; if(card.r === 'K') { kings++; document.getElementById('king-c').innerText = kings; playSound('boom'); flashScreen('red'); if(kings===4) document.getElementById('kc-rd').innerHTML += `<br><br><strong style="color:red; font-size:1.2rem;">💥 ใบที่ 4! กินแก้วกลางให้หมด!! 💥</strong>`; } else playSound('correct'); cObj.classList.add('flipped'); document.getElementById('kc-r-box').classList.remove('hidden'); }, 300); };
}

// 10. Custom Wheel
function initCustomWheel(c) { c.innerHTML = `<div class="game-rules-box mb-2">🎡 พิมพ์ตัวเลือก (1 บรรทัดต่อ 1 ข้อ) แล้วหมุน!</div><textarea id="cw-input" rows="3" class="mb-2" style="font-size:0.9rem; max-width:300px;">กินหมูกระทะ\nกินชาบู\nนอนอยู่บ้าน\nคนซ้ายจ่าย</textarea><div style="position:relative; width:260px; margin:0 auto;"><div class="wheel-pointer"></div><div class="premium-wheel" id="cw-circle">เตรียมหมุน!</div></div><button class="btn-neon-purple mt-3 action-btn" style="max-width: 200px;" onclick="spinCW()">🎡 หมุนวงล้อ</button>`; }
window.spinCW = () => { let opts = document.getElementById('cw-input').value.split('\n').filter(x => x.trim() !== ''); if(opts.length < 2) return showToast("ใส่ตัวเลือกอย่างน้อย 2 ข้อ", "error"); playSound('tick'); const w = document.getElementById('cw-circle'); w.style.transform = `rotate(${Math.floor(Math.random() * 360) + 1440}deg)`; w.style.animation = 'none'; w.innerText = "กำลังหมุน..."; setTimeout(() => { playSound('correct'); w.innerText = getRandom(opts); w.style.transform = 'rotate(0deg)'; }, 4000); }

// 11. Spy
function initSpy(c) { c.innerHTML=`<div class="game-rules-box">🕵️‍♂️ หา Spy ในวง! (สถานที่ถูกเพิ่มเป็น 50+)</div><div id="spy-st" class="glass-card p-4" style="width:100%; min-height:150px;"></div>`; window.spL = getRandom(spyLocations); window.spI = Math.floor(Math.random()*players.length); window.spC = 0; rSpy(); }
function rSpy() { const st=document.getElementById('spy-st'); if(window.spC>=players.length){ playSound('boom'); st.innerHTML=`<h3 class="text-gradient">เริ่มจับผิด!</h3><button class="btn-danger mt-3 action-btn" onclick="this.innerHTML='Spy คือ: ${players[window.spI].name}'">เฉลย</button>`; return; } st.innerHTML=`<h4 class="mb-3">ส่งให้: ${players[window.spC]?players[window.spC].name:'ไม่ระบุ'}</h4><button class="btn-neon-purple action-btn" onclick="sSpy()">👀 ดูบทบาท</button>`; }
window.sSpy = () => { playSound('tick'); const r = (window.spC===window.spI)?"<span style='color:red; font-size:2rem;'>คุณคือ SPY</span>":`สถานที่:<br><span style="color:var(--neon-blue); font-size:1.5rem;">${window.spL}</span>`; document.getElementById('spy-st').innerHTML=`<div class="mb-4 text-center display-text">${r}</div><button class="btn-neon-blue action-btn" onclick="window.spC++; rSpy();">ซ่อน & ส่งต่อ ⏭️</button>`; }

// 12. Hot Potato
function initHotPotato(c) { c.innerHTML=`<div class="game-rules-box">💣 ตอบคำถามตามหมวดแล้วส่งต่อ ระเบิดตู้มใครแพ้!</div><h3 class="mb-4 text-gradient" id="hp-c">หมวด: ...</h3><div class="display-text timer-text" id="hp-s">💣</div><button class="btn-danger action-btn" onclick="stHP()" id="hp-b">▶ เริ่มเกม</button>`; }
window.stHP = () => { playSound('tick'); const s=document.getElementById('hp-s'); const b=document.getElementById('hp-b'); document.getElementById('hp-c').innerText=`หมวด: ${getRandom(gameData.categories)}`; s.innerText="ติ๊ก..."; b.disabled=true; clearTimeout(gameTimeout); gameTimeout=setTimeout(()=>{ playSound('boom'); flashScreen('red'); s.innerText="💥 BOOM! 💥"; s.style.color="red"; b.disabled=false; b.innerText="เล่นใหม่"; }, Math.floor(Math.random()*10000)+5000); }

// 13. Heads Up
function initHeadsUp(c) { c.innerHTML=`<div class="game-rules-box">📱 แนบหน้าผาก หงายจอ=ถูก, คว่ำจอ=ข้าม (เพิ่มคำ 50+)</div><div class="custom-timer-box"><input type="number" id="hu-t" value="60">วิ</div><button class="btn-neon-blue mb-2" onclick="startHU('animals')">🐶 สัตว์โลก</button><button class="btn-neon-pink" onclick="startHU('food')">🍔 ของกิน</button>`; }
window.startHU = (cat) => { let t=parseInt(document.getElementById('hu-t').value)||60; let wList=[...gameData.headsup[cat].words].sort(()=>0.5-Math.random()); let idx=0, sc=0, isH=true; let c=document.getElementById('game-content'); c.innerHTML=`<div style="display:flex; justify-content:space-between; width:100%;"><div class="text-muted">⏱️ <span id="hu-tmr">${t}</span></div><div class="text-muted">✅ <span id="hu-sc">0</span></div></div><div class="display-text glass-card p-4" id="hu-w" style="font-size:3rem; color:var(--neon-pink);">แนบเลย!</div><div style="display:flex; gap:10px; margin-top:20px;"><button class="btn-danger action-btn" onclick="if(isH){playSound('wrong'); flashScreen('red'); idx++; document.getElementById('hu-w').innerText=wList[idx];}">คว่ำจอ ข้าม</button><button class="btn-neon-purple action-btn" onclick="if(isH){playSound('correct'); flashScreen('green'); sc++; document.getElementById('hu-sc').innerText=sc; idx++; document.getElementById('hu-w').innerText=wList[idx];}">หงายจอ ถูก</button></div>`; setTimeout(()=>{ playSound('correct'); document.getElementById('hu-w').innerText=wList[idx]; clearInterval(gameInterval); gameInterval=setInterval(()=>{ t--; document.getElementById('hu-tmr').innerText=t; if(t<=0){ clearInterval(gameInterval); isH=false; playSound('boom'); c.innerHTML=`<h2>หมดเวลา! ทายถูก <span style="font-size:3rem;">${sc}</span> คำ 🎉</h2><button class="btn-neon-blue mt-4 action-btn" onclick="initHeadsUp(document.getElementById('game-content'))">เล่นใหม่</button>`; } }, 1000); }, 2000); }

// 14. Tap Battle
function initTapBattle(c) { c.innerHTML=`<div class="game-rules-box">⚡ แข่งกันรัวนิ้วฝั่งตัวเองให้ไวสุด!</div><div id="tb-tm" class="timer-text mb-2">10</div><div class="tap-container" style="display:flex; width:100%; height:150px; border-radius:20px; overflow:hidden;"><div id="a-r" style="flex-basis:50%; background:#ef4444;" onclick="tbR+=5; tbB-=5; document.getElementById('a-r').style.flexBasis=tbR+'%'; document.getElementById('a-b').style.flexBasis=tbB+'%';"></div><div id="a-b" style="flex-basis:50%; background:#3b82f6;" onclick="tbB+=5; tbR-=5; document.getElementById('a-r').style.flexBasis=tbR+'%'; document.getElementById('a-b').style.flexBasis=tbB+'%';"></div></div><button class="btn-neon-pink mt-4 action-btn" id="tb-btn" onclick="stTBat()">▶ เริ่ม</button>`; }
let tbR=50, tbB=50; window.stTBat=()=>{ document.getElementById('tb-btn').style.display='none'; tbR=50; tbB=50; let t=10; document.getElementById('a-r').style.flexBasis='50%'; document.getElementById('a-b').style.flexBasis='50%'; playSound('tick'); clearInterval(gameInterval); gameInterval=setInterval(()=>{ t--; document.getElementById('tb-tm').innerText=t; if(t<=0){ clearInterval(gameInterval); playSound('boom'); document.getElementById('tb-tm').innerHTML=`<span style="font-size:1.5rem; color:white;">${tbR>tbB?"❤️ แดงชนะ!":(tbB>tbR?"💙 น้ำเงินชนะ!":"เสมอ!")}</span>`; document.getElementById('tb-btn').style.display='flex'; document.getElementById('tb-btn').innerText='เล่นใหม่'; } }, 1000); }

// 15-18. Short Text Games
function initToD(c) { c.innerHTML=`<div class="game-rules-box">🎭 เลือกว่าจะ Truth หรือ Dare (คำถาม 100+)</div><div id="td-t" class="display-text" style="color:var(--neon-blue);"></div><div style="display:flex; gap:10px;"><button class="btn-neon-purple action-btn" onclick="rTD('truths')">Truth</button><button class="btn-neon-pink action-btn" onclick="rTD('dares')">Dare</button></div><div class="display-text glass-card p-4 mt-3" id="td-d">...</div>`; window.rTD = (t) => { playSound('tick'); document.getElementById('td-t').innerText=`ผู้ถูกเลือก: ${getRandomPlayer()}`; document.getElementById('td-d').innerText=getRandom(gameData.tod[t]); } }
function initFiveSec(c) { c.innerHTML=`<div class="game-rules-box">⏱️ ตอบ 3 ข้อใน 5 วิ! (คำถาม 50+)</div><div class="timer-text mb-4" id="fs-tm">5</div><div class="display-text glass-card p-4" id="fs-d">...</div><button class="btn-neon-pink mt-4 action-btn" id="fs-b" onclick="stFS()">▶ เริ่มจับเวลา</button>`; window.stFS = () => { playSound('correct'); const tm=document.getElementById('fs-tm'); const b=document.getElementById('fs-b'); document.getElementById('fs-d').innerText=`โจทย์: ${getRandom(gameData.fiveSec)}`; let t=5; tm.innerText=t; b.disabled=true; clearInterval(gameInterval); gameInterval=setInterval(()=>{ t--; tm.innerText=t; playSound('tick'); if(t<=0){ clearInterval(gameInterval); playSound('wrong'); flashScreen('red'); tm.innerText="หมดเวลา!"; b.disabled=false; b.innerText="เล่นใหม่"; } }, 1000); } }
function initGuessWho(c) { c.innerHTML=`<div class="game-rules-box">🤔 ทุกคนโหวตว่าคำใบ้หมายถึงใคร!</div><div class="display-text glass-card p-4" id="gw-d" style="color:var(--neon-purple);">...</div><button class="btn-neon-purple mt-4 action-btn" onclick="playSound('tick'); document.getElementById('gw-d').innerText=getRandom(gameData.guessWho)">🕵️ สุ่มคำใบ้</button>`; document.getElementById('gw-d').innerText=getRandom(gameData.guessWho); }
function initHumSong(c) { c.innerHTML=`<div class="game-rules-box">🎶 ฮัมเพลงให้เพื่อนทาย ห้ามร้องเนื้อ!</div><div id="hs-d" class="display-text glass-card p-4" style="color:var(--neon-blue);">กดสุ่ม</div><button class="btn-neon-pink mt-4 action-btn" onclick="playSound('tick'); document.getElementById('hs-d').innerText='🎵 '+getRandom(['ทรงอย่างแบด', 'วัดปะหล่ะ', 'เลือดกรุ๊ปบี', 'ซ่อนกลิ่น'])">▶ สุ่มเพลง</button>`; }

// ==========================================
// 5. End Party Summary
// ==========================================
window.endParty = () => {
    if(players.length === 0) { showToast('ยังไม่มีข้อมูลผู้เล่น', 'error'); return; }
    document.getElementById('home-view').classList.add('hidden'); document.getElementById('summary-view').classList.remove('hidden');
    let zombies = players.filter(p => p.hp <= 0); let alive = players.filter(p => p.hp > 0);
    
    let html = `<p style="text-align: center; margin-bottom: 20px;">เล่นไปทั้งหมด: <strong style="color: var(--neon-blue);">${gamesPlayed}</strong> เกม</p>`;
    if(zombies.length > 0) { html += `<div style="background:rgba(239,68,68,0.1); border:1px solid #ef4444; border-radius:12px; padding:15px; margin-bottom:20px;"><h3 style="color: #ef4444; margin-bottom: 10px; text-align:center;">🧟 ผู้แพ้ (HP หมด) ต้องโดนทำโทษหนัก!</h3>`; zombies.forEach((p) => { html += `<div style="text-align: center; color:#ef4444; font-size: 1.1rem; margin-bottom: 5px;">☠️ ${p.name}</div>`; }); html += `</div>`; }
    html += `<div style="background:rgba(16,185,129,0.1); border:1px solid #10b981; border-radius:12px; padding:15px;"><h3 style="color: var(--neon-green); margin-bottom: 10px; text-align:center;">🎉 ผู้รอดชีวิต 🎉</h3>`;
    if(alive.length > 0) { alive.forEach((p) => { html += `<div style="text-align: center; font-size: 1.1rem; margin-bottom: 5px;">💚 ${p.name} (HP: ${p.hp})</div>`; }); } else { html += `<div style="text-align: center; color: gray;">ตายเรียบทั้งวง...</div>`; } html += `</div>`;
    document.getElementById('summary-content').innerHTML = html;
}
window.copySummary = () => { let t = `🎉 สรุปผล "วงนี้มีเกม"\nเล่นไป ${gamesPlayed} เกม\n\n`; t += players.map(p => `${p.name} - HP: ${p.hp<=0?'ตาย(ซอมบี้)':p.hp}`).join('\n'); navigator.clipboard.writeText(t); showToast('✅ คัดลอกแล้ว!'); }
window.resetAll = () => { if(confirm('ล้างข้อมูลเริ่มใหม่ทั้งหมด?')) { players = []; gamesPlayed = 0; saveState(); document.getElementById('summary-view').classList.add('hidden'); document.getElementById('home-view').classList.remove('hidden'); } }

// Init
renderPlayers(); renderGameGrid(); renderMiniHP();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW fail:', err));
