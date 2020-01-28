//Developed By: Isaac Robbins
//For Use With: HSE Schedule App

function Schedules(month){
  this.month = month;
  this.requiredSchedules = {};
  this.scheduleLayout = [];

  this.setSchedules = async function(url, sheetsMonthlyRawData){
    var needed = this._parseRequiredSchedules(sheetsMonthlyRawData);
    for(var sched = 0; sched < needed.length; sched++){
      var name = needed[sched];
      var raw = new Sheet(url + encodeURIComponent(name));
      await raw.getRawData();
      this.requiredSchedules[name] = new Schedule(name);
      this.requiredSchedules[name].setLayout(raw.rawData);
    }
  }

  this.getScheduleLayout = function(){
    return this.scheduleLayout;
  }

  this.getRequiredSchedules = function(){
    return this.requiredSchedules;
  }

  this._addScheduleToLayout = function(schedule){
    this.scheduleLayout.push(schedule);
  }

  this._addRequiredSchedules = function(name, schedule){
    if(!(name in this.requiredSchedules)){
      this.requiredSchedules[name] = schedule;
    }
  }

  this._parseRequiredSchedules = function(data){
    var parsed = [];
    data = data.wg;
    for(var week = 1; week < data.length; week++){
      for(var day = 0; day < 7; day++){
        var info = data[week].c[day];
        if(info != null && parsed.occurs(info.v) == 0){
          parsed.push(info.v);
        }
      }
    }
    return parsed;
  }
}

function Schedule(name){
  this.schoolStartTime = false;
  this.schoolEndTime = false;
  this.layout = false;
  this.name = name;

  this.setLayout = function(layout){
    if(Array.isArray(layout) == false){
      layout = this._parseRawData(layout);
    }
    this.layout = layout;
    this.schoolStartTime = layout[0].startTime;
    this.schoolEndTime = layout[layout.length - 1].endTime;
  }

  this.setCustomStart = function(startDateTime){
    this.schoolStartTime = startDateTime;
  }

  this.setCustomEnd = function(endDateTime){
    this.schoolEndTime = endDateTime;
  }

  this.getLayout = function(){
    return this.layout;
  }

  this._parseRawData = function(data){
    var parsed = [];
    data = data.wg;
    if(data[0].c[1].v != "Message"){
      for(var period = 1; period < data.length; period++){
        var info = data[period].c;
        var newPeriod = new Period();
        newPeriod.setDisplayName(info[0].v);
        newPeriod.setTimes(info[1].v, info[2].v);
        parsed.push(newPeriod);
      }
    } else {
      var info = data[1].c;
      var specialDay = new Period();
      specialDay.setDisplayName(info[0].v);
      specialDay.setTimes("12:00 a.m.", {hour:24,minute:0,second:0,millisecond:0});
      parsed.push(specialDay);
    }
    return parsed;
  }
}

function Period(){
  this.displayName = false;
  this.lowerDisplayName = false;
  this.periodNum = false;
  this.startTime = false;
  this.endTime = false;
  this.isLunch = false;
  this.lunchName = false;
  this.tableDisplay = {
    period:false,
    time:false
  };

  this.setDisplayName = function(name){
    this.displayName = name;
  }

  this.setLowerDisplayName = function(name){
    this.lowerDisplayName = name;
  }

  this.setPeriodNumber = function(num){
    this.periodNum = num;
    this._updateTableDisplay();
  }

  this.makeLunchPeriod = function(name){
    this.isLunch = true;
    this.lunchName = name;
    this._updateTableDisplay();
  }

  this.removeLowerDisplayName = function(){
    this.lowerDisplayName = false;
  }

  this.removeLunch = function(){
    this.isLunch = false;
    this.lunchName = false;
    this._updateTableDisplay();
  }

  this.setTimes = function(start, end){
    this.startTime = new DateTime();
    this.startTime.setCustomTime(start);
    this.startTime.update();
    this.endTime = new DateTime();
    this.endTime.setCustomTime(end);
    this.endTime.update();
    this._updateTableDisplay();
  }

  this._updateTableDisplay = function(){
    if(this.periodNum != false && this.startTime != false && this.endTime != false){
      this.tableDisplay.period = this.periodNum;
      if(this.isLunch){
        this.tableDisplay.period += " / " + this.lunchName;
      }
      this.tableDisplay.time = this.startTime.getTimeAsString() + " - " + this.endTime.getTimeAsString();
    } else {
      this.tableDisplay.period = false;
      this.tableDisplay.time = false;
    }
  }
}

function PassingPeriod(){
  this.displayName = false;
  this.lowerDisplayName = false;
  this.periodNum = false;
  this.startTime = false;
  this.endTime = false;

  this.setDisplayNames = function(upper, lower){
    this.displayName = upper;
    this.lowerDisplayName = lower;
  }

  this.setDisplayName = function(name){
    this.displayName = name;
  }

  this.setLowerDisplayName = function(name){
    this.lowerDisplayName = name;
  }

  this.setTimes = function(start, end){
    this.startTime = new DateTime();
    this.startTime.setCustomTime(start);
    this.startTime.update();
    this.endTime = new DateTime();
    this.endTime.setCustomTime(end);
    this.endTime.update();
  }
}
