var mobileWindow = document.getElementsByClassName("homeContent")[0];

changeHeight();

function changeHeight(){
  var innerSize = window.innerHeight;
  mobileWindow.style.height = innerSize * .81 +  "px";
  mobileWindow.style.paddingTop = innerSize * .02 + "px";
  mobileWindow.style.paddingBottom = innerSize * .04 + "px";
  mobileWindow.style.fontSize = innerSize * .025 + "px";
}

window.addEventListener("resize", changeHeight);
