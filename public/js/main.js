// imports always go first - if we're importing anything
import ChatMessage from "./modules/chatMessage.js";

const socket = io();

function setUserId({sID, message}) {
    //debugger;
    vm.socketID = sID;
}

function runDisconnectMessage(packet) {
    //debugger;
    console.log(packet);
}

function appendNewMessage(msg) {
    vm.messages.push(msg);
}

// this is our main Vue instance
const vm = new Vue({
    data: {
        socketID: "",
        messages: [],
        message: "",
        nickName: ""
    },

    methods: {
        dispatchMessage() {
            // emit a new message event and send the message to the server
            console.log('handle send message');

            socket.emit('chat_message', {
                content: this.message,
                name: this.nickName || "anonymous"
            })

            this.message = "";
        }
    },

    components: {
        newmessage: ChatMessage
    },

    mounted: function() {
        console.log('mounted');
    }
}).$mount("#app");

// some event handling -> these events are coming from the server
socket.addEventListener('connected', setUserId);
socket.addEventListener('user_disconnect', runDisconnectMessage);
socket.addEventListener('new_message', appendNewMessage);