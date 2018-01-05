<template>
    <div class='info__card__wrapper' >
        <p>{{description.index}}</p>
        <div class="info__card" v-bind:style='cardGridSystem'>
            <div v-for='item in amountOfBlocks' :key="item" class ="info__card__win-block" > 
                <img :src="description.image.src">    
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['description'],
    data(){
        return{
            type: 'win-line',
            
        }
    },
    computed: {
         cardGridSystem (){
            return {
                gridTemplateColumns: '1fr '.repeat(this.$props.description.columns),
                gridTemplateRows: '1fr '.repeat(this.$props.description.rows)
            }
        },
        amountOfBlocks(){
            return  this.$props.description.columns * this.$props.description.rows
        } 
    },
    mounted(){
        const blocks = this.$el.children[1]

        for(let i = 0 ; i < blocks.children.length; i++){
            let div = blocks.children[i]
            if(this.$props.description.scheme.indexOf(i) == -1){
                div.children[0].style.opacity = '0'
            }
        }
    }
}
</script>

<style scoped>
    .info__card__wrapper{
        color: white;
    }
    .info__card{
        display: grid;
        justify-items:  center;
        align-items: center;
        
    }
    .info__card__win-block{
        border-radius: 3px;
        background-color: rgba(103, 90, 90, 0.46);
        border: 1px solid rgba(51, 45, 45, 0.82);
    }
</style>
