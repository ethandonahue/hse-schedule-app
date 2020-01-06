if(typeof(Storage) != undefined){
  if(localStorage.selectedLunch != undefined){
    if(window.location.pathname == "/" || window.location.pathname == "/index.html"){
      window.location.replace("/screens/online/main.html");
    }
  } else {
    if(window.location.pathname != "/" && window.location.pathname != "/index.html"){
      window.location.replace("/index.html");
    }
  }
} else {

}

function setLunch(lunch){
  if(lunch != "A" && lunch != "B" && lunch !="C" && lunch != "NONE"){
    console.error("Incorrect Lunch Type Entered");
    return;
  }
  localStorage.selectedLunch = lunch;
}

function getLunch(){
  return localStorage.selectedLunch;
}

function setTheme(theme){
  localStorage.theme = theme;
}

function getTheme(){
  return localStorage.theme;
}

function saveSchedules(schedules, month, layout){
  localStorage.schedules = JSON.stringify(schedules);
  localStorage.schedulesMonth = month;
  localStorage.schedulesLayout = layout;
}

function getSavedSchedules(){
  return {
    "schedules":JSON.parse(localStorage.schedules),
    "month":localStorage.schedulesMonth,
    "layout":localStorage.schedulesLayout
  };
}
