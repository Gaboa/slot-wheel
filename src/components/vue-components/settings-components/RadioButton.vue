<template>
    <div class="settings__row">
            <span class="settings__name">{{details[0].name}}</span>
            <slot></slot>
            <span class="settings__item">
                <div class="checkbox">
                    <input class="checkbox__input" type="checkbox" :name="details[0].id" :id="details[0].id" checked="">
                    <label class="checkbox__label" :for="details[0].id"></label>
                </div>
            </span>
    </div>
</template>
<script>
export default {
    props:['details']
}
</script>
<style scoped>
.checkbox {
    position: relative;
    width: 2.5vw;
    height: 2.5vw;
}
.checkbox__input {
    display: none;
}
.checkbox__label {
    position: relative;
    z-index: 5;
    display: block;
    box-sizing: border-box;
    width: 2.5vw;
    height: 2.5vw;
    border: 2px solid #fff;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    transition: all .3s ease-in-out;
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.2), inset 2px 2px 4px 0 rgba(0, 0, 0, 0.2);
}
.checkbox__input:checked~.checkbox__label {
    border-width: 0.9vw;
    background: #5FD17A;
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.2), inset 2px 2px 4px 0 rgba(0, 0, 0, 0);
}

</style>

