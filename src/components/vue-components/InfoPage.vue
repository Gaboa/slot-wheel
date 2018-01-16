<template>
    <div class="info__page">
        <h3 class="info__header">{{ pageInfo.header }}</h3>
        <div class="info__content" :style="contentGridSystem">
            <div v-for="card in pageInfo.body.cards" :key="card.index" :style="cardGridSystem(card)">
                <div :is="card.type" :description="card.description"></div>
            </div>
        </div>
        <ul class="info__footer">
            <li v-for="item in pageInfo.footer" :key="item">{{ item }}</li>
        </ul>
    </div>
</template>

<script>
import ImageTable from './cards/ImageTable'
import ImageInstance from './cards/ImageInstance'
import TextDescription from './cards/TextDescription'
import ListImage from './cards/ListImage'
import ImageList from './cards/ImageList'
import ImageText from './cards/ImageText'
import WinLine from './cards/WinLine'

export default {
    props: ['pageInfo'],
    components: {
        'image-table': ImageTable,
        'image-instance': ImageInstance,
        'text-description': TextDescription,
        'list-image': ListImage,
        'image-list': ImageList,
        'image-text': ImageText,
        'win-line': WinLine
    },
    data() {
        return {}
    },
    computed: {
        contentGridSystem() {
            return this.$props.pageInfo.body.grid
        },
        cardGridSystem(card) {
            let vm = this;
            return function (card) {
                if (card.description.position) {
                    return {
                        gridColumnStart: card.description.position.columns[0],
                        gridColumnEnd: card.description.position.columns[1],
                        gridRowEnd: card.description.position.rows[1],
                        gridRowStart: card.description.position.rows[0],

                    }
                } else {
                    return ''
                }

            }
        }
    }
}
</script>

<style scoped>

    .info__page {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 85%;
    }
    
    .info__content {
        display: grid;
        padding: 0 2vw;
        max-width: 100%;
        height: 27vw;
    }
    .info__header {
        margin: 0;
        padding: 3vw 3vw 1vw 3vw;
        font-family: 'Oswald', 'Arial', 'Helvetica', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 2vw;
        color: #fff;
    }
    .info__footer {
        margin: 0;
        padding: 1vw 3vw;
        font-family: 'Oswald', 'Arial', 'Helvetica', sans-serif;
        list-style: none;
        font-size: 0.75vw;
        line-height: 1.5;
        color: #888;
    }

</style>