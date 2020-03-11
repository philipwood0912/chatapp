export default {
    template: `
        <div id="name">
            <form id="setName" @submit.prevent="$parent.nameSetFunct(nameSet)">
                <h2>Set a name to begin chatting!</h2>
                <input v-model="nameSet" placeholder="Coolguy420"><br>
                <button name="submit">Enter</button>
            </form>
        </div>
    `,
    data: function() {
        return {
            nameSet: ""
        }
    }
}  