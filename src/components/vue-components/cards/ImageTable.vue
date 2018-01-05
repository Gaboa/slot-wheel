<template>
    <div class="info__card">
            <img class="info__image" :src="description.image.src">
            <div class="info__card__table">
                <div v-for="row in description.table.rows" :key="row">
                    {{row}}
                </div>
            </div>

        </div>
</template>
<script>
export default {
    props:['description'],
    data(){
        return{
            type: 'image-table'
        }
    }
}
</script>
<style scoped>
    .info__card{
        display: grid;
        grid-template-columns: 50% 50% ;
        grid-template-rows: 1fr;
        justify-items: center;
        align-items: center;
        color: white;
        font-size: 1.25vw;
        font-family: 'Oswald', 'Arial', 'Helvetica', sans-serif;
    }
    .info__card img{
        max-width: 80%;
    }
    .info__card__table{
        display: grid;
        grid-template-columns: 30% 70%;
        grid-template-rows: 25% 25% 25% 25%;
        width: 70%;
    }
    .info__card__table div{
        border-bottom: 1px solid grey;
        text-align: center;
    }
    .info__card__table div:nth-child(even){
        border-left: none;
        border-right: 1px solid grey;
        
    }
    .info__card__table div:nth-child(odd){
        border-right: none;
        color: yellow;
    }
    .info__card__table div:first-child{
        grid-column-start: 1;
        grid-column-end: 3;
        grid-row-end: 2;
        grid-row-start: 1;
        padding: 3px 0;
        text-align: left;
        color: white;
    }
    
</style>



