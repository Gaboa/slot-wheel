<template>
    <div class='info__card'>
        <img alt='' :src='description.image.src'/>
        <p>{{description.content}}</p>
    </div>
</template>

<script>
export default {
    props:['description'],
    data(){
        return{
            type: 'image-text'
        }
    }
}
</script>

<style scoped>
    .info__card{
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
        justify-items:  center;
        align-items: center;
        color: white;
    }

    img{

    }
    

</style>
