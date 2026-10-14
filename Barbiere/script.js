// Zaza Barber Shop - interazioni
(function () {
  'use strict';

  const SHOP_WHATSAPP = '393475243935';

  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');

  // Header con sfondo allo scroll
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu mobile
  const toggleMenu = (open) => {
    menu.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
  };
  burger.addEventListener('click', () => toggleMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });

  // Pulsanti "Prenota": precompilano il messaggio con il servizio
  const msg = document.getElementById('messaggio');
  document.querySelectorAll('[data-service]').forEach((btn) => {
    btn.addEventListener('click', () => {
      msg.value = 'Vorrei prenotare: ' + btn.dataset.service + '. Giorno/orario preferito: ';
      setTimeout(() => document.getElementById('nome').focus({ preventScroll: true }), 600);
    });
  });

  // Animazioni in ingresso
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('visible'));
  }

  // Form: validazione e invio della richiesta via WhatsApp al negozio
  const form = document.getElementById('booking-form');
  const status = document.getElementById('form-status');

  const setError = (input, text) => {
    const field = input.closest('.field');
    field.classList.toggle('invalid', !!text);
    field.querySelector('.error').textContent = text || '';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = form.nome, tel = form.telefono, mess = form.messaggio;
    let ok = true;

    if (nome.value.trim().length < 2) { setError(nome, 'Inserisci il tuo nome.'); ok = false; } else setError(nome);
    if (!/^[+\d][\d\s./-]{7,}$/.test(tel.value.trim())) { setError(tel, 'Inserisci un numero di telefono valido.'); ok = false; } else setError(tel);
    if (mess.value.trim().length < 5) { setError(mess, 'Scrivi un breve messaggio.'); ok = false; } else setError(mess);
    if (!ok) { status.textContent = ''; return; }

    const text = 'Ciao Zaza Barber Shop! Richiesta appuntamento\n' +
      'Nome: ' + nome.value.trim() + '\n' +
      'Telefono: ' + tel.value.trim() + '\n' +
      'Messaggio: ' + mess.value.trim();
    window.open('https://wa.me/' + SHOP_WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    status.textContent = 'Grazie! Si è aperto WhatsApp con la tua richiesta: premi invio per mandarla. In alternativa chiamaci al 347 524 3935.';
    form.reset();
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
