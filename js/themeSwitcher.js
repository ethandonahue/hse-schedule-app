try{
  if(getTheme() == "dark"){
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById("checkbox").checked = true;
  } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.getElementById("checkbox").checked = false;
  }
} catch {

}

function onLoadCheckTheme(){
  try{
    if(getTheme() == "dark"){
      document.documentElement.setAttribute('data-theme', 'dark');
      document.getElementById("checkbox").checked = true;
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById("checkbox").checked = false;
    }
  } catch {

  }
}

function switchTheme() {
if (document.getElementById("checkbox").checked) {
  document.documentElement.setAttribute('data-theme', 'dark');
  setTheme("dark");
}
else {
  document.documentElement.setAttribute('data-theme', 'light');
  setTheme("light");
}
}
