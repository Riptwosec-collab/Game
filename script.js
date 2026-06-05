// ==========================================
// 1. Data & State Management
// ==========================================
let players = JSON.parse(localStorage.getItem('partyPlayers')) || [];
let gamesPlayed = parseInt(localStorage.getItem('partyGamesCount')) || 0;
let customDeck = JSON.parse(localStorage.getItem('partyCustomDeck')) || { truths: [], dares: [], headsup: [] };

const emojis = ['🐶','🐱','🐼','🦊','🦁','🐷','🐸','🐵','🦄','👽','👾','👻','🤠','🤡','🤖'];

const penalties = [
    "ดื่ม 1 แก้ว 🍺", "เต้นเพลง TikTok 15 วิ 💃", "โพสต์รูปน่าเกลียดลง Story 📸", "จ่ายเข้ากองกลาง 20 บาท 💸", 
    "ให้เพื่อนทางขวาดีดมะกอก 1 ที 🤕", "ทำหน้าตลกให้เพื่อนถ่ายรูป 🤪", "ซิทอัพ 10 ครั้ง 💪", "พูดภาษาต่างดาว 1 นาที 👽", 
    "ห้ามพูด 5 นาที 🤐", "กินของที่เพื่อนผสมให้ 🤢", "วิดพื้น 10 ครั้ง", "โทรหาคนคุยเก่า", "ให้เพื่อนวาดรูปบนหน้า", 
    "ทำท่าเหมือนลิง", "ตะโกนบอกรักคนแรกที่เดินผ่าน", "ดื่มน้ำเปล่ารวดเดียวหมดแก้ว", "สารภาพความลับ 1 เรื่อง", 
    "ให้เพื่อนทางซ้ายตบแป้งใส่หน้า", "กระโดดตบ 20 ครั้ง", "ทำท่าสุนัขฉี่", "ร้องเพลงชาติด้วยเสียงเป็ด", 
    "เต้นเพลงไก่ย่างถูกเผา", "ให้เพื่อนเลือกสเตตัส Facebook ให้ 1 วัน", "ทักแชทไปบอกรักแฟนเก่า",
    "ดื่มน้ำผสมมะนาว (หรือของเปรี้ยว)", "เล่าเรื่องที่น่าอายที่สุดในชีวิต", "เดินถอยหลัง 1 นาที", "ถูกริบมือถือ 10 นาที",
    "ให้เพื่อนเขียนชื่อบนหน้าผากด้วยปากกา", "กินกระเทียมสด 1 กลีบ", "ทำท่าซอมบี้ 1 นาที", "ให้เพื่อนแคปหน้าจอแชทล่าสุดลงโซเชียล",
    "จ่ายค่าขนม/เครื่องดื่มให้คนทางขวา", "เต้นบัลเล่ต์รอบวง 1 รอบ", "ทำสมาธิ 2 นาทีห้ามขยับ", "พูด 'ขอโทษครับ' หลังประโยค 5 นาที",
    "ร้องไห้แบบไม่มีน้ำตาให้เนียนที่สุด", "ทำท่าเหมือนคนปวดท้องเข้าห้องน้ำ", "ทำท่าเซ็กซี่อ่อยคนทางซ้าย", "โทรหาแม่บอกว่าท้อง/ทำคนท้อง",
    "กินพริก 1 เม็ด", "อมน้ำเปล่าไว้ในปากห้ามกลืนจนกว่าจะวนถึงตาตัวเอง", "ให้คนทางขวาแต่งหน้าให้", "พูดเร็วๆ รัวๆ 1 นาที",
    "ทำท่าโยคะท่ายาก 30 วินาที", "เล่าเรื่องผี 1 เรื่อง", "พูดชื่อตัวเองแทนคำว่า 'ฉัน/ผม' ตลอด 10 นาที", "ส่งเซลฟี่น่าเกลียดลงกลุ่มแชท",
    "เป็นทาสรับใช้คนทางซ้าย 10 นาที", "บอกข้อเสียของตัวเอง 3 ข้อ", "บอกข้อดีของเพื่อนทุกคนในวง", "กระโดดขาเดียว 1 นาที",
    "เต้นลีลาศกับเสาหรือเก้าอี้", "ทำเสียงแมวร้องทุกครั้งที่เพื่อนเรียกชื่อ", "ให้เพื่อนค้นกระเป๋าตังค์ได้ 1 นาที", "บอกชื่อคนที่เคยแอบชอบ",
    "ห้ามเล่นมือถือจนกว่าจะจบงาน", "ให้เพื่อน 1 คนตีก้น 1 ที", "ทำท่าเหมือนแมงมุมคลาน", "จ่ายเข้ากองกลาง 50 บาท"
];

const humSongs = ["ทรงอย่างแบด", "ซ่อนกลิ่น", "คุ้กกี้เสี่ยงทาย", "เลือดกรุ๊ปบี", "รักติดไซเรน", "สลักจิต", "โต๊ะริม", "ถ้าเราเจอกันอีก", "วัดปะหล่ะ", "วาดไว้", "เพื่อนเล่น ไม่เล่นเพื่อน", "รำคาญกะบอกกันเด้อ", "เลิกคุยทั้งอำเภอ", "ช้ำคือเรา", "หมอกหรือควัน", "ผ้าเช็ดหน้า", "จี่หอย", "ผู้สาวขาเลาะ", "คิดแต่ไม่ถึง", "กอดเสาเถียง"];
const humSyllables = ["ฮัม", "อื้ม", "อ๋า", "งื้อ", "เมี้ยว", "ก้าบ", "ตู้ด", "ปี๊บ", "จิ๊บ", "โฮ่ง"];
const phonePhrases = ["ยายกินลำไยน้ำลายยายไหลย้อย", "เช้าฟาดผัดฟักเย็นฟาดฟักผัด", "ชามเขียวคว่ำเช้าชามขาวคว่ำค่ำ", "หมู หมึก กุ้ง หุง อุ่น ตุ๋น ต้ม นึ่ง", "ยักษ์ใหญ่ไล่ยักษ์เล็ก ยักษ์เล็กไล่ยักษ์ใหญ่", "กินมันติดเหงือกกินเผือกติดฟัน", "ลิงบนหลังคาปาขี้ใส่หมาหน้าปากซอย"];

// ฐานข้อมูลเกมหลัก (เติมคำเต็ม 100+)
const gameData = {
    tod: {
        truths: ["เคยแอบชอบคนในวงนี้ไหม?", "เรื่องที่น่าอายที่สุด?", "ความลับที่ยังไม่เคยบอกพ่อแม่?", "ถ้าให้สลับร่างกับคนในวงนี้ 1 วัน จะสลับกับใคร?", "แอปในมือถือที่เข้าบ่อยที่สุด?", "เคยโกหกเพื่อนในวงนี้เรื่องอะไร?", "ร้องไห้ครั้งล่าสุดเพราะอะไร?", "คนที่คิดว่าหน้าตาดีที่สุดในวง?", "เคยขโมยของไหม?", "สเปคที่แพ้ทางสุดๆ?", "เรื่องที่ภูมิใจที่สุด?", "เคยมีแฟนพร้อมกันกี่คน?", "ถ้าต้องทิ้งเพื่อน 1 คนในวงนี้ จะทิ้งใคร?", "สิ่งที่กลัวที่สุด?", "เคยแอบอ่านแชทแฟนไหม?", "ความฝันที่แปลกที่สุด?", "เคยแกล้งเพื่อนจนร้องไห้ไหม?", "เรื่องที่โดนด่าบ่อยสุด?", "เคยชอบแฟนเพื่อนไหม?", "สัตว์เลี้ยงที่อยากเลี้ยงที่สุด?", "ถ้าถูกหวย 30 ล้านจะทำอะไร?", "คนที่คุยด้วยแล้วสบายใจที่สุด?", "เคยลืมวันเกิดคนสำคัญไหม?", "เพลงที่ฟังเวลาอกหัก?", "เรื่องที่เสียใจที่สุด?", "เคยสอบตกไหม?", "วีรกรรมวัยเด็กที่แสบที่สุด?", "เคยทำของเพื่อนพังแล้วไม่บอกไหม?", "ความเชื่อแปลกๆ ที่เคยเชื่อ?", "เคยโดนเทแบบเจ็บปวดสุดยังไง?", "ของสะสมที่หวงที่สุด?", "เคยแกล้งป่วยเพื่อหยุดเรียน/งานไหม?", "เคยแอบชอบครูหรือหัวหน้าไหม?", "คำโกหกที่ใช้บ่อยสุด?", "เคยทำอาหารไหม้ไหม?", "เคยหลงทางในห้างไหม?", "เคยส่งข้อความผิดคนจนงานเข้าไหม?", "เคยแอบหลับในห้องน้ำไหม?", "เคยลืมรูดซิปกางเกงไหม?", "เคยใส่เสื้อกลับด้านออกจากบ้านไหม?", "เคยแอบกินขนมเพื่อนไหม?", "เคยตดในลิฟต์ไหม?", "เคยหัวเราะจนน้ำตาไหลตอนไหน?", "เคยร้องไห้ในที่สาธารณะไหม?", "เคยโดนสัตว์วิ่งไล่ไหม?", "เคยทำโทรศัพท์ตกน้ำไหม?", "เคยลืมพาสเวิร์ดตัวเองไหม?", "เคยแอบดูรหัสผ่านคนอื่นไหม?", "เคยสร้างบัญชีปลอมไหม?", "เคยซื้อของแพงแล้วเสียดายไหม?", "เคยตัดผมเองแล้วพังไหม?", "เคยกินของหมดอายุไหม?", "เคยลืมจ่ายเงินค่าข้าวไหม?", "เคยแอบหยิบเงินพ่อแม่ไหม?", "เคยโดนครูตีเพราะอะไร?"],
        dares: ["เต้นท่าที่คิดว่าเซ็กซี่ที่สุด 10 วิ", "ให้คนทางขวาใช้ลิปสติกวาดหน้า", "โทรหาเพื่อนที่ไม่ได้คุยนานแล้วบอกว่า 'คิดถึง'", "ซิทอัพ 10 ครั้งพร้อมตะโกนว่า 'ฉันแข็งแกร่ง!'", "พูดภาษาต่างดาวกับคนทางซ้าย 1 นาที", "ให้คนในวงเลือกเพลงให้ร้อง 1 ท่อน", "ทำท่าเหมือนสัตว์ที่เพื่อนโหวตให้", "ใบ้คำด้วยท่าทางห้ามส่งเสียงจนกว่าเพื่อนจะทายถูก", "ให้คนทางขวาพิมพ์สเตตัสเฟซบุ๊ก/ไอจีให้", "ดื่มน้ำ 1 แก้วรวดเดียว", "วิดพื้น 5 ครั้ง", "กระโดดตบ 20 ครั้ง", "เต้นเพลงไก่ย่าง", "ทำท่าเหมือนลิง", "ตะโกนคำว่า 'ฉันสวย/หล่อ' 3 ครั้ง", "เดินแบบเหมือนนางแบบ/นายแบบ", "ทำหน้าตลกให้เพื่อนถ่ายรูป", "ให้เพื่อนจี้เอว 10 วินาที", "ร้องเพลงชาติด้วยเสียงเด็ก", "ทำท่าเหมือนโดนยิง", "สโลว์โมชั่น 1 นาที", "พูดติดอ่าง 3 ประโยค", "ให้เพื่อนจัดทรงผมให้", "กินขนม/อาหารด้วยวิธีแปลกๆ", "เล่าเรื่องผี 1 เรื่อง", "ทำท่าเหมือนซอมบี้", "พูดชื่อคนในวงพร้อมบอกข้อดีของแต่ละคน", "ทำท่าเหมือนกำลังขับรถบัส", "ร้องเพลงด้วยการทำเสียงพ่นน้ำลาย", "ทำหน้าเศร้าที่สุด", "ทำหน้าโกรธที่สุด", "ทำหน้าตกใจที่สุด", "เต้นเพลงเกาหลี 1 ท่อน", "ร้องเพลงลูกทุ่ง", "ทำเสียงสัตว์ 3 ชนิด", "ใบ้คำ 1 คำให้เพื่อนทาย", "วาดรูปเพื่อนในวง 1 คน", "ทำท่าเหมือนกำลังยกน้ำหนัก", "ทำท่าเหมือนกำลังว่ายน้ำ", "ทำท่าเหมือนกำลังบิน", "เต้นแบบไม่มีเพลง 30 วินาที", "ให้เพื่อนแต่งหน้าให้ด้วยตาปิด", "โทรหาเบอร์สุ่มแล้วร้องเพลงให้ฟัง", "ออกไปตะโกนหน้าบ้านว่า 'ฉันรักทุกคน'", "ทำท่าโยคะท่ายาก 1 ท่า", "เดินถอยหลัง 1 นาที", "พูดประโยคเดิมซ้ำๆ 5 ครั้งด้วยอารมณ์ต่างกัน", "ให้เพื่อนป้อนน้ำ", "กินมะนาว 1 ซีก (ถ้ามี)", "ทำท่าเหมือนเป็นหุ่นยนต์"]
    },
    neverHaveIEver: ["ฉันไม่เคย โดนเท", "ฉันไม่เคย แอบหลับในห้องเรียน", "ฉันไม่เคย ลืมวันเกิดแฟน", "ฉันไม่เคย ตกหลุมรักคนในเน็ต", "ฉันไม่เคย โกหกเรื่องอายุ", "ฉันไม่เคย ขโมยเงินแม่", "ฉันไม่เคย สอบตก", "ฉันไม่เคย หนีเรียน", "ฉันไม่เคย ทะเลาะกับเพื่อนสนิท", "ฉันไม่เคย ร้องไห้ในโรงหนัง", "ฉันไม่เคย ทำมือถือตกน้ำ", "ฉันไม่เคย โดนหมาไล่กัด", "ฉันไม่เคย ขี่มอเตอร์ไซค์ล้ม", "ฉันไม่เคย กินของตกพื้น", "ฉันไม่เคย ลืมรูดซิป", "ฉันไม่เคย ใส่เสื้อกลับด้าน", "ฉันไม่เคย ส่งแชทผิดกลุ่ม", "ฉันไม่เคย นินทาเพื่อน", "ฉันไม่เคย แอบชอบแฟนเพื่อน", "ฉันไม่เคย โกหกครู", "ฉันไม่เคย แอบจดโพยเข้าห้องสอบ", "ฉันไม่เคย โดนทำโทษหน้าเสาธง", "ฉันไม่เคย ลืมเอาการบ้านมา", "ฉันไม่เคย หลับบนรถเมล์จนเลยป้าย", "ฉันไม่เคย ทำกระเป๋าตังค์หาย", "ฉันไม่เคย กุญแจรถหาย", "ฉันไม่เคย ลืมล็อคบ้าน", "ฉันไม่เคย แอบกินของในตู้เย็นตอนดึก", "ฉันไม่เคย ดูซีรีส์โต้รุ่ง", "ฉันไม่เคย ไม่อาบน้ำ 3 วัน", "ฉันไม่เคย หมักผ้าไว้เป็นเดือน", "ฉันไม่เคย ใส่ถุงเท้าซ้ำ", "ฉันไม่เคย ลืมแปรงฟันก่อนนอน", "ฉันไม่เคย แค่ขี้มูกในที่สาธารณะ", "ฉันไม่เคย ตดในลิฟต์", "ฉันไม่เคย ทักคนผิด", "ฉันไม่เคย เดินชนกระจก", "ฉันไม่เคย สะดุดล้มต่อหน้าคนเยอะๆ", "ฉันไม่เคย ลืมชื่อคนรู้จัก", "ฉันไม่เคย ทำอาหารไหม้"],
    mostLikely: ["ใครมีโอกาสรวยเป็นเศรษฐีที่สุด?", "ใครมีโอกาสแต่งงานคนแรก?", "ใครมีโอกาสหลงทางในห้างที่สุด?", "ใครมีโอกาสถูกหลอกโอนเงินมากที่สุด?", "ใครมีโอกาสเป็นดารา/อินฟลูเอนเซอร์ที่สุด?", "ใครมีโอกาสเมาแล้วเรื้อนที่สุด?", "ใครมีโอกาสกินจุที่สุดแต่น้ำหนักไม่ขึ้น?", "ใครมีโอกาสที่จะนอนตื่นสายในวันสำคัญ?", "ใครมีโอกาสจะอายุยืนที่สุด?", "ใครมีโอกาสบวชตลอดชีวิต?", "ใครมีโอกาสไปอยู่ต่างประเทศถาวร?", "ใครมีโอกาสโดนไล่ออกจากงาน?", "ใครมีโอกาสถูกหวยรางวัลที่ 1?", "ใครมีโอกาสเป็นหนี้บัตรเครดิต?", "ใครมีโอกาสทำของมีค่าหาย?", "ใครมีโอกาสขับรถชนบ่อยสุด?", "ใครมีโอกาสแต่งงานช้าสุด?", "ใครมีโอกาสมีลูกเยอะสุด?", "ใครมีโอกาสเป็นประธานบริษัท?", "ใครมีโอกาสเป็นอาชญากร?", "ใครมีโอกาสเป็นสายลับ?", "ใครมีโอกาสรอดชีวิตจากซอมบี้?", "ใครมีโอกาสติดเกาะร้าง?", "ใครมีโอกาสโดนมนุษย์ต่างดาวลักพาตัว?", "ใครมีโอกาสเห็นผีมากที่สุด?", "ใครมีโอกาสเป็นหมอดู?", "ใครมีโอกาสเป็นนักบวช?", "ใครมีโอกาสเป็นนักแข่งรถ?", "ใครมีโอกาสเป็นนักร้องนำ?", "ใครมีโอกาสเป็นผู้กำกับ?", "ใครมีโอกาสเป็นเชฟมิชลิน?", "ใครมีโอกาสเป็นนักวิจารณ์อาหาร?", "ใครมีโอกาสเป็นแฟชั่นไอคอน?", "ใครมีโอกาสใส่เสื้อผ้าซ้ำกันบ่อยสุด?", "ใครมีโอกาสไม่อาบน้ำหลายวันสุด?", "ใครมีโอกาสตดในลิฟต์แล้วทำเนียน?", "ใครมีโอกาสขโมยขนมเพื่อนกิน?", "ใครมีโอกาสแอบหลับในที่ประชุม?", "ใครมีโอกาสมาสายในวันนัดสำคัญ?", "ใครมีโอกาสลืมวันเกิดเพื่อนสนิท?"],
    wheelOptions: ["คนซ้ายมือ โดน! 👈", "คนขวามือ โดน! 👉", "คนตรงข้าม รับจบ! 🫵", "ประกบข้าง! 🥪", "ทำตัวเองแท้ๆ 🎯", "ทุกคนในวงโดน! 🌪️", "จ่ายเข้ากองกลาง 10 บาท! 💸", "รอดตัว! แถมสั่งเพื่อนได้ 1 คน 🎉", "ซวยจัด! โดนทำโทษ x2 😱", "สลับที่นั่งกับคนตรงข้าม! 🔄", "ใครใส่เสื้อสีดำ โดน! 🖤", "ใครใส่แว่นตา โดน! 👓", "ใครแบตมือถือเหลือน้อยสุด โดน! 🔋", "ใครอายุมากสุด รับไปเลยพี่ใหญ่! 👴", "ใครอายุน้อยสุด โดน! 👶", "ใครมาถึงงานสายสุด โดน! ⏰", "คนเกิดเดือนนี้ โดน! 🎂", "รอดตัว! สั่งเพื่อน 2 คนให้โดนทำโทษ 😈", "สลับที่นั่งกับคนทางซ้าย 🔄", "สั่งใครก็ได้ลุกขึ้นเต้น 10 วิ 🕺", "ได้เกราะป้องกัน 1 ครั้ง 🛡️", "เป่ายิ้งฉุบกับคนตรงข้าม ใครแพ้โดน! ✌️", "ร้องเพลงท่อนฮุค 1 เพลง ไม่งั้นโดน! 🎤", "โดนยึดมือถือ 5 นาที 📵", "ห้ามพูดคำว่า 'ไม่' 5 นาที 🤐", "ใครถือมือถืออยู่ โดน! 📱", "ใครเพิ่งไปห้องน้ำล่าสุด โดน! 🚽", "ใครใช้ iPhone โดน! 🍎", "ใครใช้ Android โดน! 🤖", "ดื่มน้ำเปล่ารวดเดียวครึ่งแก้ว! 🚰"],
    categories: ["ชื่อผลไม้", "จังหวัดในไทย", "ยี่ห้อรถยนต์", "เมนูอาหารไทย", "ชื่อหนังฮีโร่", "ชื่อเพลงฮิต", "อุปกรณ์แคมป์ปิ้ง", "คำสั่งโปรแกรมมิ่ง", "ชื่อทีมฟุตบอล", "สัตว์ 4 ขา", "สีต่างๆ", "ประเทศในเอเชีย", "ยี่ห้อมือถือ", "ชื่อดอกไม้", "อวัยวะในร่างกาย", "อุปกรณ์เครื่องเขียน", "กีฬาต่างๆ", "ยี่ห้อขนม", "ชื่อดาราไทย", "อาชีพ", "ชื่อปลา", "ชื่อนก", "สถานที่ท่องเที่ยว", "ชื่อวัด", "ยี่ห้อเครื่องใช้ไฟฟ้า", "เครื่องดื่ม", "ของหวาน", "ของใช้ในห้องน้ำ", "เสื้อผ้าเครื่องแต่งกาย", "ยี่ห้อรองเท้า"],
    fiveSec: ["บอกชื่อเพื่อน 3 คน", "บอกเมนูไข่ 3 เมนู", "บอกชื่อแอป 3 แอป", "บอกคำหยาบ 3 คำ", "บอกสิ่งที่ต้องทำตอนเช้า 3 อย่าง", "บอกชื่อจังหวัด 3 จังหวัด", "บอกผลไม้สีแดง 3 ชนิด", "บอกสัตว์เลี้ยงลูกด้วยนม 3 ชนิด", "บอกยี่ห้อรถ 3 ยี่ห้อ", "บอกชื่อหนังผี 3 เรื่อง", "บอกข้อดีของตัวเอง 3 ข้อ", "บอกข้อเสียของตัวเอง 3 ข้อ", "บอกสีที่ชอบ 3 สี", "บอกประเทศที่อยากไป 3 ประเทศ", "บอกเมนูอาหารเช้า 3 เมนู", "บอกชื่อเพลงฮิต 3 เพลง", "บอกชื่อนักเตะ 3 คน", "บอกสถานที่เที่ยว 3 ที่", "บอกยี่ห้อเต็นท์ 3 ยี่ห้อ", "บอกชื่อหุ้น 3 ตัว"],
    guessWho: ["คนที่ตอบแชทนานที่สุด", "คนที่ชอบกินของแปลกๆ", "คนที่มักจะมาสายเสมอ", "คนที่ติ่งเกาหลี/อนิเมะหนักสุด", "คนที่รักสัตว์มากกว่าคน", "คนที่ใช้เงินเก่งที่สุด", "คนที่ขี้เหนียวที่สุด", "คนที่บ่นเก่งที่สุด", "คนที่หัวเราะเสียงดังที่สุด", "คนที่เงียบที่สุด", "คนที่ขี้เมาที่สุด", "คนที่คอแข็งที่สุด", "คนที่ชอบเซลฟี่ที่สุด", "คนที่แต่งตัวเก่งที่สุด", "คนที่ชอบอยู่ติดบ้านที่สุด", "คนที่ชอบเที่ยวที่สุด", "คนที่บ้างานที่สุด", "คนที่ขี้เกียจที่สุด", "คนที่เจ้าระเบียบที่สุด", "คนที่ซกมกที่สุด"],
    quiz: [
        {q: "อะไรเอ่ย สูงกว่าภูเขา แต่น้ำหนักเบาหวิว?", choices: ["ก้อนเมฆ", "เครื่องบิน", "อากาศ", "นก"], ans: 0},
        {q: "แมวอะไรอยู่ใต้ดิน?", choices: ["แมวขุด", "แมงมุม", "แมวเหมียว", "มันแกว"], ans: 3},
        {q: "สโมสรฟุตบอลใดได้แชมป์พรีเมียร์ลีกมากที่สุด?", choices: ["อาร์เซนอล", "ลิเวอร์พูล", "เชลซี", "แมนยูไนเต็ด"], ans: 3},
        {q: "React คืออะไร?", choices: ["Database", "JS Library", "OS", "Hardware"], ans: 1},
        {q: "Vercel มักใช้สำหรับทำอะไร?", choices: ["เขียนโค้ด", "ออกแบบ", "Deploy เว็บ", "เก็บ DB"], ans: 2},
        {q: "ประเทศใดมีประชากรมากที่สุดในโลก (อัปเดตใหม่)?", choices: ["จีน", "อินเดีย", "สหรัฐอเมริกา", "อินโดนีเซีย"], ans: 1},
        {q: "ดาวเคราะห์ดวงใดใหญ่ที่สุดในระบบสุริยะ?", choices: ["โลก", "ดาวอังคาร", "พฤหัสบดี", "ดาวเสาร์"], ans: 2},
        {q: "โลหะใดเป็นของเหลวที่อุณหภูมิห้อง?", choices: ["ทองคำ", "เงิน", "ปรอท", "ทองแดง"], ans: 2}
    ],
    secretMissions: ["ทำให้คนอื่นหัวเราะให้ได้ 1 คน", "เนียนจับมือคนข้างๆ 5 วินาที", "พูดคำว่า 'จริงๆ แล้ว' ทุกครั้งที่เริ่มประโยค 3 ครั้ง", "แกล้งทำของตกแล้วให้เพื่อนเก็บให้", "แอบชมคนขวามือ 1 ครั้ง", "ชวนคนซ้ายมือเซลฟี่", "ทำเป็นปวดหัวแล้วขอให้เพื่อนบีบนวด", "ขอยืมเงินเพื่อน 20 บาท", "ถามเวลาเพื่อน 3 ครั้ง", "เนียนกินน้ำ/ขนมของเพื่อน", "แอบหยิบมือถือเพื่อนมาซ่อน", "ทำเสียงจามดังๆ", "หาวเสียงดังๆ 2 ครั้ง", "แกล้งหลับ 1 นาที", "พูดชมตัวเอง 1 ครั้ง"],
    roasts: ["คนนี้คือคนที่บอกว่า 'ใกล้ถึงแล้ว' แต่ยังไม่ได้แต่งตัว", "หน้าตาเหมือนคนนอนเต็มอิ่ม แต่จริงๆ นอนเช้า", "คนนี้พิมพ์แชทเก่งมาก แต่ตัวจริงเงียบกริบ", "เป็นคนรักสุขภาพมาก... กินสลัดคลุกหมูกรอบ", "เพื่อนคนนี้คือ นิยามของคำว่า 'เงินเดือนหรือเงินทอน'", "หน้าตาดีนะ แต่แปลกที่ยังโสด... หรือว่านิสัย?", "ความจำดีเยี่ยม... เฉพาะเรื่องของชาวบ้าน", "คนนี้คือคนที่กินเท่าไหร่ก็ไม่อ้วน น่าหมั่นไส้!", "เพื่อนคนนี้ไว้ใจได้เสมอ... ยกเว้นเรื่องยืมเงิน", "คนนี้คือเดอะแบกของกลุ่ม... แบกความฮาและความกาว"],
    taboo: [
        { word: "หมูกระทะ", forbidden: ["ปิ้งย่าง", "หมูสามชั้น", "น้ำจิ้ม"] }, { word: "เราเตอร์ (Router)", forbidden: ["อินเทอร์เน็ต", "สัญญาณ", "ไฟกะพริบ"] },
        { word: "หุ้น", forbidden: ["ลงทุน", "ดอย", "ซื้อขาย"] }, { word: "เชียงใหม่", forbidden: ["ดอย", "ภาคเหนือ", "อากาศหนาว"] },
        { word: "แคมป์ปิ้ง", forbidden: ["เต็นท์", "ป่า", "นอน"] }, { word: "พรีเมียร์ลีก", forbidden: ["ฟุตบอล", "อังกฤษ", "เตะ"] },
        { word: "แมนยู", forbidden: ["ปีศาจแดง", "ผี", "โอลด์แทรฟฟอร์ด"] }, { word: "โปรแกรมเมอร์", forbidden: ["คอม", "โค้ด", "บั๊ก"] }
    ],
    spyLocations: ["โรงพยาบาล", "ค่ายทหาร", "ลานกางเต็นท์", "ดอยเชียงใหม่", "โอลด์แทรฟฟอร์ด", "ห้องเซิร์ฟเวอร์", "ร้านหมูกระทะ", "งานเทศกาลดนตรี", "สนามบิน", "สถานีตำรวจ", "โรงเรียน", "มหาวิทยาลัย", "ร้านกาแฟ", "ห้างสรรพสินค้า", "โรงหนัง", "สวนสัตว์", "พิพิธภัณฑ์", "ธนาคาร", "ร้านทำผม", "ยิม/ฟิตเนส"],
    lyrics: [
        { q: "ใกล้เกินกว่าที่จะพูดคำใดๆ ออกไป...", a: "มันใกล้เกินกว่าจะมองเห็นใคร" },
        { q: "แต่ถ้าวันนึงเธอไปเจอใคร...", a: "ที่เข้ากันได้ดีกว่า" },
        { q: "แค่รู้ว่าฉันไม่ได้อยู่คนเดียวบนโลกใบนี้...", a: "ก็พอแล้ว" },
        { q: "โปรดส่งใครมารักฉันที...", a: "อยู่อย่างนี้มันหนาวเกินไป" },
        { q: "อยากจะร้องไห้... อยากให้เวลาเดินช้าๆ...", a: "ขอเวลาสักหน่อย" },
        { q: "ทนได้ไหม ถ้ารักนี้ต้อง...", a: "มีน้ำตา" },
        { q: "รู้ไหมว่าฉันคิดถึง...", a: "คิดถึงเธอมากแค่ไหน" },
        { q: "เธอคือความฝัน ที่ฉัน...", a: "ตามหามาแสนนาน" }
    ],
    bidding: ["ชื่อหุ้น", "อุปกรณ์แคมป์ปิ้ง", "ทีมพรีเมียร์ลีก", "คำสั่ง CLI", "เมนูหมูกระทะ", "จังหวัดภาคอีสาน", "แอปมือถือ", "ภาษาโปรแกรมมิ่ง", "ซีรีส์ Netflix", "ยี่ห้อรถ", "ประเทศยุโรป", "ผลไม้", "สีต่างๆ", "อวัยวะ", "อาชีพ"],
    textBomb: ["ใจ", "รัก", "การ", "ความ", "ดอย", "แคมป์", "หุ้น", "เน็ต", "โค้ด", "กิน", "นอน", "เดิน", "วิ่ง", "นก", "ปลา", "แมว", "หมา", "น้ำ", "ไฟ", "ดิน", "ฟ้า", "ดาว", "เดือน", "ปี", "วัน", "เวลา", "บ้าน", "รถ", "ถนน", "เมือง"],
    headsup: {
        animals: { name: "🐶 สัตว์โลก", words: ["สิงโต", "ช้าง", "ยีราฟ", "แพนด้า", "ฉลาม", "นกฮูก", "สลอธ", "แมวน้ำ", "เพนกวิน", "จิงโจ้", "ฮิปโป", "ไดโนเสาร์", "จระเข้", "งูหลาม", "แมงมุม", "หมาป่า", "นกแก้ว", "ลิง", "โลมา", "เต่า"] },
        food: { name: "🍔 ของกิน", words: ["หมูกระทะ", "ชาบู", "ส้มตำ", "ข้าวมันไก่", "ผัดกะเพรา", "ชานมไข่มุก", "บิงซู", "พิซซ่า", "ซูชิ", "ต้มยำกุ้ง", "แซลมอนดอง", "ก๋วยเตี๋ยวเรือ", "ข้าวเหนียวมะม่วง", "หมูปิ้ง", "ยำแซลมอน", "หมาล่า", "ปาท่องโก๋", "โรตี", "ขนมจีน"] },
        jobs: { name: "👨‍⚕️ อาชีพ", words: ["หมอ", "พยาบาล", "ตำรวจ", "ทหาร", "โปรแกรมเมอร์", "ยูทูบเบอร์", "ดารา", "นักร้อง", "แม่ค้าออนไลน์", "วิศวกร", "ครู", "นักดับเพลิง", "นักบิน", "แอร์โฮสเตส", "เชฟ", "สถาปนิก", "นักข่าว", "ช่างภาพ", "ทนาย", "ช่างตัดผม"] }
    }
};

const gameList = [
    { id: 'humsong', name: 'ฮัมเพลงปริศนา', icon: '🎶', color: 'pink' },
    { id: 'telephone', name: 'โทรศัพท์กระซิบ', icon: '📱', color: 'blue' },
    { id: 'bill', name: 'รูเล็ตต์จ่ายบิล', icon: '💸', color: 'purple' },
    { id: 'lyrics', name: 'ทายเนื้อเพลง', icon: '🎤', color: 'pink' },
    { id: 'bidding', name: 'ประมูลคำ', icon: '📈', color: 'blue' },
    { id: 'oneword', name: 'เรื่องเล่ากองไฟ', icon: '🏕️', color: 'purple' },
    { id: 'textbomb', name: 'พิมพ์ทะลุนรก', icon: '💣', color: 'pink' },
    { id: 'headsup', name: 'ทายคำบนหัว', icon: '📱', color: 'blue' },
    { id: 'croc', name: 'จระเข้งับนิ้ว', icon: '🐊', color: 'purple' },
    { id: 'spy', name: 'สปายจับผิด', icon: '🕵️‍♂️', color: 'pink' },
    { id: 'taboo', name: 'ใบ้คำห้ามพูด', icon: '🤫', color: 'blue' },
    { id: 'tapbattle', name: 'ศึกจิ้มไว', icon: '⚡', color: 'purple' },
    { id: 'wheel', name: 'Spin the Wheel', icon: '🎡', color: 'pink' },
    { id: 'hotpotato', name: 'Hot Potato', icon: '💣', color: 'blue' },
    { id: 'tod', name: 'Truth or Dare', icon: '🎭', color: 'purple' },
    { id: 'nhie', name: 'Never Have I Ever', icon: '🙅‍♂️', color: 'pink' },
    { id: 'mostlikely', name: 'Most Likely To', icon: '👉', color: 'blue' },
    { id: 'fivesec', name: '5 Sec Challenge', icon: '⏱️', color: 'purple' },
    { id: 'guesswho', name: 'Guess Who', icon: '🤔', color: 'pink' },
    { id: 'quiz', name: 'Quiz Battle', icon: '🧠', color: 'blue' },
    { id: 'secret', name: 'Secret Mission', icon: '💌', color: 'purple' },
    { id: 'roast', name: 'AI Roast Friend', icon: '🔥', color: 'pink' }
];

// ==========================================
// 2. Audio & Ambience
// ==========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let ambientInterval = null;
function initAudio() { if(!audioCtx) { audioCtx = new AudioContext(); } if(audioCtx.state === 'suspended') { audioCtx.resume(); } }
function playSound(type) {
    if(!audioCtx) return;
    const osc = audioCtx.createOscillator(); const gainNode = audioCtx.createGain();
    osc.connect(gainNode); gainNode.connect(audioCtx.destination); const now = audioCtx.currentTime;
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
        osc.type = 'triangle'; osc.frequency.setValueAtTime(1000, now); gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now); osc.stop(now + 0.05);
    }
}
document.addEventListener('click', initAudio, { once: true });
window.changeAmbience = () => {
    initAudio(); clearInterval(ambientInterval); const type = document.getElementById('ambience-select').value;
    if(type === 'heartbeat') { ambientInterval = setInterval(() => { playSound('boom'); }, 1200); } 
    else if (type === 'crickets') { ambientInterval = setInterval(() => { if(Math.random() > 0.5 && audioCtx) { const osc = audioCtx.createOscillator(); osc.type = 'square'; osc.frequency.value = 3000 + Math.random()*2000; const gain = audioCtx.createGain(); gain.gain.value = 0.02; gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1); osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.1); } }, 150); }
}

// ==========================================
// 3. UI Helpers & Features
// ==========================================
function saveState() { localStorage.setItem('partyPlayers', JSON.stringify(players)); localStorage.setItem('partyGamesCount', gamesPlayed.toString()); renderPlayers(); }
function showToast(msg, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) { container = document.createElement('div'); container.id = 'toast-container'; document.body.appendChild(container); }
    const t = document.createElement('div'); t.className = 'toast'; t.style.borderColor = type === 'error' ? '#ef4444' : 'var(--neon-blue)';
    t.innerText = msg; container.appendChild(t); setTimeout(() => t.remove(), 3000);
}
let isCampfire = false;
window.toggleCampfire = () => {
    isCampfire = !isCampfire; const btn = document.getElementById('btn-campfire');
    if(isCampfire) { document.body.classList.add('campfire-mode'); btn.innerText = "🔥 ปิดโหมดแคมป์"; btn.style.background = "#d97706"; showToast("เปิดโหมดประหยัดแบตเตอรี่แล้ว"); } 
    else { document.body.classList.remove('campfire-mode'); btn.innerText = "🏕️ โหมดแคมป์"; btn.style.background = "#222"; showToast("กลับสู่โหมดปกติ"); }
}
window.shareApp = () => { if (navigator.share) { navigator.share({ title: 'วงนี้มีเกม 🎮', text: 'มาเล่นเกมปาร์ตี้สนุกๆ ด้วยกันเถอะ!', url: window.location.href }).catch(console.error); } else { navigator.clipboard.writeText(window.location.href); showToast('✅ คัดลอกลิงก์เรียบร้อย ส่งให้เพื่อนได้เลย!'); } }
window.splitTeams = () => {
    if(players.length < 2) { showToast("ต้องมีผู้เล่นอย่างน้อย 2 คน", "error"); return; }
    let shuffled = [...players].sort(() => 0.5 - Math.random()); let half = Math.ceil(shuffled.length / 2);
    document.getElementById('team-result').innerHTML = `<div style="margin-bottom:15px; background: rgba(239,68,68,0.2); border: 1px solid #ef4444; padding: 10px; border-radius: 8px;"><strong style="color:#ef4444; font-size:1.2rem;">🔴 ทีมแดง (Team A)</strong><br><span style="color:white;">${shuffled.slice(0, half).map(p => p.name).join('<br>')}</span></div><div style="background: rgba(59,130,246,0.2); border: 1px solid #3b82f6; padding: 10px; border-radius: 8px;"><strong style="color:#3b82f6; font-size:1.2rem;">🔵 ทีมน้ำเงิน (Team B)</strong><br><span style="color:white;">${shuffled.slice(half).map(p => p.name).join('<br>')}</span></div>`;
    document.getElementById('team-modal').classList.remove('hidden');
}
window.showPenaltyModal = () => { initAudio(); document.getElementById('penalty-modal').classList.remove('hidden'); document.getElementById('penalty-result').innerText = 'กดสุ่มเลย!'; }
window.showCustomModal = () => { document.getElementById('custom-modal').classList.remove('hidden'); }
window.closeModals = () => { document.getElementById('penalty-modal').classList.add('hidden'); document.getElementById('custom-modal').classList.add('hidden'); document.getElementById('team-modal').classList.add('hidden'); }
window.rollPenalty = () => { playSound('tick'); const el = document.getElementById('penalty-result'); el.innerText = 'กำลังสุ่ม...'; setTimeout(() => { playSound('boom'); el.innerText = getRandom(penalties); }, 800); };
window.saveCustomData = () => {
    const cat = document.getElementById('custom-category').value; const val = document.getElementById('custom-input').value.trim();
    if(val) { if(cat === 'tod-truth') customDeck.truths.push(val); else if(cat === 'tod-dare') customDeck.dares.push(val); else if(cat === 'headsup') customDeck.headsup.push(val); localStorage.setItem('partyCustomDeck', JSON.stringify(customDeck)); showToast('✅ บันทึกคำถามของวงคุณเรียบร้อยแล้ว!'); document.getElementById('custom-input').value = ''; } else { showToast('กรุณาพิมพ์ข้อความก่อนบันทึก', 'error'); }
};
function flashScreen(type) { const overlay = document.getElementById('flash-overlay'); if(!overlay) return; overlay.style.backgroundColor = type === 'green' ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'; setTimeout(() => { overlay.style.backgroundColor = 'transparent'; }, 400); }
function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getRandomPlayer() { return getRandom(players).name; }

// ==========================================
// 4. Core System & Navigation
// ==========================================
window.addPlayer = () => {
    initAudio(); const input = document.getElementById('new-player-name'); const name = input.value.trim();
    if (name && players.length < 15) { players.push({ id: Date.now(), name: `${emojis[Math.floor(Math.random() * emojis.length)]} ${name}` }); input.value = ''; saveState(); } 
    else if (players.length >= 15) { showToast('ผู้เล่นเต็มแล้ว! (สูงสุด 15 คน)', 'error'); }
}
window.removePlayer = (id) => { if(confirm('ต้องการลบผู้เล่นคนนี้?')) { players = players.filter(p => p.id !== id); saveState(); } }
function renderPlayers() {
    const list = document.getElementById('player-list'); list.innerHTML = '';
    players.forEach((p) => { const item = document.createElement('div'); item.className = 'player-item'; item.innerHTML = `<div style="font-weight: 600;">${p.name}</div><div class="score-controls"><button class="score-btn" style="color: #ef4444;" onclick="removePlayer(${p.id})">×</button></div>`; list.appendChild(item); });
    if(players.length === 0) list.innerHTML = '<p class="text-muted" style="text-align:center; padding: 20px 0;">ยังไม่มีผู้เล่น เพิ่มชื่อด้านบนเลย!</p>';
}

function renderGameGrid() {
    const grid = document.getElementById('game-grid'); grid.innerHTML = '';
    gameList.forEach(game => { const card = document.createElement('div'); card.className = `game-card`; card.style.borderColor = `var(--neon-${game.color})`; card.innerHTML = `<div class="game-icon">${game.icon}</div><div style="font-weight: 600; font-size: 0.95rem;">${game.name}</div>`; card.onclick = () => openGame(game.id); grid.appendChild(card); });
}

window.randomGameSelect = () => { openGame(gameList[Math.floor(Math.random() * gameList.length)].id); }

let gameInterval, gameTimeout;
window.openGame = (gameId) => {
    initAudio();
    if(players.length < 2 && !['wheel', 'croc', 'tapbattle', 'bill', 'humsong', 'lyrics'].includes(gameId)) { showToast("เกมนี้ต้องใช้ผู้เล่นอย่างน้อย 2 คน กรุณาเพิ่มผู้เล่นก่อนครับ", "error"); return; }
    gamesPlayed++; saveState();
    const game = gameList.find(g => g.id === gameId); document.getElementById('game-title').innerText = `${game.icon} ${game.name}`;
    const content = document.getElementById('game-content'); content.innerHTML = ''; content.classList.remove('animate-entrance'); void content.offsetWidth; content.classList.add('animate-entrance');

    switch(gameId) {
        case 'humsong': initHumSong(content); break; case 'telephone': initTelephone(content); break; case 'bill': initBill(content); break;
        case 'lyrics': initLyrics(content); break; case 'bidding': initBidding(content); break; case 'oneword': initOneWord(content); break;
        case 'textbomb': initTextBomb(content); break; case 'headsup': initHeadsUp(content); break; case 'croc': initCroc(content); break;
        case 'spy': initSpy(content); break; case 'taboo': initTaboo(content); break; case 'tapbattle': initTapBattle(content); break;
        case 'wheel': initWheel(content); break; case 'hotpotato': initHotPotato(content); break; case 'tod': initToD(content); break;
        case 'nhie': initNHIE(content); break; case 'mostlikely': initMostLikely(content); break; case 'fivesec': initFiveSec(content); break;
        case 'guesswho': initGuessWho(content); break; case 'quiz': initQuiz(content); break; case 'secret': initSecret(content); break;
        case 'roast': initRoast(content); break;
    }
    document.getElementById('home-view').classList.add('hidden'); document.getElementById('game-view').classList.remove('hidden');
}

window.closeGame = () => {
    clearInterval(gameInterval); clearTimeout(gameTimeout);
    if(typeof handleHeadsUpTilt !== 'undefined') window.removeEventListener('deviceorientation', handleHeadsUpTilt);
    document.getElementById('game-view').classList.add('hidden'); document.getElementById('home-view').classList.remove('hidden');
}

// ==========================================
// 5. Game Implementations (All 22 Games)
// ==========================================

// ฮัมเพลงปริศนา
function initHumSong(c) {
    c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">🎶</span> <strong>วิธีเล่น:</strong> ฮัมเพลงให้เพื่อนทายด้วยคำที่กำหนด ห้ามร้องเนื้อเพลง!</div><div class="custom-timer-box"><label>เวลา (วิ):</label><input type="number" id="hum-time" value="30"></div><div id="hum-song" class="display-text glass-card p-4 mb-4" style="color:var(--neon-blue); font-size: 2rem;">กดเริ่มเพื่อสุ่มเพลง</div><div id="hum-word" class="text-muted mb-4" style="font-size: 1.2rem;"></div><div id="hum-timer" class="timer-text mb-4">0</div><div style="display:flex; gap:10px; width: 100%; max-width: 400px;"><button class="btn-danger action-btn" onclick="playSound('wrong'); flashScreen('red');">❌ หมดเวลา/ยอมแพ้</button><button class="btn-neon-purple action-btn" onclick="playSound('correct'); flashScreen('green');">✅ ทายถูก!</button></div><button class="btn-neon-pink action-btn mt-4" onclick="startHum()" style="max-width: 200px;">▶ สุ่มใหม่ & จับเวลา</button>`;
    window.startHum = () => { playSound('tick'); document.getElementById('hum-song').innerText = `🎵 ${getRandom(humSongs)}`; document.getElementById('hum-word').innerHTML = `ต้องฮัมด้วยคำว่า: <strong style="color:var(--neon-pink)">"${getRandom(humSyllables)}"</strong>`; let time = parseInt(document.getElementById('hum-time').value) || 30; document.getElementById('hum-timer').innerText = time; clearInterval(gameInterval); gameInterval = setInterval(() => { time--; document.getElementById('hum-timer').innerText = time; if(time <= 0) { clearInterval(gameInterval); playSound('boom'); flashScreen('red'); document.getElementById('hum-timer').innerText = "หมดเวลา!"; } }, 1000); }
}

// โทรศัพท์กระซิบ
function initTelephone(c) {
    c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📱</span> <strong>วิธีเล่น:</strong> อ่านประโยคแล้วพิมพ์ส่งต่อให้เพื่อน ดูซิประโยคจะเพี้ยนแค่ไหน!</div><div class="custom-timer-box"><label>เวลาอ่าน (วิ):</label><input type="number" id="tp-time" value="5"></div><button class="btn-neon-blue action-btn mt-4" onclick="startTelephone(event)" style="max-width: 250px;">▶ เริ่มเกม</button><div id="tp-stage" style="width: 100%; margin-top: 20px;"></div>`;
    window.startTelephone = (e) => { window.tpPlayers = [...players].sort(() => 0.5 - Math.random()); window.tpIndex = 0; window.tpHistory = []; window.tpPhrase = getRandom(phonePhrases); document.getElementById('tp-time').parentElement.style.display = 'none'; e.target.style.display = 'none'; renderTpStage(); }
}
function renderTpStage() {
    const stage = document.getElementById('tp-stage');
    if(window.tpIndex >= window.tpPlayers.length) { let resultHTML = `<h3 class="mb-3 text-gradient">ประโยคต้นฉบับ: <br>"${window.tpPhrase}"</h3>`; window.tpHistory.forEach((h, i) => { resultHTML += `<div style="margin-bottom:10px; background:rgba(255,255,255,0.1); padding:10px; border-radius:8px;">${window.tpPlayers[i].name} พิมพ์ว่า:<br><strong style="color:var(--neon-pink)">"${h}"</strong></div>`; }); stage.innerHTML = resultHTML + `<button class="btn-neon-blue mt-4 action-btn" onclick="initTelephone(document.getElementById('game-content'))">🔄 เล่นใหม่</button>`; return; }
    stage.innerHTML = `<h3 class="mb-4">ตานี้ของ: <span style="color:var(--neon-blue)">${window.tpPlayers[window.tpIndex].name}</span></h3><button class="btn-neon-pink action-btn" id="btn-show-tp" onclick="showTpText()">👀 กดดูข้อความ</button><div id="tp-display" class="display-text glass-card p-4 hidden" style="color:white; font-size:1.5rem;"></div><input type="text" id="tp-input" class="hidden mb-4 mt-4" placeholder="พิมพ์สิ่งที่คุณจำได้..."><button class="btn-neon-purple action-btn hidden" id="btn-next-tp" onclick="nextTpPlayer()">ส่งต่อ ⏭️</button>`;
}
window.showTpText = () => { playSound('tick'); document.getElementById('btn-show-tp').classList.add('hidden'); let display = document.getElementById('tp-display'); display.innerText = window.tpIndex === 0 ? window.tpPhrase : window.tpHistory[window.tpIndex-1]; display.classList.remove('hidden'); let readTime = parseInt(document.getElementById('tp-time').value) || 5; setTimeout(() => { playSound('tick'); display.classList.add('hidden'); document.getElementById('tp-input').classList.remove('hidden'); document.getElementById('btn-next-tp').classList.remove('hidden'); }, readTime * 1000); }
window.nextTpPlayer = () => { playSound('correct'); let val = document.getElementById('tp-input').value.trim() || "(ส่งกระดาษเปล่า)"; window.tpHistory.push(val); window.tpIndex++; renderTpStage(); }

// รูเล็ตต์มื้อนี้ใครจ่าย
function initBill(c) {
    c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">💸</span> <strong>วิธีเล่น:</strong> กรอกยอดบิล แล้วสุ่มแบ่งสัดส่วนการจ่ายแบบไม่แฟร์!</div><input type="number" id="bill-amount" placeholder="กรอกยอดบิลรวม (บาท)" class="mb-4" style="font-size:1.5rem; text-align:center;"><div id="bill-result" class="display-text glass-card p-4 mb-4" style="color:var(--neon-pink); font-size: 1.5rem;">รอสุ่ม...</div><button class="btn-danger action-btn" onclick="spinBill()">🎲 สุ่มคนจ่าย</button>`;
    window.spinBill = () => { let amt = parseFloat(document.getElementById('bill-amount').value); if(isNaN(amt) || amt <= 0) { showToast("กรอกยอดบิลให้ถูกต้อง", "error"); return; } playSound('tick'); let target = document.getElementById('bill-result'); target.innerText = "กำลังสุ่ม..."; setTimeout(() => { playSound('boom'); flashScreen('red'); let cond = [`จ่ายเต็ม ${amt} บาท!`, `จ่าย 50% = ${amt*0.5} บาท`, `จ่าย 10% = ${amt*0.1} บาท รอดไป!`, `มื้อนี้กินฟรี!!`, `รับจบ! จ่าย ${amt} บาท แถมทิป`, `หารเท่ากันทุกคนจ้า`]; target.innerHTML = `ผู้โชคร้าย: <strong style="color:white; font-size:2rem;">${getRandomPlayer()}</strong><br><br>${getRandom(cond)}`; }, 1500); }
}

// ทายเนื้อเพลง
function initLyrics(c) {
    c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">🎤</span> <strong>วิธีเล่น:</strong> อ่านเนื้อเพลงท่อนแรก แล้วร้องท่อนต่อไปให้ถูกภายในเวลา!</div><div class="custom-timer-box"><label>เวลา (วิ):</label><input type="number" id="lyr-time" value="10"></div><div id="lyr-disp" class="display-text glass-card p-4 mb-4" style="color:var(--neon-blue); font-size: 1.8rem;"></div><div id="lyr-timer" class="timer-text mb-4">10</div><div id="lyr-ans" class="hidden glass-card p-4 mb-4" style="color:var(--neon-pink); font-size: 1.5rem;"></div><button id="lyr-start" class="btn-neon-pink action-btn mb-2" onclick="startLyric()">⏱️ จับเวลา</button><button class="btn-danger action-btn mb-2" onclick="revealLyric()">👀 เฉลย</button><button class="btn-neon-blue action-btn" onclick="nextLyric()">⏭️ สุ่มใหม่</button>`;
    window.nextLyric = () => { window.curLyric = getRandom(gameData.lyrics); document.getElementById('lyr-disp').innerText = window.curLyric.q; document.getElementById('lyr-ans').classList.add('hidden'); document.getElementById('lyr-timer').innerText = document.getElementById('lyr-time').value || 10; document.getElementById('lyr-start').disabled = false; clearInterval(gameInterval); };
    window.startLyric = () => { playSound('tick'); let t = parseInt(document.getElementById('lyr-time').value) || 10; document.getElementById('lyr-start').disabled = true; clearInterval(gameInterval); gameInterval = setInterval(() => { t--; document.getElementById('lyr-timer').innerText = t; playSound('tick'); if(t<=0){ clearInterval(gameInterval); playSound('wrong'); flashScreen('red'); document.getElementById('lyr-timer').innerText="หมดเวลา!"; revealLyric(); } }, 1000); };
    window.revealLyric = () => { clearInterval(gameInterval); document.getElementById('lyr-ans').innerText = `เฉลย: "${window.curLyric.a}"`; document.getElementById('lyr-ans').classList.remove('hidden'); };
    nextLyric();
}

// ประมูลคำ
function initBidding(c) { c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📈</span> <strong>วิธีเล่น:</strong> สุ่มหัวข้อ คนแรกเปิดประมูลจำนวนคำที่จะตอบ คนต่อไปต้องเกทับหรือยอมแพ้!</div><div class="text-muted mb-2">หัวข้อรอบนี้:</div><div id="bid-cat" class="display-text glass-card p-4 mb-4" style="color:var(--neon-purple); font-size: 2rem;"></div><button class="btn-neon-purple action-btn" onclick="nextBid()">🔄 สุ่มใหม่</button>`; window.nextBid = () => { playSound('tick'); document.getElementById('bid-cat').innerText = getRandom(gameData.bidding); }; nextBid(); }

// เรื่องเล่ากองไฟ (One Word)
function initOneWord(c) { c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">🏕️</span> <strong>วิธีเล่น:</strong> ผลัดกันพูดคนละ 1 คำให้ต่อกันเป็นเรื่อง ใครคิดไม่ออกในเวลาแพ้!</div><div class="custom-timer-box"><label>เวลา (วิ):</label><input type="number" id="ows-time" value="3"></div><div id="ows-timer" class="timer-text mb-4" style="font-size:5rem;">3</div><button id="ows-btn" class="btn-neon-pink action-btn mt-4" style="height:100px; font-size:2rem;" onclick="resetOws()">พูดแล้วกดส่ง! 🔴</button>`; window.resetOws = () => { playSound('tick'); let t = parseInt(document.getElementById('ows-time').value) || 3; document.getElementById('ows-timer').innerText = t; document.getElementById('ows-timer').style.color = "var(--neon-pink)"; document.getElementById('ows-btn').innerText = "พูดแล้วกดส่ง! 🔴"; clearInterval(gameInterval); gameInterval = setInterval(() => { t--; document.getElementById('ows-timer').innerText = t; if(t<=0){ clearInterval(gameInterval); playSound('boom'); flashScreen('red'); document.getElementById('ows-timer').innerText = "💥"; document.getElementById('ows-timer').style.color = "red"; document.getElementById('ows-btn').innerText = "เริ่มใหม่ 🔄"; } else { playSound('tick'); } }, 1000); }; }

// พิมพ์ทะลุนรก
function initTextBomb(c) { c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">💣</span> <strong>วิธีเล่น:</strong> พิมพ์คำที่มีพยางค์ตามโจทย์ประกอบอยู่ แล้วกดส่งเพื่อส่งระเบิดต่อ!</div><div id="tb2-syl" class="timer-text mb-4" style="color:var(--neon-pink); font-size: 3rem;">...</div><input type="text" id="tb2-input" placeholder="พิมพ์คำตอบที่นี่..." class="mb-4 text-center" style="font-size:1.5rem;" disabled><button id="tb2-sub" class="btn-danger action-btn mb-4" onclick="submitTB2()" disabled>ส่ง! 💣</button><button class="btn-neon-blue action-btn mt-4" id="tb2-start" onclick="startTB2()">▶ เริ่มเกม (สุ่มระเบิดเวลา)</button>`; window.startTB2 = () => { playSound('tick'); document.getElementById('tb2-start').style.display = 'none'; document.getElementById('tb2-input').disabled = false; document.getElementById('tb2-sub').disabled = false; document.getElementById('tb2-input').value = ''; document.getElementById('tb2-syl').innerText = getRandom(gameData.textBomb); window.tb2Time = Math.floor(Math.random()*15)+15; clearInterval(gameInterval); gameInterval = setInterval(() => { window.tb2Time--; if(window.tb2Time<=0){ clearInterval(gameInterval); playSound('boom'); flashScreen('red'); document.getElementById('tb2-syl').innerText = "💥 ตู้มมม! 💥"; document.getElementById('tb2-input').disabled = true; document.getElementById('tb2-sub').disabled = true; document.getElementById('tb2-start').style.display = 'inline-block'; document.getElementById('tb2-start').innerText = 'เล่นใหม่ 🔄'; } }, 1000); }; window.submitTB2 = () => { let val = document.getElementById('tb2-input').value.trim(); let syl = document.getElementById('tb2-syl').innerText; if(val.includes(syl) && val.length > syl.length) { playSound('correct'); flashScreen('green'); document.getElementById('tb2-input').value = ""; document.getElementById('tb2-syl').innerText = getRandom(gameData.textBomb); } else { playSound('wrong'); showToast('คำไม่ถูกต้อง!', 'error'); } }; }

// ทายคำบนหัว (Heads Up)
let huScore = 0; let huWordsList = []; let huCurrentIndex = 0; let isHuPlaying = false; let huReadyForNextTilt = true;
function initHeadsUp(c) {
    huScore = 0; isHuPlaying = false; 
    let catHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">📱</span> <strong>วิธีเล่น:</strong> แนบมือถือที่หน้าผาก ✅ <strong>หงายจอขึ้น</strong> = ถูก! ❌ <strong>คว่ำจอลง</strong> = ข้าม!</div><div class="custom-timer-box"><label>เวลา (วิ):</label><input type="number" id="hu-time-input" value="60"></div><h3 class="mb-3 text-gradient">เลือกหมวดหมู่</h3><div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:350px;"><button class="btn-neon-pink action-btn" onclick="startHeadsUp('custom')">✨ หมวดของวงเรา</button>`;
    for (let key in gameData.headsup) { catHTML += `<button class="btn-neon-blue action-btn" onclick="startHeadsUp('${key}')">${gameData.headsup[key].name}</button>`; } c.innerHTML = catHTML + `</div>`;
}
window.startHeadsUp = (cat) => { let t = parseInt(document.getElementById('hu-time-input').value) || 60; if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') { DeviceOrientationEvent.requestPermission().then(() => startHULoop(cat, t)).catch(console.error); } else { startHULoop(cat, t); } };
window.startHULoop = (cat, time) => {
    let words = cat === 'custom' ? (customDeck.headsup.length > 0 ? customDeck.headsup : ["ไม่มีคำ!"]) : gameData.headsup[cat].words;
    huWordsList = [...words].sort(() => 0.5 - Math.random()); huCurrentIndex = 0; huScore = 0;
    const c = document.getElementById('game-content');
    c.innerHTML = `<div style="display: flex; justify-content: space-between; width: 100%; padding: 0 20px;"><div class="text-muted" style="font-size: 1.2rem;">⏱️ <span id="hu-timer">${time}</span></div><div class="text-muted" style="font-size: 1.2rem;">✅ <span id="hu-score">0</span> คำ</div></div><div class="display-text glass-card p-4" id="hu-word" style="font-size: 4rem; color: var(--neon-pink); width: 100%; word-break: break-word; min-height: 250px;">แนบหน้าผากเลย!</div><div style="display: flex; gap: 10px; width: 100%; max-width: 400px; margin-top: 20px;" id="hu-controls"><button class="btn-danger action-btn" onclick="huPass()">คว่ำจอ ข้าม ⏭️</button><button class="btn-neon-purple action-btn" onclick="huCorrect()">หงายจอ ถูก ✅</button></div><button class="btn-neon-blue action-btn mt-4" style="max-width: 250px; display: none;" id="hu-restart" onclick="initHeadsUp(document.getElementById('game-content'))">🔄 เล่นใหม่</button>`;
    const wd = document.getElementById('hu-word'); const ctrl = document.getElementById('hu-controls'); ctrl.style.opacity = '0.5'; ctrl.style.pointerEvents = 'none';
    wd.innerText = "3"; playSound('tick'); setTimeout(() => { wd.innerText = "2"; playSound('tick'); }, 1000); setTimeout(() => { wd.innerText = "1"; playSound('tick'); }, 2000);
    setTimeout(() => { playSound('correct'); ctrl.style.opacity = '1'; ctrl.style.pointerEvents = 'auto'; wd.innerText = huWordsList[huCurrentIndex]; isHuPlaying = true; window.addEventListener('deviceorientation', handleHeadsUpTilt); clearInterval(gameInterval); gameInterval = setInterval(() => { time--; document.getElementById('hu-timer').innerText = time; if(time<=0) endHeadsUp(); }, 1000); }, 3000);
};
function handleHeadsUpTilt(e) { if(!isHuPlaying) return; let b = e.beta; if(huReadyForNextTilt) { if(b>-20 && b<45) { huReadyForNextTilt=false; huCorrect(); } else if(b>135 && b<=180) { huReadyForNextTilt=false; huPass(); } } else { if(b>60 && b<120) huReadyForNextTilt=true; } }
window.huCorrect = () => { if(!isHuPlaying) return; playSound('correct'); flashScreen('green'); huScore++; document.getElementById('hu-score').innerText = huScore; loadNextHU(); };
window.huPass = () => { if(!isHuPlaying) return; playSound('wrong'); flashScreen('red'); loadNextHU(); };
function loadNextHU() { huCurrentIndex++; if(huCurrentIndex>=huWordsList.length) endHeadsUp(true); else document.getElementById('hu-word').innerText = huWordsList[huCurrentIndex]; }
function endHeadsUp(out=false) { clearInterval(gameInterval); isHuPlaying=false; window.removeEventListener('deviceorientation', handleHeadsUpTilt); playSound('boom'); document.getElementById('hu-controls').style.display='none'; document.getElementById('hu-restart').style.display='flex'; document.getElementById('hu-word').innerHTML = `<span style="font-size: 1.5rem; color: white;">${out?'คำหมด!':'หมดเวลา!'} ทายถูก</span><br><span style="font-size: 5rem;">${huScore}</span> คำ 🎉`; }

// จระเข้
function initCroc(c) { c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">🐊</span> ผลัดกันกดฟันจระเข้ทีละซี่ ส่งวนไป ใครกดโดนจระเข้งับ โดนทำโทษ!</div><div class="croc-grid" id="croc-grid"></div><button class="btn-neon-blue mt-4 action-btn" onclick="initCroc(document.getElementById('game-content'))" style="max-width:200px;">🔄 เริ่มใหม่</button>`; const grid = document.getElementById('croc-grid'); const trap = Math.floor(Math.random()*10); for(let i=0; i<10; i++) { let btn = document.createElement('button'); btn.className = 'croc-tooth'; btn.onclick = () => { if(i===trap){ playSound('boom'); flashScreen('red'); grid.innerHTML = `<div style="grid-column:span 5; color:red; font-size:2rem; font-weight:bold; padding:40px 0;">งับ!! 🐊💥</div>`; }else{ playSound('tick'); btn.classList.add('pressed'); } }; grid.appendChild(btn); } }

// Spyfall
function initSpy(c) { c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">🕵️‍♂️</span> ส่งมือถือดูบทบาททีละคน 1 คนเป็น Spy ให้ผลัดกันถามจับผิด!</div><div id="spy-stage" class="glass-card p-4" style="width:100%; min-height: 200px; display:flex; flex-direction:column; justify-content:center;"></div>`; window.spyLoc = getRandom(gameData.spyLocations); window.spyIdx = Math.floor(Math.random()*players.length); window.spyCurr = 0; renderSpy(); }
function renderSpy() { const st = document.getElementById('spy-stage'); if(window.spyCurr>=players.length){ playSound('boom'); st.innerHTML = `<h2 class="text-gradient mb-4">เริ่มจับผิดได้!</h2><p class="text-muted">ผลัดกันถามแล้วโหวตจับ Spy</p><button class="btn-danger action-btn mt-4" onclick="document.getElementById('spy-stage').innerHTML='<h1 style=color:red>Spy คือ: ${players[window.spyIdx].name} 🕵️‍♂️</h1>'">เฉลย</button>`; return; } st.innerHTML = `<h3 class="mb-4">ส่งมือถือให้: <span style="color:var(--neon-pink)">${players[window.spyCurr].name}</span></h3><button class="btn-neon-purple action-btn" onclick="showSpy()">👀 ดูบทบาท</button>`; }
window.showSpy = () => { playSound('tick'); const t = (window.spyCurr===window.spyIdx) ? "<span style='color:red; font-size:2.5rem;'>คุณคือ SPY 🕵️‍♂️</span>" : `สถานที่คือ:<br><span style='color:var(--neon-blue); font-size:2rem;'>${window.spyLoc}</span>`; document.getElementById('spy-stage').innerHTML = `<div class="mb-4">${t}</div><button class="btn-neon-blue action-btn" onclick="window.spyCurr++; renderSpy();">ซ่อน และส่งต่อ ⏭️</button>`; };

// ใบ้คำห้ามพูด
function initTaboo(c) { c.innerHTML = `<div class="game-rules-box mb-4"><span style="font-size: 1.2rem;">🤫</span> ใบ้คำให้เพื่อนทาย โดย "ห้ามพูดคำต้องห้าม" ด้านล่างเด็ดขาด!</div><div id="taboo-c" style="width:100%;"></div><button class="btn-neon-blue mt-4 action-btn" onclick="startTaboo()" style="max-width:200px;">🎲 สุ่มคำ</button>`; window.startTaboo = () => { playSound('tick'); const d = getRandom(gameData.taboo); let fb = d.forbidden.map(w => `<div style="background:rgba(239,68,68,0.2); padding:5px 10px; border-radius:8px; color:#ef4444; border:1px solid #ef4444;">❌ ${w}</div>`).join(''); document.getElementById('taboo-c').innerHTML = `<div class="glass-card p-4 text-center mb-4"><div class="text-muted mb-2">คำที่ต้องใบ้:</div><div style="font-size:3rem; color:var(--neon-blue); font-weight:bold;">${d.word}</div></div><div class="text-muted mb-2 text-center">ห้ามพูดคำเหล่านี้:</div><div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;" class="mb-4">${fb}</div><div style="display:flex; gap:10px;"><button class="btn-danger action-btn" onclick="playSound('wrong'); flashScreen('red');">🚨 กดออด</button><button class="btn-neon-purple action-btn" onclick="playSound('correct'); flashScreen('green'); startTaboo();">✅ ทายถูก</button></div>`; }; }

// ศึกจิ้มไว
let tapRed=50; let tapBlue=50; let isTap=false;
function initTapBattle(c) { c.innerHTML = `<div class="game-rules-box mb-2"><span style="font-size: 1.2rem;">⚡</span> วางมือถือตรงกลาง แข่งกันรัวนิ้วฝั่งตัวเองให้ไวสุด!</div><div class="custom-timer-box"><label>เวลา (วิ):</label><input type="number" id="tb-time" value="10"></div><div id="tb-tmr" class="timer-text mb-2" style="font-size:2rem;">0</div><div class="tap-container"><div class="tap-area tap-red" id="a-red" onpointerdown="doTap('r')">RED</div><div class="tap-area tap-blue" id="a-blue" onpointerdown="doTap('b')">BLUE</div></div><button class="btn-neon-pink mt-4 action-btn" id="tb-start" onclick="startTap()">▶ เริ่ม</button>`; }
window.startTap = () => { document.getElementById('tb-start').style.display='none'; tapRed=50; tapBlue=50; isTap=true; let t=parseInt(document.getElementById('tb-time').value)||10; uTap(); playSound('tick'); clearInterval(gameInterval); gameInterval=setInterval(()=>{ t--; document.getElementById('tb-tmr').innerText=t; if(t<=0){ clearInterval(gameInterval); isTap=false; playSound('boom'); document.getElementById('tb-tmr').innerHTML=`<span style="font-size:1.5rem; color:white;">${tapRed>tapBlue?"❤️ แดงชนะ!":(tapBlue>tapRed?"💙 น้ำเงินชนะ!":"เสมอ!")}</span>`; document.getElementById('tb-start').style.display='flex'; document.getElementById('tb-start').innerText='เล่นใหม่'; } }, 1000); };
window.doTap = (c) => { if(!isTap) return; if(c==='r' && tapRed<95){ tapRed+=3; tapBlue-=3; } else if(c==='b' && tapBlue<95){ tapBlue+=3; tapRed-=3; } uTap(); };
function uTap() { document.getElementById('a-red').style.flexBasis=`${tapRed}%`; document.getElementById('a-blue').style.flexBasis=`${tapBlue}%`; }

// Wheel, HotPotato, ToD, NHIE, MostLikely, 5Sec, GuessWho, Quiz, Secret, Roast
function initWheel(c) { c.innerHTML = `<div class="game-rules-box mb-4">📖 หมุนวงล้อวัดดวง ใครซวยโดนทำโทษ!</div><div class="wheel-container" id="w-c">เตรียมหมุน!</div><button class="btn-neon-purple mt-4 action-btn" onclick="spinW()">🎡 หมุนวงล้อ</button>`; window.spinW = () => { playSound('tick'); const w=document.getElementById('w-c'); w.style.transform=`rotate(${Math.floor(Math.random()*360)+1440}deg)`; w.style.animation='none'; w.innerText="กำลังหมุน..."; setTimeout(()=>{ playSound('correct'); w.innerText=getRandom(gameData.wheelOptions); w.style.transform='rotate(0deg)'; w.style.animation='ring-pulse 2s infinite'; }, 3500); }; }
function initHotPotato(c) { c.innerHTML = `<div class="game-rules-box mb-4">📖 ตอบคำถามตามหมวดแล้วส่งมือถือวน ระเบิดตู้มที่ใครแพ้!</div><div class="custom-timer-box"><label>สุ่มสุดที่ (วิ):</label><input type="number" id="hp-t" value="15"></div><h3 class="mb-4 text-gradient" id="hp-cat">หมวดหมู่: ...</h3><div class="display-text timer-text" id="hp-st">💣</div><button class="btn-danger action-btn mt-4" onclick="startHP()" id="hp-b">▶ เริ่มเกม</button>`; window.startHP = () => { playSound('tick'); const s=document.getElementById('hp-st'); const b=document.getElementById('hp-b'); document.getElementById('hp-cat').innerText=`หมวด: ${getRandom(gameData.categories)}`; s.innerText="ติ๊ก..."; s.style.color="white"; b.disabled=true; b.innerText="กำลังเล่น..."; let max=parseInt(document.getElementById('hp-t').value)||15; const time=Math.floor(Math.random()*(max*1000))+3000; clearTimeout(gameTimeout); gameTimeout=setTimeout(()=>{ playSound('boom'); flashScreen('red'); s.innerText="💥 BOOM! 💥"; s.style.color="red"; b.disabled=false; b.innerText="เล่นใหม่"; document.getElementById('hp-cat').innerText="คนถือมือถือโดนทำโทษ!"; }, time); }; }
function initToD(c) { c.innerHTML = `<div class="game-rules-box mb-4">📖 เลือกว่าจะตอบความจริง (Truth) หรือทำภารกิจ (Dare)</div><div id="tod-tg" style="font-size:1.5rem; color:var(--neon-blue); margin-bottom:20px; font-weight:bold;"></div><div style="display:flex; gap:10px; width:100%; max-width:300px; margin-bottom:20px;"><button class="btn-neon-purple action-btn" onclick="rToD('truths')">Truth 😇</button><button class="btn-neon-pink action-btn" onclick="rToD('dares')">Dare 😈</button></div><div class="display-text glass-card p-4" id="tod-disp" style="width:100%;">...</div>`; window.rToD = (t) => { playSound('tick'); let p = gameData.tod[t].concat(t==='truths'?customDeck.truths:customDeck.dares); document.getElementById('tod-tg').innerText=`ผู้ถูกเลือก: ${getRandomPlayer()}`; document.getElementById('tod-disp').innerText=getRandom(p); }; }
function initNHIE(c) { c.innerHTML = `<div class="game-rules-box mb-4">📖 อ่านประโยค ใคร "เคยทำ" ต้องโดนทำโทษ!</div><div class="display-text glass-card p-4" id="n-disp" style="color:var(--neon-blue); width:100%;">กดปุ่มสุ่ม</div><button class="btn-neon-blue action-btn mt-4" onclick="playSound('tick'); document.getElementById('n-disp').innerText=getRandom(gameData.neverHaveIEver)">🎲 สุ่มคำถาม</button>`; }
function initMostLikely(c) { c.innerHTML = `<div class="game-rules-box mb-4">📖 นับ 1-2-3 แล้วชี้คนที่ตรงกับคำถามที่สุด!</div><div class="display-text glass-card p-4" id="m-disp" style="color:var(--neon-pink); width:100%;">...</div><button class="btn-neon-pink action-btn mt-4" onclick="playSound('tick'); document.getElementById('m-disp').innerText=getRandom(gameData.mostLikely)">👉 สุ่มคำถาม</button>`; document.getElementById('m-disp').innerText=getRandom(gameData.mostLikely); }
function initFiveSec(c) { c.innerHTML = `<div class="game-rules-box mb-4">📖 ตอบ 3 ข้อในเวลาที่กำหนด!</div><div class="custom-timer-box"><label>เวลา (วิ):</label><input type="number" id="fs-t" value="5"></div><div class="timer-text mb-4" id="fs-tmr">0</div><div class="display-text glass-card p-4" id="fs-disp" style="font-size:1.2rem; min-height:60px; width:100%;">...</div><button class="btn-neon-pink mb-4 mt-4 action-btn" onclick="startFS()" id="fs-b">▶ สุ่ม & จับเวลา</button>`; window.startFS = () => { playSound('correct'); const tm=document.getElementById('fs-tmr'); const b=document.getElementById('fs-b'); document.getElementById('fs-disp').innerText=`โจทย์: ${getRandom(gameData.fiveSec)}`; let t=parseInt(document.getElementById('fs-t').value)||5; tm.innerText=t; b.disabled=true; clearInterval(gameInterval); gameInterval=setInterval(()=>{ t--; tm.innerText=t; playSound('tick'); if(t<=0){ clearInterval(gameInterval); playSound('wrong'); flashScreen('red'); tm.innerText="หมดเวลา!"; b.disabled=false; b.innerText="เล่นใหม่"; } }, 1000); }; }
function initGuessWho(c) { c.innerHTML = `<div class="game-rules-box mb-4">📖 ทุกคนโหวตว่าคำใบ้หมายถึงใคร!</div><div class="display-text glass-card p-4" id="g-disp" style="color:var(--neon-purple); width:100%;">...</div><button class="btn-neon-purple action-btn mt-4" onclick="playSound('tick'); document.getElementById('g-disp').innerText=getRandom(gameData.guessWho)">🕵️ สุ่มคำใบ้</button>`; document.getElementById('g-disp').innerText=getRandom(gameData.guessWho); }
function initQuiz(c) { c.innerHTML = `<div class="game-rules-box mb-4">📖 ช่วยกันตอบ ถ้าผิดโดนยกวง!</div><div id="q-q" class="display-text" style="font-size:1.2rem;">...</div><div id="q-c" style="width:100%; max-width:350px;"></div><button class="btn-neon-blue mt-4 action-btn" onclick="loadQ()">🔄 สุ่มข้อใหม่</button>`; window.loadQ = () => { playSound('tick'); const q = getRandom(gameData.quiz); document.getElementById('q-q').innerText=q.q; const div = document.getElementById('q-c'); div.innerHTML=''; q.choices.forEach((ch, idx) => { const b=document.createElement('button'); b.className='choice-btn'; b.innerText=ch; b.onclick=()=>{ if(idx===q.ans){ playSound('correct'); flashScreen('green'); b.style.background='rgba(34,197,94,0.4)'; b.innerText+=" ✅ รอดตัว!"; }else{ playSound('wrong'); flashScreen('red'); b.style.background='rgba(239,68,68,0.4)'; b.innerText+=" ❌ โดนทำโทษ!"; } Array.from(div.children).forEach(btn=>btn.disabled=true); }; div.appendChild(b); }); }; loadQ(); }
function initSecret(c) { c.innerHTML = `<div class="game-rules-box mb-4">📖 กดดูภารกิจลับแล้วซ่อนไว้ ใครทำไม่สำเร็จโดนปรับ!</div><div class="display-text hidden glass-card p-4" id="sm-d" style="border: 2px dashed var(--neon-pink); width:100%;"></div><button class="btn-neon-pink action-btn mt-4" onclick="toggleSM()" id="sm-b">👀 เปิดดูภารกิจ</button>`; window.toggleSM = () => { playSound('tick'); const d=document.getElementById('sm-d'); const b=document.getElementById('sm-b'); if(d.classList.contains('hidden')){ d.innerText=getRandom(gameData.secretMissions); d.classList.remove('hidden'); b.innerText="🙈 ซ่อนภารกิจ"; }else{ d.classList.add('hidden'); b.innerText="👀 สุ่มใหม่"; } }; }
function initRoast(c) { c.innerHTML = `<div class="game-rules-box mb-4">📖 ระบบแซวแบบเจ็บๆ คันๆ!</div><div id="r-tg" class="timer-text" style="font-size:2.5rem; color:var(--neon-blue); margin-bottom:20px;">...</div><div class="display-text glass-card p-4" id="r-d" style="font-size:1.2rem; color:white; width:100%;">...</div><button class="btn-neon-purple mt-4 action-btn" onclick="genR()">🔥 สุ่มแซวเพื่อน</button>`; window.genR = () => { playSound('boom'); document.getElementById('r-tg').innerText=getRandomPlayer(); document.getElementById('r-d').innerText=`"${getRandom(gameData.roasts)}"`; }; genR(); }

// ==========================================
// 6. Summary & End
// ==========================================
window.endParty = () => {
    if(players.length === 0) { showToast('ยังไม่มีข้อมูลผู้เล่นครับ', 'error'); return; }
    document.getElementById('home-view').classList.add('hidden'); document.getElementById('summary-view').classList.remove('hidden');
    let summaryHTML = `<p style="text-align: center; margin-bottom: 20px;">เล่นไปทั้งหมด: <strong style="color: var(--neon-blue);">${gamesPlayed}</strong> เกม</p><h3 style="color: var(--neon-purple); margin-bottom: 20px;">🎉 ผู้รอดชีวิตในวง 🎉</h3>`;
    players.forEach((p, i) => { summaryHTML += `<div style="text-align: center; font-size: 1.2rem; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">${i+1}. ${p.name}</div>`; });
    document.getElementById('summary-content').innerHTML = summaryHTML;
}
window.copySummary = () => { let text = `🎉 สรุปผลปาร์ตี้ "วงนี้มีเกม" 🎉\nเล่นไปทั้งหมด ${gamesPlayed} เกม\n\nผู้ร่วมชะตากรรม:\n`; players.forEach((p, i) => { text += `${i+1}. ${p.name}\n`; }); navigator.clipboard.writeText(text).then(() => { showToast('✅ คัดลอกผลสรุปแล้ว! นำไปแปะในแชทกลุ่มได้เลย'); }); }
window.resetAll = () => { if(confirm('แน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด? (เริ่มใหม่)')) { players = []; gamesPlayed = 0; saveState(); document.getElementById('summary-view').classList.add('hidden'); document.getElementById('home-view').classList.remove('hidden'); showToast('ล้างข้อมูลเรียบร้อยแล้ว'); } }

// ==========================================
// 7. Initialize App
// ==========================================
function init() {
    renderPlayers();
    renderGameGrid();
    if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW Reg failed:', err)); }
}

init();
