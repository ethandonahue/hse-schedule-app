//Developed By: Isaac Robbins
//For Use With: HSE Schedule App

//const googleSheetURL = "https://docs.google.com/spreadsheets/d/1QBUjDIa7H-UhTKOe7znd2h9XYn1uDeuZrXzuR0C7KYk/gviz/tq?sheet=";

const globalTime = new DateTime();
const scheduless = new Schedules(globalTime.getDate().monthName);
const monthlyRawData = new Sheet(googleSheetURL);
var monthlyLayout = undefined;
var schedulesRequired = undefined;
var currentSchedule = undefined;
var personalSchedule = undefined;
var timeLeft = undefined;

preupdate();

async function preupdate(){
  await loadGoogleCharts();
  if(localStorage.schedules != undefined){
    await refreshSchedules();
    console.log(scheduless);
  } else {

  }
  update();
}

function update(){
  globalTime.update();
  currentSchedule = cloneObject(schedulesRequired[monthlyLayout[globalTime.getDate().dayOfMonth - 1]]);
  personalSchedule = cloneObject(currentSchedule);
  personalizeSchedule();
  setCurrentPeriod(currentSchedule);
  setCurrentPeriod(personalSchedule);
  timeLeft = globalTime.getTimeUntil(personalSchedule.layout[personalSchedule.currentPeriod].endTime);
  updateDisplays();
  window.requestAnimationFrame(update);
}

async function refreshSchedules(){
  await monthlyRawData.getRawData();
  await scheduless.setSchedules(googleSheetURL, monthlyRawData.rawData);
  monthlyLayout = scheduless.getScheduleLayout();
  schedulesRequired = scheduless.getRequiredSchedules();
}

function personalizeSchedule(){

}

function setCurrentPeriod(schedule){
  for(var p = 0; p < schedule.layout.length; p++){
    if(globalTime.isBetween(schedule.layout[p].startTime, schedule.layout[p].endTime)){
      schedule.currentPeriod = p;
      return;
    }
  }
}

function formatTimeLeft(){
  var string = "";
  if(timeLeft.hour != 0){
    string += timeLeft.hour + ":";
  }
  string += timeLeft.minute + ":";
  if(timeLeft.second < 10){
    string += "0" + timeLeft.second;
  } else {
    string += timeLeft.second;
  }
  return string;
}

function updateDisplays(){
  document.getElementById("currentDayText").textContent = globalTime.getDate().dayName;
  document.getElementById("currentWeekText").textContent = globalTime.getDateAsString();
  document.getElementById("currentTimeText").textContent = globalTime.getTimeAsString();
  document.getElementById("timeHeader").textContent = personalSchedule.layout[personalSchedule.currentPeriod].displayName;
  if(personalSchedule.layout[personalSchedule.currentPeriod].lowerDisplayName == false){
    document.getElementById("timeSecondaryHeader").style.display = "none";
  } else {
    document.getElementById("timeSecondaryHeader").textContent = personalSchedule.layout[personalSchedule.currentPeriod].lowerDisplayName;
    document.getElementById("timeSecondaryHeader").style.display = "block";
  }
  document.getElementById("timeText").textContent = formatTimeLeft();
  if(personalSchedule.layout[personalSchedule.currentPeriod].isLunch == false){
    document.getElementById("lunch").style.display = "none";
  } else {
    document.getElementById("lunchText").textContent = personalSchedule.layout[personalSchedule.currentPeriod].lunchName;
    //document.getElementById("lunchTime").textContent = lunchtime;
    document.getElementById("lunch").style.display = "table-cell";
  }
}
