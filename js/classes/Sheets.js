//Developed By: Isaac Robbins
//For Use With: HSE Schedule App

function Sheet(url){
  this.url = url;
  this.rawData = false;

  var me = this;

  this.getRawData = function(){
    var me = this;
    this._makeQuery();
    return new Promise((resolve) => {
      this._whenRawData(() => {
        resolve(this.rawData);
      });
    });
  }

  this._makeQuery = function(){
    var query = new google.visualization.Query(this.url);
    query.send(this._handleQueryResponse);
  }

  this._handleQueryResponse = function(response){
    me.rawData = response.getDataTable();
  }

  this._whenRawData = function(callback){
    var interval = setInterval(() => {
      try{
        if(this.rawData != false){
          clearInterval(interval);
          callback();
        }
      } catch {

      }
    }, 100, interval, callback);
  }
}

function loadGoogleCharts(){
  google.charts.load('current', {'packages':['corechart']});
  return new Promise((resolve) => {
    var loaded = setInterval(() => {
      try{
        if(google.visualization.Query != undefined){
          clearInterval(loaded);
          resolve();
        }
      } catch {

      }
    }, 100, loaded);
  });
}
