//Developed By: Isaac Robbins
//For Use With: HSE Schedule App

//const googleSheetURL = "https://docs.google.com/spreadsheets/d/1QBUjDIa7H-UhTKOe7znd2h9XYn1uDeuZrXzuR0C7KYk/gviz/tq?sheet=";

const globalTime = new DateTime();
const schedules = new Schedules(globalTime.getDate().monthName);
const monthlyRawData = new Sheet(googleSheetURL);
var monthlyLayout;
var schedulesRequired;

updateRawSchedules();

async function updateRawSchedules(){
  if(localStorage.schedules == undefined){
    await monthlyRawData.getRawData();

  } else {
    window.requestAnimationFrame(update);
  }
}

function update(){
  globalTime.update();

  window.requestAnimationFrame(update);
}
