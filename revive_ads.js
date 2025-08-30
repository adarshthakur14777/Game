
(function(){
  const $ = id => document.getElementById(id);
  const gameOver = $('gameOver');
  const reviveBtn = $('reviveBtn');
  const restartBtn = $('restartBtn');
  const adTimer = $('adTimer');
  const adProgress = $('adProgress');
  const adModal = $('adModal');
  const adTimerModal = $('adTimerModal');
  const adProgressModal = $('adProgressModal');

  const Revive = {
    limit: 1,
    used: 0,
    adSeconds: 30,
    lastSafe: {x:60,y:60,dir:{x:1,y:0}},
    onRespawnCb: null,
    onRespawn(cb){ this.onRespawnCb = cb; },
    getLastSafe(){ return this.lastSafe; },
    onDeath(safe){ if (safe) this.lastSafe=safe; showGameOver(); },
  };
  window.PaperRevive = Revive;

  function showGameOver(){
    gameOver.classList.remove('hidden');
    updateAdUI(Revive.adSeconds, 0);
  }
  function hideGameOver(){ gameOver.classList.add('hidden'); }

  function updateAdUI(remaining, ratio){
    adTimer.textContent = String(remaining);
    adProgress.style.width = (100*ratio).toFixed(2)+'%';
  }

  function countdown(seconds, onTick){
    return new Promise(res=>{
      const start = performance.now();
      function tick(){
        const elapsed = Math.floor((performance.now()-start)/1000);
        const left = Math.max(0, seconds - elapsed);
        const ratio = Math.min(1, (seconds-left)/seconds);
        onTick(left, ratio);
        if(left>0) setTimeout(tick, 250); else res(true);
      }
      tick();
    });
  }

  async function showRewardedFallback(){
    adModal.classList.remove('hidden');
    await countdown(Revive.adSeconds, (l,r)=>{ adTimerModal.textContent=String(l); adProgressModal.style.width=(100*r)+'%'; });
    adModal.classList.add('hidden');
  }

  async function handleRevive(){
    if (Revive.used >= Revive.limit) return;
    hideGameOver();
    try {
      // TODO: Integrate Google IMA HTML5 Rewarded here (on success, continue)
      await showRewardedFallback();
    } catch(e) {
      // fallback already done
    }
    Revive.used++;
    if (Revive.onRespawnCb) Revive.onRespawnCb();
  }

  reviveBtn && reviveBtn.addEventListener('click', handleRevive);
  restartBtn && restartBtn.addEventListener('click', ()=>{ window.location.reload(); });
})();
