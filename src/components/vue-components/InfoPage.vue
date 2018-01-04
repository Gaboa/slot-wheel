<template>
  <div class="info__page active">
      <h3 class="info__header">{{pageInfo.header}}</h3>
      <div class="info__content" v-bind:style="contentGridSystem">
        <div v-for="card in pageInfo.body.cards" :key="card.index">
            <div :is = "card.type" :description="card.description"></div>
        </div>
      </div>
        <ul class="info__footer">
            <li v-for = "item in pageInfo.footer" :key="item">{{item}}</li>
        </ul>
    </div>
</template>

<script>
import ImageTable from './cards/ImageTable'
export default {
    props: ['pageInfo'],
    components:{
        'image-table':ImageTable
    },
    data(){
        return {
            test:'image-table',
            contentGridSystem:{
                gridTemplateColumns: this._props.pageInfo.body.grid.columns,
                gridTemplateRows:  this._props.pageInfo.body.grid.rows
            }
        }
    },
    methods: {
       
    }
}
</script>

<style scoped>
    .info__page {
        padding: 2vw 3vw;
        padding-bottom: 4vw;
    }
    .info__header {
        margin: 1.5vw 0;
        font-style: normal;
        font-weight: normal;
        font-family: 'Oswald', sans-serif;
        font-size: 2vw;
        color: #fff;
    }
    .info__content{
        display: grid;
        margin: 3vw auto;
        /* grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr ; */
        grid-row-gap: 3vw;
        grid-column-gap: 3vw;
        width: 95%;
        justify-items: start;
        font-family: Arial, Helvetica, sans-serif;
    }
    .info__footer {
        margin: 0;
        padding: 0;
        list-style: none;
        font-size: 0.75vw;
        color: #888;
        font-family: Arial, Helvetica, sans-serif;
    }
</style>


