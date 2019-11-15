var schedule1;

function loadSchedule(){
  if(currentSchedule.schedule != undefined){
    schedule1 = currentSchedule.schedule;
    clearInterval(interval);
    createTable();
  }
}

var interval = setInterval(loadSchedule, 100);


function createTable(){
  var para = document.createElement("td");
  var node = document.createTextNode("This is new.");
  para.appendChild(node);
  para.setAttribute("class", "row");
  var element = document.getElementsByTagName("table")[0];
  element.appendChild(para);
}
