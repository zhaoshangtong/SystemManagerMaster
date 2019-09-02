<template>
    <div class="translateCenter">
        <div v-for="(item,index) in datas" :key="index" class="primary-div">
            <mt-button type="primary" @click="goDataList(item.id)" class="primay-btn">{{item.name}}</mt-button>
        </div>
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
            if(this.type==0||this.type==1||this.type==2){
                this.$router.push({
                    path: "mtDataList",
                    query: {
                        type:this.type,
                        id:id
                    }
                })
            }else if(this.type==3){
                this.$router.push({
                    path: "mtRealWarning",
                    query: {
                        type:this.type,
                        id:id
                    }
                })
            }else if(this.type==4){

            }
            
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
.primay-btn{
    /* border-radius: 40px; */
    padding: 10px;
    width: 50%;
}
.primary-div{
    text-align: center;
    width: 100%;
    margin:20px 0;
}
.translateCenter{ width: 100%; position: absolute; left:50%; top:50%; transform:translate(-50%,-50%);}
</style>
