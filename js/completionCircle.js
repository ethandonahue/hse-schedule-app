//Developed By: Isaac Robbins
//For Use With: HSE Schedule App

var canvas, surface;

var startingPos = 1.5 * Math.PI;

fgColorCircle = "#FFFFFF";
bgColorCircle = "#6698FF";

SheetsPlus.whenNotEquals("period", "undefined", getCanvas);

function getCanvas(){
  canvas = document.getElementById("completionCircle");
  surface = canvas.getContext("2d");
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  setInterval(() => {
    surface.clearRect(0, 0, canvas.width, canvas.height);
    if(period != undefined){
      //surface.fillRect(0, 0, canvas.width, canvas.height);
      completeCircle(1 - TimePlus.toSeconds(TimePlus.timeBetween(TimePlus.getCurrentTime(), period.endTime)) / TimePlus.toSeconds(TimePlus.timeBetween(period.startTime, period.endTime)));
    }
  }, 10);
}

function resizeCanvas(){
  if(landOrPort() == "landscape"){
    canvas.style.width = window.innerWidth * 0.5 + "px";
    canvas.style.height = window.innerHeight * 0.8 + "px";
    canvas.width = window.innerWidth * 0.5 * window.devicePixelRatio;
    canvas.height = window.innerHeight * 0.8 * window.devicePixelRatio;
  } else {
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight * 0.35 + "px";
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * 0.35 * window.devicePixelRatio;
  }
  surface.scale(window.devicePixelRatio, window.devicePixelRatio);
  completeCircle(1 - TimePlus.toSeconds(TimePlus.timeBetween(TimePlus.getCurrentTime(), period.endTime)) / TimePlus.toSeconds(TimePlus.timeBetween(period.startTime, period.endTime)));
}

function completeCircle(percentage){
  var width = canvas.style.width.substring(0, canvas.style.width.indexOf("px"));
  var height = canvas.style.height.substring(0, canvas.style.height.indexOf("px"));
  var radius = width / 3;
  var endingPos = (percentage * 2 * Math.PI) - (0.5 * Math.PI);
  if(endingPos == startingPos){
    endingPos = 3.5 * Math.PI;
  }
  if(landOrPort() == "portrait"){
    radius = height / 2.1;
  }
  surface.beginPath();
  surface.strokeStyle = bgColorCircle;
  surface.lineWidth = 2;
  surface.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
  surface.stroke();
  surface.beginPath();
  surface.strokeStyle = fgColorCircle;
  surface.lineWidth = 5;
  surface.arc(width / 2, height / 2, radius, startingPos, endingPos);
  surface.stroke();
}
