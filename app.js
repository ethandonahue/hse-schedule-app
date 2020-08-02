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

//Connection & Message Handling

io.on("connection", (socket) => {

	new Network.connection(socket);
	socket.emit("GET_USER_ID");

	socket.on("USER_ID", (id) => {
		if(id == undefined || Network.users.getUser(id) == false){
			var u = new Network.user();
			u.updateConnection(Network.connections.getConnection(socket.id));
			db.users.insert(u.getAsJSON());
			socket.emit("SET_USER_ID", u.getId());
		} else {
			Network.users.getUser(id).updateConnection(Network.connections.getConnection(socket.id));
		}
		socket.emit("SERVER_READY");
	});

	socket.on("LUNCH_CHANGE", (lunch) => {
		var id = Network.connections.getConnection(socket.id).getUserId();
		Network.users.getUser(id).setData("lunch", lunch);
		db.users.update({id:id}, {$set:{data:{lunch:lunch}}});
		db.users.loadDatabase();
	});

	socket.on("disconnect", () => {
		Network.connections.getConnection(socket.id).terminate();
	});

});

//Emit Interval

setInterval(() => {
	var timer = {
		period:moment(),
		lunch:moment()
	};
  io.emit("TIMER_DATA", timer);
}, 100);
