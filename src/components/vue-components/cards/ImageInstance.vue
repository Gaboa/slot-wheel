<template>
    <div class='info__card'>
        <img alt='' :src='description.image.src'/>
    </div>
</template>

<script>
export default {
    props:['description'],
    data(){
        return{
            type: 'image-instance'
        }
    }
}
</script>

<style scoped>

    .info__card img{
        object-fit: contain;
        max-width: 70%;
    }

</style>

