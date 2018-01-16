<template>
    <div class='info__card'>
        <ul class='info__card__list'>
            <li v-for='item in description.content' :key='item'>{{item}}</li>
        </ul>
        <div class='info__image' :style='imageScr'></div>
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
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
        justify-items:  start;
        align-items: center;
        font-size: 1.25vw;
        font-family: 'Oswald', 'Arial', 'Helvetica', sans-serif;
    }
    .info__card__list{
        margin: 0;
        padding: 0;
        color: white;
        list-style-type:  none;
        line-height: 1.5;
    }
    .info__image{
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        height: 100%;
         width: 100%;
    }

</style>
