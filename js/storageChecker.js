if(typeof(Storage) != "undefined"){
  if(localStorage.selectedLunch == "A" || localStorage.selectedLunch == "B" || localStorage.selectedLunch == "C" || localStorage.selectedLunch == "NONE"){
    if(window.location.pathname == "/" || window.location.pathname == "/index.html"){
      window.location.replace("/screens/online/home.html");
    }
  } else {
    if(window.location.pathname == "/" && window.location.pathname != "/index.html"){
      window.location.replace("/index.html");
    }
  }
  //console.log("LocalStorage Was Able To Be Accessed");
} else {
  //console.log("LocalStorage Is Unable To Be Accessed");
}

function setLunch(lunch){
  if(lunch != "A" && lunch != "B" && lunch !="C" && lunch != "NONE"){
    console.error("Incorrect Lunch Type Entered");
    return;
  }
  localStorage.selectedLunch = lunch;
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
