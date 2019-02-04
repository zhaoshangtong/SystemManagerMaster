<template>
    <div id="myChart" :style="{width:'300px',weight:'300px'}">

    </div>
</template>
<script>
import echarts from 'echarts'
export default {
    props:[legendData],
    data(){
        return{
            interval:0,
            tags:this.$route.params.tags,
            option = {
    title: {
        text: '实时数据'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:[]//tag值数组
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []//横坐标
    },
    yAxis: {
        type: 'value'
    },
    series: [
        // {
        //     name:'邮件营销',
        //     type:'line',
              //     stack: '总量',
           //     data:[120, 132, 101, 134, 90, 230, 210]
              // },
             ]
           },
        }
    },
    mounted(){
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        
        this.interval = setInterval(() => {
            if(option.length<=5){
                let data=this.getData()

            }
        }, 1000)
        myChart.setOption(option)
    },
    methods:{
        getData(){
            let exprise=localStorage.getItem("login").exprise;
            var sid;
            var now=new Date();
            var dateDiff=exprise.getTime()-now.getTime();
            if(dateDiff<2000){//小于2s时
            //重新登陆
            var login_url =
            this.$HttpApi +
            "login?user=" +
            this.ruleForm.username +
            "&pwd=21232F297A57A5A743894A0E4A801FC3";
          this.$axios.get(login_url).then(res => {
            if (res.data.error == 0) {
              //登录成功
              sid = res.data.results.sid;
              let exprise=res.data.results.expiration;
              localStorage.setItem("login", {sid,exprise});
            }
          })
        }else{
            sid=localStorage.getItem("login").sid;
        }
        
        let url=this.$HttpApi +"get_snapshot?sid="+sid+"&tag="+this.tags;
        //获取json数据中的泵站数据
        this.$axios.get(url).then(res => {
            var result=res.results;
            //datas数据编辑
            
        });
        }
    },
    beforeDestroy(){
        clearInterval(interval)
    }
}
</script>
<style>

</style>
