const menu = document.getElementById('menu');

document.getElementById('menuBtn').onclick = () => {
  menu.classList.toggle('hidden');
  menu.classList.toggle('flex');
};

menu.querySelectorAll('a').forEach(a => a.onclick = () => {
  menu.classList.add('hidden');
  menu.classList.remove('flex');
});