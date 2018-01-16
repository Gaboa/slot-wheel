<template>
    <h2 class='settings__title'>{{title}}</h2>
</template>
<script>
export default {
    props:['title']
}
</script>
<style scoped>
    .settings__title {
        margin: 0;
        margin-bottom: 1.5vw;
        padding: 1.3vw 0;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.18);
        text-transform: uppercase;
        text-align: center;
        font-weight: normal;
        font-size: 1.9vw;
        color: #FFFFFF;
    }
</style>


