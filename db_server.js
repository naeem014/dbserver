var io = require('socket.io')();
io.listen(process.env.PORT || 3000);

var mysql = require('mysql');

var pool = mysql.createPool({
	host : 'mysql.devsrvr.flowtrackr.com',
	user : 'naeemakhtar',
	password : 'hkjdf@Thk',
	database : 'ft_chat' 
});

io.sockets.on('connection', function (socket) {

	socket.on('project_message', function (data) {
		var arr = data.split(',');
		var post = {p_id: parseInt(arr[0], 10), u_id: parseInt(arr[1], 10), message: arr[2], unix_stamp: Math.floor(Date.now()/1000)};

		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return;
			}
			connection.query('INSERT INTO project_messages SET ?', post, function (err, result) {
				if (err) {
					console.log(err);
				}
				connection.release();
			});
		});
	});

	socket.on('fetch_project_messages', function (data) {
		
		var param = parseInt(data, 10);
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return;
			}
			connection.query('SELECT * FROM project_messages WHERE p_id = '+param, function (err, result) {
				if (err) {
					console.log(err);
				}
				connection.release();
				socket.emit('from_db', result);
			});
		});
	});

	socket.on('project_entry', function (data) {
		var arr = data.split(',');
		var post = {p_id: parseInt(arr[0], 10), project_name: arr[1]};

		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return;
			}
			connection.query('INSERT INTO project_info SET ?', post, function (err, result) {
				if (err) {
					console.log(err);
				}
				connection.release();
			});
		});
	});

	socket.on('project_info', function (data) {
		var arr = data.split(',');
		var post = {p_id: parseInt(arr[0], 10), u_id: arr[1], user_name: arr[2]};

		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return;
			}
			connection.query('INSERT INTO project_users_info SET ?', post, function (err, result) {
				if (err) {
					console.log(err);
				}
				connection.release();
			});
		});
	});

	socket.on('fetch_project_info', function (data) {
		
		var param = parseInt(data, 10);
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return;
			}
			connection.query('SELECT * FROM project_info WHERE p_id = '+param, function (err, result) {
				if (err) {
					console.log(err);
				}
				connection.release();
				socket.emit('project_name', result);
			});
		});
	});

	socket.on('fetch_project_users_info', function (data) {
		
		var param = parseInt(data, 10);
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				return;
			}
			connection.query('SELECT * FROM project_users_info WHERE p_id = '+param, function (err, result) {
				if (err) {
					console.log(err);
				}
				connection.release();
				socket.emit('project_users', result);
			});
		});
	});	 
});