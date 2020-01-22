//Developed By: Isaac Robbins
//Last Update: 11/9/2019
//For Use With: HSE Schedule App

var ScriptPlus = {
	config:{
		debug:false,
		version:"1.1.0"
	}
}

var TimePlus = {
	days:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	months:["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	timeTracker:true,
	getCurrentTime:function(){
			var d = new Date();
			return {
				hour:d.getHours(),
				minute:d.getMinutes(),
				second:d.getSeconds(),
				millisecond:d.getMilliseconds()
			};
		},
	getCurrentDate:function(){
			var d = new Date();
			return {
				year:d.getFullYear(),
				month:d.getMonth(),
				weekOfYear:d.getWeek(),
				dayOfWeek:d.getDay(),
				dayOfMonth:d.getDate(),
				firstDayOfMonth:new Date(d.getFullYear(), d.getMonth(), 1).getDay(),
				daysInMonth:new Date(d.getFullYear(), d.getMonth(), 0).getDate(),
				monthName:TimePlus.months[d.getMonth()],
				dayName:TimePlus.days[d.getDay()]
			};
		},
	getFullDate:function(){
			var d = new Date();
			return d;
	 },
	addMilliseconds:function(t1, t2){
			if(typeof(t1) == "string"){
				t1 = parseInt(t1);
			}
			if(typeof(t2) == "string"){
				t2 = parseInt(t2);
			}
			if(typeof(t1) != "number" || isNaN(t1)){
				scriptPlusGiveErrorMessage("Could Not Determine Number");
				return;
			}
			if(typeof(t2) != "number" || isNaN(t2)){
				scriptPlusGiveErrorMessage("Could Not Determine Number");
				return;
			}
			var t = t1 + t2;
			while(t >= 1000){
				t -= 1000;
			}
			return t;
		},
	addSeconds:function(t1, t2){
			if(typeof(t1) == "string"){
				t1 = parseInt(t1);
			}
			if(typeof(t2) == "string"){
				t2 = parseInt(t2);
			}
			if(typeof(t1) != "number" || isNaN(t1)){
				scriptPlusGiveErrorMessage("Could Not Determine Number");
				return;
			}
			if(typeof(t2) != "number" || isNaN(t2)){
				scriptPlusGiveErrorMessage("Could Not Determine Number");
				return;
			}
			var t = t1 + t2;
			while(t >= 60){
				t -= 60;
			}
			return t;
		},
	addMinutes:function(t1, t2){
			if(typeof(t1) == "string"){
				t1 = parseInt(t1);
			}
			if(typeof(t2) == "string"){
				t2 = parseInt(t2);
			}
			if(typeof(t1) != "number" || isNaN(t1)){
				scriptPlusGiveErrorMessage("Could Not Determine Number");
				return;
			}
			if(typeof(t2) != "number" || isNaN(t2)){
				scriptPlusGiveErrorMessage("Could Not Determine Number");
				return;
			}
			var t = t1 + t2;
			while(t >= 60){
				t -= 60;
			}
			return t;
		},
	addHours:function(t1, t2){
			if(typeof(t1) == "string"){
				t1 = parseInt(t1);
			}
			if(typeof(t2) == "string"){
				t2 = parseInt(t2);
			}
			if(typeof(t1) != "number" || isNaN(t1)){
				scriptPlusGiveErrorMessage("Could Not Determine Number");
				return;
			}
			if(typeof(t2) != "number" || isNaN(t2)){
				scriptPlusGiveErrorMessage("Could Not Determine Number");
				return;
			}
			var t = t1 + t2;
			while(t >= 24){
				t -= 24;
			}
			return t;
		},
	addDays:function(d1, d2){
			if(typeof(d1) == "string"){
				d1 = TimePlus.days.indexOf(d1);
			}
			if(typeof(d2) == "string"){
				d2 = TimePlus.days.indexOf(d2);
			}
			if(typeof(d1) != "number"){
				scriptPlusGiveErrorMessage("Could Not Determine Number");
				return;
			}
			if(typeof(d2) != "number"){
				scriptPlusGiveErrorMessage("Could Not Determine Number");
				return;
			}
			var d = d1 + d2;
			while(d >= 7){
				d -= 7;
			}
			return d;
		},
	addWeeks:function(w1, w2){
			if(typeof(w1) != "number"){
				scriptPlusGiveErrorMessage("Could Not Determine Number");
				return;
			}
			if(typeof(w2) != "number"){
				scriptPlusGiveErrorMessage("Could Not Determine Number");
				return;
			}
			var w = w1 + w2;
			while(w >= 53){
				w -= 53;
			}
			return w;
		},
	addMonths:function(m1, m2){
			if(typeof(m1) == "string"){
				m1 = TimePlus.months.indexOf(m1);
			}
			if(typeof(m2) == "string"){
				m2 = TimePlus.months.indexOf(m2);
			}
			if(typeof(m1) != "number"){
				scriptPlusGiveErrorMessage("Could Not Determine Number");
				return;
			}
			if(typeof(m2) != "number"){
				scriptPlusGiveErrorMessage("Could Not Determine Number");
				return;
			}
			var m = m1 + m2;
			while(m >= 12){
				m -= 12;
			}
			return m;
		},
	addYears:function(y1, y2){
			if(typeof(y1) == "string"){
				y1 = parseInt(y1);
			}
			if(typeof(y2) == "string"){
				y2 = parseInt(y2);
			}
			if(typeof(y1) != "number" || isNaN(y1)){
				scriptPlusGiveErrorMessage("Could Not Determine Number");
				return;
			}
			if(typeof(y2) != "number" || isNaN(y2)){
				scriptPlusGiveErrorMessage("Could Not Determine Number");
				return;
			}
			var y = y1 + y2;
			return y;
		},
	timeUntil:function(time){
			var remaining = {};
			var now = new Date();
			var start = new Date();
			var remain;
			start.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
			if(typeof(time) != "object"){
				scriptPlusGiveErrorMessage("The Object Given Was Not Recognized");
				return;
			}
			if(Object.keys(time).length != 0){
				if(time.second != undefined){
					start.setSeconds(time.second);
				} else {
					start.setSeconds(0);
				}
				if(time.minute != undefined){
					start.setMinutes(time.minute);
				} else {
					start.setMinutes(0);
				}
				if(time.hour != undefined){
					start.setHours(time.hour);
				}
				if(now > start){
					start.setDate(start.getDate() + 1);
				}
			} else {
				return {hour:24,minute:0,second:0};
			}
			remain = (start - now) / 1000;
			remaining.hour = Math.floor((remain / 3600));
			remaining.minute = Math.floor((remain / 60) % 60);
			remaining.second = Math.floor(remain % 60);
			return remaining;
		},
	timeBetween:function(t1, t2){
		var remain;
		var remaining = {};
		if(!t1.second){
			t1.second = 0;
		}
		var start = new Date(TimePlus.getCurrentDate().year, TimePlus.getCurrentDate().month, TimePlus.getCurrentDate().dayOfMonth, t1.hour, t1.minute, t1.second, 0);
		var end = new Date(TimePlus.getCurrentDate().year, TimePlus.getCurrentDate().month, TimePlus.getCurrentDate().dayOfMonth, t2.hour, t2.minute, 0, 0);
		remain = Math.abs((start - end) / 1000);
		remaining.hour = Math.floor((remain / 3600));
		remaining.minute = Math.floor((remain / 60) % 60);
		remaining.second = Math.floor(remain % 60);
		return remaining;
	},
	toSeconds:function(time){
		var seconds = time.second;
		seconds += time.minute * 60;
		seconds += time.hour * 3600;
		return seconds;
	},
	formattedToObject:function(time){
			var hour = parseInt(time.substring(0, time.indexOf(":")));
			if(time.indexOf("p") > 0 && hour != 12){
				hour += 12;
			} else if(time.indexOf("a") > 0 && hour == 12){
				hour = 0;
			}
			var minute = parseInt(time.substring(time.indexOf(":") + 1, time.indexOf(" ")));
			return {"hour":hour, "minute":minute};
		},
	startTimeTracker:function(){
			if(TimePlus.timeTracker == true){
				TimePlus.timeTracker = new Date();
				scriptPlusDebugLogging("Started A Time Tracker");
			} else {
				scriptPlusGiveErrorMessage("A Tracker Is Already Running");
			}
		},
	endTimeTracker:function(){
			if(TimePlus.timeTracker != true){
				var end = new Date();
				var elapsed = new Date();
				var fin;
				elapsed.setTime(end.getTime() - TimePlus.timeTracker.getTime());
				elapsed.setHours(elapsed.getHours() - 19);
				fin = {hours:elapsed.getHours(),minutes:elapsed.getMinutes(),seconds:elapsed.getSeconds(),milliseconds:elapsed.getMilliseconds()};
				TimePlus.timeTracker = true;
				scriptPlusDebugLogging("Ended A Time Tracker");
				return fin;
			} else {
				scriptPlusGiveErrorMessage("A Tracker Is Not Running");
			}
		}
}

var SheetsPlus = {
	DATA:false,
	load:function(){
			google.charts.load('current', {'packages':['corechart']});
		},
	get:function(url){
			SheetsPlus.getData(url);
			return new Promise((resolve) => {
				SheetsPlus.whenNotEquals("SheetsPlus.DATA", "false", () => {
					var dat = SheetsPlus.DATA;
					SheetsPlus.DATA = false;
					var tags = document.getElementsByTagName("script");
				  for(var i = 0; i < tags.length; i++){
				    var element = tags[i];
				    if(element.src.indexOf(googleSheetURL) > -1){
							element.remove();
				    }
				  }
					resolve(dat);
				});
			});
		},
	getData:function(url){
			var query = new google.visualization.Query(url);
			query.send(SheetsPlus.handleResponse);
		},
	handleResponse:function(response){
		  SheetsPlus.DATA = response.getDataTable();
		},
	whenNotEquals:function(variable, value, run){
	    var id = Math.random();
	    var interval = setInterval(() => {
				try{
		      if(eval(variable) != eval(value)){
		        clearInterval(interval);
		        run();
		      }
				} catch{

				}
	    }, 100, id, interval, variable, value, run);
	  }
}

function getKeyByValue(object, val){
	if(typeof(object) != "object"){
		scriptPlusGiveErrorMessage("The Object Given Was Not Recognized");
		return;
	}
	for(var prop in object){
		if(object.hasOwnProperty(prop)){
			if(object[prop] == val){
				scriptPlusDebugLogging("Found Key (" + prop + ") From Object (" + object.constructor.name + ") Using Value (" + val + ")");
				return prop;
			}
		}
	}
}

function randomNumber(min, max){
	if(typeof(min) != "number" || typeof(max) != "number"){
		scriptPlusGiveErrorMessage("The Values Given Are Not Numbers");
		return;
	}
	var rand = Math.floor(Math.random() * (max - min + 1)) + min;
	scriptPlusDebugLogging("Picked Random Value (" + rand + ") From Range (" + min + " - " + max + ")");
	return rand;
}

function readFileOnline(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function(){
			if (rawFile.readyState == 4 && rawFile.status == "200"){
				scriptPlusDebugLogging("Read Online File (" + file + ")");
				callback(rawFile.responseText);
			}
    }
		rawFile.onerror = function(){
			callback(404);
		}
    rawFile.send(null);
}

function includeHTML(){
  var tags = document.getElementsByTagName("*");
  for(var i = 0; i < tags.length; i++){
    var element = tags[i];
    var file = element.getAttribute("include-html");
    if(file){
			readFileOnline(file, function(html){
				element.innerHTML = html;
				element.removeAttribute("include-html");
				includeHTML();
			});
      return;
    }
  }
}

function landOrPort(){
	if(window.matchMedia("(orientation: landscape)").matches){
		return "landscape";
	}
	return "portrait";
}

function isAppleDevice(){
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
}

function inStandalone(){
	 return (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://');
}

Array.prototype.pickValue = function(){
	var randomValue = Math.floor(Math.random()*this.length);
	scriptPlusDebugLogging("Picked Random Value (" + randomValue + ") From Range (0 - " + (this.length - 1) + ")");
	scriptPlusDebugLogging("The Value Chosen From List (" + this + ") Was (" + this[randomValue] + ")");
	return this[randomValue];
}

Date.prototype.getWeek = function() {
  var d = new Date(this.getFullYear(),0,1);
  return Math.ceil((((this - d) / 86400000) + d.getDay()+1)/7) - 1;
}

function scriptPlusDebugLogging(message){
	if(ScriptPlus.config.debug){
		console.log("%c[ScriptPlus - Version " + ScriptPlus.config.version + "] " + message, "color:#FF8C00");
	}
}

function scriptPlusGiveErrorMessage(message){
	if(ScriptPlus.config.debug){
		console.error("%c\n[ScriptPlus - Version " + ScriptPlus.config.version + "] " + message + "\n", "color:#ffffff;font-style:italic;font-weight:bold");
	}
}
