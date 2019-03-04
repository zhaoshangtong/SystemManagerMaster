<template>
  <div>
    <mt-header  :title="title" style="padding:0;margin-bottom:5px">
      <router-link  to slot="left">
        <mt-button icon="back" @click="goBack">返回</mt-button>
      </router-link>
    </mt-header>
  </div>
</template>
<script>
export default {
    data(){
        return{
            title:"数据中心",
        }
    },
    methods:{
        goBack(){
          this.$router.go(-1);
        }
    }
}
</script>
<style>

</style>
