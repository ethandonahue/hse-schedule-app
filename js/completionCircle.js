var canvas, surface;

var startingPos = 1.5 * Math.PI;

var fgColor = "#FFFFFF";
var bgColor = "#6698FF";

function getCanvas(){
  canvas = document.getElementById("completionCircle");
  canvas.width = window.innerWidth * 0.4;
  canvas.height = window.innerHeight * 0.54;
  surface = canvas.getContext("2d");
  //surface.fillRect(0, 0, canvas.width, canvas.height);
  completeCircle(0.5);
  setInterval(() => {
    canvas.width = window.innerWidth * 0.5;
    canvas.height = window.innerHeight * 0.8;
    completeCircle(1 - TimePlus.toSeconds(TimePlus.timeBetween(TimePlus.getCurrentTime(), period.endTime)) / TimePlus.toSeconds(TimePlus.timeBetween(period.startTime, period.endTime)));
  }, 100);
}

function completeCircle(percentage){
  var endingPos = (percentage * 2 * Math.PI) - (0.5 * Math.PI);
  if(endingPos == startingPos){
    endingPos = 3.5 * Math.PI;
  }
  surface.beginPath();
  surface.strokeStyle = bgColor;
  surface.lineWidth = 2;
  surface.arc(canvas.width / 2, canvas.height / 2, canvas.width / 3, 0, 2 * Math.PI);
  surface.stroke();
  surface.beginPath();
  surface.strokeStyle = fgColor;
  surface.lineWidth = 5;
  surface.arc(canvas.width / 2, canvas.height / 2, canvas.width / 3, startingPos, endingPos);
  surface.stroke();
}
