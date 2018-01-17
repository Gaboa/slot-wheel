<template>
    <p class=card__info>{{description.content}}</p>
</template>
<script>
export default {
    props:['description'],
    data(){
        return{
            type: 'text-description'
        }
    }
}
</script>
<style scoped>

    .card__info{
        color: white;
        font-size: 1.25vw;
        font-family: 'Oswald', 'Arial', 'Helvetica', sans-serif;
        line-height: 1.5;
    }
    p{
        margin: 0;
    }

</style>

