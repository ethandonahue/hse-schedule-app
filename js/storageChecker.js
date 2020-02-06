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

if(localStorage.popups == undefined){
  localStorage.popups = JSON.stringify({});
}

function setLunch(lunch){
  if(lunch != "A" && lunch != "B" && lunch !="C" && lunch != "NONE" && lunch != "ALL"){
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
  } else if(getLunch() == "NONE"){
    lunchElement = document.getElementById("noLunch");
  } else {
    lunchElement = document.getElementById("allLunch");
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

function addPopId(id){
  var pop = JSON.parse(localStorage.popups);
  pop[id] = false;
  localStorage.popups = JSON.stringify(pop);
}

function popupSeen(id){
  var pop = JSON.parse(localStorage.popups);
  return pop[id];
}

function popupSetSeen(id){
  var pop = JSON.parse(localStorage.popups);
  pop[id] = true;
  localStorage.popups = JSON.stringify(pop);
}
