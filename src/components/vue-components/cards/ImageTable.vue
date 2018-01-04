<template>
    <div class="info__card">
            <img class="info__image" :src="description.image.src">
            <table class="info__card__table" cellpadding="0" cellspacing="0">
                <th>
                    <td colspan="2">{{description.table.name}}</td>
                    <td></td>
                </th>

                <tr v-for="row in description.table.rows" :key="row.index">
                    <td width=20%>{{row[0]}}</td>
                    <td width=80%>{{row[1]}}</td>
                </tr>
            </table>
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
        grid-template-columns: 1fr 1fr ;
        grid-template-rows: 1fr;
        justify-items: center;
        align-items: center;
    }
    .info__card__table{
        color: #ffffff;
        border-collapse: collapse;
    }
    .info__card__table tr td {
        border: 1px solid grey;
        text-align: center;
        vertical-align: middle;
    }
    .info__card__table tr td:nth-child(odd){
        border-left: none;
    }
    .info__card__table tr td:nth-child(even){
        border-right: none;
        color: beige;
    }
    
</style>



