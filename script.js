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
    playSound('tick'); document
