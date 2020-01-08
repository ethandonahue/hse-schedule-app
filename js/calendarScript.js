document.getElementById("monthName").innerHTML = TimePlus.getCurrentDate().monthName;
document.getElementById("yearVal").innerHTML = TimePlus.getCurrentDate().year;



for (var i = 0; i <= TimePlus.getCurrentDate().firstDayOfMonth-1; i++) {
	var day = document.createElement("li");
	var dayVal = document.createTextNode("");
	day.appendChild(dayVal);
	var calendar = document.getElementsByClassName('days')[0];
	calendar.appendChild(day);
}

for (var i = 1; i <= TimePlus.getCurrentDate().daysInMonth; i++) {

		var day = document.createElement("li");
    var dayVal = document.createTextNode(i);
		day.setAttribute("onclick", "displaySelectedSchedule(" + i + ")");
		day.appendChild(dayVal);



		var calendar = document.getElementsByClassName('days')[0];
		calendar.appendChild(day);

	}

function displaySelectedSchedule(day){
	deleteTable();
	simulateDay = day - 1;
	loadSchedule();
	display(1);
}
