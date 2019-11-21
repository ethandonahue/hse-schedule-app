const schedulesPerWeek = {
  "Sunday":{header:"It's The Weekend", text:"No School"},
  "Monday":"mondaySmartPeriodDay",
  "Tuesday":"regularSchoolDay",
  "Wednesday":"regularSchoolDay",
  "Thursday":"regularSchoolDay",
  "Friday":"regularSchoolDay",
  "Saturday":{header:"It's The Weekend", text:"No School"}
};

var useMilitaryTime = false;

getSchedule();

function getSchedule(){
  SheetsPlus.load();
  SheetsPlus.whenNotEquals("google.visualization.Query", "undefined", function(){
    SheetsPlus.getData("https://docs.google.com/spreadsheets/d/1QBUjDIa7H-UhTKOe7znd2h9XYn1uDeuZrXzuR0C7KYk/edit?usp=sharing");
  });
  SheetsPlus.whenNotEquals("SheetsPlus.DATA", "false", function(){
    s = SheetsPlus.get();
    console.log(s);
  });
}

readFileOnline("/json/schedules.json", (data) => {
  schedules = JSON.parse(data);
  window.requestAnimationFrame(refresh);
});

function refresh(){
  currentSchedule = schedulesPerWeek[TimePlus.getCurrentDate().dayName];
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
  document.getElementById("currentDayText").textContent = day;
  document.getElementById("currentWeekText").textContent = date;
  document.getElementById("currentTimeText").textContent = curTime;
  document.getElementById("timeHeader").textContent = header;
  document.getElementById("timeText").textContent = text;
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
