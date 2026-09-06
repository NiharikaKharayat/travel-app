  const profiles = [
    { name: 'Aria', age: 24, loc: 'Currently in Kyoto, Japan', match: 92, bio: 'Seeking fellow explorers for sunrise hikes and authentic street food.', tags: ['Adventure','Trekking','Budget Travel'], img: 'https://picsum.photos/id/1027/600/800' },
    { name: 'Devan', age: 27, loc: 'Currently in Rishikesh, India', match: 88, bio: 'Photographer chasing golden hour in the mountains. Always down for chai stops.', tags: ['Photography','Solo Travel','Culture'], img: 'https://picsum.photos/id/1005/600/800' },
    { name: 'Meera', age: 23, loc: 'Currently traveling in India', match: 95, bio: 'First solo trip! Looking for a small, easygoing group to explore offbeat trails.', tags: ['First-timer','Trekking','Quiet trip'], img: 'https://picsum.photos/id/1011/600/800' }
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
