<template>
    <div>
        <div @click="chooseSbei">
            <mt-field label="设备：" placeholder="请选择设备" v-model="choose_sbei" style="color:green"></mt-field>
        </div>
        <div>
            <mt-popup v-model="popupVisible" popup-transition="popup-fade" style="width:100%;" closeOnClickModal="true" position="bottom">
                <mt-picker :slots="slots" @change="onValuesChange" showToolbar>
                     <div class="picker-toolbar-title">
                        <div class="usi-btn-cancel" @click="popupVisible = !popupVisible">取消</div>
                        <div class="usi-btn-sure" @click="choosedSbei">确定</div>
                    </div>
                </mt-picker>
            </mt-popup>
        </div>
        <div>
            <mt-field type="date"  v-model="start_date" style="float:left;width:50%;"></mt-field>
            <mt-field type="date"  v-model="end_date" style="float:right;width:50%;"></mt-field>
        </div>
        <div style="width:100%;margin-top:10px;" v-show="hasData">
                <mt-spinner v-show="loading" type="triple-bounce" style="position:absolute;left:50%;top:50%;transform:translate(0,-50%);"></mt-spinner>
                <mt-loadmore style="width:100%;" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
                    <div v-for="(item,index) in datas" :key="index" style="margin-top:5px;border:1px solid #26a2ff;">
                        <mt-cell :title="item.time" style="background-color:aliceblue;">
                        </mt-cell>
                        <mt-cell :title="select_sbei" style="background-color:aliceblue;">
                        </mt-cell>
                        <mt-cell :title="select_case">
                        {{item.value}}
                        </mt-cell>
                        <mt-cell :title="item.msg" style="color:red;">
                        </mt-cell>
                    </div>
                </mt-loadmore>
            </div>
            <div v-show="!hasData" style="position:absolute;top:50%;transform:translate(100%,-50%);">
                没有查到数据～
            </div>
    </div>
</template>
<script>
import datalistdata from "../../../static/alldata.json";
export default {
    data(){
        return{
            popupVisible:false,
            choose_sbei:"",
            start_date:"",
            end_date:"",
            select_sbei:"",
            select_case:"",
            cur_page:1,
            selectTags:[],
            hasData:true,
            loading:false,
            allLoaded:false,
            datas:[],
            slots: [
                {
                    flex: 1,
                    values: [],
                    className: 'slot3',
                    textAlign: 'right'
                }, {
                    divider: true,
                    content: '-',
                    className: 'slot2'
                }, {
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'left'
                }
            ]
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
    methods:{
        onValuesChange(picker, values) {
            var sbei=picker.getSlotValue(0)
            var cases=picker.getSlotValue(1)
            if(this.select_sbei!=sbei){
                this.select_sbei=sbei
                this.getAllWarnSet()
            }
            this.select_case=cases;
        },
        chooseSbei(){
            this.popupVisible=true
        },
        choosedSbei(){
            this.popupVisible=false
            this.choose_sbei=this.select_sbei+"-"+this.select_case
            this.getData()
        },
        formatDate(date,i=1) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            var d = date.getDate();
            d = d < 10 ? "0" + d : d;
            var h = date.getHours();
            var mm = date.getMinutes();
            var s = date.getSeconds();
            if(i==2){
                return y + "-" + m + "-" + d
            }else{
                return y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
            }
            
        },
        async getAllSBei() {
            var datas= await this.$axios
                .get("http://zxc02.vipgz1.idcfengye.com/api/Warning/GetAllSBei")
                .then(res => {
                var result = res.data;
                if (!!result) {
                    return result;
                }
            });
            this.slots[0].values =datas.map(o=>{return o.sbei})
            this.select_sbei = datas[0].sbei;
        },
        async getAllWarnSet() {
            var datas = await this.$axios
                .get("http://zxc02.vipgz1.idcfengye.com/api/Warning/GetAllWarningTags")
                .then(res => {
                var result = res.data;
                if (!!result&&result.length>0) {
                    var obj= result.filter(p=>p.sbei==this.select_sbei);
                    this.selectTags=obj
                    return obj.map(o=>{return o.sbei_child==null?o.name:o.sbei_child+"-"+o.name})
                }
            });
            this.slots[2].values=datas
        },
        getData() {
            this.loading=true
            this.datas = [];
            let start = this.start_date;
            let end = this.end_date;
            let pageIndex = this.cur_page;
            if(this.select_case==""||this.select_case==null){
                this.loading = false;
                return
            }
            let names= this.select_case.split('-');
            let name=names[names.length-1]
            let sData = this.selectTags.filter(o => o.name == name)[0];
            let down_value = sData.down_value;
            let down2_value = sData.down2_value;
            let up_value = sData.up_value;
            let up2_value = sData.up2_value;
            let tableName = this.getTableName(sData.type,this.select_sbei);
            if(tableName==""){
                this.loading = false;
                return
            }
            let tag = sData.tag;
            var url = "http://zxc02.vipgz1.idcfengye.com/api/Warning/GetHistoryWarningData";
            var postdata = {
                startDate: start,
                endDate: end,
                tableName: tableName,
                pageIndex: pageIndex,
                tag: tag,
                down_value: down_value,
                down2_value: down2_value,
                up_value: up_value,
                up2_value: up2_value
            };
            this.$axios.post(url, postdata).then(res => {
                if (!!res.data && res.data.count > 0) {
                var result = res.data.data;
                this.hasData=true
                this.datas=result
                this.totalCount = res.data.count;
                }else{
                    this.hasData=false
                }
                this.loading = false;
            });
            
        },
        getTableName(type,sbei){
            var children=datalistdata.filter(o=>o.id==type)[0].children
            if(!!children&&children.length>0){
                return children.filter(o=>o.name==sbei)[0].tableName
            }else{
                return ""
            }
        },
        loadBottom(){
            if(this.datas.length==this.totalCount){
                this.allLoaded = true;// 若数据已全部获取完毕
            }
            this.cur_page+=1;
            // this.getData();
            // this.$refs.loadmore.onBottomLoaded();
        },
    },
    computed:{
        
    },
    mounted(){
        
        this.start_date = this.formatDate(new Date(),2);
        this.end_date = this.formatDate(new Date(),2);
        this.getAllSBei();
        this.getAllWarnSet();
    }
}
</script>
<style>
.picker-toolbar-title{
    display: flex;
    flex-direction:row;
    justify-content:space-around;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
}
.usi-btn-cancel,
.usi-btn-sure {
    color: #FF6600
}
</style>
