<template>
    <div id="input-area" contenteditable="true" v-once v-html="value" :value="value" class="input-area"
         @input="$emit('input', $event.target.innerHTML)"></div>
</template>

<script>
    export default {
        name: "editable",
        props: ['value'],
        watch: {
            value: function (newValue) {
                if (document.activeElement == this.$el) {
                    return;
                }

                this.$el.innerHTML = newValue;
            }
        },
        // created(){
        //     document.getElementById('input-area').focus()
        // }
    }
</script>

<style scoped>
    [contenteditable="true"].single-line {
        white-space: nowrap;
        width: 200px;
        overflow: hidden;
    }

    [contenteditable="true"].single-line br {
        display: none;

    }

    [contenteditable="true"].single-line * {
        display: inline;
        white-space: nowrap;
    }

    .input-area {
        outline: none;
        min-width: 1px;
        color: #C1C3C9;
    }



</style>
