var screens = ["ABOUT SCREEN", "BELLSCHEDULE SCREEN", "HOME SCREEN", "CALENDAR SCREEN", "SETTINGS SCREEN"];
var buttons = ["aboutButton", "bellButton", "homeButton", "calendarButton", "settingsButton"];
var icons = ["about.png", "schedule.png", "home.png", "calendar.png", "settings.png"];

function showSection(section){
  switch(section){
    case "about":
      display(0);
      highlightButton(0);
      break;
    case "bell":
      display(1);
      highlightButton(1);
      break;
    case "home":
      display(2);
      highlightButton(2);
      break;
    case "calendar":
      display(3);
      highlightButton(3);
      break;
    case "settings":
      display(4);
      highlightButton(4);
      break;
    default:
      if(window.location.hash == ""){
        showSection("home");
      } else {
        showSection(window.location.hash.replace("#", ""));
      }
      break;
  }
  if(section != ""){
    window.location.hash = section;
  }
}

function display(screen){
  screens.forEach((scr) => {
    document.getElementById(scr).setAttribute("class", "hideDIV");
  });
  document.getElementById(screens[screen]).setAttribute("class", "showDIV");
}

function highlightButton(button){
  buttons.forEach((btn) => {
    if(document.getElementById(btn) != null && document.getElementById(btn).firstElementChild){
      document.getElementById(btn).firstElementChild.removeAttribute("id");
      document.getElementById(btn).firstElementChild.lastElementChild.setAttribute("src", "/images/unselected/" + icons[buttons.indexOf(btn)]);
    }
  });
  document.getElementById(buttons[button]).firstElementChild.setAttribute("id", "selectedNavButton");
  document.getElementById(buttons[button]).firstElementChild.lastElementChild.setAttribute("src", "/images/selected/" + icons[button]);
}
