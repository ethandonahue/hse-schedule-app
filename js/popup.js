function showPopup(header, message, id){
  if(popupSeen(id) == undefined){
    addPopId(id);
  }
  if(popupSeen(id) == false || popupSeen(id) == true){
      document.getElementById("popup-header").innerHTML = header;
      document.getElementById("popup-message").innerHTML = message;
      document.getElementById("popup").setAttribute("class", "showDIV");
      popupSetSeen(id);
  }
}

function hidePopup(){
  document.getElementById("popup").setAttribute("class", "hideDIV");
}

window.onclick = function(event){
  hidePopup();
}
window.ontouch = function(event){
  hidePopup();
}

function appleInstaller(){
  if(isAppleDevice()){
    //showPopup("Install On iOS", "1. Click the 'share' icon at the bottom of the screen.<br><br>2. Click 'Add to Home Screen'<br><br>3. Click 'Add'", "apple-installer");
  }
}
