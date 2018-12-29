module.exports = function(io){

    var db_model = require('../models/db_models');
    var data_tb = require('../common/data_tb');

    var USERSDATA = [];
    var isOnlines = [];

    io.sockets.on("connection", function(socket){
        console.log("Có thằng vừa truy cập! ID = " + socket.id);

        //LISTEN ON USER ACTIONS
            socket.on("user_sign_in", function(user){
                socket.username = user.username;
                socket.nickname = user.nickname;
                socket.status = user.status;

                console.log(socket.nickname + ' has been join (' + socket.status + ' - ' + socket.id + ')');

                let userData = {
                    id: socket.id,
                    username: socket.username,
                    nickname: socket.nickname,
                    status: socket.status
                }
                USERSDATA.forEach(e => {
                    if (e.username == socket.username) {
                        let newData = {
                            id: e.id,
                            username: e.username,
                            nickname: e.nickname,
                            status: socket.status
                        }
                        let index = USERSDATA.indexOf(e);
                        USERSDATA.splice(index, 1, newData);
                    }
                });

                USERSDATA.push(userData);
                console.log(USERSDATA);

                let thisUserArr = [];
                USERSDATA.forEach(element => {
                    if (element.username == socket.username) {
                        thisUserArr.push(element.username);
                    }
                });
                // console.log(thisUserArr);

                let thisUserArrLength = thisUserArr.length;
                // if (thisUserArrLength==1 && socket.status=='online') {
                //     socket.broadcast.emit("emit_user_is_now_online", userData);
                // }

                socket.broadcast.emit("emit_sign_in_this_user", userData);
                
                socket.emit("update_user_status", userData);
                socket.broadcast.emit("update_user_status", userData);
            });
            
            socket.on("this_user_sign_in", user => {
                socket.username = user.username;
                socket.nickname = user.nickname;
                socket.status = user.status;
                let userData = {
                    id: socket.id,
                    username: socket.username,
                    nickname: socket.nickname,
                    status: socket.status
                }
                USERSDATA.push(userData);
                console.log(USERSDATA);
            });

            socket.on("user_sign_out", function(user){
                onSignOutStatus = user.status;
                socket.status = user.status;
                console.log(socket.nickname + ' đã thoát (' + socket.id + ' on Status ' + socket.status + ')');
                USERSDATA.forEach(element => {
                    if (element.id == socket.id) {
                        let index = USERSDATA.indexOf(element);
                        USERSDATA.splice(index, 1);
                    }
                });
                console.log(USERSDATA);

                let data = {
                    username: user.username,
                    nickname: user.nickname,
                    status: socket.status
                }

                let thisUserArr = [];
                USERSDATA.forEach(element => {
                    if (element.username == user.username) {
                        thisUserArr.push(element.username);
                    }
                });
                console.log(thisUserArr);
                let thisUserArrLength = thisUserArr.length;
                // if (thisUserArrLength != 0) {
                //     socket.broadcast.emit("emit_sign_out_this_user", data);
                // }
                if (thisUserArrLength == 0) {
                    let data = {
                        username: user.username,
                        nickname: user.nickname,
                        status: 'offline'
                    }
                    socket.broadcast.emit("update_user_status", data);

                    let data_table = data_tb.table.mryu_user;
                    let set = 'connecting = ?';
                    let where = 'username';
                    let params = ['0', socket.username];
                    db_model.editData(data_table, set, where, params)
                    .then(result => {
                        console.log('updated ' + socket.nickname + ' to Disconnecting');
                    }).catch(err => console.log(err));
                } else {
                    socket.broadcast.emit("emit_sign_out_this_user", data);
                }
            });

            socket.on("this_user_sign_out", user => {
                console.log(socket.id + ' đã thoát');
                USERSDATA.forEach(element => {
                    if (element.id == socket.id) {
                        let index = USERSDATA.indexOf(element);
                        USERSDATA.splice(index, 1);
                    }
                });
                console.log(USERSDATA);

                // let data = {
                //     username: user.username,
                //     nickname: user.nickname,
                //     status: socket.status
                // }

                let thisUserArr = [];
                USERSDATA.forEach(element => {
                    if (element.username == user.username) {
                        thisUserArr.push(element.username);
                    }
                });
                if (thisUserArrLength == 0) {
                    let data = {
                        username: user.username,
                        nickname: user.nickname,
                        status: 'offline'
                    }
                    socket.broadcast.emit("update_user_status", data);

                    let data_table = data_tb.table.mryu_user;
                    let set = 'connecting = ?';
                    let where = 'username';
                    let params = ['0', socket.username];
                    db_model.editData(data_table, set, where, params)
                    .then(result => {
                        console.log('updated ' + socket.nickname + ' to Disconnecting');
                    }).catch(err => console.log(err));
                }
            });

            socket.on("screen_is_loged", data => {
                USERSDATA.forEach(element => {
                    if (element.id == socket.id) {
                        let index = USERSDATA.indexOf(element);
                        USERSDATA.splice(index, 1);
                    }
                });
                console.log(USERSDATA);

                socket.broadcast.emit("emit_screen_is_loged", data);
            });
            socket.on("this_screen_is_loged", data => {
                USERSDATA.forEach(element => {
                    if (element.id == socket.id) {
                        let index = USERSDATA.indexOf(element);
                        USERSDATA.splice(index, 1);
                    }
                });
                console.log(USERSDATA);
            });

            socket.on("screen_is_unlocked", user => {
                socket.username = user.username;
                socket.nickname = user.nickname;
                socket.status = user.status;

                let userData = {
                    id: socket.id,
                    username: socket.username,
                    nickname: socket.nickname,
                    status: socket.status
                }
                USERSDATA.push(userData);
                console.log(USERSDATA);

                let thisUserArr = [];
                USERSDATA.forEach(element => {
                    if (element.username == socket.username) {
                        thisUserArr.push(element.username);
                    }
                });
                console.log(thisUserArr);

                socket.broadcast.emit("emit_screen_is_unlocked", user);
            });
            socket.on("this_screen_is_unlocked", user => {
                socket.username = user.username;
                socket.nickname = user.nickname;
                socket.status = user.status;

                let userData = {
                    id: socket.id,
                    username: socket.username,
                    nickname: socket.nickname,
                    status: socket.status
                }
                USERSDATA.push(userData);
                console.log(USERSDATA);
            });
        //LISTEN ON USER ACTIONS

        //LISTEN ON ALL ACTIONS
            socket.on("client_emit", data => {
                let message = data.message;
                let emit = data.emit;
                let broadcast = data.broadcast;
                let content = data.content;
                if (emit) {
                    socket.emit(message, content);
                }
                if (broadcast) {
                    socket.broadcast.emit(message, content);
                }
            });
        //LISTEN ON ALL ACTIONS

        //LISTEN ON INVOICE CONTROLLER
            socket.on("invoice_created", (data) => {
                socket.emit("emit_invoice_created", data);
                socket.broadcast.emit("emit_invoice_created", data);
            });
        //LISTEN ON INVOICE CONTROLLER

        //LISTEN ON TEST DATA PAGE
            socket.on("reload_data", function (message) {
                socket.broadcast.emit("emit_reload_data", message);    
            });

            socket.on("staff_has_been_created", function(nickname) {
                socket.broadcast.emit("emit_staff_has_been_created", nickname);
            });
        //--END TEST DATA

        //DEMO CHAT
            socket.on("client_send_mess", message => {
                let data = {
                    user: socket.id,
                    text: message
                }
                socket.broadcast.emit("server_send_mess", data);
            });
        //--END DEMO CHAT

        //MEMBER CHAT
            socket.on("member_send_mess", data => {
                socket.broadcast.emit("emit_member_send_mess", data);
            });
        //MEMBER CHAT

        //LISTTEN ON CLIENT DISCONNECT
        socket.on("disconnect", function(){
            console.log(socket.nickname + ' has been disconnect (' + socket.id + ')');
            USERSDATA.forEach(element => {
                if (element.id == socket.id) {
                    let index = USERSDATA.indexOf(element);
                    USERSDATA.splice(index, 1);
                }
            });
            console.log('---USERSDATA---');
            console.log(USERSDATA);

            // let data = {
            //     username: socket.username,
            //     nickname: socket.nickname,
            //     status: socket.status
            // }

            let thisUserArr = [];
            USERSDATA.forEach(element => {
                if (element.username == socket.username) {
                    thisUserArr.push(element.username);
                }
            });
            console.log(thisUserArr);
            let thisUserArrLength = thisUserArr.length;
            if (thisUserArrLength == 0) {
                let data = {
                    username: socket.username,
                    nickname: socket.nickname,
                    status: 'offline'
                }
                socket.broadcast.emit("update_user_status", data);

                let data_table = data_tb.table.mryu_user;
                let set = 'connecting = ?';
                let where = 'username';
                let params = ['0', socket.username];
                db_model.editData(data_table, set, where, params)
                .then(result => {
                    console.log('updated ' + socket.nickname + ' to Disconnecting');
                }).catch(err => console.log(err));

            }
        });
    });
}