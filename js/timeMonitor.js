var schedulesPerWeek = [];

var useMilitaryTime = false;

const googleSheetURL = "https://docs.google.com/spreadsheets/d/1QBUjDIa7H-UhTKOe7znd2h9XYn1uDeuZrXzuR0C7KYk/gviz/tq?sheet=";

if(localStorage.schedules != undefined && localStorage.schedulesMonth == TimePlus.getCurrentDate().monthName){
  schedules = getSavedSchedules().schedules;
  schedulesPerWeek = getSavedSchedules().layout.split(",");
  window.requestAnimationFrame(refresh);
}

SheetsPlus.load();
SheetsPlus.whenNotEquals("google.visualization.Query", "undefined", getMonthlySchedule);

async function getMonthlySchedule(){
  rawMonthlySchedule = await SheetsPlus.get(googleSheetURL + encodeURIComponent("Monthly Planner"));
  neededSchedules = [];
  fullSchedule = {};
  var pos = 0;
  for(var week = 1; week < rawMonthlySchedule.wg.length; week++){
    for(var day = 0; day<rawMonthlySchedule.wg[week].c.length; day++){
      if(rawMonthlySchedule.wg[week].c[day] != null && rawMonthlySchedule.wg[week].c[day].v != null){
        schedulesPerWeek[pos] = rawMonthlySchedule.wg[week].c[day].v;
        pos++;
        if(!neededSchedules.includes(rawMonthlySchedule.wg[week].c[day].v)){
          neededSchedules.push(rawMonthlySchedule.wg[week].c[day].v);
        }
      }
    }
  }
  for(var schedule = 0; schedule < neededSchedules.length; schedule++){
    neededSchedules[schedule] = encodeURIComponent(neededSchedules[schedule]);
    var sched = await SheetsPlus.get(googleSheetURL + neededSchedules[schedule]);
    neededSchedules[schedule] = decodeURIComponent(neededSchedules[schedule]);
    var periodSchedule = [];
    if(sched.wg[0].c[1].v == "Start Time"){
      for(var wg = 1; wg < sched.wg.length; wg++){
        var name = sched.wg[wg].c[0];
        var startTime = sched.wg[wg].c[1];
        var endTime = sched.wg[wg].c[2];
        if(name != null){
          name = sched.wg[wg].c[0].v;
        }
        if(startTime != null){
          startTime = TimePlus.formattedToObject(sched.wg[wg].c[1].v);
        }
        if(endTime != null){
          endTime = TimePlus.formattedToObject(sched.wg[wg].c[2].v);
        }
        periodSchedule.push({
          "periodName":name,
          "startTime":startTime,
          "endTime":endTime,
          "periodNum":name.replace("Period", "").trim(),
          "passing":false
        });
        if(sched.wg[wg + 1] != undefined && sched.wg[wg].c[2].v != sched.wg[wg + 1].c[1].v){
          periodSchedule.push({
            "periodName":"Passing Period",
            "startTime":endTime,
            "endTime":TimePlus.formattedToObject(sched.wg[wg + 1].c[1].v),
            "periodNum":sched.wg[wg + 1].c[0].v.replace("Period", "").trim(),
            "passing":true
          });
        }
        fullSchedule[neededSchedules[schedule]] = {
          "info":{
            "schoolStartTime":periodSchedule[0].startTime,
            "schoolEndTime":periodSchedule[periodSchedule.length - 1].endTime
          },
          "schedule":periodSchedule
        };
      }
    } else {
      fullSchedule[neededSchedules[schedule]] = {
        "header":sched.wg[1].c[0],
        "text":sched.wg[1].c[1]
      };
    }
  }
  schedules = fullSchedule;
  saveSchedules(schedules, TimePlus.getCurrentDate().monthName, schedulesPerWeek);
  window.requestAnimationFrame(refresh);
}

function refresh(){
  currentSchedule = schedulesPerWeek[TimePlus.getCurrentDate().dayOfMonth - 1];
  time = TimePlus.getCurrentTime();
  date = TimePlus.getCurrentDate();
  var updateHeader, updateText;
  if(typeof(currentSchedule) == "object"){
    updateHeader = currentSchedule.header;
    updateText = currentSchedule.text;
  } else {
    currentSchedule = schedules[currentSchedule];
    period = getCurrentPeriod(time.hour, time.minute);
    if(period != undefined){
      var timeUntil = TimePlus.timeUntil({
        hour:period.endTime.hour,
        minute:period.endTime.minute,
        second:0
      });
      updateHeader = period.periodName;
      updateText = timeFormatting(timeUntil.hour, timeUntil.minute, timeUntil.second);
    } else if(time.hour <= currentSchedule.info.schoolStartTime.hour || (time.hour <= currentSchedule.info.schoolStartTime.hour && time.minute < currentSchedule.info.schoolStartTime.minute)){
      var timeUntil = TimePlus.timeUntil({
        hour:currentSchedule.info.schoolStartTime.hour,
        minute:currentSchedule.info.schoolStartTime.minute,
        second:0
      });
      updateHeader = "School Starts In";
      updateText = timeFormatting(timeUntil.hour, timeUntil.minute, timeUntil.second);
    } else if(time.hour >= currentSchedule.info.schoolEndTime.hour || (time.hour >= currentSchedule.info.schoolEndTime.hour && time.minute > currentSchedule.info.schoolEndTime.minute)){
      updateHeader = "School Has Ended";
      updateText = "No Time Available";
    }
  }
  updateDivs(date.dayName, date.monthName + " " + date.dayOfMonth + ", " + date.year, timeFormatting(time.hour, time.minute, "CLOCK"), updateHeader, updateText);
}

function updateDivs(day, date, curTime, header, text){
  try{
    document.getElementById("currentDayText").textContent = day;
    document.getElementById("currentWeekText").textContent = date;
    document.getElementById("currentTimeText").textContent = curTime;
    document.getElementById("timeHeader").textContent = header;
    document.getElementById("timeText").textContent = text;
  } catch {

  }
  window.requestAnimationFrame(refresh);
}

function getCurrentPeriod(hour, minute){
  var sched = currentSchedule.schedule;
  for(var i = 0; i<sched.length; i++){
    var start = new Date(date.year, date.month, date.dayOfMonth, sched[i].startTime.hour, sched[i].startTime.minute, 0, 0);
    var end = new Date(date.year, date.month, date.dayOfMonth, sched[i].endTime.hour, sched[i].endTime.minute, 0, 0);
    if(TimePlus.getFullDate() >= start && TimePlus.getFullDate() < end){
      return sched[i];
    }
  }
}

function timeFormatting(hour, minute, second){
  var formatted = "";
  if(hour != "hide"){
    if(!useMilitaryTime && hour > 12){
      hour -= 12;
    }
    if(useMilitaryTime && hour < 10){
      hour = "0" + hour;
    }
    if(second == "CLOCK"){
      second = "hide";
      if(hour == 0){
        hour = 12;
      }
    }
    if(hour != 0){
      formatted += hour;
    } else {
      hour = "hide";
    }
  }
  if(minute != "hide"){
    if(minute < 10 && hour != "hide"){
      minute = "0" + minute;
    }
    if(hour != "hide"){
      minute = ":" + minute;
    }
    formatted += minute;
  }
  if(second != "hide"){
    if(second < 10 && minute != "hide"){
      second = "0" + second;
    }
    if(minute != "hide"){
      second = ":" + second;
    }
    formatted += second;
  }
  return formatted;
}
