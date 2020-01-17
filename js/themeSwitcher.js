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
      fgColorCircle = "#FFFFFF";
      bgColorCircle = "#6698FF";
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById("checkbox").checked = false;
        fgColorCircle = "#6698FF";
        bgColorCircle = "#000000";
    }
  } catch {

  }
}

function switchTheme() {
if (document.getElementById("checkbox").checked) {
  document.documentElement.setAttribute('data-theme', 'dark');
  fgColorCircle = "#FFFFFF";
  bgColorCircle = "#6698FF";
  setTheme("dark");
}
else {
  document.documentElement.setAttribute('data-theme', 'light');
  fgColorCircle = "#6698FF";
  bgColorCircle = "#000000";
  setTheme("light");
}
}
