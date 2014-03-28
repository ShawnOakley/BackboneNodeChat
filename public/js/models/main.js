var HomeModel = Backbone.Model.extent({
	defaults: {
		// Backbone collection for users
		onlineUsers: new UserCollection(),

		// Backbone collection for user chats, initialized with a predefined chat model
		userChats: new ChatCollection([
			new ChatModel({sender: '', message: 'Chat Server v.1'})	
		])		
	},

	// method for adding a new user to onlineUsers collection
	addUser: function(username) {
		this.get('onlineUsers').add(new UserModel({name: username}))
	},

	// method for removing a user from onineUsers collection
	removeUser: function(username) {
		var onlineUsers = this.get('onlineUsers');
		var u = onlineUsers.find(function(item) {
			return item.get('name') == username;
		});

		if (u) {
			onlineUsers.remove(u);
		}
	},

	// method for adding new chat to userChats collection
	addChat: function(chat) {
		this.get('userChats').add(new ChatModel({sender: chat.sender, message: chat.message}))
	}

})

var MainController = function () {
	var self = this;

	// Event Bus for socket client
	self.appEventBus = _.extend({}, Backbone.Events);
	// Event Bus for Backbone Views
	self.viewEventBus = _.extend({}, Backbone.Events);

	// initialize function
	self.init = function() {
		// create a chat client and connect
		self.chatClient = new ChatClient({vent: self.appEventBus})
		self.chatClient.connect();

		// create our views, place login view inside container first.
		self.loginModel = new LoginModel();
		self.contain{erModel = new ContainerModel({
			viewState: new LoginView({
				vent: self.viewEventBus,
				model: self.loginModel
			})
		});
		self.containerView = new ContainerView({model: self.containerModel})
		self.containerView.render()
	}
}
