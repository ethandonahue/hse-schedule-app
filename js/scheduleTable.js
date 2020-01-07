var schedule;
var listObjects = [];

function loadSchedule() {
	if (currentSchedule.schedule != undefined) {
		schedule = currentSchedule.schedule;
		clearInterval(interval);
		createTable();
	}
}

var interval = setInterval(loadSchedule, 100);


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
			periodRow.setAttribute("class", "row selected");
			timeRow.setAttribute("class", "row selected");
		} else {
			periodRow.setAttribute("class", "row");
			timeRow.setAttribute("class", "row");
		}


		tableContainer.appendChild(periodRow);
		tableContainer.appendChild(timeRow);

		var table = document.getElementsByTagName("table")[0];
		table.appendChild(tableContainer);

	}
	window.requestAnimationFrame(highlightSelected);
}

function highlightSelected(){
	for(var i = 0; i<listObjects.length; i++){
		listObjects[i].period.removeAttribute("class");
		listObjects[i].time.removeAttribute("class");
		if(eval(period) != undefined && listObjects[i].period.textContent == period.periodNum){
			listObjects[i].period.setAttribute("class", "row selected");
			listObjects[i].time.setAttribute("class", "row selected");
		} else {
			listObjects[i].period.setAttribute("class", "row");
			listObjects[i].time.setAttribute("class", "row");
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
