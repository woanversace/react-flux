var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher'),

    UserActionTypes = require('../constants/ChatConstants').UserActionTypes;
    UserStore = require('../stores/UserStore'),
    EventEmitter = require('events').EventEmitter,
    ObjectAssign = require('object-assign');

var _stateStore = {
        listMessage:''
    },

    CHANGE_EVENT = 'change';


var MessageStore = ObjectAssign({}, EventEmitter.prototype, {

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

    getListMessage: function() {
        return _stateStore.listMessage;
    },

    setListMessage: function(listMessage) {
        _stateStore.listMessage = listMessage;
    },

    addMessage: function(message) {
        _stateStore.listMessage.push(message);
    }
});

MessageStore.dispatchId = ChatAppDispatcher.register(function(action) {

    var payload = action.payload,
        type = action.type;

    switch (type) {
        case UserActionTypes.UPDATE_LIST_MESSAGE:
            MessageStore.setListMessage(payload.listMessage);
            break;
        case UserActionTypes.CREATE_MESSAGE:
            MessageStore.addMessage(payload);
            break;
    };

    MessageStore.emitChange();

});

module.exports = MessageStore;
