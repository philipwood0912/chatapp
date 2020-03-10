export default {
    template: `
        <div id="home">
            <form id="setName" @submit.prevent="$parent.nameSetFunct(nameSet)">
                <h2>Chat Nickname</h2>
                <input v-model="nameSet" placeholder="Coolguy420">
                <button name="submit">Set Name</button>
            </form>
        </div>
    `,
    data: function() {
        return {
            nameSet: ""
        }
    }
}  