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

//Database Initiation

const db = {
	admins:new Datastore({filename:"./server/databases/admins.db", autoload: true}),
	schedules:new Datastore({filename:"./server/databases/schedules.db", autoload: true}),
	users:new Datastore({filename:"./server/databases/users.db", autoload: true})
};

//Schedule Setup

var schedules = undefined;
var scheduleDays = {
	1:"Summer Break",
	2:"Summer Break",
	3:"Summer Break",
	4:"Summer Break",
	5:"Summer Break",
	6:"First 5 Student Days",
	7:"First 5 Student Days",
	10:"First 5 Student Days",
	11:"First 5 Student Days",
	12:"First 5 Student Days"
};

//Read From Databases

readDatabases();

function readDatabases(){
	db.users.find({}, (err, us) => {
		for(var u = 0; u < us.length; u++){
			Network.users.transformJSONToUser(us[u]);
		}
		db.schedules.find({}, (err, sched) => {
			schedules = {};
			for(var s = 0; s < sched.length; s++){
				schedules[sched[s].metadata.name] = sched[s];
			}
			createServer();
		});
	});
}

//Server Setup & Initiation

function createServer(){
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
	listenForSockets();
}


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
			hour:14,
			minute:55
		},
		defaultDays:[1, 2, 3, 4, 5],
		hasLunches:true
	},
	schedule:[
		{
			type:"class",
			period:1,
			periodName:"Period 1",
			startTime:{
				hour:7,
				minute:35
			},
			endTime:{
				hour:8,
				minute:27
			}
		},
		{
			type:"passing",
			to:"Period 2",
			startTime:{
				hour:8,
				minute:27
			},
			endTime:{
				hour:8,
				minute:34
			}
		},
		{
			type:"class",
			period:2,
			periodName:"Period 2",
			startTime:{
				hour:8,
				minute:34
			},
			endTime:{
				hour:9,
				minute:26
			}
		},
		{
			type:"passing",
			to:"Period 3",
			startTime:{
				hour:9,
				minute:26
			},
			endTime:{
				hour:9,
				minute:33
			}
		},
		{
			type:"class",
			period:3,
			periodName:"Period 3",
			startTime:{
				hour:9,
				minute:33
			},
			endTime:{
				hour:10,
				minute:25
			}
		},
		{
			type:"passing",
			to:"Period 4",
			startTime:{
				hour:10,
				minute:25
			},
			endTime:{
				hour:10,
				minute:32
			}
		},
		{
			type:"class",
			period:4,
			periodName:"Period 4",
			startTime:{
				hour:10,
				minute:32
			},
			endTime:{
				hour:11,
				minute:23
			}
		},
		{
			type:"lunches",
			period:5,
			periodName:"Period 5",
			lunchName:"Lunch",
			startTime:{
				hour:11,
				minute:23,
				a:{
					hour:11,
					minute:23
				},
				b:{
					hour:11,
					minute:53
				},
				c:{
					hour:12,
					minute:23
				}
			},
			endTime:{
				hour:12,
				minute:53,
				a:{
					hour:11,
					minute:53
				},
				b:{
					hour:12,
					minute:23
				},
				c:{
					hour:12,
					minute:53
				}
			},
			A:[
				{
					type:"lunch",
					lunch:"A",
					lunchName:"A Lunch",
					startTime:{
						hour:11,
						minute:23
					},
					endTime:{
						hour:11,
						minute:53
					}
				},
				{
					type:"passing",
					to:"Period 5",
					startTime:{
						hour:11,
						minute:53
					},
					endTime:{
						hour:12,
						minute:0
					}
				},
				{
					type:"class",
					period:5,
					periodName:"Period 5",
					startTime:{
						hour:12,
						minute:0
					},
					endTime:{
						hour:12,
						minute:53
					}
				}
			],
			B:[
				{
					type:"passing",
					to:"Period 5",
					startTime:{
						hour:11,
						minute:23
					},
					endTime:{
						hour:11,
						minute:30
					}
				},
				{
					type:"class",
					period:5,
					periodName:"Period 5",
					startTime:{
						hour:11,
						minute:30
					},
					endTime:{
						hour:11,
						minute:53
					}
				},
				{
					type:"lunch",
					lunch:"B",
					lunchName:"B Lunch",
					startTime:{
						hour:11,
						minute:53
					},
					endTime:{
						hour:12,
						minute:23
					}
				},
				{
					type:"passing",
					to:"Period 5",
					startTime:{
						hour:12,
						minute:23
					},
					endTime:{
						hour:12,
						minute:28
					}
				},
				{
					type:"class",
					period:5,
					periodName:"Period 5",
					startTime:{
						hour:12,
						minute:28
					},
					endTime:{
						hour:12,
						minute:53
					}
				}
			],
			C:[
				{
					type:"passing",
					to:"Period 5",
					startTime:{
						hour:11,
						minute:23
					},
					endTime:{
						hour:11,
						minute:30
					}
				},
				{
					type:"class",
					period:5,
					periodName:"Period 5",
					startTime:{
						hour:11,
						minute:30
					},
					endTime:{
						hour:12,
						minute:23
					}
				},
				{
					type:"lunch",
					lunch:"C",
					lunchName:"C Lunch",
					startTime:{
						hour:12,
						minute:23
					},
					endTime:{
						hour:12,
						minute:53
					}
				}
			],
		},
		{
			type:"passing",
			to:"Period 6",
			startTime:{
				hour:12,
				minute:53
			},
			endTime:{
				hour:13,
				minute:0
			}
		},
		{
			type:"class",
			period:6,
			periodName:"Period 6",
			startTime:{
				hour:13,
				minute:0
			},
			endTime:{
				hour:13,
				minute:57
			}
		},
		{
			type:"passing",
			to:"Period 7",
			startTime:{
				hour:13,
				minute:57
			},
			endTime:{
				hour:14,
				minute:4
			}
		},
		{
			type:"class",
			period:7,
			periodName:"Period 7",
			startTime:{
				hour:14,
				minute:4
			},
			endTime:{
				hour:14,
				minute:55
			}
		}
	]
});
db.schedules.insert({
	metadata:{
		name:"Weekend",
		type:"weekend",
		defaultDays:[0, 6]
	}
});*/
/*db.schedules.insert({
	metadata:{
		name:"Summer Break",
		type:"break",
		defaultDays:[]
	}
});*/
/*db.schedules.insert({
	metadata:{
		name:"First 5 Student Days",
		type:"school day",
		schoolStartTime:{
			hour:8,
			minute:0
		},
		schoolEndTime:{
			hour:12,
			minute:30
		},
		defaultDays:[],
		hasLunches:false
	},
	schedule:[
		{
			type:"class",
			period:"SEL",
			periodName:"SEL",
			startTime:{
				hour:8,
				minute:0
			},
			endTime:{
				hour:8,
				minute:25
			}
		},
		{
			type:"passing",
			to:"Period 1",
			startTime:{
				hour:8,
				minute:25
			},
			endTime:{
				hour:8,
				minute:35
			}
		},
		{
			type:"class",
			period:1,
			periodName:"Period 1",
			startTime:{
				hour:8,
				minute:35
			},
			endTime:{
				hour:9,
				minute:0
			}
		},
		{
			type:"passing",
			to:"Period 2",
			startTime:{
				hour:9,
				minute:0
			},
			endTime:{
				hour:9,
				minute:10
			}
		},
		{
			type:"class",
			period:2,
			periodName:"Period 2",
			startTime:{
				hour:9,
				minute:10
			},
			endTime:{
				hour:9,
				minute:35
			}
		},
		{
			type:"passing",
			to:"Period 3",
			startTime:{
				hour:9,
				minute:35
			},
			endTime:{
				hour:9,
				minute:45
			}
		},
		{
			type:"class",
			period:3,
			periodName:"Period 3",
			startTime:{
				hour:9,
				minute:45
			},
			endTime:{
				hour:10,
				minute:10
			}
		},
		{
			type:"passing",
			to:"Period 4",
			startTime:{
				hour:10,
				minute:10
			},
			endTime:{
				hour:10,
				minute:20
			}
		},
		{
			type:"class",
			period:4,
			periodName:"Period 4",
			startTime:{
				hour:10,
				minute:20
			},
			endTime:{
				hour:10,
				minute:45
			}
		},
		{
			type:"passing",
			to:"Period 5",
			startTime:{
				hour:10,
				minute:45
			},
			endTime:{
				hour:10,
				minute:55
			}
		},
		{
			type:"class",
			period:5,
			periodName:"Period 5",
			startTime:{
				hour:10,
				minute:55
			},
			endTime:{
				hour:11,
				minute:20
			}
		},
		{
			type:"passing",
			to:"Period 6",
			startTime:{
				hour:11,
				minute:20
			},
			endTime:{
				hour:11,
				minute:30
			}
		},
		{
			type:"class",
			period:6,
			periodName:"Period 6",
			startTime:{
				hour:11,
				minute:30
			},
			endTime:{
				hour:11,
				minute:55
			}
		},
		{
			type:"passing",
			to:"Period 7",
			startTime:{
				hour:11,
				minute:55
			},
			endTime:{
				hour:12,
				minute:5
			}
		},
		{
			type:"class",
			period:7,
			periodName:"Period 7",
			startTime:{
				hour:12,
				minute:5
			},
			endTime:{
				hour:12,
				minute:30
			}
		}
	]
});*/

//Connection & Message Handling

function listenForSockets(){
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
			socket.emit("SCHEDULE_DATA", {
				today:getTodaysSchedule(),
				monthly:getMonthlySchedule()
			});
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
}

//Schedule Finder

function getTodaysSchedule(day){
	var todaysSchedule = undefined;
	var m;
	if(day == undefined){
		m = moment();
	} else {
		m = moment().date(day);
	}
	if(schedules != undefined){
		if(m.date() in scheduleDays){
			todaysSchedule = schedules[scheduleDays[m.date()]];
		} else {
			for(schedule in schedules){
				for(var d = 0; d < schedules[schedule].metadata.defaultDays.length; d++){
					if(m.day() == schedules[schedule].metadata.defaultDays[d]){
						todaysSchedule = schedules[schedule];
						return todaysSchedule;
					}
				}
			}
		}
	}
	return todaysSchedule;
}

//Monthly Schedule Finder

function getMonthlySchedule(){
	var schedule = [];
	var m = moment();
	for(var d = 1; d <= m.daysInMonth(); d++){
		schedule.push(getTodaysSchedule(d));
	}
	return schedule;
}

//Period Finder

function getCurrentPeriod(schedule){
	var currentPeriod = undefined;
	var m = moment();
	if(schedule != undefined){
		var sched = schedule.schedule;
		var schoolStart = moment().set({"hour":schedule.metadata.schoolStartTime.hour, "minute":schedule.metadata.schoolStartTime.minute, "second":0, "millisecond":0});
		var schoolEnd = moment().set({"hour":schedule.metadata.schoolEndTime.hour, "minute":schedule.metadata.schoolEndTime.minute, "second":0, "millisecond":0});
		if(m.isBefore(schoolStart)){
			currentPeriod = "Before School";
		} else if(m.isAfter(schoolEnd)){
			currentPeriod = "After School";
		} else {
			for(var p = 0; p < sched.length; p++){
				var periodStart = moment().set({"hour":sched[p].startTime.hour, "minute":sched[p].startTime.minute, "second":0, "millisecond":0});
				var periodEnd = moment().set({"hour":sched[p].endTime.hour, "minute":sched[p].endTime.minute, "second":0, "millisecond":0});
				if(m.isBetween(periodStart, periodEnd)){
					currentPeriod = sched[p];
					return currentPeriod;
				}
			}
		}
	}
	return currentPeriod;
}

//Lunch Finder

function getCurrentLunch(schedule){
	var currentLunch = undefined;
	var currentPeriod = getCurrentPeriod(schedule);
	var m = moment();
	if(currentPeriod != undefined && currentPeriod.type == "lunches"){
		var aStart = moment().set({"hour":currentPeriod.startTime.a.hour, "minute":currentPeriod.startTime.a.minute, "second":0, "millisecond":0});
		var aEnd = moment().set({"hour":currentPeriod.endTime.a.hour, "minute":currentPeriod.endTime.a.minute, "second":0, "millisecond":0});
		var bStart = moment().set({"hour":currentPeriod.startTime.b.hour, "minute":currentPeriod.startTime.b.minute, "second":0, "millisecond":0});
		var bEnd = moment().set({"hour":currentPeriod.endTime.b.hour, "minute":currentPeriod.endTime.b.minute, "second":0, "millisecond":0});
		var cStart = moment().set({"hour":currentPeriod.startTime.c.hour, "minute":currentPeriod.startTime.c.minute, "second":0, "millisecond":0});
		var cEnd = moment().set({"hour":currentPeriod.endTime.c.hour, "minute":currentPeriod.endTime.c.minute, "second":0, "millisecond":0});
		if(m.isBetween(aStart, aEnd)){
			currentLunch = "A";
		} else if(m.isBetween(bStart, bEnd)){
			currentLunch = "B";
		} else if(m.isBetween(cStart, cEnd)){
			currentLunch = "C";
		}
	}
	return currentLunch;
}

//Lunch Part Finder

function getCurrentLunchPart(schedule){
	var currentLunchPart = undefined;
	var currentPeriod = getCurrentPeriod(schedule);
	var m = moment();
	if(currentPeriod != undefined && currentPeriod.type == "lunches"){
		currentLunchPart = {
			a:undefined,
			b:undefined,
			c:undefined
		};
		for(var i = 0; i < currentPeriod.A.length; i++){
			var aStart = moment().set({"hour":currentPeriod.A[i].startTime.hour, "minute":currentPeriod.A[i].startTime.minute, "second":0, "millisecond":0});
			var aEnd = moment().set({"hour":currentPeriod.A[i].endTime.hour, "minute":currentPeriod.A[i].endTime.minute, "second":0, "millisecond":0});
			if(m.isBetween(aStart, aEnd)){
				currentLunchPart.a = currentPeriod.A[i];
				i = currentPeriod.A.length;
			}
		}
		for(var i = 0; i < currentPeriod.B.length; i++){
			var bStart = moment().set({"hour":currentPeriod.B[i].startTime.hour, "minute":currentPeriod.B[i].startTime.minute, "second":0, "millisecond":0});
			var bEnd = moment().set({"hour":currentPeriod.B[i].endTime.hour, "minute":currentPeriod.B[i].endTime.minute, "second":0, "millisecond":0});
			if(m.isBetween(bStart, bEnd)){
				currentLunchPart.b = currentPeriod.B[i];
				i = currentPeriod.B.length;
			}
		}
		for(var i = 0; i < currentPeriod.C.length; i++){
			var cStart = moment().set({"hour":currentPeriod.C[i].startTime.hour, "minute":currentPeriod.C[i].startTime.minute, "second":0, "millisecond":0});
			var cEnd = moment().set({"hour":currentPeriod.C[i].endTime.hour, "minute":currentPeriod.C[i].endTime.minute, "second":0, "millisecond":0});
			if(m.isBetween(cStart, cEnd)){
				currentLunchPart.c = currentPeriod.C[i];
				i = currentPeriod.C.length;
			}
		}
	}
	return currentLunchPart;
}

//Countdown JSON Maker

function standardCountdownJSON(h, m){
	var now = moment();
	var then = moment().set({"hour": h, "minute": m, "second":0, "millisecond":0});
	var difference = then.subtract(now.get("year"), "years").subtract(now.get("month"), "months").subtract(now.get("date"), "days").subtract(now.get("hour"), "hours").subtract(now.get("minute"), "minutes").subtract(now.get("second"), "seconds").subtract(now.get("millisecond"), "milliseconds");
	var remaining = {
		years:difference.add(1, "year").get("year"),
		months:difference.add(1, "month").get("month"),
		days:difference.add(1, "day").get("date") - difference.daysInMonth(),
		hours:difference.get("hour"),
		minutes:difference.get("minute"),
		seconds:difference.get("second"),
		milliseconds:difference.get("millisecond")
	}
	return remaining;
}

//Lunch Countdown JSON Maker

function lunchCountdownJSON(schedule){
	var remaining = undefined;
	var m = moment();
	if(schedule.metadata.hasLunches){
		var lunchPosition;
		var sched = schedule.schedule;
		var allSet = false;
		for(var p = 0; p < sched.length; p++){
			if(sched[p].type == "lunches"){
				lunchPosition = p;
				p = sched.length;
			}
		}
		var aStart = moment().set({"hour":sched[lunchPosition].startTime.a.hour, "minute":sched[lunchPosition].startTime.a.minute, "second":0, "millisecond":0});
		var bStart = moment().set({"hour":sched[lunchPosition].startTime.b.hour, "minute":sched[lunchPosition].startTime.b.minute, "second":0, "millisecond":0});
		var cStart = moment().set({"hour":sched[lunchPosition].startTime.c.hour, "minute":sched[lunchPosition].startTime.c.minute, "second":0, "millisecond":0});
		if(m.isBefore(aStart)){
			remaining.a = standardCountdownJSON(sched[lunchPosition].startTime.a.hour, sched[lunchPosition].startTime.a.minute);
			remaining.all = standardCountdownJSON(sched[lunchPosition].startTime.a.hour, sched[lunchPosition].startTime.a.minute);
			allSet = true;
		}
		if(m.isBefore(bStart)){
			remaining.b = standardCountdownJSON(sched[lunchPosition].startTime.b.hour, sched[lunchPosition].startTime.b.minute);
			if(!allSet){
				remaining.all = standardCountdownJSON(sched[lunchPosition].startTime.b.hour, sched[lunchPosition].startTime.b.minute);
				allSet = true;
			}
		}
		if(m.isBefore(cStart)){
			remaining.c = standardCountdownJSON(sched[lunchPosition].startTime.c.hour, sched[lunchPosition].startTime.c.minute);
			if(!allSet){
				remaining.all = standardCountdownJSON(sched[lunchPosition].startTime.c.hour, sched[lunchPosition].startTime.c.minute);
			}
		}
	}
	return remaining;
}

//Emit Interval

var currentDay = moment().date();
setInterval(() => {
	var schedule = getTodaysSchedule();
	if(moment().date() != currentDay){
		io.emit("SCHEDULE_DATA", {
			today:getTodaysSchedule(),
			monthly:getMonthlySchedule()
		});
		currentDay = moment().date();
	}
	if(schedule != undefined && schedule.metadata.type == "school day" && period != "After School"){
		var period = getCurrentPeriod(schedule);
		var lunch = getCurrentLunch(schedule);
		var lunchPart = getCurrentLunchPart(schedule);
		var timer = undefined;
		if(period == "Before School"){
			timer = {
				period:standardCountdownJSON(schedule.metadata.schoolStartTime.hour, schedule.metadata.schoolStartTime.minute),
				lunch:lunchCountdownJSON(schedule)
			};
		} else if(period != "After School"){
			var a, b, c;
			if(period.type == "lunches"){
				timer = {
					period:{
						none:standardCountdownJSON(period.endTime.hour, period.endTime.minute),
						a:standardCountdownJSON(lunchPart.a.endTime.hour, lunchPart.a.endTime.minute),
						b:standardCountdownJSON(lunchPart.b.endTime.hour, lunchPart.b.endTime.minute),
						c:standardCountdownJSON(lunchPart.c.endTime.hour, lunchPart.c.endTime.minute),
						all:standardCountdownJSON(lunchPart[lunch.toLowerCase()].endTime.hour, lunchPart[lunch.toLowerCase()].endTime.minute)
					},
					lunch:lunchCountdownJSON(schedule)
				};
			} else {
				timer = {
					period:standardCountdownJSON(period.endTime.hour, period.endTime.minute),
					lunch:lunchCountdownJSON(schedule)
				};
			}
		}
	}
	io.emit("TIME_DATA", {
		timer:timer,
		period:period,
		lunch:lunch,
		lunchPart:lunchPart,
		time:{
			day:moment().format("dddd"),
			week:moment().format("MMM. Do, YYYY"),
			time:moment().format("h:mm:ss A")
		}
	});
}, 200);
