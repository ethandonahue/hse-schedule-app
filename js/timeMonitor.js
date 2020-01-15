var schedulesPerWeek = [];

var useMilitaryTime = false;

const googleSheetURL = "https://docs.google.com/spreadsheets/d/1QBUjDIa7H-UhTKOe7znd2h9XYn1uDeuZrXzuR0C7KYk/gviz/tq?sheet=";

var scheduleRefreshRate = 5;

var simulateDay = null;

var simulatePeriod = null;

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
            "periodName":"Passing Period\n(Go To " + sched.wg[wg + 1].c[0].v + ")",
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
        "header":sched.wg[1].c[0].v,
        "text":sched.wg[1].c[1].v
      };
    }
  }
  schedules = fullSchedule;
  saveSchedules(schedules, TimePlus.getCurrentDate().monthName, schedulesPerWeek);
  if(mostRecentVersion() != true){
    delete localStorage.firstLoadedLayout;
    delete localStorage.firstLoadedSchedule;
    window.location.reload();
  }
  window.requestAnimationFrame(refresh);
  setTimeout(() => {
    window.requestAnimationFrame(getMonthlySchedule);
  }, scheduleRefreshRate * 1000);
}

function refresh(){
  currentSchedule = schedules[schedulesPerWeek[TimePlus.getCurrentDate().dayOfMonth - 1]];
  if(simulateDay != null){
    currentSchedule = schedules[schedulesPerWeek[simulateDay - 1]];
  }
  updateAroundLunch();
  time = TimePlus.getCurrentTime();
  date = TimePlus.getCurrentDate();
  var updateHeader, updateText, lunchTime;
  var lunchText = "NONE";
  if(currentSchedule.header != undefined){
    updateHeader = currentSchedule.header;
    updateText = currentSchedule.text;
  } else {
    period = getCurrentPeriod(time.hour, time.minute);
    if(period != undefined){
      var timeUntil = TimePlus.timeUntil({
        hour:period.endTime.hour,
        minute:period.endTime.minute,
        second:0
      });
      if(getLunch() != "NONE"){
        var lunches = [];
        var lunchInfo;
        currentSchedule.schedule.forEach((period) => {
          if(period.periodName.indexOf("Lunch") > -1){
            lunches.push(period);
          }
        });
        lunches.forEach((lunch) => {
          if(getLunch() == lunch.periodName.replace("Lunch", "").trim()){
            lunchInfo = lunch;
          }
        });
        if(lunchInfo == undefined){
          lunchInfo = lunches[0];
        }
        lunchTime = TimePlus.timeUntil({
          hour:lunchInfo.startTime.hour,
          minute:lunchInfo.startTime.minute,
          second:0
        });
        if(currentSchedule.schedule.indexOf(period) < currentSchedule.schedule.indexOf(lunchInfo)){
          if(lunchInfo.periodNum == "Lunch"){
            lunchText = "Time Until Lunch";
          } else {
            lunchText = "Time Until " + getLunch() + " Lunch";
          }
          lunchTime = timeFormatting(lunchTime.hour, lunchTime.minute, lunchTime.second);
        }
      }
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
  updateDivs(date.dayName, date.monthName + " " + date.dayOfMonth + ", " + date.year, timeFormatting(time.hour, time.minute, "CLOCK"), updateHeader, updateText, lunchText, lunchTime);
}

function updateDivs(day, date, curTime, header, text, lunchtext, lunchtime){
  try{
    document.getElementById("currentDayText").textContent = day;
    document.getElementById("currentWeekText").textContent = date;
    document.getElementById("currentTimeText").textContent = curTime;
    if(header.indexOf("\n") > -1){
      document.getElementById("timeHeader").textContent = header.substring(0, header.indexOf("\n"));
      document.getElementById("timeSecondaryHeader").textContent = header.substring(header.indexOf("\n"));
      document.getElementById("timeSecondaryHeader").style.display = "block";
    } else {
      document.getElementById("timeHeader").textContent = header;
      document.getElementById("timeSecondaryHeader").style.display = "none";
    }
    document.getElementById("timeText").textContent = text;
    if(lunchtext != "NONE"){
      document.getElementById("lunch").style.display = "table-cell";
      document.getElementById("lunchText").textContent = lunchtext;
      document.getElementById("lunchTime").textContent = lunchtime;
    } else {
      document.getElementById("lunch").style.display = "none";
    }
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
      if(simulatePeriod != null){
        i = simulatePeriod;
      }
      return sched[i];
    }
  }
}

function updateAroundLunch(){
  if(currentSchedule.info != undefined && currentSchedule.info.updatedAroundLunch == undefined){
    var lunches = [];
    if(currentSchedule.schedule != undefined){
      currentSchedule.schedule.forEach((period) => {
        if(period.periodName.indexOf("/") > -1){
          lunches.push(period);
        }
      });
      if(lunches.length > 0){
        lunches.forEach((lunch) => {
          if(getLunch() == lunch.periodName.substring(lunch.periodName.indexOf("/") + 2).replace("Lunch", "").trim()){
            lunch.periodName = lunch.periodName.substring(lunch.periodName.indexOf("/ ") + 2);
          } else {
            lunch.periodName = lunch.periodName.substring(0, lunch.periodName.indexOf(" /"));
          }
          lunch.periodNum = lunch.periodNum.substring(lunch.periodNum.indexOf("/ ") + 2);
        });
      }
      if(lunches.length > 1){
        if(lunches[1].periodName == lunches[2].periodName && window.location.pathname == "/screens/online/home.html"){
          lunches[1].endTime = lunches[2].endTime;
          currentSchedule.schedule.splice(currentSchedule.schedule.indexOf(lunches[2]), 1);
        } else if (lunches[0].periodName == lunches[1].periodName && window.location.pathname == "/screens/online/home.html"){
          lunches[0].endTime = lunches[1].endTime;
          currentSchedule.schedule.splice(currentSchedule.schedule.indexOf(lunches[1]), 1);
        }
      }
      currentSchedule.info.updatedAroundLunch = true;
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

function changeMilitaryTime(){
  if(document.getElementById("toggle24Hour").checked){
    useMilitaryTime = true;
  } else {
    useMilitaryTime = false;
  }
}
