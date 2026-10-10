// Gileno Gestão: menu do celular, revelação ao rolar e ano do rodapé.
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');

  var botao = document.querySelector('.botao-menu');
  var menu = document.querySelector('.menu');
  if (botao && menu) {
    botao.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botao.querySelector('i').className = aberto ? 'ri-close-line' : 'ri-menu-line';
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.classList.remove('aberto');
        botao.setAttribute('aria-expanded', 'false');
        botao.querySelector('i').className = 'ri-menu-line';
      }
    });
  }

  var alvos = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (itens) {
      itens.forEach(function (item) {
        if (item.isIntersecting) {
          item.target.classList.add('visivel');
          obs.unobserve(item.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    alvos.forEach(function (el) { obs.observe(el); });
  } else {
    alvos.forEach(function (el) { el.classList.add('visivel'); });
  }

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  // "Campanha do mês" no menu ganha a cor da campanha do mês (Outubro Rosa = rosa).
  // Mesmas 12 cores do calendário da página inicial (gera_calendario.py, que as tira
  // do meses.py da Agrodel) e o mesmo mês dele (new Date() do navegador). A cor é
  // clareada com branco só o necessário para o texto ter contraste 4,5:1 sobre o
  // fundo do topo (--fundo); 7 dos 12 meses precisam disso (fev, mar, abr, jun, out, nov, dez).
  var CORES = ['#7a8b99', '#6a3d9a', '#9c4dcc', '#2e7d32', '#c9960c', '#0f7b4f',
               '#c8860a', '#a97c1a', '#e6a700', '#d63384', '#1565c0', '#c62828'];
  var camp = document.querySelectorAll('.menu a[href$="#campanha-do-mes"]');
  if (camp.length) {
    var rgb = function (h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }); };
    var lum = function (c) {
      var l = c.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
    };
    var fundo = lum(rgb('#060b18')), base = rgb(CORES[new Date().getMonth()]), cor = base;
    for (var p = 0.05; p <= 1 && (lum(cor) + 0.05) / (fundo + 0.05) < 4.5; p += 0.05) {
      cor = base.map(function (v) { return Math.round(v + (255 - v) * p); });
    }
    camp.forEach(function (a) {
      a.style.setProperty('--cor-camp', 'rgb(' + cor.join(',') + ')');
      a.classList.add('camp-menu');
    });
  }
})();
