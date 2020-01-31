//Developed By: Isaac Robbins
//For Use With: HSE Schedule App

function Schedules(month){
  this.month = month;
  this.requiredSchedules = {};
  this.scheduleLayout = [];
  this.scheduleData = [];

  this.setSchedules = async function(url, sheetsMonthlyRawData){
    var needed = this._parseRequiredSchedules(sheetsMonthlyRawData);
    var layout = this._parseScheduleLayout(sheetsMonthlyRawData);
    var promises = [];
    var me = this;
    for(var sched = 0; sched < needed.length; sched++){
      promises.push(new Sheet(url + encodeURIComponent(needed[sched])).getRawData());
    }
    await Promise.all(promises).then((scheds) => {
      for(var sched = 0; sched < scheds.length; sched++){
        me.scheduleData.push(scheds[sched]);
        me.requiredSchedules[needed[sched]] = new Schedule(needed[sched]);
        me.requiredSchedules[needed[sched]].setLayout(scheds[sched]);
        me.requiredSchedules[needed[sched]].setRawData(scheds[sched]);
      }
    });
    //console.log(this.requiredSchedules);
    for(var sched = 0; sched < layout.length; sched++){
      this.scheduleLayout.push(layout[sched]);
    }
  }

  this.getScheduleLayout = function(){
    return this.scheduleLayout;
  }

  this.getRequiredSchedules = function(){
    return this.requiredSchedules;
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

  this._parseScheduleLayout = function(data){
    var parsed = [];
    data = data.wg;
    for(var week = 1; week < data.length; week++){
      for(var day = 0; day < 7; day++){
        var info = data[week].c[day];
        if(info != null){
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
  this.currentPeriod = false;
  this.rawData = false;
  this.lunchPeriod = false;

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

  this.setRawData = function(data){
    this.rawData = data;
  }

  this.clone = function(){
    var clone = new Schedule("Clone of " + this.name);
    clone.setLayout(this.rawData);
    clone.setRawData(this.rawData);
    return clone;
  }

  this.updateTimes = function(){
    for(var p = 0; p < this.layout.length; p++){
      console.log(this.layout[p]);
      this.layout[p].startTime.update();
      this.layout[p].endTime.update();
      console.log(this.layout[p]);
    }
  }

  this._parseRawData = function(data){
    var parsed = [];
    data = data.wg;
    if(data[0].c[1].v != "Message"){
      for(var period = 1; period < data.length; period++){
        var info = data[period].c;
        var newPeriod = new Period();
        newPeriod.setDisplayName(info[0].v);
        newPeriod.setPeriodNumber(info[0].v.substring(info[0].v.indexOfNumber(), info[0].v.indexOfNumber() + 1));
        newPeriod.setTimes(info[1].v, info[2].v);
        newPeriod.setTableDisplay(info[0].v.substring(info[0].v.indexOfNumber(), info[0].v.length));
        if(newPeriod.displayName.contains("Lunch")){
          newPeriod.makeLunchPeriod(info[0].v);
        }
        parsed.push(newPeriod);
      }
      for(var period = 0; period < parsed.length - 1; period++){
        if(parsed[period].endTime.getTimeInSeconds() != parsed[period + 1].startTime.getTimeInSeconds()){
          var newPassing = new PassingPeriod();
          newPassing.setDisplayName("Passing Period");
          newPassing.setLowerDisplayName("(Go To " + parsed[period + 1].displayName + ")");
          newPassing.setPeriodNumber(parsed[period + 1].periodNum);
          newPassing.setTimes(parsed[period].endTime.getTimeAsString(), parsed[period + 1].startTime.getTimeAsString());
          parsed.pushAt(period + 1, newPassing);
        }
      }
    } else {
      var info = data[1].c;
      var specialDay = new Period();
      specialDay.setDisplayName(info[0].v);
      specialDay.setCustomPeriodTime(info[1].v);
      specialDay.setPeriodNumber("Special Day");
      specialDay.setTimes("12:00 a.m.", {hour:23,minute:59,second:59,millisecond:999});
      parsed.push(specialDay);
    }
    return parsed;
  }
}

function Period(){
  this.displayName = false;
  this.lowerDisplayName = false;
  this.customPeriodTime = false;
  this.periodNum = false;
  this.startTime = false;
  this.endTime = false;
  this.isLunch = false;
  this.lunchName = false;
  this.notLunchName = false;
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

  this.setCustomPeriodTime = function(name){
    this.customPeriodTime = name;
  }

  this.setPeriodNumber = function(num){
    this.periodNum = num;
    this._updateTableDisplay();
  }

  this.makeLunchPeriod = function(name){
    this.isLunch = true;
    this.lunchName = name.substring(name.indexOf("/") + 2, name.length);
    this.notLunchName = name.substring(0, name.indexOf("/") - 1);
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

  this.setTableDisplay = function(period, time){
    if(period != undefined){
      this.tableDisplay.period = period;
    }
    if(time != undefined){
      this.tableDisplay.time = time;
    }
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

  this.setPeriodNumber = function(num){
    this.periodNum = num;
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
