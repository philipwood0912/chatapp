// imports always go first - if we're importing anything
import nameComponent from "./modules/nameComponent.js";
import roomComponent from "./modules/roomComponent.js";
import ChatMessage from "./modules/chatMessage.js";

(() => {
    
    const socket = io();
    
    function setUserId({sID, message}) {
        vm.socketID = sID;
        //console.log(sID);
    }
    
    function runDisconnectMessage(packet) {
        //console.log(packet);
        // subtract one from connections when a user leaves
        vm.connections = packet.connection;
        var userindx;
        // loop throught multi array to match disconnecting ids
        // and remove user who disconnected
        for(var i=0; i<vm.nickName.length;i++){
            if(packet.id === vm.nickName[i].id){
                userindx = vm.nickName.indexOf(vm.nickName[i]);
                vm.nickName.splice(userindx, 1);
            }
        }
        console.log(vm.nickName);
    }
    
    function appendNewMessage(msg) {
        //console.log(msg);
        // set audio file on msg function
        let audio = new Audio('../audio/ping.wav');
        vm.messages.push(msg);
        // if message id and vue socketID do not match play audio file
        // so sound is only played when you receive a message
        if(msg.id != vm.socketID){
            audio.play();
        }

    }
    // function to set nickname for chat
    function setNickName(packet) {
        //console.log(packet);
        //push id / name / auth value to an array to be parsed over
        vm.nickName.push({id:packet.id, name:packet.newname, auth:packet.auth});
        // run auth check to make sure right user is authenticated
        vm.authenticated = vm.authCheck(vm.socketID, vm.nickName);
        // set connections when user picks a name and is sent into chat
        vm.connections = packet.connection;
        console.log(vm.nickName);
    }
    
    // this is our main Vue instance
    const vm = new Vue({
        data: {
            socketID: "",
            messages: [],
            message: "",
            nickName: [],
            authenticated: false,
            connections: ""
        },
    
        methods: {
            dispatchMessage() {
                // emit a new message event and send the message to the server
                console.log('handle send message');
    
                socket.emit('chat_message', {
                    content: this.message,
                    name: this.nameCheck(this.socketID, this.nickName)
                })
                
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
            }
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