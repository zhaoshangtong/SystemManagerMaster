<template>
  <div>
    <h1>{{name}}</h1>
    <tree-table :key="id" ref="recTree" :list.sync="treeDataSource" @actionFunc="actionFunc" @deleteFunc="deleteFunc" @handlerExpand="handlerExpand" @orderByFunc="orderByFunc"></tree-table>
  </div>
</template>
<script>
import datalistdata from '../../../static/alldata.json'
import treeTable from './TreeTable.vue'
export default {
name:'datalistview',
  data() {
    return {
      id:this.$route.params.id,
      datalist:datalistdata,
      title:'',
    };
  },
  components:{treeTable},
  computed:{
    name(){
      this.title= this.datalist.filter(p=>p.id==this.id)[0].name;
      return this.title;
    },
    treeDataSource(){
      return  this.datalist.filter(p=>p.id==this.id)[0].children;
    }
  },
  mounted(){
    console.log("id:"+this.id)
  },
  methods:{
    fetchData(){
      this.treeDataSource=datalistdata.filter(p=>p.id==this.id)[0].children;
      this.name=datalistdata.filter(p=>p.id==this.id)[0].name;
    },
    orderByFunc(val) {
      alert('排序')
      alert(val)
    },
    actionFunc(m) {
      alert('编辑'+this.id)
      let children=datalistdata.filter(p=>p.id==this.id)[0].children;
      let _params=children.filter(o=>o.id==m.id)[0].params;
      let tags=_params.map(function(a) {return a.tag;}).join('|');
      let itemId=m.id;
      this.$router.push({
        path:"/realtime/"+this.id+"/"+itemId+"/"+tags,
        name:"realtimedata",
        params: {
            itemId: itemId,
            tags:tags
          }
      })

    },
    deleteFunc(m) {
      alert('删除'+this.id)
    },
    handlerExpand(m) {
      console.log('展开/收缩')
      m.isExpand = !m.isExpand
    }
  }
};
</script>
<style>
</style>
