var calendarDayToPrint = 1;

document.getElementById("cal-month").innerHTML = TimePlus.getCurrentDate().monthName + "<br>" + TimePlus.getCurrentDate().year;

for(var w = 0; w < 5; w++){
	for(var d = 0; d < 7; d++){
		var wk = document.getElementById("cal-week-" + (w + 1));
		var dy = document.createElement("td");
		dy.setAttribute("class", "cal-days");
		if(w == 0 && d < TimePlus.getCurrentDate().firstDayOfMonth || calendarDayToPrint == TimePlus.getCurrentDate().daysInMonth){
			dy.innerHTML = "";
		} else {
			dy.innerHTML = calendarDayToPrint;
			dy.setAttribute("onclick", "displaySelectedSchedule(" + calendarDayToPrint + ")");
			calendarDayToPrint++;
		}
		wk.appendChild(dy);
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
