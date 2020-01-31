//Developed By: Isaac Robbins
//For Use With: HSE Schedule App

const googleSheetURL = "https://docs.google.com/spreadsheets/d/1QBUjDIa7H-UhTKOe7znd2h9XYn1uDeuZrXzuR0C7KYk/gviz/tq?sheet=";

const globalTime = new DateTime();
const schedules = new Schedules(globalTime.getDate().monthName);
const monthlyRawData = new Sheet(googleSheetURL);
var monthlyLayout = undefined;
var schedulesRequired = undefined;
var currentSchedule = undefined;
var personalSchedule = undefined;
var periodTimeLeft = undefined;
var periodHeader = undefined;
var periodShowLower = undefined;
var showLunch = undefined;

/*saveSchedules(schedules, TimePlus.getCurrentDate().monthName, schedulesPerWeek);
if(localStorage.day != TimePlus.getCurrentDate().dayOfMonth){
  localStorage.day = TimePlus.getCurrentDate().dayOfMonth;
  deleteCalendar();
  generateCalendar();
}
if(mostRecentVersion() != true){
  delete localStorage.firstLoadedLayout;
  delete localStorage.firstLoadedSchedule;
  window.location.reload();
}*/

preupdate();

async function preupdate(){
  await loadGoogleCharts();
  //if(localStorage.schedules == undefined){
    await refreshSchedules();
  //} else {
    //monthlyLayout = localStorage.schedulesLayout;
    //schedulesRequired = localStorage.schedules;
  //}
  update();
  setTimeout(refreshSchedules, 5000);
}

function update(){
  globalTime.update();
  try{
    currentSchedule = schedulesRequired[monthlyLayout[globalTime.getDate().dayOfMonth - 1]].clone();
    personalSchedule = schedulesRequired[monthlyLayout[globalTime.getDate().dayOfMonth - 1]].clone();
    currentSchedule.updateTimes();
    personalSchedule.updateTimes();
  } catch {
    currentSchedule = schedulesRequired[monthlyLayout[0]].clone();
    personalSchedule = schedulesRequired[monthlyLayout[0]].clone();
    currentSchedule.removeCustomDates();
    personalSchedule.removeCustomDates();
  }
  personalizeSchedule();
  setCurrentPeriod(currentSchedule);
  setCurrentPeriod(personalSchedule);
  periodHeader = getPeriodHeader();
  periodTimeLeft = getPeriodTimeLeft();
  updateDisplays();
  createScheduleTable();
  window.requestAnimationFrame(update);
}

async function refreshSchedules(){
  await monthlyRawData.getRawData();
  await schedules.setSchedules(googleSheetURL, monthlyRawData.rawData);
  monthlyLayout = schedules.getScheduleLayout();
  schedulesRequired = schedules.getRequiredSchedules();
  localStorage.schedulesLayout = JSON.stringify(schedules.getScheduleLayout());
  localStorage.schedules = JSON.stringify(schedules.getRequiredSchedules());
  setTimeout(refreshSchedules, 5000);
}

function personalizeSchedule(){
  var lunchIndexes = [];
  for(var p = 0; p < personalSchedule.layout.length; p++){
    if(personalSchedule.layout[p].isLunch){
      lunchIndexes.push(p);
    }
  }
  if(lunchIndexes.length > 0){
    for(var l = 0; l < lunchIndexes.length; l++){
      if(personalSchedule.layout[lunchIndexes[l]].lunchName != undefined && personalSchedule.layout[lunchIndexes[l]].lunchName.contains(localStorage.selectedLunch)){
        switch(l){
          case 0:
            var me = personalSchedule.layout[lunchIndexes[0]];
            var middle = personalSchedule.layout[lunchIndexes[1]];
            var end = personalSchedule.layout[lunchIndexes[2]];
            me.setDisplayName(me.lunchName);
            middle.setDisplayName(me.notLunchName);
            middle.setTimes(middle.startTime.getTimeAsString(), end.endTime.getTimeAsString());
            personalSchedule.layout.splice(lunchIndexes[2], 1);
            personalSchedule.lunchPeriod = lunchIndexes[0];
            break;
          case 1:
            var start = personalSchedule.layout[lunchIndexes[0]];
            var me = personalSchedule.layout[lunchIndexes[1]];
            var end = personalSchedule.layout[lunchIndexes[2]];
            me.setDisplayName(me.lunchName);
            start.setDisplayName(start.notLunchName);
            end.setDisplayName(end.notLunchName);
            personalSchedule.lunchPeriod = lunchIndexes[1];
            break;
          case 2:
            var start = personalSchedule.layout[lunchIndexes[0]];
            var middle = personalSchedule.layout[lunchIndexes[1]];
            var me = personalSchedule.layout[lunchIndexes[2]];
            me.setDisplayName(me.lunchName);
            start.setDisplayName(start.notLunchName);
            start.setTimes(start.startTime.getTimeAsString(), middle.endTime.getTimeAsString());
            personalSchedule.layout.splice(lunchIndexes[1], 1);
            personalSchedule.lunchPeriod = lunchIndexes[2] - 1;
            break;
        }
      }
    }
  }
}

function setCurrentPeriod(schedule){
  periodShowLower = true;
  showLunch = true;
  if(globalTime.getTimeInSeconds() <= schedule.schoolStartTime.getTimeInSeconds()){
    schedule.currentPeriod = "Before School";
    periodShowLower = false;
    showLunch = true;
    return;
  }
  if(globalTime.getTimeInSeconds() >= schedule.schoolEndTime.getTimeInSeconds()){
    schedule.currentPeriod = "After School";
    periodShowLower = false;
    showLunch = false;
    return;
  }
  for(var p = 0; p < schedule.layout.length; p++){
    if(globalTime.isBetween(schedule.layout[p].startTime, schedule.layout[p].endTime)){
      schedule.currentPeriod = p;
      return;
    }
  }
  if(schedule.layout[0].periodNum == "Special Day"){
    schedule.currentPeriod = 0;
    showLunch = false;
    if(schedule.layout[0].lowerDisplayName == false){
      periodShowLower = false;
    } else {
      periodShowLower = true;
    }
    return;
  }
  return;
}

function getPeriodHeader(){
  if(personalSchedule.currentPeriod == false){
    try{
      if(personalSchedule.layout[personalSchedule.currentPeriod].displayName != false){
        return personalSchedule.layout[personalSchedule.currentPeriod].displayName;
      } else {
        return "Header";
      }
    } catch {
      return "Header";
    }
  } else if(personalSchedule.currentPeriod == "Before School"){
    return "School Starts In";
  } else if(personalSchedule.currentPeriod == "After School"){
    return "School Has Ended";
  } else {
    return personalSchedule.layout[personalSchedule.currentPeriod].displayName;
  }
}

function getPeriodTimeLeft(){
  if(personalSchedule.currentPeriod == false){
    try{
      if(personalSchedule.layout[personalSchedule.currentPeriod].customPeriodTime != false){
        return personalSchedule.layout[personalSchedule.currentPeriod].customPeriodTime;
      } else {
        return "Time";
      }
    } catch {
      return "Time";
    }
  } else if(personalSchedule.currentPeriod == "Before School"){
    return formatTimeLeft(globalTime.getTimeUntil(personalSchedule.schoolStartTime));
  } else if(personalSchedule.currentPeriod == "After School"){
    return "No Time Available";
  } else if(personalSchedule.currentPeriod == "Special Day"){
    return ;
  } else {
    return formatTimeLeft(globalTime.getTimeUntil(personalSchedule.layout[personalSchedule.currentPeriod].endTime));
  }
}

function formatTimeLeft(obj){
  var string = "";
  if(obj.hour != 0){
    string += obj.hour + ":";
    if(obj.minute < 10){
      string += "0";
    }
  }
  string += obj.minute + ":";
  if(obj.second < 10){
    string += "0" + obj.second;
  } else {
    string += obj.second;
  }
  return string;
}

function updateDisplays(){
  document.getElementById("currentDayText").textContent = globalTime.getDate().dayName;
  document.getElementById("currentWeekText").textContent = globalTime.getDateAsString();
  document.getElementById("currentTimeText").textContent = globalTime.getTimeAsString();
  document.getElementById("timeHeader").textContent = periodHeader;
  document.getElementById("timeText").textContent = periodTimeLeft;
  if(periodShowLower && personalSchedule.layout[personalSchedule.currentPeriod] != undefined && personalSchedule.layout[personalSchedule.currentPeriod].lowerDisplayName != false){
    document.getElementById("timeSecondaryHeader").textContent = personalSchedule.layout[personalSchedule.currentPeriod].lowerDisplayName;
    document.getElementById("timeSecondaryHeader").style.display = "block";
  } else {
    document.getElementById("timeSecondaryHeader").style.display = "none";
  }
  try{
    if(showLunch && globalTime.getTimeInSeconds() < personalSchedule.layout[personalSchedule.lunchPeriod].startTime.getTimeInSeconds()){
      document.getElementById("lunchText").textContent = "Time Until " + personalSchedule.layout[personalSchedule.lunchPeriod].lunchName;
      document.getElementById("lunchTime").textContent = formatTimeLeft(globalTime.getTimeUntil(personalSchedule.layout[personalSchedule.lunchPeriod].startTime));
      document.getElementById("lunch").style.display = "table-cell";
    } else {
      document.getElementById("lunch").style.display = "none";
    }
  } catch {
    document.getElementById("lunch").style.display = "none";
  }
}
