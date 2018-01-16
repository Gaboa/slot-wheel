<template>
    <div class="settings__row">
        <span class="settings__name">{{ details[0].name }}</span>
        <span class="settings__item">
            <div class="center">
                <input :id="details[0].id" 
                type="range" 
                min="0"
                max="100"
                :value="state"
                @change="handleChange"
                >
            </div>
        </span>
    </div>
</template>
<script>
export default {
    props: ['details', 'state'],
    methods:{
        handleChange(e){
            this.$root.$emit('sound_changed',
            {
                type:'SOUND', 
                state: 'CHANGED', 
                val: +e.target.value, 
                key:`${this.$props.details[0].key}`
            })
        }
    }
}
</script>
<style scoped>

    .settings__row {
        color: #FFFFFF;
        padding: 1.5vw 2vw;
        font-size: 1.5vw;
        border-bottom: 1px solid rgba(255, 255, 255, 0.18);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: 'Oswald', sans-serif;
    }
    .center {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        padding: 0.4vw 1vw;
    }
    [type=range] {
        -webkit-appearance: none;
        margin: 0;
        width: 17.5vw;
        height: 1.75vw;
        background: transparent;
        cursor: pointer;
    }

    [type=range]:focus {
    outline: none;
    }

    input[type=range]::-webkit-slider-thumb{
        -webkit-appearance: none;
        border: 2px solid #5FD17A;
        height: 1.85vw;
        width: 1.85vw;
        border-radius: 50%;
        cursor: pointer;
        background: #FFFFFF;
        margin-top: -0.92vw;
    }

    input[type=range]::-moz-range-thumb{
        border: 2px solid #5FD17A;
        height: 1.85vw;
        width: 1.85vw;
        border-radius: 50%;
        cursor: pointer;
        background: #FFFFFF;
        margin-top: -0.92vw;
    }

    input[type=range]::-ms-thumb{
        border: 2px solid #5FD17A;
        height: 1.85vw;
        width: 1.85vw;
        border-radius: 50%;
        cursor: pointer;
        background: #FFFFFF;
        margin-top: -0.92vw;
    }

    input[type=range]::-webkit-slider-runnable-track {
        width: 100%;
        height:2px;
        cursor: pointer;
        background: #5FD17A;
    }

    input[type=range]::-moz-range-track {
        width: 100%;
        height:2px;
        cursor: pointer;
        background: #5FD17A;
    }

    input[type=range]::-ms-track {
        width: 100%;
        height:2px;
        cursor: pointer;
        background: #5FD17A;
    }

</style>

