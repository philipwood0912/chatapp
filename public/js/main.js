// imports always go first - if we're importing anything
import nameComponent from "./modules/nameComponent.js";
import roomComponent from "./modules/roomComponent.js";

(() => {
    
    const socket = io();
    
    function setUserId({sID, message}) {
        //debugger;
        vm.socketID = sID;
    }
    
    function runDisconnectMessage(packet) {
        debugger;
        console.log(packet);
    }
    
    function appendNewMessage(msg) {
        vm.messages.push(msg);
    }
    
    function setNickName(packet) {
        console.log(packet);
        //vm.nickName.push([packet.id, packet.nickName.name]);
        vm.nickName['name'] = packet.nickName.name;
        vm.authenticated = packet.nickName.authenticated;
        console.log(vm.nickName);
        console.log(vm.authenticated);
    }
    
    // this is our main Vue instance
    const vm = new Vue({
        data: {
            socketID: "",
            messages: [],
            message: "",
            nickName: {},
            authenticated: false
        },
    
        methods: {
            dispatchMessage() {
                // emit a new message event and send the message to the server
                console.log('handle send message');
    
                socket.emit('chat_message', {
                    content: this.message,
                    name: this.nickName['name']
                })
    
                this.message = "";
            },
            nameSetFunct(nameSet) {
                console.log('set nickname');
    
                if(nameSet != ""){
                    socket.emit('name_set', {
                        name: nameSet,
                        authenticated: true
                    })
                }
            }
        },
    
        components: {
            newname: nameComponent,
            newroom: roomComponent
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