//Created By: Isaac Robbins
//For Use With: HSE Schedule App

function DateTime(custom){
  this.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  this.monthNames = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  this.time = false;
  this.date = false;
  this.staticTime = false;
  this.staticDate = false;

  if(custom != undefined){
    if(custom.time != undefined){
      this.staticTime = this._formatStaticTime(custom.time);
    }
    if(custom.date != undefined){
      this.staticDate = this._formatStaticDate(custom.date);
    }
  }

  this.getTime = function(){
    return this.time;
  }

  this.getDate = function(){
    return this.date;
  }

  this.getTimeAsString = function(){
    return this._timeObjectToString(this.time);
  }

  this.getTimeInSeconds = function(){
    return this._toSeconds(this.time);
  }

  this.setCustomTime = function(time){
    this.staticTime = this._formatStaticTime(time);;
  }

  this.setCustomDate = function(date){
    this.staticDate = this._formatStaticDate(date);;
  }

  this.removeCustomTime = function(){
    this.staticTime = false;
  }

  this.removeCustomDate = function(){
    this.staticDate = false;
  }

  this.update = function(){
    var d = new Date();
    if(this.staticTime == false){
			this.time = {
				hour:d.getHours(),
				minute:d.getMinutes(),
				second:d.getSeconds(),
				millisecond:d.getMilliseconds()
			};
    } else {
      this.time = {
				hour:this.staticTime.hour,
				minute:this.staticTime.minute,
				second:this.staticTime.second,
				millisecond:this.staticTime.millisecond
			};
    }
    if(this.staticDate == false){
    	this.date = {
        year:d.getFullYear(),
    		month:d.getMonth(),
    		weekOfYear:d.getWeek(),
    		dayOfWeek:d.getDay(),
    		dayOfMonth:d.getDate(),
    		firstDayOfMonth:new Date(d.getFullYear(), d.getMonth(), 1).getDay(),
    		daysInMonth:new Date(d.getFullYear(), d.getMonth(), 0).getDate(),
    		monthName:this.monthNames[d.getMonth()],
    		dayName:this.dayNames[d.getDay()]
    	};
    } else {
      this.date = {
        year:this.staticDate.year,
    		month:this.staticDate.month,
    		weekOfYear:this.staticDate.weekOfYear,
    		dayOfWeek:this.staticDate.dayOfWeek,
    		dayOfMonth:this.staticDate.dayOfMonth,
    		firstDayOfMonth:this.staticDate.firstDayOfMonth,
    		daysInMonth:this.staticDate.daysInMonth,
    		monthName:this.staticDate.monthName,
    		dayName:this.staticDate.dayName
    	};
    }
  }

  this._formatStaticTime = function(static){
    var d = new Date();
    if(typeof(static) == "string"){
      static = this._timeStringToObject(static);
    }
    if(static.hour == undefined){
      static.hour = d.getHours();
    }
    if(static.minute == undefined){
      static.minute = d.getMinutes();
    }
    if(static.second == undefined){
      static.second = d.getSeconds();
    }
    if(static.millisecond == undefined){
      static.millisecond = d.getMilliseconds();
    }
    return static;
  }

  this._formatStaticDate = function(static){
    var d = new Date();
    if(typeof(static) == "string"){
      static = this._dateStringToObject(static);
    }
    if(static.year == undefined){
      static.year = d.getFullYear();
    }
    if(static.month == undefined){
      static.month = d.getMonth();
    }
    if(static.dayOfMonth == undefined){
      static.dayOfMonth = new Date(static.year, static.month, d.getDate()).getDate();
    }
    if(static.dayOfWeek == undefined){
      static.dayOfWeek = new Date(static.year, static.month, static.dayOfMonth).getDay();
    }
    if(static.weekOfYear == undefined){
      static.weekOfYear = new Date(static.year, static.month, static.dayOfMonth).getWeek();
    }
    if(static.firstDayOfMonth == undefined){
      static.firstDayOfMonth = new Date(static.year, static.month, 1).getDay();
    }
    if(static.daysInMonth == undefined){
      static.daysInMonth = new Date(static.year, static.month, 0).getDate();
    }
    if(static.monthName == undefined){
      static.monthName = this.monthNames[static.month];
    }
    if(static.dayName == undefined){
      static.dayName = this.dayNames[static.dayOfWeek];
    }
    return static;
  }

  this._timeStringToObject = function(string){
    var object = {
      hour:undefined,
      minute:undefined,
      second:0,
      millisecond:0
    };
    if(string.contains("a.m.")){
      object.hour = parseInt(string.substring(0, string.indexOf(":")));
      object.minute = parseInt(string.substring(string.indexOf(":") + 1, string.indexOf("a.m.")));
      if(object.hour == 12){
        object.hour = 0;
      }
    } else if(string.contains("p.m.")){
      object.hour = parseInt(string.substring(0, string.indexOf(":")));
      object.minute = parseInt(string.substring(string.indexOf(":") + 1, string.indexOf("p.m.")));
      if(object.hour != 12){
        object.hour += 12;
      }
    }
    return object;
  }

  this._timeObjectToString = function(object){
    var string = "";
    var aOrP = "";
    object = this._formatStaticTime(object);
    if(object.hour < 13){
      string += object.hour;
      aOrP = "a.m.";
    } else {
      string += (object.hour - 12);
      aOrP = "p.m.";
    }
    string += ":" + object.minute + " " + aOrP;
    return string;
  }

  this._dateStringToObject = function(string){
    var d = new Date();
    var object = {
      year:undefined,
      month:undefined,
      weekOfYear:undefined,
      dayOfWeek:undefined,
      dayOfMonth:undefined,
      firstDayOfMonth:undefined,
      daysInMonth:undefined,
      monthName:undefined,
      dayName:undefined
    };
    var divider = "";
    if(string.occurs("-") > 0){
      divider = "-";
    } else if(string.occurs("/") > 0){
      divider = "/";
    }
    if(string.occurs(divider) == 2){
      object.month = parseInt(string.substring(0, string.indexesOf(divider)[0])) - 1;
      object.dayOfMonth = parseInt(string.substring(string.indexesOf(divider)[0] + 1, string.indexesOf(divider)[1]));
      object.year = string.substring(string.indexesOf(divider)[1] + 1);
      if(object.year.length == 2){
        object.year = parseInt(d.getFullYear().toString().substring(0, 2) + object.year);
      } else {
        object.year = parseInt(object.year);
      }
    }
    return object;
  }

  this._toSeconds = function(time){
    time = this._formatStaticTime(time);
		var seconds = time.second;
		seconds += time.minute * 60;
		seconds += time.hour * 3600;
		return seconds;
	}

  this.update();
}
