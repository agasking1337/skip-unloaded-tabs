async function getOrderedTabsInCurrentWindow() {
  const tabs = await browser.tabs.query({ currentWindow: true });
  tabs.sort((a, b) => a.index - b.index);
  return tabs;
}

function findTargetIndex(tabs, startIndex, direction) {
  const n = tabs.length;
  if (n === 0) return -1;
  for (let step = 1; step <= n; step++) {
    const idx = (startIndex + direction * step + n) % n;
    const t = tabs[idx];
    if (!t.discarded) {
      return idx;
    }
  }
  return -1;
}

async function activateLoadedTab(direction) {
  const tabs = await getOrderedTabsInCurrentWindow();
  const active = tabs.find(t => t.active);
  const startIndex = active ? active.index : (tabs[0]?.index ?? 0);

  const posByIndex = new Map();
  tabs.forEach((t, i) => posByIndex.set(t.index, i));
  const startPos = posByIndex.get(startIndex) ?? 0;

  try {
    const discardedCount = tabs.filter(t => t.discarded).length;
    console.debug('[SkipUnloadedTabs] Command direction:', direction, 'total tabs:', tabs.length, 'discarded:', discardedCount, 'startPos:', startPos);
  } catch (_) {}

  const targetPos = findTargetIndex(tabs, startPos, direction);
  if (targetPos === -1) {
    try { console.debug('[SkipUnloadedTabs] No loaded target tab found.'); } catch (_) {}
    return;
  }

  const targetTab = tabs[targetPos];
  try { console.debug('[SkipUnloadedTabs] Activating tab id:', targetTab.id, 'index:', targetTab.index, 'url:', targetTab.url); } catch (_) {}
  await browser.tabs.update(targetTab.id, { active: true });
}

browser.commands.onCommand.addListener((command) => {
  try { console.debug('[SkipUnloadedTabs] onCommand:', command); } catch (_) {}
  if (command === 'next-loaded-tab') {
    activateLoadedTab(+1).catch(console.error);
  } else if (command === 'prev-loaded-tab') {
    activateLoadedTab(-1).catch(console.error);
  }
});
