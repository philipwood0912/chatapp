export default {
    template: `
        <div id="room">
            <form @submit.prevent="$parent.dispatchMessage">
				<textarea v-model="$parent.message" class="message" type="text" placeholder="Send a message!" autocomplete="off" id="textarea"></textarea>
                <button name="submit"><i class="fas fa-arrow-right fa-3x" style="color:#007cff"></i></button>
			</form>
        </div>
    `,
}