<template>
    <div :class = '{ opened : visible, closed : !visible}' >
        
        <div class=info__close @click=closeInfo></div>

        <info-page :pageInfo ='getDataForActivePage()'></info-page>

        <ul class="info__markers">
        
            <div class="info__left" @click=prev></div>
        
            <li class="info__marker" 
                v-for='page in info.pages' 
                :key="page.index" 
                :class='{ active: activePage === page.index }'>
            </li>
        
            <div class="info__right" @click=next></div>
        
        </ul>

    </div>
</template>

<script>
import InfoPage from './InfoPage.vue'
export default {
    props: ['info', 'visible'],

    components: {
        'info-page': InfoPage
    },

    data(){
        return {
            activePage: 0,
            amountOfPages: this.info.pages.length
        }
    },

    methods:{

        getDataForActivePage(){
            return this.info.pages.filter(page => page.index === this.activePage)[0]
        },

        next(){
            if(this.activePage + 1 >= this.amountOfPages){
                this.activePage = 0 
            } else {
                this.activePage +=1
            }
        },

        prev(){
            if(this.activePage - 1 < 0 ){
                this.activePage = this.amountOfPages - 1
            } else {
                this.activePage -=1
            }
        },

        closeInfo(){
            this.$emit('close', {type:'CLOSE'})
        }

    }
}
</script>

<style scoped>

    .info__markers {
        list-style: none;
        margin: 0;
        padding: 0vw 25vw 1.5vw 25vw;

        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .info__markers li {
        width: 0.8vw;
        height: 0.8vw;

        border-radius: 50%;
        background: white;
    }

    .info__left{
        outline: 0;
        margin-right: 1vw;
        width: 5vw;
        height: 5vw;
        
        -webkit-appearance: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        border: none;
        cursor: pointer;

        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('data:image/png;base64,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');
    }

    .info__right{
        outline: none;
        margin-left: 1vw;
        width: 5vw;
        height: 5vw;

        /* -webkit-appearance: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0); */
        border: none;
        cursor: pointer;

        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('data:image/png;base64,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');
    }

    .opened {
        display: flex;
        flex-direction: column;

        z-index: 10;
        
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        width: 80vw;
        height: 45vw;

        border-radius: 3px;
        background: rgba(0, 0, 0, 0.7);
    }

    .closed{
        display: none;
    }

    .info__close{
        position: absolute;
        top: 1.5vw;
        right: 0.5vw;
        max-width: 6vw;
        width: 50px;
        height: 50px;
        cursor: pointer;
        border: none;

        background: url('data:image/png;base64,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');
        background-size: contain;
        background-repeat: no-repeat;
    }
   
    .info__marker.active {
        background: #777777;
    }

</style>


