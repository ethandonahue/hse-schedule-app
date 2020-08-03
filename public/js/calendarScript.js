function generateCalendar(ms) {
  var calendarDayToPrint = 1;
  deleteCalendar();
  document.getElementById("cal-month").innerHTML = moment().format("MMMM") + "<br>" + moment().format("YYYY");
  for (var w = 0; w < 6; w++) {
    for (var d = 0; d < 7; d++) {
      var wk = document.getElementById("cal-week-" + (w + 1));
      var dy = document.createElement("td");
      dy.setAttribute("class", "cal-days");
      if ((w == 0 && d < moment().startOf("month").day()) || calendarDayToPrint > ms.length) {
        dy.innerHTML = "";
        dy.setAttribute("class", "calendarOtherMonth");
      } else {
        dy.innerHTML = calendarDayToPrint;
        if(ms[calendarDayToPrint - 1].metadata.type == "school day") {
          dy.setAttribute("onclick", "displaySelectedSchedule(" + calendarDayToPrint + ")");
        } else {
          dy.setAttribute("class", "calendarNoSchool");
        }
        if(calendarDayToPrint == moment().date()) {
          dy.setAttribute("class", "calendarCurrentDay");
        }
        calendarDayToPrint++;
      }
      wk.appendChild(dy);
    }
  }
}

function deleteCalendar() {
  for (var w = 0; w < 6; w++) {
    var wk = document.getElementById("cal-week-" + (w + 1));
    for (var d = 0; d < 7; d++) {
      try {
        wk.children[0].remove();
      } catch {

      }
    }
  }
  calendarDayToPrint = 1;
}

function displaySelectedSchedule(day) {
  globalTime.setCustomDate(globalTime.getDate().month + 1 + "/" + day + "/" + globalTime.getDate().year);
  globalTime.setCustomTime("12:00 a.m.");
  globalTime.update();
  createScheduleTable();
  display(1);
}
