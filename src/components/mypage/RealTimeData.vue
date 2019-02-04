<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i>`实时数据`</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="tabName" >
                <el-tab-pane label="数据表格" name="datatable">
                    <el-table :data="datas" :show-header="false" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.tag}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.time}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="value" width="180"></el-table-column>
                        <!-- <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.$index)">标为已读</el-button>
                            </template>
                        </el-table-column> -->
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="数据图表" name="echars">
                    <template v-if="tabName === 'echars'">
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import datalistdata from '../../../static/alldata.json'
import querydata from '../../../static/querydata.json'
export default {
    data(){
        return{
            tabName:'datatable',
            datas:[],
            tags:this.$route.params.tags,
            itemId:this.$route.params.itemId,
            id:this.$route.params.id,
            interval:0,//定时器

        }
    },
    mounted(){
        this.interval = setInterval(() => {
            this.getData1()
        }, 1000)
    },
    methods:{
        getData1(){
            var result=querydata.results;
            let id=this.id;
            let itemid=this.itemId;
            var children=datalistdata.filter(o=>o.id==id)[0].children;
            var params=children.filter(o=>o.id==itemid)[0].params;
            this.datas=[];
            for(var i=0;i<result.length;i++){
                var tag=result[i].name;
                var time=result[i].time;
                var value=result[i].value;
                var name=params.filter(o=>o.tag==tag)[0].name;
                this.datas.push({name,tag,time,value});
            }
        },
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
        //清除定时器
        clearInterval(this.interval);
    }
}
</script>
<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
</style>
