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
  console.log(currentSchedule);
  console.log(personalSchedule);
  //window.requestAnimationFrame(update);
}

async function refreshSchedules(){
  await monthlyRawData.getRawData();
  await scheduless.setSchedules(googleSheetURL, monthlyRawData.rawData);
  monthlyLayout = scheduless.getScheduleLayout();
  schedulesRequired = scheduless.getRequiredSchedules();
}

function personalizeSchedule(){
  
}
