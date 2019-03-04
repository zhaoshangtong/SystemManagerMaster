<template>
    <div style="margin:5px;">
        <mt-navbar v-model="selected">
        <mt-tab-item id="1">表格</mt-tab-item>
        <mt-tab-item id="2">图表</mt-tab-item>
        </mt-navbar>

        <!-- tab-container -->
        <mt-tab-container-item v-if="selected=='1'">
            <!-- 表格 -->
            <mt-cell :title="nowTime" style="color:blue;background-color:aliceblue;">
            <mt-spinner type="triple-bounce" v-show="timeShow"></mt-spinner>
            </mt-cell>
            <mt-cell-swipe v-for="(item,index) in datas" :key="index" :title="item.name" >
                <span style="color: green">
                    <mt-spinner type="triple-bounce" v-show="timeShow"></mt-spinner>
                    {{item.value}}
                </span>
            </mt-cell-swipe>
        </mt-tab-container-item>
        <mt-tab-container-item v-if="selected=='2'">
            <!-- 图表 -->
            <realTimeCharts />
        </mt-tab-container-item>
    </div>
</template>
<script>
import datalistdata from "../../../static/alldata.json";
import realTimeCharts from "../mypage/RealTimeCharts.vue";
export default {
    name:"mtRealTime",
    data(){
        return{
            itemId:this.$route.query.itemId,
            tableName:this.$route.query.tableName,
            tags:this.$route.query.tags,
            level:this.$route.query.level,
            id:this.$route.query.id,
            interval:0,
            showdata:[],
            nowTime:"",
            timeShow:false,
            selected:"1",
        }
    },
    mounted(){
        this.timeShow=true;
        this.interval = setInterval(() => {
            this.getData();
        }, 2000);
    },
    components:{realTimeCharts},
    beforeDestroy(){
        //清除定时器
        clearInterval(this.interval);
    },
    computed:{
        datas(){
            var tags=this.tags;
            var data=[]
            if(!!tags){
                var tagArr=tags.split('|');
                var params=this.getParams()
                tagArr.forEach(c=>{
                        var tag=c;
                        var value=""
                        var names = params.filter(o => o.tag == tag);
                        var name = "";
                        if (!!names&&names.length > 0) {
                            name = names[0].name;
                        }
                        if (name != "") {
                            data.push({ name, tag, value });
                        }
                })
                if(this.showdata.length>0){
                    data.forEach(d=>{
                        var tag=d.tag
                        var name=d.name
                        var values=this.showdata.filter(p=>p.name==name&&p.tag==tag)
                        if(!!values&&values.length>0){
                            d.value=values[0].value
                            this.timeShow=false
                        }else{
                            d.value=""
                        }
                    })
                }
            }
            return data;
        }
    },
    methods:{
        formatDate(date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            var d = date.getDate();
            d = d < 10 ? "0" + d : d;
            var h = date.getHours();
            var mm = date.getMinutes();
            var s = date.getSeconds();
            return y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
        },
        getData(){
            var login_url =
            "http://zxc.vipgz1.idcfengye.com/webapi/login?user=admin" +
            "&pwd=21232F297A57A5A743894A0E4A801FC3";
            this.$axios.get(login_url).then(res => {
                if (res.data.error == 0) {
                    //登录成功
                    var sid = res.data.results.sid;
                    this.getDataFromApi(sid);
                }
            });
        },
        getDataFromApi(sid) {
            let url =
                "http://zxc.vipgz1.idcfengye.com/webapi/get_snapshot?sid=" +
                sid +
                "&tag=" +
                this.tags;
            //获取json数据中的泵站数据
            var params=this.getParams()//存tag与name的数组
            this.showdata=[]
            this.nowTime=this.formatDate(new Date())
            this.$axios.get(url).then(res => {
                var result = res.data.results;
                if(!!result&&result.length>0){
                    result.forEach(o=>{
                        var tag=o.name;
                        var value=o.value;
                        var names = params.filter(o => o.tag == tag);
                        var name = "";
                        if (!!names&&names.length > 0) {
                            name = names[0].name;
                        }
                        if (name != "") {
                            this.showdata.push({ name, tag, value });
                        }
                    })
                }  
            });
        },
        getParams(){
            let id=this.id
            let itemId=this.itemId
            let level=this.level
            var children = datalistdata.filter(o => o.id == id)[0].children;

            if (level > 1) {
                var parentId = String(itemId).substring(0, 2);
                children = children.filter(o => o.id == parentId)[0].children;
            }
            var params = children.filter(o => o.id == itemId)[0].params.filter(p => p.showReal);
            return params;
        }
    },
}
</script>
<style>

</style>
