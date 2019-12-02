var toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');


if(getTheme() == "dark"){
  document.documentElement.setAttribute('data-theme', 'dark');
  document.getElementById("checkbox").checked = true;
} else {
    document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById("checkbox").checked = false;
}

function switchTheme(e) {
if (e.target.checked) {
  document.documentElement.setAttribute('data-theme', 'dark');
  setTheme("dark");
}
else {
  document.documentElement.setAttribute('data-theme', 'light');
  setTheme("light");
}
}
toggleSwitch.addEventListener('change', switchTheme, false);
