// ---------- View / nav switching ----------
  const tabMap = { 'view-home': 'view-home', 'view-swipe': 'view-home', 'view-planner': 'view-planner', 'view-itinerary': 'view-planner', 'view-gems': 'view-gems' };
  let viewHistory = [];

  function showView(id, push = true) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById(id).classList.add('flex');

    const activeTab = tabMap[id];
    document.querySelectorAll('.nav-item').forEach(btn => {
      const isActive = btn.dataset.tab === activeTab;
      btn.classList.toggle('text-primary', isActive);
      btn.classList.toggle('text-on-secondary-fixed-variant', !isActive);
      const icon = btn.querySelector('.nav-icon');
      icon.style.fontVariationSettings = isActive ? "'FILL' 1" : "'FILL' 0";
      btn.querySelector('.nav-label').classList.toggle('font-bold', isActive);
    });

    const backBtn = document.getElementById('backBtn');
    backBtn.classList.toggle('hidden', id !== 'view-itinerary');
    backBtn.classList.toggle('flex', id === 'view-itinerary');

    if (push) { viewHistory.push(id); }
  }

  function goBack() {
    viewHistory.pop();
    const prev = viewHistory[viewHistory.length - 1] || 'view-planner';
    showView(prev, false);
  }

  // init nav colors
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.add('text-on-secondary-fixed-variant'));
  showView('view-home');

  // ---------- Swipe matching ----------
  const profiles = [
    { name: 'Aria', age: 24, loc: 'Currently in Kyoto, Japan', match: 92, bio: 'Seeking fellow explorers for sunrise hikes and authentic street food.', tags: ['Adventure','Trekking','Budget Travel'], img: 'https://picsum.photos/id/1027/600/800' },
    { name: 'Devan', age: 27, loc: 'Currently in Rishikesh, India', match: 88, bio: 'Photographer chasing golden hour in the mountains. Always down for chai stops.', tags: ['Photography','Solo Travel','Culture'], img: 'https://picsum.photos/id/1005/600/800' },
    { name: 'Meera', age: 23, loc: 'Currently in Manali, India', match: 95, bio: 'First solo trip! Looking for a small, easygoing group to explore offbeat trails.', tags: ['First-timer','Trekking','Quiet trip'], img: 'https://picsum.photos/id/1011/600/800' }
  ];
  let profileIndex = 0;

  function renderCard() {
    const stack = document.getElementById('cardStack');
    const emptyState = document.getElementById('matchEmpty');
    if (profileIndex >= profiles.length) {
      stack.innerHTML = '';
      emptyState.classList.remove('hidden');
      emptyState.classList.add('flex');
      return;
    }
    emptyState.classList.add('hidden');
    emptyState.classList.remove('flex');
    const p = profiles[profileIndex];
    stack.innerHTML = `
      <div id="activeCard" class="swipe-card absolute inset-0 rounded-lg overflow-hidden soft-shadow" style="background: url('${p.img}') center/cover;">
        <div class="absolute inset-0 bg-gradient-to-t from-on-surface/85 via-on-surface/10 to-transparent"></div>
        <div class="absolute top-4 left-4 bg-white/95 text-tertiary font-label-md text-sm px-3 py-1.5 rounded-full flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">favorite</span> ${p.match}% match
        </div>
        <div class="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 class="font-headline-lg-mobile text-[24px]">${p.name}, ${p.age}</h3>
          <p class="text-white/80 text-sm flex items-center gap-1 mt-1"><span class="material-symbols-outlined text-[16px]">location_on</span> ${p.loc}</p>
          <p class="text-white/90 text-sm mt-2 mb-3">${p.bio}</p>
          <div class="flex flex-wrap gap-2">
            ${p.tags.map(t => `<span class="bg-white/15 border border-white/30 text-white text-xs font-label-sm px-3 py-1 rounded-full">${t}</span>`).join('')}
          </div>
        </div>
      </div>`;
  }

  function swipeCard(dir) {
    const card = document.getElementById('activeCard');
    if (!card) return;
    if (dir === 'right') {
      card.classList.add('leaving-right');
      const matched = profiles[profileIndex];
      setTimeout(() => openMatch(matched.name), 250);
    } else if (dir === 'left') {
      card.classList.add('leaving-left');
    } else {
      card.classList.add('leaving-right');
    }
    setTimeout(() => { profileIndex++; renderCard(); }, 350);
  }

  function resetSwipe() { profileIndex = 0; renderCard(); }

  function openMatch(name) {
    document.getElementById('matchName').textContent = name;
    const popup = document.getElementById('matchPopup');
    popup.classList.remove('hidden');
    popup.classList.add('flex');
  }
  function closeMatch() {
    const popup = document.getElementById('matchPopup');
    popup.classList.add('hidden');
    popup.classList.remove('flex');
  }

  renderCard();

  // ---------- AI planner chat ----------
  function sendPrompt(preset) {
    const input = document.getElementById('chatInput');
    const text = preset || input.value.trim();
    if (!text) return;
    const log = document.getElementById('chatLog');

    log.insertAdjacentHTML('beforeend', `
      <div class="flex items-start gap-3 max-w-[85%] self-end flex-row-reverse ml-auto fade-in">
        <div class="bg-tertiary-container/10 text-on-surface border border-tertiary-container/30 rounded-2xl rounded-tr-sm p-4 text-sm">${text}</div>
      </div>`);
    input.value = '';
    log.scrollTop = log.scrollHeight;

    setTimeout(() => {
      log.insertAdjacentHTML('beforeend', `
        <div class="flex items-start gap-3 max-w-[95%] fade-in">
          <div class="w-8 h-8 rounded-full bg-surface-container flex-shrink-0 flex items-center justify-center">
            <span class="material-symbols-outlined text-primary text-sm" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
          </div>
          <div class="w-full">
            <div class="bg-surface-container-low text-on-surface rounded-2xl rounded-tl-sm p-4 text-sm leading-relaxed">
              <p class="mb-3">I've curated a 3-day itinerary for Munsyari, balancing breathtaking views with your budget.</p>
              <button onclick="showView('view-itinerary')" class="w-full bg-surface-card rounded-lg p-3 border border-outline-variant/30 flex items-center justify-between hover:border-primary/50 transition-colors">
                <div class="text-left">
                  <p class="font-label-md text-on-surface">3-Day Munsyari Escape</p>
                  <p class="text-text-muted text-xs">₹1,03,000 est. · Oct 12–14</p>
                </div>
                <span class="material-symbols-outlined text-primary">chevron_right</span>
              </button>
            </div>
          </div>
        </div>`);
      log.scrollTop = log.scrollHeight;
    }, 500);
  }
  document.getElementById('chatInput').addEventListener('keydown', e => { if (e.key === 'Enter') sendPrompt(); });

  // ---------- Hidden gems cycle ----------
  const gemPairs = [
    { crowded: 'Manali', crowdedPrice: '₹1,00,000', crowdedImg: 'https://picsum.photos/id/1039/700/420', gem: 'Munsyari', gemPrice: '₹60,000', gemImg: 'https://picsum.photos/id/1015/700/420', save: '₹40,000', tag: 'Same mountains, half the crowd', match: 98 },
    { crowded: 'Nainital', crowdedPrice: '₹65,000', crowdedImg: 'https://picsum.photos/id/1043/700/420', gem: 'Chopta', gemPrice: '₹38,000', gemImg: 'https://picsum.photos/id/1036/700/420', save: '₹27,000', tag: 'Same lake calm, mini Switzerland views', match: 95 },
    { crowded: 'Mussoorie', crowdedPrice: '₹55,000', crowdedImg: 'https://picsum.photos/id/1044/700/420', gem: 'Kanatal', gemPrice: '₹32,000', gemImg: 'https://picsum.photos/id/1024/700/420', save: '₹23,000', tag: 'Same hill-station charm, none of the traffic', match: 96 }
  ];
  let gemIndex = 0;
  function cycleGem() {
    gemIndex = (gemIndex + 1) % gemPairs.length;
    const g = gemPairs[gemIndex];
    const section = document.getElementById('view-gems');
    section.querySelectorAll('img')[0].src = g.crowdedImg;
    section.querySelectorAll('img')[1].src = g.gemImg;
    section.querySelectorAll('.line-through')[0].textContent = g.crowded;
    section.querySelectorAll('.line-through')[1].textContent = g.crowdedPrice + ' est. total';
    section.querySelectorAll('.font-headline-md.text-on-surface')[0].textContent = g.gem;
    section.querySelector('.text-primary.text-sm.font-label-md').textContent = g.tag;
    section.querySelectorAll('.font-headline-md.text-on-surface.text-lg')[0].innerHTML = g.gemPrice + ' <span class="text-text-muted font-body-md text-sm">est. total</span>';
    section.querySelector('.bg-tertiary').innerHTML = '<span class="material-symbols-outlined text-[14px]">savings</span> Save ' + g.save;
    section.querySelector('.bg-primary.text-white').innerHTML = '<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: \'FILL\' 1;">auto_awesome</span> AI match ' + g.match + '%';
  }