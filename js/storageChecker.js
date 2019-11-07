if(typeof(Storage) != "undefined"){
  if(localStorage.selectedLunch){
    if(window.location.pathname != "/screens/online/home.html"){
      window.location.replace("/screens/online/home.html");
    }
  } else {
    if(window.location.pathname != "/index.html"){
      window.location.replace("/index.html");
    }
  }
  //console.log("LocalStorage Was Able To Be Accessed");
} else {
  //console.log("LocalStorage Is Unable To Be Accessed");
}

function setLunch(lunch){
  localStorage.selectedLunch = lunch;
}