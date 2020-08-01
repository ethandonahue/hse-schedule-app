//Developed By: Isaac Robbins

//Single Connection

class Connection{
  constructor(socket){//Initialization
    this.socket = socket;
  	this.id = socket.id;
  	this.room = undefined;
    connections.addConnection(this);
    socket.emit("CONNETED_TO_SERVER");
  }
  joinRoom(code){//Joins Given Room If Available
		rooms.joinRoom(this, code);
	}
  leaveRoom(){//Leaves Current Room If Available
		if(this.room != undefined){
			rooms[this.room].removePlayer(this.id);
		}
	}
  getRoom(){//Gets The Current Room
		return this.room;
	}
  terminate(){//Deletes The Connection
    this.leaveRoom();
    connections.removeConnection(this);
  }
}

//Multiple Connections

class Connections{
  constructor(){//Initialization
    this.connections = {};
  }
  addConnection(c){//Add A Connection
    this.connections[c.id] = c;
  }
  getConnection(id){//Return A Connection
    if(this.connections[id] != undefined){
      return this.connections[id];
    }
    return false;
  }
  totalConnections(){
    return _.size(this.connections);
  }
  removeConnection(c){//Remove A Connection
    if(this.connections[c.id] != undefined){
      delete this.connections[c.id];
    }
  }
}

//Single Room

class Room{
  constructor(){//Initialization
    this.data = {
      meta:{
    		maxConnections:4,
    		open:true,
        private:false,
        code:this.generateRoomCode(4, false)
      },
      connections:{}
  	}
  }
  generateRoomCode(length, numbers){//Generates The Unique Room Code
  	var generatedCode = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if(numbers){
      characters += "0123456789";
    }
    for(var i = 0; i < length; i++){
     	generatedCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  	for(var room in rooms.rooms){
  		if(generatedCode == rooms[room].getCode()){
  			generateRoomCode();
  			return;
  		}
  	}
    return generatedCode;
  }
  addConnection(c){//Adds A Connection
		this.data.connections[c.id] = c;
		c.room = this.data.meta.code;
		c.socket.emit("JOINED_ROOM", this.getRoomMetadata());
	}
  removeConnection(c){//Removes A Connection & Checks To Delete Room
		if(this.data.connections[c.id] != undefined){
      delete this.data.connections[c.id];
      c.room = undefined;
      c.socket.emit("LEFT_ROOM");
    }
		if(_.size(this.data.connections) == 0){
			rooms.deleteRoom(this.data.meta.code);
		}
	}
  emitToRoomMembers(name, message){//Sends Message To All Connections
		for(var connection in this.data.connections){
			this.data.connections[connection].socket.emit(name, message);
		}
	}
  canJoin(){//Returns If Joinable
		return ((_.size(this.data.connections) <= this.data.meta.maxConnections) && this.data.meta.open == true);
	}
  getRoomMetadata(){//Returns Room Metadata
		return this.data.meta;
	}
  getRoomData(){//Returns Room Data
		return this.data;
	}
  getCode(){//Returns Room Code
		return this.data.meta.code;
	}
  terminate(){//Deletes The Room
    for(var connection in this.data.connections){
      this.removeConnection(this.data.connections[connection]);
    }
    rooms.removeRoom(this.data.meta.code);
  }
}

//Multiple Rooms

class Rooms{//Initialization
  constructor(){
    this.rooms = {};
  }
  addRoom(r){//Add A Room
    this.rooms[r.data.meta.code] = r;
  }
  joinRoom(c, code){//Join A Room Under Conditions
    if(c.room != undefined){
      c.socket.emit("ALREADY_IN_ROOM");
      return;
    }
    if(this.rooms[code] == undefined){
      c.socket.emit("INVALID_ROOM");
      return;
    }
    if(this.rooms[code].canJoin() == false){
      c.socket.emit("ROOM_FULL");
      return;
    }
		this.rooms[code].addConnection(c);
  }
  removeRoom(code){//Remove A Room
    if(this.rooms[code] != undefined){
      delete this.rooms[code];
    }
  }
}

//Initialize

const connections = new Connections();
const rooms = new Rooms();

//Exports

module.exports = {
  connection:Connection,
  connections:connections,
  room:Room,
  rooms:rooms
}
