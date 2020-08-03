//Developed By: Isaac Robbins
//For Use With: HSE Schedule App

var timer = undefined;
var schedule = undefined;
var period = undefined;
var lunch = undefined;
var lunchPart = undefined;
var time = undefined;

function setup(){
  document.getElementById("timeHeader").textContent = "Connected";
  document.getElementById("timeText").textContent = "Loading";
  if(isAppleDevice() && !inStandalone()){
    var appleInstallPop = new PopUp("apple-installer");
    appleInstallPop.setHeader("Install On iOS");
    appleInstallPop.setMessage("1. Click the 'share' icon at the bottom of the screen.<br><br>2. Click 'Add to Home Screen'<br><br>3. Click 'Add'");
    appleInstallPop.show();
  }
  var recentUpdate = new PopUp("Update V. 1.2.0");
  recentUpdate.setHeader("Version 1.2.0");
  recentUpdate.setMessage("-Added Table Header<br><br>-Spring Break Countdown<br><br>-Minor Bug Fixes");
  recentUpdate.show();
}

function updateTimers(t){
  var timeLeft = "";
  var time;
  if(lunch != undefined){
    time = t.period[storage.get("selectedLunch").toLowerCase()];
  } else {
    time = t.period;
  }
  if(time.hours != 0){
    timeLeft += time.hours + ":";
  }
  if(time.minutes < 10 && time.hours != 0){
    timeLeft += "0" + time.minutes + ":";
  } else {
    timeLeft += time.minutes + ":";
  }
  if(time.seconds < 10){
    timeLeft += "0" + time.seconds;
  } else {
    timeLeft += time.seconds;
  }
  document.getElementById("timeText").textContent = timeLeft;
  if(t.lunch != undefined && storage.get("selectedLunch") != "NONE"){
    var timeLeft = "";
    var time = t.lunch[storage.get("selectedLunch").toLowerCase()];
    if(time.hours != 0){
      timeLeft += time.hours + ":";
    }
    if(time.minutes < 10 && time.hours != 0){
      timeLeft += "0" + time.minutes + ":";
    } else {
      timeLeft += time.minutes + ":";
    }
    if(time.seconds < 10){
      timeLeft += "0" + time.seconds;
    } else {
      timeLeft += time.seconds;
    }
    document.getElementById("lunchText").textContent = "Time Until Lunch";
    document.getElementById("lunchTime").textContent = timeLeft;
    document.getElementById("lunch").style.display = "table-cell";
  } else {
    document.getElementById("lunch").style.display = "none";
  }
}

function handleScheduleData(s, p){
  if(s != undefined){
    switch(s.metadata.type){
      case "school day":
        if(p != undefined){
          if(p == "Before School"){
            document.getElementById("timeHeader").textContent = "School Starts In";
          } else if(p == "After School"){
            document.getElementById("timeHeader").textContent = "School Has Ended";
            document.getElementById("timeText").textContent = "School Day Over";
          } else {
            if(p.type == "class"){
              document.getElementById("timeHeader").textContent = p.periodName;
            } else if(p.type == "passing"){
              document.getElementById("timeHeader").textContent = "Passing Period";
            } else if(p.type == "lunches"){
              if(lunch == storage.get("selectedLunch")){
                document.getElementById("timeHeader").textContent = lunchPart[storage.get("selectedLunch").toLowerCase()].lunchName;
              } else {
                document.getElementById("timeHeader").textContent = p.periodName;
              }
            }
          }
          break;
        }
      case "weekend":
        document.getElementById("timeHeader").textContent = "It's The Weekend";
        document.getElementById("timeText").textContent = "No School Today";
        break;
      default:
        document.getElementById("timeHeader").textContent = "An Error Occured";
        document.getElementById("timeText").textContent = "Unavailable";
        break;
    }
  }
}

function updateClock(dayName, week, time){
  document.getElementById("currentDayText").textContent = dayName;
  document.getElementById("currentWeekText").textContent = week;
  document.getElementById("currentTimeText").textContent = time;
}

function updateDisplays() {
  document.getElementById("currentDayText").textContent = globalTime.getDate().dayName;
  document.getElementById("currentWeekText").textContent = globalTime.getDateAsString();
  document.getElementById("currentTimeText").textContent = globalTime.getTimeAsString();
  document.getElementById("timeHeader").textContent = periodHeader;
  document.getElementById("timeText").textContent = periodTimeLeft;
  if (periodShowLower && personalSchedule.layout[personalSchedule.currentPeriod] != undefined && personalSchedule.layout[personalSchedule.currentPeriod].lowerDisplayName != false) {
    document.getElementById("timeSecondaryHeader").textContent = personalSchedule.layout[personalSchedule.currentPeriod].lowerDisplayName;
    document.getElementById("timeSecondaryHeader").style.display = "block";
  } else {
    document.getElementById("timeSecondaryHeader").style.display = "none";
  }
  try {
    if (showLunch && globalTime.getTimeInSeconds() < personalSchedule.layout[personalSchedule.lunchPeriod].startTime.getTimeInSeconds()) {
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

function bindSocketEvents(){
  socket.on("CONNETED_TO_SERVER", () => {
    setup();
  });

  socket.on("GET_USER_ID", () => {
    socket.emit("USER_ID", storage.get("userId"));
  });

  socket.on("SET_USER_ID", (id) => {
    storage.set("userId", id);
  });

  socket.on("SERVER_READY", () => {

    //socket.emit("LUNCH_CHANGE", storage.get("selectedLunch"));
    socket.emit("REQUEST_SCHEDULE");

    socket.on("SCHEDULE_DATA", (data) => {
      schedule = data;
      handleScheduleData(schedule, period);
    });

    socket.on("TIME_DATA", (data) => {
      timer = data.timer;
      period = data.period;
      lunch = data.lunch;
      lunchPart = data.lunchPart;
      time = data.time;
      if(timer != undefined){
        updateTimers(timer);
      }
      updateClock(time.day, time.week, time.time);
      handleScheduleData(schedule, period);
    });

    socket.on("disconnect", () => {
      document.getElementById("timeHeader").textContent = "Disconnected";
      document.getElementById("timeText").textContent = "Retrying";
    })

  });

}

window.onload = function(){
  socket = io();
  bindSocketEvents();
}
