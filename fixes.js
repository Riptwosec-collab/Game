// Runtime fixes and hardening for Party Game Hub
(function () {
  'use strict';

  const originalAddPlayer = window.addPlayer;
  const originalOpenGame = window.openGame;
  const originalStartHeadsUpSensorCheck = window.startHeadsUpSensorCheck;

  function safeText(value) {
    return String(value ?? '');
  }

  window.shuffle = function shuffle(items) {
    const result = Array.isArray(items) ? [...items] : [];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  window.saveState = function saveState() {
    localStorage.setItem('partyPlayers', JSON.stringify(players));
    localStorage.setItem('partyGamesCount', String(gamesPlayed));
    renderPlayers();
  };

  window.renderPlayers = function renderPlayers() {
    const list = document.getElementById('player-list');
    if (!list) return;
    list.replaceChildren();

    if (!Array.isArray(players) || players.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'text-muted';
      empty.style.cssText = 'text-align:center; padding:20px 0;';
      empty.textContent = 'ยังไม่มีผู้เล่น เพิ่มชื่อด้านบนเลย!';
      list.appendChild(empty);
      return;
    }

    players.forEach((player) => {
      const item = document.createElement('div');
      item.className = 'player-item';

      const name = document.createElement('div');
      name.style.fontWeight = '600';
      name.textContent = safeText(player.name);

      const controls = document.createElement('div');
      controls.className = 'score-controls';

      const remove = document.createElement('button');
      remove.className = 'score-btn';
      remove.style.color = '#ef4444';
      remove.type = 'button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `ลบ ${safeText(player.name)}`);
      remove.addEventListener('click', () => removePlayer(player.id));

      controls.appendChild(remove);
      item.append(name, controls);
      list.appendChild(item);
    });
  };

  window.renderGameGrid = function renderGameGrid() {
    const grid = document.getElementById('game-grid');
    if (!grid) return;
    grid.replaceChildren();

    if (!Array.isArray(gameList) || gameList.length === 0) {
      const message = document.createElement('p');
      message.className = 'text-muted';
      message.textContent = 'ยังไม่พบรายการเกม';
      grid.appendChild(message);
      return;
    }

    gameList.forEach((game) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'game-card';
      card.style.borderColor = `var(--neon-${game.color})`;
      card.setAttribute('aria-label', `เปิดเกม ${game.name}`);

      const icon = document.createElement('div');
      icon.className = 'game-icon';
      icon.textContent = game.icon;

      const name = document.createElement('div');
      name.style.cssText = 'font-weight:600; font-size:0.95rem;';
      name.textContent = game.name;

      card.append(icon, name);
      card.addEventListener('click', () => openGame(game.id));
      grid.appendChild(card);
    });
  };

  window.getRandomPlayer = function getRandomPlayer() {
    if (!Array.isArray(players) || players.length === 0) return null;
    return getRandom(players)?.name ?? null;
  };

  window.splitTeams = function splitTeams() {
    if (!Array.isArray(players) || players.length < 2) {
      showToast('ต้องมีผู้เล่นอย่างน้อย 2 คน', 'error');
      return;
    }

    const shuffled = shuffle(players);
    const half = Math.ceil(shuffled.length / 2);
    const result = document.getElementById('team-result');
    if (!result) return;
    result.replaceChildren();

    const createTeam = (title, members, color, background) => {
      const box = document.createElement('div');
      box.style.cssText = `margin-bottom:15px;background:${background};border:1px solid ${color};padding:10px;border-radius:8px;`;

      const heading = document.createElement('strong');
      heading.style.cssText = `color:${color};font-size:1.2rem;`;
      heading.textContent = title;
      box.appendChild(heading);

      members.forEach((member) => {
        const line = document.createElement('div');
        line.style.color = 'white';
        line.textContent = safeText(member.name);
        box.appendChild(line);
      });
      return box;
    };

    result.append(
      createTeam('🔴 ทีมแดง (Team A)', shuffled.slice(0, half), '#ef4444', 'rgba(239,68,68,0.2)'),
      createTeam('🔵 ทีมน้ำเงิน (Team B)', shuffled.slice(half), '#3b82f6', 'rgba(59,130,246,0.2)')
    );

    document.getElementById('team-modal')?.classList.remove('hidden');
  };

  window.startTelephone = function startTelephone(button) {
    if (!Array.isArray(players) || players.length < 2) {
      showToast('เกมนี้ต้องใช้ผู้เล่นอย่างน้อย 2 คน', 'error');
      return;
    }
    tpPlayers = shuffle(players);
    tpIndex = 0;
    tpHistory = [];
    tpPhrase = getRandom(phonePhrases);
    const timerBox = document.getElementById('tp-time')?.parentElement;
    if (timerBox) timerBox.style.display = 'none';
    if (button) button.style.display = 'none';
    renderTpStage();
  };

  window.spinBill = function spinBill() {
    if (!Array.isArray(players) || players.length === 0) {
      showToast('กรุณาเพิ่มผู้เล่นอย่างน้อย 1 คนก่อนสุ่มบิล', 'error');
      return;
    }

    const amount = Number.parseFloat(document.getElementById('bill-amount')?.value);
    if (!Number.isFinite(amount) || amount <= 0) {
      showToast('กรุณากรอกยอดบิลให้ถูกต้อง', 'error');
      return;
    }

    playSound('tick');
    const target = document.getElementById('bill-result');
    if (!target) return;
    target.textContent = 'กำลังสุ่ม...';

    setTimeout(() => {
      playSound('boom');
      flashScreen('red');
      const player = getRandomPlayer();
      const conditions = [
        `จ่ายเต็มจำนวน ${amount.toFixed(2)} บาท!`,
        `จ่าย 50% = ${(amount * 0.5).toFixed(2)} บาท`,
        `จ่ายแค่ 10% = ${(amount * 0.1).toFixed(2)} บาท`,
        'มื้อนี้กินฟรี ไม่ต้องจ่าย',
        `รับจบ จ่าย ${amount.toFixed(2)} บาท พร้อมแถมทิป`,
        'หารเท่ากันทุกคน'
      ];
      target.replaceChildren();
      const label = document.createElement('div');
      label.textContent = 'ผู้โชคร้าย:';
      const name = document.createElement('strong');
      name.style.cssText = 'color:white;font-size:2rem;display:block;margin:10px 0;';
      name.textContent = safeText(player);
      const condition = document.createElement('div');
      condition.textContent = getRandom(conditions);
      target.append(label, name, condition);
    }, 1000);
  };

  if (typeof originalStartHeadsUpSensorCheck === 'function') {
    window.startHeadsUpSensorCheck = function startHeadsUpSensorCheck(categoryKey) {
      const input = document.getElementById('hu-time-input');
      const parsed = Number.parseInt(input?.value, 10);
      const time = Number.isFinite(parsed) ? Math.min(300, Math.max(5, parsed)) : 60;

      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then((permissionState) => {
            if (permissionState !== 'granted') showToast('ไม่ได้รับอนุญาตใช้เซ็นเซอร์ ใช้ปุ่มกดแทนได้', 'error');
            startHeadsUpGameLoop(categoryKey, time);
          })
          .catch(() => {
            showToast('เปิดเซ็นเซอร์ไม่สำเร็จ ใช้ปุ่มกดแทนได้', 'error');
            startHeadsUpGameLoop(categoryKey, time);
          });
      } else {
        startHeadsUpGameLoop(categoryKey, time);
      }
    };
  }

  window.openGame = function openGameSafe(gameId) {
    const game = Array.isArray(gameList) ? gameList.find((item) => item.id === gameId) : null;
    if (!game) {
      showToast('ไม่พบเกมนี้ กรุณารีเฟรชหน้าเว็บ', 'error');
      return;
    }
    if (gameId === 'bill' && (!Array.isArray(players) || players.length === 0)) {
      showToast('รูเล็ตต์จ่ายบิลต้องมีผู้เล่นอย่างน้อย 1 คน', 'error');
      return;
    }
    if (typeof originalOpenGame === 'function') originalOpenGame(gameId);
  };

  const playerInput = document.getElementById('new-player-name');
  playerInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (typeof originalAddPlayer === 'function') originalAddPlayer();
    }
  });

  // Ensure the home page game grid always renders after all scripts are ready.
  function boot() {
    renderPlayers();
    renderGameGrid();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
