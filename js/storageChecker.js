if(typeof(Storage) != undefined){
  if(localStorage.selectedLunch != undefined){
    if(window.location.pathname == "/" || window.location.pathname == "/index.html"){
      window.location.replace("/main.html");
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
  selectLunch();
}

function selectLunch(){
  removeSelectedLunch();
  var lunchElement;

  if(getLunch() == "A"){
    lunchElement = document.getElementById("aLunch");
  } else if (getLunch() == "B"){
    lunchElement = document.getElementById("bLunch");
  } else if (getLunch() == "C"){
    lunchElement = document.getElementById("cLunch");
  } else {
    lunchElement = document.getElementById("noLunch");
  }

  lunchElement.classList.add("selectedLunch");

}

function removeSelectedLunch(){
  for(var i = 0; i < document.getElementsByClassName("selectedLunch").length; i++){
    document.getElementsByClassName("selectedLunch")[i].classList.remove("selectedLunch");
  }
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
  if(localStorage.firstLoadedSchedule == undefined){
    localStorage.firstLoadedSchedule = JSON.stringify(schedules);
  }
  if(localStorage.firstLoadedLayout == undefined){
    localStorage.firstLoadedLayout = layout;
  }
}

function getSavedSchedules(){
  return {
    "schedules":JSON.parse(localStorage.schedules),
    "month":localStorage.schedulesMonth,
    "layout":localStorage.schedulesLayout
  };
}

function mostRecentVersion(){
  if(localStorage.firstLoadedLayout != undefined && localStorage.firstLoadedSchedule != undefined){
    if(localStorage.schedulesLayout == localStorage.firstLoadedLayout && localStorage.schedules == localStorage.firstLoadedSchedule){
      return true;
    }
    return false;
  }
  return true;
}
