<template>
<div>
    <mt-header title="修改客户资料">
          <a @click="toBack" replace slot="left">
                <a class="back-icon"></a>
          </a>
    </mt-header>
    <mt-tabbar v-model="selected">
  <mt-tab-item id="外卖">
    外卖
  </mt-tab-item>
  <mt-tab-item id="订单">
    订单
  </mt-tab-item>
  <mt-tab-item id="发现">
    发现
  </mt-tab-item>
  <mt-tab-item id="我的">
    我的
  </mt-tab-item>
</mt-tabbar>
</div>

    
</template>
<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        SayHi(){
            alert("hi")
        },
        toBack(){

        }
    }
}
</script>
<style>

</style>
