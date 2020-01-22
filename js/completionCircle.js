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
    canvas.width = window.screen.width * 0.5;
    canvas.height = window.screen.height * 0.8;
  } else {
    canvas.width = window.screen.width;
    canvas.height = window.screen.height * 0.32;
  }
  if(isAppleDevice() && !inStandalone()){
    if(landOrPort() == "landscape"){
      canvas.width = window.innerWidth * 0.5;
      canvas.height = window.innerHeight * 0.8;
    } else {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.35;
    }
  }
  if(inStandalone()){
    if(landOrPort() == "landscape"){
      canvas.width = window.innerWidth * 0.5;
      canvas.height = window.innerHeight * 0.8;
    } else {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.35;
    }
  }
  completeCircle(1 - TimePlus.toSeconds(TimePlus.timeBetween(TimePlus.getCurrentTime(), period.endTime)) / TimePlus.toSeconds(TimePlus.timeBetween(period.startTime, period.endTime)));
}

function completeCircle(percentage){
  var radius = canvas.width / 3;
  var endingPos = (percentage * 2 * Math.PI) - (0.5 * Math.PI);
  if(endingPos == startingPos){
    endingPos = 3.5 * Math.PI;
  }
  if(landOrPort() == "portrait"){
    radius = canvas.height / 2.1;
  }
  surface.beginPath();
  surface.strokeStyle = bgColorCircle;
  surface.lineWidth = 2;
  surface.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
  surface.stroke();
  surface.beginPath();
  surface.strokeStyle = fgColorCircle;
  surface.lineWidth = 5;
  surface.arc(canvas.width / 2, canvas.height / 2, radius, startingPos, endingPos);
  surface.stroke();
}
