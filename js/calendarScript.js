var calendarDayToPrint = 1;

document.getElementById("cal-month").innerHTML = TimePlus.getCurrentDate().monthName + "<br>" + TimePlus.getCurrentDate().year;

SheetsPlus.whenNotEquals("currentSchedule", "undefined", generateCalendar);

function generateCalendar(){
	for(var w = 0; w < 5; w++){
		for(var d = 0; d < 7; d++){
			var wk = document.getElementById("cal-week-" + (w + 1));
			var dy = document.createElement("td");
			dy.setAttribute("class", "cal-days");
			if(w == 0 && d < TimePlus.getCurrentDate().firstDayOfMonth || calendarDayToPrint == TimePlus.getCurrentDate().daysInMonth){
				dy.innerHTML = "";
				dy.setAttribute("class", "calendarOtherMonth");
			} else {
				dy.innerHTML = calendarDayToPrint;
				if(schedules[schedulesPerWeek[calendarDayToPrint - 1]].schedule){
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

function displaySelectedSchedule(day){
	deleteTable();
	simulateDay = day;
	simulatePeriod = -1;
	currentSchedule = schedules[schedulesPerWeek[simulateDay - 1]];
	refresh();
	loadSchedule();
	display(1);
}
