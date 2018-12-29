module.exports = function(io){
    //For Angular 5 App
        var usersData = [];
        var isOnlines = [];
    //For Angular 5 App



    var usernames = [];
    var connectingData = [];
    var USERSDATA = [];
    var USERLOGOUT = [];

    io.sockets.on("connection", function(socket){
        connectingData.push(socket.id);
        console.log("Có thằng vừa truy cập! ID = " + socket.id);
        // console.log('IS CONNECTING: ');
        // console.log(connectingData);

        //LISTEN ON USER CONTROL
            socket.on("user_is_login", function(user){
                socket.username = user.username;
                socket.nickname = user.nickname;
                socket.status = user.status;
                var changeStatus = user.changeStatus;
                // console.log(socket.username + ' changeStatus = ' + changeStatus);
                // console.log(socket.username + ' has login - ID = ' + socket.id + ' Status: ' + socket.status);
                console.log(`-------------------------------------
                ON USER LOGIN:
                ` + socket.nickname + ` has loged in`);

                USERLOGOUT.forEach(element => {
                    if(element == socket.username){
                        let index = USERLOGOUT.indexOf(element);
                        USERLOGOUT.splice(index, 1);
                    }
                });

                let userData = {
                    id: socket.id,
                    username: socket.username,
                    nickname: socket.nickname,
                    status: socket.status
                }
                USERSDATA.push(userData);
                console.log(USERSDATA);
                
                let thisUserArr = [];
                USERSDATA.forEach(userElement => {
                    if(userElement.username == socket.username){
                        thisUserArr.push(userElement.username);
                    }
                });
                console.log('thisUserArr = ' + thisUserArr);
                let thisUserArrLength = thisUserArr.length;
                console.log('thisUserArrLength = ' + thisUserArrLength);

                if(socket.status=="online"){
                    var mess = socket.nickname + ' is now online';
                } else if (user.status=="away") {
                    var mess = socket.nickname + ' is now online';
                } else {
                    var mess = 'noMess';
                }
                let data = {
                    username: socket.username,
                    status: socket.status,
                    mess: mess
                }
                socket.broadcast.emit("login_this_user", data);

                if(thisUserArrLength == 1){
                    socket.broadcast.emit("emit_user_is_login", data);
                } 
                else {
                    if(changeStatus == 1){
                        socket.broadcast.emit("emit_user_is_login", data);
                    }
                }
            });

            socket.on("user_is_change_status", function(user){
                // socket.username = user.username;
                // socket.nickname = user.nickname;
                socket.status = user.status;
                console.log(socket.username + ' (' + socket.id + ')' + ' has change Status to ' + socket.status);

                if(socket.username){
                    if(socket.status=="online"){
                        var data = {
                            mess: socket.nickname + ' is now online'
                        }
                    } else if (socket.status=="offline"){
                        var data = {
                            mess: socket.nickname + ' has left'
                        }
                    } else {
                        var data = {
                            mess: 'noMess'
                        }
                    }
                    socket.broadcast.emit("emit_user_status", data);
                }
            });

            socket.on("user_is_logout", function(user){
                // socket.username = user.username;
                // socket.nickname = user.nickname;
                socket.status = user.status;

                console.log(`--------------------------------------------------
                ON USER LOGOUT: 
                Logout Notify: 
                ` + socket.username + ' (ID=' + socket.id + ') is logout');

                USERSDATA.forEach(element => {
                    if(element.id == socket.id){
                        let indexOfUser = USERSDATA.indexOf(element);
                        USERSDATA.splice(indexOfUser, 1);
                    }
                });

                console.log('USERSDATA after Logout');
                console.log(USERSDATA);

                let thisUserArr = [];
                USERSDATA.forEach(element => {
                    if(element.username == socket.username){
                        thisUserArr.push(element.username);
                    }
                });

                let thisUserArrLength = thisUserArr.length;
                console.log('thisUserArrLength = ' + thisUserArrLength);
                
                if(thisUserArrLength == 0){
                    let data = {
                        username: socket.username,
                        status: socket.status,
                        mess: socket.nickname + ' has left'
                    }
                    socket.broadcast.emit("emit_user_has_left", data);
        
                    console.log(socket.nickname + ' (' + socket.id + ')' + ' has logout on Status: ' + socket.status);
                    
                    USERLOGOUT.push(socket.username);
                    console.log('USERLOGOUT ' + USERLOGOUT);
                } else {
                    let data = {
                        username: socket.username,
                    }
                    socket.broadcast.emit("check_logout_this_user", data);
                }
            });

            socket.on("delete_this_user", function(user){
                // var username = user.username;
                // var nickname = user.nickname;
                // var status = user.status;
                console.log(`--------------------------------------------------
                ON DELETE LOGED OUT USERS:`)
                console.log('USERSDATA before deleted: ');
                console.log(USERSDATA);
                console.log('Delete user: ' + socket.username + ' (ID=' + socket.id + ')');

                USERSDATA.forEach(element => {
                    if(element.id == socket.id){
                        let indexOfUser = USERSDATA.indexOf(element);
                        console.log('indexOf delete User: ' + indexOfUser);
                        USERSDATA.splice(indexOfUser, 1);
                    }
                });
                
                console.log('USERSDATA after deleted: ');
                console.log(USERSDATA);

                let thisUserArr = [];
                USERSDATA.forEach(element => {
                    if(element.username == socket.username){
                        thisUserArr.push(element.username);
                    }
                });
                let thisUserArrLength = thisUserArr.length;
                console.log('thisUserArrLength: ' + thisUserArrLength);

                if(thisUserArrLength == 0){
                    let data = {
                        username: socket.username,
                        status: socket.status,
                        mess: socket.nickname + ' has left'
                    }
                    socket.broadcast.emit("emit_user_has_left", data);
        
                    console.log(socket.nickname + ' (' + socket.id + ')' + ' has logout on Status: ' + socket.status);
                
                    USERLOGOUT.push(socket.username);
                    console.log('USERLOGOUT: ');
                    console.log(USERLOGOUT);
                } else {
                    console.log(socket.nickname + ' still loging in');
                }
            });

            socket.on("user_is_out_of_work", function(user){
                // socket.username = user.username;
                // socket.nickname = user.nickname;
                var data = {
                    id: user.id,
                    username: user.username,
                    nickname: user.nickname,
                    thisUserMess: 'Your account has been locked!',
                    otherUserMess: user.nickname + ' has been left'
                }
                socket.broadcast.emit("emit_user_has_been_left", data);
            });

            socket.on("user_has_been_created" , function(user){
                var data = {
                    mess: 'Thành viên mới: ' + user.name + ' vừa được khởi tạo',
                    link: user.link
                }
                socket.emit("emit_user_has_been_created", data);
                socket.broadcast.emit("emit_user_has_been_created", data);
            });

            socket.on("user_has_updated_avatar", function(user){
                socket.broadcast.emit("emit_user_has_updated_avatar", user);
            });

            socket.on("user_has_been_edited", function(user){
                socket.broadcast.emit("emit_user_has_been_edited", user);
            });
        //END LISTEN ON USER CONTROL

        //COMMENTS
            socket.on("user_has_commented", function(data){
                socket.broadcast.emit("emit_user_has_commented", data);
            });
        //END COMMENTS

        //LISTEN CUSTOMER CONTROL
            socket.on("customer_has_been_created", function(customer){
                let data = {
                    id: customer.id,
                    mess: 'Một khách hàng mới vừa được thêm vào Hệ thống!',
                    link:customer.link
                }
                socket.broadcast.emit("emit_customer_has_been_created", data);
            });

            socket.on("customer_has_been_updated", function(customer){
                // let data = {
                //     id: customer
                // }
                let data = customer;
                socket.broadcast.emit("emit_customer_has_been_updated", data);
            });
        //LISTEN CUSTOMER CONTROL
        
        //LISTEN VISA ORDERS CONTROL
            socket.on("order_has_been_created", function(order){
                // console.log(order.user + ' vừa thêm một đơn hàng mới');
                var data = {
                    orderID: order.id,
                    mess: order.user + ' vừa thêm một đơn hàng mới',
                    link: order.link
                }
                socket.broadcast.emit("emit_order_has_been_created", data);
            });

            socket.on("order_has_been_updated", function(order){
                var data = {
                    orderID: order.id,
                    mess: order.user + ' vừa cập nhật nội dung một đơn hàng',
                    link: order.link
                }
                socket.broadcast.emit("emit_order_has_been_updated", data);
            });

            socket.on("visa_order_reportOf_has_been_created", function(order){
                var data = {
                    orderID: order.id,
                    mess: order.user + ' vừa báo cáo kết thúc một đơn hàng',
                    link: order.link
                }
                socket.broadcast.emit("emit_visa_order_reportOf_has_been_created", data);
            })

            socket.on("visa_receipt_has_been_created", function(receipt){
                var data = {
                    receiptID: receipt.id,
                    orderID: receipt.orderID,
                    mess: receipt.user + ' vừa lập phiếu thu mới',
                    link: receipt.link
                }
                socket.broadcast.emit("emit_visa_receipt_has_been_created", data);
            });
        //END LISTEN VISA ORDERS CONTROL

        //LISTEN ADVICES CONTROL
            socket.on("user_has_seen_advice", function(id){
                socket.emit("emit_user_has_seen_advice", id);
                socket.broadcast.emit("emit_user_has_seen_advice", id);
            });

        //LISTEN ADVICES CONTROL

        //LISTEN CHAT ALL SERVER
            //listen adduser event
            socket.on("addUser", function(username){
                //save user
                socket.username = username;
                usernames.push(username);
                console.log(usernames);

                //Notify to this user
                var data = {
                    sender: "SERVER",
                    message: "You have join chat room"
                }
                socket.emit("update_message", data);

                //notyfi to other user
                var data = {
                    sender: "SERVER",
                    message: username + " have join to chat room"
                }
                socket.broadcast.emit("update_message", data);
            });

            //listen send_message event
            socket.on("send_message", function(message){
                //Notyfi to this User
                var data = {
                    sender: "You",
                    message: message
                }
                socket.emit("update_message", data);

                //Notyfi to other User
                var data = {
                    sender: socket.username,
                    message: message
                }
                socket.broadcast.emit("update_message", data);
            });
        //END LISTEN CHAT ALL SERVER


        //LISTEN ON CLIENT ANGULAR 5 APP
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
                usersData.push(userData);
                console.log(usersData);

            });

            socket.on("user_sign_out", function(user){
                socket.status = user.status;
                console.log(socket.nickname + ' đã thoát (' + socket.id + ' on Status ' + socket.status + ')');
                usersData.forEach(element => {
                    if (element.id == socket.id) {
                        let index = usersData.indexOf(element);
                        usersData.splice(index, 1);
                    }
                });
                console.log(usersData);
                socket.broadcast.emit("server_sad_user_sign_out", socket.username);
            });
        //--END LISTEN ON CLIENT ANGULAR5 APP

        //listen disconect event
        socket.on("disconnect", function(){
            //On Agular 5 App
                console.log(socket.nickname + ' has been disconnect (' + socket.id + ')');
                usersData.forEach(element => {
                    if (element.id == socket.id) {
                        let index = usersData.indexOf(element);
                        usersData.splice(index, 1);
                    }
                });
                console.log('---USERSDATA---');
                console.log(usersData);
            //--End On Agular 5 App

            //AngularJs App
                // socket.emit("emit_you_have_disconnected", data);

                // console.log(socket.id + ' has been disconnected on Status ' + socket.status);
                // connectingData.forEach(element => {
                //     if(element == socket.id){
                //         var index = connectingData.indexOf(element);
                //         connectingData.splice(index, 1);
                //     }
                // });
                // console.log('IS CONNECTING: ');
                // console.log(connectingData);

                // //ON CHAT ALL SERVER
                //     //Delete User
                //     for (let index = 0; index < usernames.length; index++) {
                //         // const element = array[index];
                //         if(usernames[index] == socket.username){
                //             usernames.splice(index, 1);
                //         }
                //         console.log(usernames);
                //     }
                //     //Notyfi to other User
                //     var data = {
                //         sender: "SERVER",
                //         message: socket.username + " has left!"
                //     }
                //     socket.broadcast.emit("update_message", data);
                // //ON CHAT ALL SERVER
                
                // var userID = socket.id;

                // console.log(`-------------------------------------------------
                // ON USER HAS BEEN DISCONNETCTED`);
                // console.log('USERSDATA before disconnected:');
                // console.log(USERSDATA);

                // USERSDATA.forEach(element => {
                //     if(element.id == userID){
                //         let indexOf = USERSDATA.indexOf(element);
                //         console.log(indexOf);
                //         USERSDATA.splice(indexOf, 1);
                //     }
                // });

                // console.log('USERSDATA after disconnected:');
                // console.log(USERSDATA);

                // if(socket.username){
                //     let thisUserArr = [];
                //     USERSDATA.forEach(element => {
                //         if(element.username == socket.username){
                //             thisUserArr.push(element.username);
                //         }
                //     });
                //     let thisUserArrLength = thisUserArr.length;
                //     console.log(socket.username + ' Lenght = ' + thisUserArrLength);

                //     console.log('USERLOGOUT: ' + USERLOGOUT);
                //     console.log('USERLOGOUT.length = ' + USERLOGOUT.length);

                //     let thisUserLogoutArr = [];
                //     USERLOGOUT.forEach(element => {
                //         if(element == socket.username){
                //             thisUserLogoutArr.push(element);
                //         }
                //     });
                //     let thisUserLogoutArrLength = thisUserLogoutArr.length;
                //     console.log('thisUserLogoutArr: ' + thisUserLogoutArr);

                //     if(thisUserArrLength == 0 && thisUserLogoutArrLength == 0){
                //         if(socket.status != 'offline'){
                //             let data = {
                //                 username: socket.username,
                //                 status: socket.status,
                //                 mess: socket.nickname + ' has left'
                //             }
                //             socket.broadcast.emit("emit_user_has_disconected", data);
                //         }
                //         console.log(socket.nickname + ' (' + userID + ')' + ' has logout - Status: ' + socket.status);
                //     }
                // }
            //AngularJs App
        });
    });
}