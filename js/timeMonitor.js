const schedulesPerWeek = {
  "Sunday":false,
  "Monday":"mondaySmartPeriodDay",
  "Tuesday":"regularSchoolDay",
  "Wednesday":"regularSchoolDay",
  "Thursday":"regularSchoolDay",
  "Friday":"regularSchoolDay",
  "Saturday":false
};

var useMilitaryTime = false;

readFileOnline("/json/schedules.json", (data) =>{
  schedules = JSON.parse(data);
  currentSchedule = schedules[schedulesPerWeek[TimePlus.getCurrentDate().dayName]];
  timeMonitor = setInterval(refresh, 100);
});

function refresh(){
  time = TimePlus.getCurrentTime();
  date = TimePlus.getCurrentDate();
  var updateHeader, updateText;
  if(time.hour >= currentSchedule.info.schoolStartTime.hour || (time.hour >= currentSchedule.info.schoolStartTime.hour && time.minute > currentSchedule.info.schoolStartTime.minute)){
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
  } else {
    var period = getCurrentPeriod(time.hour, time.minute);
    var timeUntil = TimePlus.timeUntil({
      hour:period.endTime.hour,
      minute:period.endTime.minute,
      second:0
    });
    updateHeader = period.periodName;
    updateText = timeFormatting(timeUntil.hour, timeUntil.minute, timeUntil.second);
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
    if(time.hour >= sched[i].startTime.hour && time.hour <= sched[i].endTime.hour){
      if(time.minute >= sched[i].startTime.minute && time.minute < sched[i].endTime.minute){
        return sched[i];
      }
    }
  }
}

function timeFormatting(hour, minute, second){
  var formatted = "";
  if(hour != 0 && hour != false){
    if(!useMilitaryTime){
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
