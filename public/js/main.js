// imports always go first - if we're importing anything
import nameComponent from "./modules/nameComponent.js";
import roomComponent from "./modules/roomComponent.js";
import ChatMessage from "./modules/chatMessage.js";

(() => {
    
    const socket = io();
    
    function setUserId({sID, message}) {
        vm.socketID = sID;
    }
    
    function runDisconnectMessage(packet) {
        // set vue connections
        vm.connections = packet.connection;
        var userindx;
        // loop through array to match disconnecting ids
        // and remove user who disconnected
        for(var i=0; i<vm.currentUsers.length;i++){
            if(packet.id === vm.currentUsers[i].id){
                userindx = vm.currentUsers.indexOf(vm.currentUsers[i]);
                vm.currentUsers.splice(userindx, 1);
            }
        }
        console.log(vm.currentUsers);
    }
    
    function appendNewMessage(msg) {
        //console.log(msg);
        // set audio file on msg function
        let audio = new Audio('../audio/ping.wav');
        audio.volume = 0.3;
        vm.messages.push(msg);
        // if message id and vue socketID do not match play audio file
        // so sound is only played when you receive a message
        if(msg.id != vm.socketID){
            audio.play();
        }

    }
    // function to set nickname for chat
    function setNickName(packet) {
        console.log(packet);
        //set current users in vue
        vm.currentUsers = packet.currentusers;
        // run auth check to make sure right user is authenticated
        vm.authenticated = vm.authCheck(vm.socketID, vm.currentUsers);
        // set connections when user picks a name and is sent into chat
        vm.connections = packet.connection;
        console.log(vm.currentUsers);
    }
    
    // this is our main Vue instance
    const vm = new Vue({
        data: {
            socketID: "",
            messages: [],
            message: "",
            authenticated: false,
            connections: "",
            currentUsers: ""
        },
    
        methods: {
            dispatchMessage() {
                // emit a new message event and send the message to the server
                console.log('handle send message');
    
                socket.emit('chat_message', {
                    content: this.message,
                    //match ids for current users name
                    name: this.nameCheck(this.socketID, this.currentUsers)
                })
                //this.scrollToBottom();
                this.message = "";
            },
            //set name function
            nameSetFunct(nameSet) {
                console.log('set nickname');
                // if nameset is not an empty string
                if(nameSet != ""){
                    socket.emit('name_set', {
                        name: nameSet,
                        //authenticate the user
                        authenticated: true
                    })
                }
            },
            //name check function
            // loops over an array containing username and socketids
            // if ids match return the username for use in the chat
            nameCheck(id, arr){
                for(let i=0;i<arr.length;i++){
                    if(id === arr[i].id){
                        return arr[i].name;
                    }
                }
            },
            //authenticated check
            //same as name check function but return authentication if ids match
            authCheck(id, arr){
                for(let i=0;i<arr.length;i++){
                    if(id === arr[i].id){
                        return arr[i].auth;
                    }
                }
            },
            scrollToBottom(){
                var container = this.$el.querySelector(".messages");
                container.scrollTop = container.scrollHeight
                //debugger;
            }
        },
        updated: function() {
            this.$nextTick(() => this.scrollToBottom());
        },
        //conponents for chatapp
        components: {
            newname: nameComponent,
            newroom: roomComponent,
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
    socket.addEventListener('nickname', setNickName);
})();