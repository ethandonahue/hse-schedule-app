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
    toggleSwitch.disabled = true;
    setTimeout(() => {
      toggleSwitch.disabled = false;
    }, 400);
  }
  else {
    document.documentElement.setAttribute('data-theme', 'light');
    setTheme("light");
    toggleSwitch.disabled = true;
    setTimeout(() => {
      toggleSwitch.disabled = false;
    }, 400);
  }
}
toggleSwitch.addEventListener('change', switchTheme, false);
