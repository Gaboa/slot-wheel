<template>
    <button :class= 'classObject' @click='handleClick'>{{name}}</button>
</template>
<script>
export default {
    props:['name', 'isActive'],
    computed: {
        classObject(){
            return {   
                setting__button: true,
                active: this.$props.isActive
            }
        }
    },
    methods:{
        handleClick(){
            this.$root.$emit('mode_changed', {type: 'MODE', state: 'CHANGED', val:this.$props.name.toLowerCase(), key:'activeMode'})
        }
    }
}
</script>
<style scoped>

    .setting__button{
        width: 25%;
        height: 3.5vw;
        font-size: 1.5vw;
        border: none;
        color: #000000;
        cursor: pointer;
    }
    .active{
        background-color: #2f7eb7;
        color: #ffffff;
    }
    
</style>


