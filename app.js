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
var Datastore = require('nedb');
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
	admins:new Datastore({filename:"/server/databases/admins.db", autoload: true}),
	schedules:new Datastore({filename:"/server/databases/schedules.db", autoload: true}),
	usage:new Datastore({filename:"/server/databases/usage.db", autoload: true})
};

//Connection & Message Handling

io.on("connection", (socket) => {

	new Network.connection(socket);

	socket.on("disconnect", () => {
		Network.connections.getConnection(socket.id).terminate();
	});

	socket.on("create_room", () => {
		if(Network.connections.getConnection(socket.id).room == undefined){
			var r = new Network.room();
			Network.connections.getConnection(socket.id).joinRoom(r.getCode());
		}
	});

	socket.on("join_room", (code) => {
		Network.connections.getConnection(socket.id).joinRoom(code);
	});

	socket.on("leave_room", () => {
		Network.connections.getConnection(socket.id).leaveRoom();
	});

	socket.on("find_rooms", () => {
		var open_rooms = [];
		for(room in rooms){
			if(rooms[room].canJoin()){
				open_rooms.push(room);
			}
		}
		socket.emit("found_rooms", open_rooms);
	});

});
