'use strict';


var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher'),

    UserActionTypes = require('../constants/ChatConstants').UserActionTypes,

    // Event
    EventEmitter = require('events').EventEmitter,
    ObjectAssign = require('object-assign');

var _stateStore = {
    user: '',
    listUser: '',
    userTarget:''
};

var CHANGE_EVENT = 'change';


var UserStore = ObjectAssign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getAll: function() {
        return _stateStore;
    },

    getUser: function() {
        return _stateStore.user;
    },

    getUserTarget: function() {
        return _stateStore.userTarget;
    },

    getListUser: function() {
        return _stateStore.listUser;
    },

    setUser: function(user) {
        _stateStore.user = user;
    },

    setListUser: function(listUser) {
        _stateStore.listUser = listUser;
    },

    setUserTarget: function(user) {
        _stateStore.userTarget = user;
    }
});

UserStore.dispatchId = ChatAppDispatcher.register(function(action) {
    var payload = action.payload,
        type = action.type;

    switch(type) {
        case UserActionTypes.CREATE_USER:
            UserStore.setUser(payload);
            break;
        case UserActionTypes.UPDATE_LIST_USER:
            UserStore.setListUser(payload.listUser);
            break;
        case UserActionTypes.UPDATE_USER_TARGET:
            UserStore.setUserTarget(payload.userTarget);
            break;
    }

    UserStore.emitChange();
});


module.exports = UserStore;
