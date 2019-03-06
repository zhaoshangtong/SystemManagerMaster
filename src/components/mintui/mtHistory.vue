<template>
    <div style="margin:5px;">
        <mt-navbar v-model="selected">
        <mt-tab-item id="1">表格</mt-tab-item>
        <mt-tab-item id="2">图表</mt-tab-item>
        </mt-navbar>
        
        <!-- tab-container -->
        
        <mt-tab-container-item v-if="selected=='1'">
            <div style="margin-top:5px;height:53px;">
                <mt-field type="date"  v-model="start_date" style="float:left;width:50%;"></mt-field>
                <mt-field type="date"  v-model="end_date" style="float:right;width:50%;"></mt-field>
            </div>
            <!-- 表格 -->
            <div style="width:100%;margin-top:10px;" v-show="hasData">
                <mt-spinner v-show="timeShow" type="triple-bounce" style="position:absolute;left:50%;top:50%;transform:translate(0,-50%);"></mt-spinner>
                <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
                    <div v-for="(item,index) in datas" :key="index" style="margin-top:5px;border:1px solid #26a2ff;">
                        <mt-cell :title="item.time" style="color:blue;background-color:aliceblue;">
                        </mt-cell>
                        <mt-cell v-for="(_item,_index) in item.data" :key="_index" :title="_item.name" >
                            <span style="color: green">
                                {{_item.value}}
                            </span>
                        </mt-cell>
                    </div>
                </mt-loadmore>
            </div>
            <div v-show="!hasData" style="position:absolute;top:50%;transform:translate(100%,-50%);">
                没有查到数据～
            </div>
        </mt-tab-container-item>
        <mt-tab-container-item v-if="selected=='2'">
            <!-- 图表 -->
            <div style="margin-top:5px;height:53px;">
                <mt-field type="date"  v-model="start_date" style="float:left;width:50%;"></mt-field>
                <mt-field type="date"  v-model="end_date" style="float:right;width:50%;"></mt-field>
            </div>
            <mtHistoryChars  :start_date="start_date" :end_date="end_date"/>
        </mt-tab-container-item>
    </div>
</template>
<script>
import datalistdata from "../../../static/alldata.json";
import mtHistoryChars from "./mtHistoryChars.vue";
export default {
    name:"mtHistory",
    data(){
        return{
            itemId:this.$route.query.itemId,
            tableName:this.$route.query.tableName,
            tags:this.$route.query.tags,
            level:this.$route.query.level,
            id:this.$route.query.id,
            interval:0,
            showdata:[],
            timeShow:false,
            selected:"1",
            pickerVisible:"",
            datas:[],
            hasData:true,
            start_date:this.formatDate(new Date(),2),
            end_date:this.formatDate(new Date(),2),
            totalCount: 0,
            cur_page: 1,
            allLoaded:false,
        }
    },
    watch:{
        start_date(newDate){
            this.start_date=newDate;
            this.getData()
        },
        end_date(newDate){
            this.end_date=newDate;
            this.getData()
        }
    },
    mounted(){
        this.timeShow=true;
    },
    components:{mtHistoryChars},
    methods:{
        formatDate(date,other=1) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            var d = date.getDate();
            d = d < 10 ? "0" + d : d;
            var h = date.getHours();
            var mm = date.getMinutes();
            var s = date.getSeconds();
            if(other=2){
                return y + "-" + m + "-" + d
            }
            return y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
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
            var params = children.filter(o => o.id == itemId)[0].params.filter(p => p.showHistory);
            return params;
        },
        getData(){
            let start = this.start_date;
            let end = this.end_date;
            let pageIndex = this.cur_page;
            let tags = this.tags; //"A001|A002"
            let tableName = this.tableName;
            var url = "http://zxc02.vipgz1.idcfengye.com/api/History/GetHistoryData";
            var postdata = {
                startDate: start,
                endDate: end,
                tableName: tableName,
                pageIndex: pageIndex,
                pageSize:10
            };
            var params=this.getParams()
            var tagArr=this.tags.split('|')
            this.$axios.post(url, postdata).then(res => {
                if (!!res.data) {
                    var result = res.data.data;
                    for (var i = 0; i < result.length; i++) {
                        var time=result[i]["time"];
                        var data=[]
                        tagArr.forEach(p=>{
                            var tag=p
                            var name=params.filter(o=>o.tag==tag)[0].name
                            var value_tag=tag.replace('.','_').toUpperCase()
                            var value=result[i].item[value_tag]
                            data.push({tag,name,value});
                        })
                        this.datas.push({time,data})                        
                    }
                    this.totalCount = res.data.count;
                    this.hasData=true;
                }else{
                    this.hasData=false;
                }
                this.timeShow=false;
            });
        },
        loadBottom(){
            if(this.datas.length==this.totalCount){
                this.allLoaded = true;// 若数据已全部获取完毕
            }
            this.cur_page+=1;
            this.getData();
            this.$refs.loadmore.onBottomLoaded();
        },
        dateChange(){
            alert(this.start_date+","+this.end_date)
        }
    },
}
</script>
<style>

</style>
