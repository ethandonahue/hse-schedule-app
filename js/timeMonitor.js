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

readFileOnline("/json/schedules.json", (data) => {
  schedules = JSON.parse(data);
  timeMonitor = setInterval(refresh, 100);
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
  }
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
  updateDivs(date.dayName, date.monthName + " " + date.dayOfMonth + ", " + date.year, timeFormatting(time.hour, time.minute, false), updateHeader, updateText);
}

function updateDivs(day, date, curTime, header, text){
  document.getElementById("currentDayText").textContent = day;
  document.getElementById("currentWeekText").textContent = date;
  document.getElementById("currentTimeText").textContent = curTime;
  document.getElementById("timeHeader").textContent = header;
  document.getElementById("timeText").textContent = text;
}

function getCurrentPeriod(hour, minute){
  var sched = currentSchedule.schedule;
  for(var i = 0; i<sched.length; i++){
    var start = new Date(date.year, date.month, date.dayOfMonth, sched[i].startTime.hour, sched[i].startTime.minute, 0, 0);
    var end = new Date(date.year, date.month, date.dayOfMonth, sched[i].endTime.hour, sched[i].endTime.minute, 0, 0);
    if(TimePlus.getFullDate() >= start && TimePlus.getFullDate() <= end){
      return sched[i];
    }
  }
}

function timeFormatting(hour, minute, second){
  var formatted = "";
  if(hour != false){
    if(!useMilitaryTime && hour > 12){
      hour -= 12;
    } else if(hour < 10){
      hour = "0" + hour;
    }
    formatted = hour;
  }
  if(minute != false){
    if(minute < 10){
      minute = "0" + minute;
    }
    if(hour != 0 && hour != false){
      minute = ":" + minute
    }
    formatted += minute;
  }
  if(second != false){
    if(second < 10){
      second = "0" + second;
    }
    if(minute != false){
      second = ":" + second;
    }
    formatted += second;
  }
  return formatted;
}
