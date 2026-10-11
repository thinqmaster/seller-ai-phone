// SELLER AI 원격 바로가기 — 서버 없이 이 폰 안에서만 동작합니다. 비밀번호·카드·주문 정보를 받거나 보내지 않습니다.
(() => {
  const $ = id => document.getElementById(id);
  const DEFAULT_REMOTE = 'https://remotedesktop.google.com/access';
  const STORES = {
    android: ['Chrome 원격 데스크톱 (플레이스토어)', 'https://play.google.com/store/apps/details?id=com.google.chromeremotedesktop'],
    ios: ['Chrome Remote Desktop (앱스토어)', 'https://apps.apple.com/app/chrome-remote-desktop/id944025852'],
    other: ['Chrome 원격 데스크톱', 'https://remotedesktop.google.com/access']
  };
  const store = {
    get(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  const okUrl = v => /^https:\/\/[^\s]+$/i.test(String(v || '').trim());
  const remoteUrl = () => { const v = store.get('remoteUrl'); return okUrl(v) ? v : DEFAULT_REMOTE; };

  function draw() {
    $('open').href = remoteUrl();
    const s = STORES[isIOS ? 'ios' : isAndroid ? 'android' : 'other'];
    $('storeNote').textContent = s[0];
    $('store').href = s[1];
    document.querySelectorAll('#steps input[data-s]').forEach(c => { c.checked = store.get('step' + c.dataset.s) === '1'; });
    $('installNote').textContent = standalone ? '이미 홈 화면 앱으로 열려 있어요.'
      : isIOS ? '아이폰은 반드시 사파리에서: 아래 공유 버튼 → 「홈 화면에 추가」. (알림은 이 홈 화면 앱에서만 옵니다 · iOS 16.4 이상)'
      : isAndroid ? '크롬 오른쪽 위 ⋮ → 「앱 설치」 또는 「홈 화면에 추가」.'
      : '폰의 크롬(안드로이드) 또는 사파리(아이폰)에서 이 주소를 열어 홈 화면에 추가하세요.';
    $('ru').value = store.get('remoteUrl');
  }
  document.querySelectorAll('#steps input[data-s]').forEach(c => c.addEventListener('change', () => store.set('step' + c.dataset.s, c.checked ? '1' : '0')));
  $('sv').onclick = () => {
    const v = ($('ru').value || '').trim();
    if (okUrl(v)) { store.set('remoteUrl', v); draw(); } else { $('ru').value = ''; $('ru').placeholder = 'https:// 로 시작하는 주소만 저장돼요'; }
  };
  $('rs').onclick = () => { store.set('remoteUrl', ''); draw(); };
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  draw();
})();
