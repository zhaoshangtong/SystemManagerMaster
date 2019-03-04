<template>
    <div class="wrapper">
        
        <div class="content">
            <mtHeader/>
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import mtHeader from "./mtHeader.vue"
export default {
    data(){
        return{

        }
    },
    components:{mtHeader},

}
</script>
<style>

</style>
