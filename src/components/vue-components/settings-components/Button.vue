<template>
    <button class=setting__button>{{name}}</button>
</template>
<script>
export default {
    props:['name', 'isActive']
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


