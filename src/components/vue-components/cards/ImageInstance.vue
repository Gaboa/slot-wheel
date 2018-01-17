<template>
    <div class='info__card' :style="imageScr">
    </div>
</template>

<script>
export default {
    props:['description'],
    data(){
        return{
            type: 'image-instance'
        }
    },
    computed:{
        imageScr() {
            return {
                backgroundImage: 'url('+ this.$props.description.image.src + ')'
            }
        }
    }
}
</script>

<style scoped>

    .info__card{
        background-image: url(~/src/img/info/cannon.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        height: 100%;
        width: 100%;
    }

</style>

