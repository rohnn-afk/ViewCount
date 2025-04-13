(function () {
  // Prevent reloading the script multiple times
  if (window.Analytics) return;

  const API_URL = 'https://viewcount-backend.onrender.com/api/event';

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function getVisitorId() {
    let id = localStorage.getItem('visitorId');
    if (!id) {
      id = generateUUID();
      localStorage.setItem('visitorId', id);
    }
    return id;
  }

  function collectMetadata() {
    return {
      visitorId: getVisitorId(),
      url: location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
  }

  let apiKey = null;
  let initialized = false;

  function sendEvent(eventType, extra = {}) {
    if (!apiKey) return console.warn('[Analytics] Not initialized');
    const body = {
      eventType,
      metadata: { ...collectMetadata(), ...extra },
      apiKey
    };
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).catch(console.error);
  }

  function trackScroll() {
    let sent = false;
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY + window.innerHeight;
      const height = document.body.offsetHeight;
      const percent = (scroll / height) * 100;
      if (percent > 75 && !sent) {
        sent = true;
        sendEvent('scroll', { percent: 75 });
      }
    });
  }

  function trackClicks() {
    document.addEventListener('click', e => {
      const tag = e.target.tagName;
      if (!['A', 'BUTTON', 'INPUT', 'LABEL'].includes(tag)) return; // filter noise
      const text = e.target.innerText?.slice(0, 50);
      sendEvent('click', { tag, text });
    });
  }

  function trackPageView() {
    sendEvent('pageview');
  }

  window.Analytics = {
    init: function (key) {
      if (initialized) return;
      initialized = true;
      apiKey = key;
      trackPageView();
      trackClicks();
      trackScroll();
    },
    track: function (type, metadata = {}) {
      sendEvent(type, metadata);
    }
  };
})();
