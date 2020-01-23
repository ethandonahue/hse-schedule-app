var showingPopId = null;

function showPopup(header, message, id){
  if(popupSeen(id) == undefined){
    addPopId(id);
  }
  if(showingPopId == null){
    if(popupSeen(id) == false){
        document.getElementById("popup-header").innerHTML = header;
        document.getElementById("popup-message").innerHTML = message;
        document.getElementById("popup").setAttribute("class", "showDIV");
        showingPopId = id;
    }
  }
}

function hidePopup(){
  document.getElementById("popup").setAttribute("class", "hideDIV");
  popupSetSeen(showingPopId);
  if(showingPopId == "apple-installer"){
    showingPopId = null;
    recentUpdate();
  } else {
    showingPopId = null;
  }
}

window.ontouchstart = function(event){
  hidePopup();
}
window.onclick = function(event){
  hidePopup();
}
window.ontouch = function(event){
  hidePopup();
}

function appleInstaller(){
  if(isAppleDevice() && !inStandalone()){
    showPopup("Install On iOS", "1. Click the 'share' icon at the bottom of the screen.<br><br>2. Click 'Add to Home Screen'<br><br>3. Click 'Add'", "apple-installer");
  }
}

function recentUpdate(){  //Don't forget to change the update id
  showPopup("Recent Update:", "-Added notification pop-ups<br><br>-Bell Schedule Highlighting Fixes<br><br>-Completion Circle Enhancements", "Update-1");
}
