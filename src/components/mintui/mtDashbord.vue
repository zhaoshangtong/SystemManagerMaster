<template>
    <div style="margin-top:50%">
        <mt-button type="primary" v-for="(item,index) in datas" :key="index" 
        @click="goDataList(item.id)" style="width:100%;height:80px;margin:30px 0;">{{item.name}}</mt-button>
    </div>
</template>
<script>
import datalistdata from "../../../static/alldata.json";
export default {
    name:"mtDashbord",
    data(){
        return{
            type:this.$route.query.type,//0是实时数据，1是历史数据
        }
    },
    methods:{
        goDataList(id){
            this.$router.push({
                path: "mtDataList",
                query: {
                    type:this.type,
                    id:id
                }
            })
        }
    },
    computed:{
        datas(){
            var data=[]
            datalistdata.forEach(element => {
                var name=element.name;
                var id=element.id;
                data.push({name,id})
            });
            return data;
        }
    }
}
</script>
<style>

</style>
