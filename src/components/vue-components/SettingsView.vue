<template>
<div :class='{ darkness__visible : visible, darkness__hidden : !visible}' @click.self=closeInfo>
    <div :class='{ opened : visible, closed : !visible}'>

        <div class=info__close @click=closeInfo></div>

        <div class='settings__column'>
            <settings-title title="audio"></settings-title>
            <range :details="[{name: 'Volume', id: 'volume', key:'volume'}]" :state="volume"></range>
            <radio :details="[{name: 'Music', id: 'music', key: 'isMusic'}]" :state="isMusic"></radio>
            <radio :details="[{name: 'Effects', id: 'effects', key: 'isEffects'}]" class="border__none" :state="isEffects"></radio>
            <settings-title title="options"></settings-title>
            <radio :details="[{name: 'Fast spin', id: 'speed', key: 'isFast'}]" :state="isFast"></radio>
        </div>

        <div class='settings__column'>
            <settings-title title="autoplay"></settings-title>
            <radio :details="[{name: 'Stop if cash increases by:', id: 'stopIfCashGreater', key:'stopIfCashGreater'}]" :state="stopIfCashGreater">
                <span class="settings__input">
                    <input type="number" min="0" value="0" id="increase__text">
                </span>
            </radio>
            <radio :details="[{name: 'Stop if cash decreases by:', id: 'stopIfCashLess', key:'stopIfCashLess'}]" :state="stopIfCashLess">
                <span class="settings__input">
                    <input type="number" min="0" value="0" id="increase__text">
                </span>
            </radio>
            <radio :details="[{name: 'Bonus stops the autoplay:', id: 'bonusStopsAutoPlay', key:'bonusStopsAutoPlay' }]" class="border__none" :state="bonusStopsAutoPlay"></radio>
            <settings-title title="mode"></settings-title>
            <div class='settings__row'>
                <mode-button v-for="mode in modes" :key="mode" :name="mode" :isActive ='mode.toLowerCase() === activeMode' >
                    {{mode}}
                </mode-button>
            </div>

        </div>
    </div>
</div>
</template>

<script>
    import InfoPage from './InfoPage.vue'
    import Title from './settings-components/Title'
    import Button from './settings-components/Button'
    import Radio from './settings-components/Radio'
    import Range from './settings-components/Range'

    export default {
        props: [    
            'visible',
            'volume',
            'isMusic',
            'isEffects',
            'isFast',
            'activeMode',
            'bonusStopsAutoPlay',
            'stopIfCashLess',
            'stopIfCashGreater'
                ],
        components: {
            'settings-title': Title,
            'mode-button': Button,
            'radio': Radio,
            'range': Range
        },
        data() {
            return {
                modes: ['FullHD', 'HD', 'Mobile']
            }
        },
        methods: {
            closeInfo(){
                this.$parent.$emit('close_info', {type:'CLOSE', state:'CHANGED',})
            }
        }
    }
</script>

<style scoped>

    .darkness__hidden{
        display: hidden;
    }

    .darkness__visible{
        display: block; 
        position: fixed; 
        z-index: 1; 
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0,0,0); 
        background-color: rgba(0,0,0,0.4);
    }

    .opened {
        z-index: 10;

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        display: flex;
        padding: 3vw 2vw;
        box-sizing: border-box;
        justify-content: space-around;

        width: 80vw;
        height: 45vw;

        border-radius: 3px;
        background: rgba(0, 0, 0, 0.7);

        font-family: 'Oswald', sans-serif;
        font-size: 2.5vw;
    }

    .closed {
        display: none !important;
    }

    .info__close {
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

    .settings__column {
        width: 45%;
    }

    .settings__row {
        color: #FFFFFF;
        padding: 1.5vw 2vw;
        font-size: 1.5vw;
        border-bottom: 1px solid rgba(255, 255, 255, 0.18);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .settings__input {
        max-width: 20%;
    }

    .settings__input input {
        font-size: 1.5vw;
        padding: 0.15vw 0;
        padding-left: 1vw;
        max-width: 100%;
        border: none;
        border-radius: 7px;
        background: rgba(255, 255, 255, 0.18);
        text-align: center;
        color: #ffffff;
        outline: none;
    }
    .border__none{
        border-bottom: none;
    }

    .info__close{
        position: absolute;
        top: 1.5vw;
        right: 0.5vw;
        max-width: 6vw;
        width: 3vw;
        height: 3vw;
        cursor: pointer;
        border: none;

        background: url('data:image/png;base64,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');
        background-size: contain;
        background-repeat: no-repeat;
    }

</style>