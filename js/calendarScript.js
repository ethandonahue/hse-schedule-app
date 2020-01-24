var calendarDayToPrint = 1;

SheetsPlus.whenNotEquals("currentSchedule", "undefined", generateCalendar);

function generateCalendar(){
	document.getElementById("cal-month").innerHTML = TimePlus.getCurrentDate().monthName + "<br>" + TimePlus.getCurrentDate().year;
	for(var w = 0; w < 5; w++){
		for(var d = 0; d < 7; d++){
			var wk = document.getElementById("cal-week-" + (w + 1));
			var dy = document.createElement("td");
			dy.setAttribute("class", "cal-days");
			if(w == 0 && d < TimePlus.getCurrentDate().firstDayOfMonth || calendarDayToPrint > TimePlus.getCurrentDate().daysInMonth){
				dy.innerHTML = "";
				dy.setAttribute("class", "calendarOtherMonth");
			} else {
				dy.innerHTML = calendarDayToPrint;
				var scheduleAvail = getSavedSchedules().schedules[getSavedSchedules().layout.split(",")[calendarDayToPrint - 1]].info;
				if(scheduleAvail != undefined){
					dy.setAttribute("onclick", "displaySelectedSchedule(" + calendarDayToPrint + ")");
				} else {
					dy.setAttribute("class", "calendarNoSchool");
				}
				if(calendarDayToPrint == TimePlus.getCurrentDate().dayOfMonth){
					dy.setAttribute("class", "calendarCurrentDay");
				}
				calendarDayToPrint++;
			}
			wk.appendChild(dy);
		}
	}
}

function deleteCalendar(){
	for(var w = 0; w < 5; w++){
		var wk = document.getElementById("cal-week-" + (w + 1));
		for(var d = 0; d < 7; d++){
			wk.children[0].remove();
		}
	}
	calendarDayToPrint = 1;
}

function displaySelectedSchedule(day){
	deleteTable();
	simulateDay = day;
	simulatePeriod = -1;
	currentSchedule = getSavedSchedules().schedules[getSavedSchedules().layout.split(",")[day - 1]];
	//refresh();
	loadSchedule();
	display(1);
}
