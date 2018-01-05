<template>
    <p class=card__content>{{description.content}}</p>
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
    .card__content{
        color: white;
    }

</style>

