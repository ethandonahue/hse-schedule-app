function noSchoolTable() {
		var noSchool = document.createElement("h2");
		var headerVal = document.createTextNode("No School Today");
		noSchool.appendChild(headerVal);
		noSchool.setAttribute("class", "noSchool");
		var tableHeader = document.getElementById("tableToNotDelete");
		tableHeader.appendChild(noSchool);
}

function createScheduleTable() {

	var tableHeader = document.getElementById("tableToNotDelete");

	var periodHeader = document.createElement("td");
	var periodText = document.createTextNode("Period");
	periodHeader.appendChild(periodText);
	periodHeader.setAttribute("class", "bellRow");
	tableHeader.appendChild(periodHeader);

	var timeHeader = document.createElement("td");
	var timeText = document.createTextNode("Time");
	timeHeader.appendChild(timeText);
	timeHeader.setAttribute("class", "bellRow");
	tableHeader.appendChild(timeHeader);




	for (var i = 0; i < schedule.length; i++) {
		if (schedule[i].passing) {
			i++
		}

		var tableContainer = document.createElement("tr");
		var periodRow = document.createElement("td");
		var timeRow = document.createElement("td");
		var periodVal = document.createTextNode(schedule[i].periodNum);
		var timeVal = document.createTextNode(convertTime(schedule[i].startTime, schedule[i].endTime));

		periodRow.appendChild(periodVal);
		timeRow.appendChild(timeVal);

		listObjects.push({
			"period":periodRow,
			"time":timeRow
		});

		if (eval(period) != undefined && period.periodNum == schedule[i].periodNum && !schedule[i].passing) {
			periodRow.setAttribute("class", "bellRow selected");
			timeRow.setAttribute("class", "bellRow selected");
		} else {
			periodRow.setAttribute("class", "bellRow");
			timeRow.setAttribute("class", "bellRow");
		}

		tableContainer.setAttribute("class", "bell-schedule-table");

		tableContainer.appendChild(periodRow);
		tableContainer.appendChild(timeRow);

		var table = document.getElementsByTagName("table")[0];
		table.appendChild(tableContainer);

	}
	window.requestAnimationFrame(highlightSelected);
}

function deleteTable(){
	while(document.getElementsByClassName("bell-schedule-table").length > 0){
		document.getElementsByClassName("bell-schedule-table")[0].remove();
		document.getElementById("tableToNotDelete").innerHTML = "";
	}
}

function highlightSelected(){
	for(var i = 0; i<listObjects.length; i++){
		listObjects[i].period.removeAttribute("class");
		listObjects[i].time.removeAttribute("class");
		if(eval(period) != undefined && getCurrentTablePeriod(time.hour, time.minute).indexOf(listObjects[i].period.textContent) > -1){
			listObjects[i].period.setAttribute("class", "bellRow selected");
			listObjects[i].time.setAttribute("class", "bellRow selected");
		} else {
			listObjects[i].period.setAttribute("class", "bellRow");
			listObjects[i].time.setAttribute("class", "bellRow");
		}
	}
	window.requestAnimationFrame(highlightSelected);
}

function getCurrentTablePeriod(hour, minute){
  var sched = schedule;
  for(var i = 0; i<sched.length; i++){
    var start = new Date(date.year, date.month, date.dayOfMonth, sched[i].startTime.hour, sched[i].startTime.minute, 0, 0);
    var end = new Date(date.year, date.month, date.dayOfMonth, sched[i].endTime.hour, sched[i].endTime.minute, 0, 0);
    if(TimePlus.getFullDate() >= start && TimePlus.getFullDate() < end){
      if(simulatePeriod != null){
        i = simulatePeriod;
      }
      return sched[i].periodName;
    }
  }
}

function convertTime(start, end) {
	var output = "";
	var startHour;
	var endHour;
	var startMinute;
	var endMinute;
	if (start.hour <= 12) {
		startHour = start.hour;
	} else {
		startHour = start.hour - 12;
	}

	if (end.hour <= 12) {
		endHour = end.hour;
	} else {
		endHour = end.hour - 12;
	}

	if (start.minute < 10) {
		startMinute = "0" + start.minute;
	} else {
		startMinute = start.minute;
	}

	if (end.minute < 10) {
		endMinute = "0" + end.minute;
	} else {
		endMinute = end.minute;
	}

	output += startHour + ":" + startMinute + " - " + endHour + ":" + endMinute;

	return output;

}
