//Developed By: Isaac Robbins

//Server Requires & Port Setup

const express = require("express");
const os = require("os");
const app = express();
const serv = require("http").Server(app);
const io = require("socket.io")(serv,{});
const port = process.env.PORT || 51000;

//Custom Requires

const _ = require("underscore");
const moment = require("moment");
const bcrypt = require("bcrypt");
const Datastore = require('nedb');
const Network = require("./server/classes/Network.js");

//Server Setup & Initiation

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});
app.use("/public", express.static(__dirname + "/public"));
serv.listen(port);

if(port != process.env.PORT){
	var __ConnectTo__;
	try{
		__ConnectTo__ = os.networkInterfaces()["Wi-Fi"][1].address + ":" + port;
	} catch {
		__ConnectTo__ = os.networkInterfaces()["Ethernet"][1].address + ":" + port;
	}
	console.clear();
	console.log("--> Webpage Started On } " + __ConnectTo__);
}

//Database Initiation

const db = {
	admins:new Datastore({filename:"./server/databases/admins.db", autoload: true}),
	schedules:new Datastore({filename:"./server/databases/schedules.db", autoload: true}),
	users:new Datastore({filename:"./server/databases/users.db", autoload: true})
};

db.users.find({}, (err, us) => {
	for(var u = 0; u < us.length; u++){
		Network.users.transformJSONToUser(us[u]);
	}
});

//Schedule Setup

var schedules = undefined;
var scheduleDays = {

};
db.schedules.find({}, (err, sched) => {
	schedules = {};
	for(var s = 0; s < sched.length; s++){
		schedules[sched[s].metadata.name] = sched[s];
	}
});

/*db.admins.findOne({username:"test"}, async (err, admin) =>{
	var right = await bcrypt.compare("test", admin.password);
	console.log(right);
});*/

/*db.schedules.insert({
	metadata:{
		name:"Regular School Day",
		type:"school day",
		schoolStartTime:{
			hour:7,
			minute:35
		},
		schoolEndTime:{
			hour:2,
			minute:55
		},
		defaultDays:[1, 2, 3, 4, 5]
	}
});
db.schedules.insert({
	metadata:{
		name:"Weekend",
		type:"break",
		defaultDays:[0, 6]
	}
});*/

//Connection & Message Handling

io.on("connection", (socket) => {

	new Network.connection(socket);
	socket.emit("GET_USER_ID");

	socket.on("USER_ID", (id) => {
		if(id == undefined || Network.users.getUser(id) == false){
			var u = new Network.user();
			id = u.getId();
			u.updateConnection(Network.connections.getConnection(socket.id));
			u.setData("lunch", "");
			u.setData("loginDates", []);
			u.setData("logoutDates", []);
			db.users.insert(u.getAsJSON());
			db.users.loadDatabase();
			socket.emit("SET_USER_ID", id);
		} else {
			Network.users.getUser(id).updateConnection(Network.connections.getConnection(socket.id));
		}
		db.users.update({id:id}, {$push:{"data.loginDates":moment().toJSON()}});
		db.users.loadDatabase();
		socket.emit("SERVER_READY");
	});

	socket.on("REQUEST_SCHEDULE", () => {
		socket.emit("SCHEDULE_DATA", getTodaysSchedule());
	});

	socket.on("LUNCH_CHANGE", (lunch) => {
		var id = Network.connections.getConnection(socket.id).getUserId();
		db.users.update({id:id}, {$set:{"data.lunch":lunch}});
		db.users.loadDatabase();
	});

	socket.on("disconnect", () => {
		var id = Network.connections.getConnection(socket.id).getUserId();
		db.users.update({id:id}, {$push:{"data.logoutDates":moment().toJSON()}});
		db.users.loadDatabase();
		Network.connections.getConnection(socket.id).terminate();
	});

});

//Schedule Finder

function getTodaysSchedule(){
	var todaysSchedule = undefined;
	var m = moment();
	if(m.date() in scheduleDays){
		todaysSchedule = schedules[scheduleDays[m.date()]];
	} else {
		for(schedule in schedules){
			for(var d = 0; d < schedules[schedule].metadata.defaultDays.length; d++){
				if(m.day() == schedules[schedule].metadata.defaultDays[d]){
					todaysSchedule = schedules[schedule];
				}
			}
		}
	}
	return todaysSchedule;
}

//Emit Interval

setInterval(() => {
	var now = moment();
	var schedule = getTodaysSchedule();
	if(schedule != undefined && schedule.metadata.type == "school day"){
		var then = moment().set({'hour': 15, 'minute': 10, 'second':0, 'millisecond':0});
		var difference = then.subtract(now.get("year"), "years").subtract(now.get("month"), "months").subtract(now.get("hour"), "hours").subtract(now.get("minute"), "minutes").subtract(now.get("second"), "seconds").subtract(now.get("millisecond"), "milliseconds").subtract(now.get("date"), "days");
		var period = {
			years:difference.add(1, "year").get("year"),
			months:difference.add(1, "month").get("month"),
			days:difference.add(1, "day").get("date") - difference.daysInMonth(),
			hours:difference.get("hour"),
			minutes:difference.get("minute"),
			seconds:difference.get("second"),
			milliseconds:difference.get("millisecond")
		}
		var timer = {
			period:period,
			lunch:moment()
		};
	  io.emit("TIMER_DATA", timer);
	}
}, 100);
