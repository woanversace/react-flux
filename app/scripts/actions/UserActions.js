'use strict';


var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher'),
    ChatConstants = require('../constants/ChatConstants'),
    UserActionTypes = ChatConstants.UserActionTypes,

    firebase = require('firebase'),
    _ = require('underscore');


var firebaseListUser = new firebase('https://chatchit.firebaseio.com/user/'),
    firebaseChat1,
    firebaseChat2;

var dispatch = function(type, payload) {
    ChatAppDispatcher.dispatch({
        type: type,
        payload: payload
    });
};


var UserActions = {

    createUser: function(userName, imgUrl) {
        var user = firebaseListUser.push({
            user_name: userName,
            img_url: imgUrl
        }, function(err) {
            if(err) dispatch(UserActionTypes.APP_ERR);
            else {
                dispatch(UserActionTypes.CREATE_USER, {
                    userName: userName,
                    imgUrl: imgUrl,
                    id: user.key()
                });
            }
        });
    },

    updateListUser: function() {
        var listUser=[];

        firebaseListUser.once('value', function(snap) {
            _.each(snap.val(), function(obj, keyId) {
                var temp = {
                    id: keyId,
                    userName: obj.user_name,
                    imgUrl: obj.img_url
                };
                listUser.push(temp);
            });

            // emit event when update finished
            dispatch(UserActionTypes.UPDATE_LIST_USER, {
                listUser: listUser
            });
        });
    },

    updateListMessage: function(targetId, currentId) {
        var listMessage=[];

        firebaseChat1 = new firebase(firebaseListUser + targetId + '/chat/' + currentId);
        firebaseChat2 = new firebase(firebaseListUser + currentId + '/chat/' + targetId);

        firebaseChat1.once('value', function(snap1) {
            var value = snap1.val();
            _.each(value, function(message, keyId) {
                listMessage.push({
                    message: message.message,
                    time: message.time,
                    id: message.id,
                    key: keyId
                });
            });

            // read and add event
            firebaseChat2.on('value', function(snap2) {
                var value2 = snap2.val(),
                    temp=[],
                    count;
                _.each(value2, function(message, keyId) {
                    count=0;
                    _.each(listMessage, function(message) {
                        if(keyId === message.key) {
                            count++;
                        }
                    });
                    if(count === 0) {
                        temp.push({
                            message: message.message,
                            time: message.time,
                            id: message.id,
                            key: keyId
                        });
                    }
                });

                listMessage = listMessage.concat(temp);

                // send event to stores
                dispatch(UserActionTypes.UPDATE_LIST_MESSAGE, {
                    listMessage: listMessage,
                    targetId: targetId
                });
            });
        });

    },

    turnOffListenMessage: function() {
        firebaseChat2.off('value');
    },

    clickToChat: function(user, currentUserId) {
        dispatch(UserActionTypes.UPDATE_USER_TARGET, {
            userTarget: user
        });

        // update listMessage
        this.updateListMessage(user.id, currentUserId);
    },

    createMessage: function(message) {
        var messageFirebase;

        if(firebaseChat1) {
            messageFirebase = firebaseChat1.push(message, function(err) {

                // HANDLE ERORR
                if (err) dispatch(UserActionTypes.ERR_API);
                else {
                    dispatch(UserActionTypes.CREATE_MESSAGE, {
                        message: message.message,
                        time: message.time,
                        id: message.id,
                        key: messageFirebase.key()
                    });
                }
            });
        }
    },

    login: function(user) {
        dispatch(UserActionTypes.CREATE_USER, {
            userName: user.userName,
            imgUrl: user.imgUrl,
            id: user.id
        });
    }

}

module.exports = UserActions;
