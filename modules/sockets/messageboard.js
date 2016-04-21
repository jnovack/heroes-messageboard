module.exports = function(myApp) {
    var nsp_messageboard = myApp.webserver.io.of('/messageboard');
    var debug = require('debug')('module:sockets:messageboard');

    nsp_messageboard.on('connection', function(socket){
        debug("connection on socket.io/messageboard for socket " + socket.id);

        socket.custom = {
            room: null,
            isAdmin: false
        };

        socket.on('join', function(data) {
            // Slight obfuscation for clients
            if (typeof data === "string") { data = { room: data }; }

            if (socket.custom.room) {
              debug("socket " + socket.id + " left " + socket.custom.room);
              socket.leave(socket.custom.room);
            }

            socket.join(data.room);
            socket.custom.room = data.room;

            debug("socket " + socket.id + " joined " + socket.custom.room);
            socket.emit('joined', socket.custom.room);

            if ((typeof data === "object") && (data.admin === true)) {
                debug("socket " + socket.id + " in " + socket.custom.room + " is admin");
                socket.custom.isAdmin = true;
            }

            myApp.storage.get(socket.custom.room, function(err, json) {
                if (!err) {
                    json = myApp.utils.tryJSONParse(json);            // TODO Don't trust parsing.
                    debug("messageboard: onJoin get", json);
                    if (json !== null) {
                        if (typeof json.value !== "undefined") {
                            myApp.utils.each(json.value, function(value) {
                                debug("messageboard: onJoin get each: ", value);
                                socket.emit('value', value);
                            });
                        }
                        if (typeof json.action !== "undefined") {
                            myApp.utils.each(json.action, function(value) {
                                debug("messageboard: onJoin get each: ", value);
                                socket.emit('action', value);
                            });
                        }
                    }
                }
            });
        });

        socket.on('broadcast', function(message) {
            if (!socket.custom.isAdmin) {
                return;
            }
            if (message.event != "command") {
                myApp.storage.get(socket.custom.room, makeGetCallback(socket.custom.room, message));
            }
            nsp_messageboard.in(socket.custom.room).emit(message.event, message.data);
        });

    });

    makeGetCallback = function(id, message) {
        debug("makeGetCallback", id, message);
        var passthru = { id: id, data: message };
        return function(err, json) {
            json = myApp.utils.tryJSONParse(json);    // TODO Don't trust parsing.
            if (typeof json[message.event] == "undefined") {
                json[message.event] = {};
            }
            json[message.event][message.data.id] = message.data;
            debug("makeGetCallback: passthru: ", passthru);
            debug("makeGetCallback: json: ", json);
            myApp.storage.set(passthru.id, JSON.stringify(json));
        };
    };

    debug("loaded...");
};
