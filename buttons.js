const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
 
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    tabPanels.forEach(p => {
      p.classList.remove('active');
      p.hidden = true;
    });
 
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
 
    const panel = document.getElementById('panel-' + btn.dataset.tab);
    panel.classList.add('active');
    panel.hidden = false;
  });
});
 