import ChatMessage from "./chatMessage.js";
export default {
    components: {newmessage: ChatMessage},
    template: `
        <div id="room">
            <h2>Chat Room</h2>
            <section class="messages">
                <ul id="messages" v-for="message in $parent.messages">
                    <newmessage :msg="message"></newmessage>
                </ul>
		    </section>
            <form>
				<label for="message">Something to say?</label>
				<textarea v-model="$parent.message" class="message" type="text" autocomplete="off" id="textarea"></textarea>
				<input @click.prevent="$parent.dispatchMessage" type="submit">
			</form>
        </div>
    `,
}