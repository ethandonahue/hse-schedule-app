var schedule;
var listObjects = [];

SheetsPlus.whenNotEquals("currentSchedule", "undefined", loadSchedule);

function loadSchedule() {
	if (currentSchedule.schedule != undefined) {
		schedule = currentSchedule.schedule;
		createTable();
	}
}

function createTable() {

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


		tableContainer.appendChild(periodRow);
		tableContainer.appendChild(timeRow);

		var table = document.getElementsByTagName("table")[0];
		table.appendChild(tableContainer);

	}
	window.requestAnimationFrame(highlightSelected);
}

function deleteTable(){
	while(document.getElementsByTagName("tr").length > 1){
		document.getElementsByTagName("tr")[1].remove();
	}
}

function highlightSelected(){
	for(var i = 0; i<listObjects.length; i++){
		listObjects[i].period.removeAttribute("class");
		listObjects[i].time.removeAttribute("class");
		if(eval(period) != undefined && listObjects[i].period.textContent == period.periodNum){
			listObjects[i].period.setAttribute("class", "bellRow selected");
			listObjects[i].time.setAttribute("class", "bellRow selected");
		} else {
			listObjects[i].period.setAttribute("class", "bellRow");
			listObjects[i].time.setAttribute("class", "bellRow");
		}
	}
	window.requestAnimationFrame(highlightSelected);
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
