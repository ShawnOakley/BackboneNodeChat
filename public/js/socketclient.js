var ChatClient = function(options) {
	// redefine this to avoid conflicts
	var self = this;

	// app event bus;

	self.vent = options.vent;

	// server hostname replace with your server's hostname eg: http://localhost
	self.hostname = 'http://localhost.com';	

	// connects to the server
	self.connect = function() {
		// connect to the host
		self.socket = io.connect(self.hostname);

		// set responseListeners on the socket
		self.setResponseListeners(self.socket);
	}

	// send login message
	self.login = function(name) {
		self.socket.emit('login', name);
	}

	// send chat message
	self.chat = function(chat) {
		self.socket.emit('chat', chat);
	}

	self.setResponseListerners = function(socket) {
		// handle messages from the server
		socket.on('welcome', function(data){
			// request server info
			socket.emit('onlineUsers');

			self.vent.trigger('loginDone', data);
		})

	socket.on('loginNameExists', function(data) {
      self.vent.trigger('loginNameExists', data);
    });
 
    socket.on('loginNameBad', function(data) {
      self.vent.trigger('loginNameBad', data);
    });
 
    socket.on('onlineUsers', function(data) {
      console.log(data);
      self.vent.trigger('usersInfo', data);
    });
 
    socket.on('userJoined', function(data) {
      self.vent.trigger('userJoined', data);
    });
 
    socket.on('userLeft', function(data) {
      self.vent.trigger('userLeft', data);
    });
 
    socket.on('chat', function(data) {
      self.vent.trigger('chatReceived', data);
    });

	}
}

// User Model

var User = function(args) {
	var self = this;

	// Socket field
	self.socket = args.socket;
	// username field
	self.user = args.user;
})