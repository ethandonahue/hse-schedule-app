function showPopup(header, message, id){
  if(popupSeen(id) == false){
      document.getElementById("popup-header").innerHTML = header;
      document.getElementById("popup-message").innerHTML = message;
      document.getElementById("popup").setAttribute("class", "showDIV");
      popupSetSeen(id);
  } else if(popupSeen(id) == -1){
    addPopId(id);
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
