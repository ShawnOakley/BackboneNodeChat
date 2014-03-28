var Server = function(options) {
	var self = this;
	self.io = options.io;

	// users array
	self.users = [];

	// initialize function
	self.init = function() {
		// Fired upon a connection
		self.io.on('connection', function(socket){
			self.handleConnection(socket);
		});
	}

	// socket handler for an incoming socket
	self.handleConnection = function(socket) {
		// wait for a login message
		socket.on('login', function(username) {
			var nameBad = !username || username.length < 3 || username.length > 10;

			if (nameBad) {
				socket.emit('loginNameBad', username);
				return;
			}

			var nameExists = _.some(self.users, function(item) {
				return item.user == username;
			});

			if (nameExists) {
				socket.emit('loginNameExists', username);
			} else {
				// create a new user model
				var newUser = new User({ user: username, socket: socket });
				// push to users array
				self.users.push(newUser);
				// set response listeners for the new user
				self.setResponseListeners(newUser);
				// send welcome message to user
				socket.emit('welcome');
				// send user joined message to all users
				self.io.sockets.emit('userJoined', newUser.user);
			}
		});
	}

	// method to set response listeners
	self.setResponseListeners = function(user) {
		// triggered when a sock disconnects
		user.socket.on('disconnect', function() {
			// remove the use and send uset left message to all
			self.users.splice(self.users.indexOf(user), 1);
			self.io.sockets.emit('userLeft', user.user);
		});
		// triggered when socket requests online users
		user.socket.on('onlineUsers', function(){
			var users = _.map(self.users function(item) {
				return item.user;
			})
		});

		user.socket.emit('onlineUsers', users);
	}
}