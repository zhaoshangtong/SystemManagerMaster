<template>
    <div>
        <mt-cell v-for="(item,index) in datas" :key="index" 
        :title="item.name" :style="{color:item.color}" @click="goSearch(item.id,item.tags,item.tableName,item.level)" is-link :to="item.path"></mt-cell>
    </div>
</template>
<script>
import datalistdata from "../../../static/alldata.json";
export default {
    name:"mtDataList",
    data(){
        return{
            id:this.$route.query.id,
            type:this.$route.query.type,
        }
    },
    methods:{
        goSearch(itemId,tags,tableName,level){
            var path="";
            if(this.type==0){//实时数据
                path="/weixin/mtRealTime"
            }else{//历史数据
                path="/weixin/mtHistory"
            }
            this.$router.push({
                path: path,
                query: {
                    id:this.id,//一级id
                    itemId:itemId,//下级id
                    tags:tags,//拼接的tag
                    tableName:tableName,
                    level:level
                }
            })
        }
        
    },
    computed:{
        datas(){
            var data=[];
            var list=datalistdata.filter(o=>o.id==this.id)[0].children;
            if(!!list){
                list.forEach(e => {
                    var name=e.name;
                    var id=e.id;
                    var level=1;
                    var tableName=e.tableName;
                    var params=e.params;
                    
                    var color="blue";
                    var path="";
                    if(this.type==0){//实时数据
                        params=params.filter(p => p.showReal)
                        var tags=params.map(o=>{
                            return o.tag
                        }).join("|");
                        path="/weixin/mtRealTime?id="+this.id+"&itemId="+e.id+"&tags="+tags+"&tableName="+tableName+"&level="+level
                    }else{//历史数据
                        params=params.filter(p => p.showHistory)
                        var tags=params.map(o=>{
                            return o.tag
                        }).join("|");
                        path="/weixin/mtHistory?id="+this.id+"&itemId="+e.id+"&tags="+tags+"&tableName="+tableName+"&level="+level
                    }
                    data.push({name,id,level,tags,color,tableName,path})
                    var children=e.children;
                    if(children==undefined){
                        return;
                    }
                    children.forEach(c=>{
                        var cparams=c.params;
                        
                        level=2,
                        name=c.name;
                        id=c.id;
                        color="black";
                        // var tableName=c.tableName;
                        if(this.type==0){//实时数据
                            cparams=cparams.filter(p => p.showReal)
                            var ctags=cparams.map(o=>{
                                return o.tag
                            }).join("|");
                            path="/weixin/mtRealTime?id="+this.id+"&itemId="+c.id+"&tags="+ctags+"&tableName="+tableName+"&level="+level
                        }else{//历史数据
                            cparams=cparams.filter(p => p.showHistory)
                            var ctags=cparams.map(o=>{
                                return o.tag
                            }).join("|");
                            path="/weixin/mtHistory?id="+this.id+"&itemId="+c.id+"&tags="+ctags+"&tableName="+tableName+"&level="+level
                        }
                        data.push({name,id,level,tags:ctags,color,tableName,path})
                        var grandChildren=c.children;
                        if(!!grandChildren){
                            grandChildren.forEach(g=>{
                                var gparams=g.params;
                                var gtags=gparams.map(o=>{
                                    return o.tag
                                }).join("|");
                                level=3,
                                name=g.name;
                                id=g.id;
                                color="blue";
                                // var tableName=g.tableName;
                                data.push({name,id,level,tags:gtags,color,tableName})
                            })
                        }
                    })
                });
            }
            return data;
        }
    }
}
</script>
<style>

</style>
