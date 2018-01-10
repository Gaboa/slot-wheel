<template>
    <div class='info__card'>
        <!-- <img alt='' :src='description.image.src'/> -->
        <div class='info__image' :style="imageScr"></div>
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
        display: grid;
        grid-template-columns: 35% 65%;
        grid-template-rows: 100%;
        justify-items:  start;
        align-items: center;
        color: white;
        font-size: 1.25vw;
        font-family: 'Oswald', 'Arial', 'Helvetica', sans-serif;
        line-height: 1.5;
    }
    .info__image{
        /* background-image: url('~/src/img/info/skull.png'); */
        background-repeat: none;
        background-position: center;
        background-size: cover;
        height : 100%; 
        width: 100%;
    }

    img{
        width: 50%;
    }
    

</style>
