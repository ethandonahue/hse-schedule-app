const schedulesPerWeek = {
  "Sunday":false,
  "Monday":"mondaySmartPeriodDay",
  "Tuesday":"regularSchoolDay",
  "Wednesday":"regularSchoolDay",
  "Thursday":"regularSchoolDay",
  "Friday":"regularSchoolDay",
  "Saturday":false
};

readFileOnline("/json/schedules.json", (data) =>{
  schedules = JSON.parse(data);
  currentSchedule = schedules[schedulesPerWeek[TimePlus.getCurrentDate().dayName]];
  timeMonitor = setInterval(refresh, 100);
});

function refresh(){
  var time = TimePlus.getCurrentTime();
  if(time.hour >= currentSchedule.info.schoolStartTime.hour && time.hour <= currentSchedule.info.schoolEndTime.hour){
    var period = getCurrentPeriod(Time);
    updateTimeRemainingDiv();
  } else {
    updateTimeRemainingDiv("Not School Hours");
  }
}

function updateTimeRemainingDiv(hour, minute, second){

}

function getCurrentPeriod(hour, minute){

}
