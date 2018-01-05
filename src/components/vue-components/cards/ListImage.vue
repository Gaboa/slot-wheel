<template>
    <div class='info__card'>
        <ul class='info__card__list'>
            <li v-for='item in description.content' :key='item'>{{item}}</li>
        </ul>
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
    .info__card{
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
        justify-items:  center;
        align-items: center;
    }
    .info__card__list{
        color: white;
        list-style-type:  none;
    }

    img{
        width: 150px;
    }
    

</style>
