//Developed By: Isaac Robbins
//For Use With: HSE Schedule App

var timer = undefined;
var schedule = undefined;
var period = undefined;

function setup(){
  document.getElementById("timeHeader").textContent = "Connected";
  document.getElementById("timeText").textContent = "Loading";
}

function updateTimers(t){
  var timeLeft = "";
  if(t.period.hours != 0){
    timeLeft += t.period.hours + ":";
  }
  if(t.period.minutes < 10 && t.period.hours != 0){
    timeLeft += "0" + t.period.minutes + ":";
  } else {
    timeLeft += t.period.minutes + ":";
  }
  if(t.period.seconds < 10){
    timeLeft += "0" + t.period.seconds;
  } else {
    timeLeft += t.period.seconds;
  }
  document.getElementById("timeText").textContent = timeLeft;
}

function handleScheduleData(s, p){
  switch(s.metadata.type){
    case "school day":
      if(p == "Before School"){
        document.getElementById("timeHeader").textContent = "School Starts In";
      } else if(p == "After School"){
        document.getElementById("timeHeader").textContent = "School Has Ended";
        document.getElementById("timeText").textContent = "No School";
      } else {
        if(p.type == "class"){
          document.getElementById("timeHeader").textContent = p.periodName;
        } else if(p.type == "passing"){
          document.getElementById("timeHeader").textContent = "Passing Period";
        }
      }
      break;
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

async function preupdate() {
  await loadGoogleCharts();
  await refreshSchedules();
  update();
  generateCalendar();
  setTimeout(refreshSchedules, 10000);
  if (isAppleDevice() && !inStandalone()) {
    var appleInstallPop = new PopUp("apple-installer");
    appleInstallPop.setHeader("Install On iOS");
    appleInstallPop.setMessage("1. Click the 'share' icon at the bottom of the screen.<br><br>2. Click 'Add to Home Screen'<br><br>3. Click 'Add'");
    appleInstallPop.show();
  }
  var recentUpdate = new PopUp("Update V. 1.1.0");
  recentUpdate.setHeader("Version 1.1.0");
  recentUpdate.setMessage("-Added Table Header<br><br>-Spring Break Countdown<br><br>-Minor Bug Fixes");
  recentUpdate.show();
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
    //socket.emit("REQUEST_SCHEDULE");
    socket.emit("REQUEST_ALL");

    socket.on("ALL_DATA", (data) => {
      schedule = data.schedule;
      period = data.period;
      handleScheduleData(data.schedule, data.period);
    });

    socket.on("SCHEDULE_DATA", (scheduleData) => {
      schedule = scheduleData;
      handleScheduleData(scheduleData, period);
    })

    socket.on("TIMER_DATA", (timerData) => {
      timer = timerData;
      updateTimers(timerData);
    });

    socket.on("disconnect", () => {
      document.getElementById("timeHeader").textContent = "Server Offline";
      document.getElementById("timeText").textContent = "Retrying";
    })

  });

}

window.onload = function(){
  socket = io();
  bindSocketEvents();
}
