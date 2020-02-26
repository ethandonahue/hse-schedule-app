// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
vhSet();
window.addEventListener('resize', () => {
  // We execute the same script as before
  vhSet();
});

function vhSet(){
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
