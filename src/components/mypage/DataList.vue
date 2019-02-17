<template>
  <div>
    <h1>{{name}}</h1>
    <tree-table
      ref="recTree"
      :list.sync="treeDataSource"
      @actionFunc="actionFunc"
      @deleteFunc="deleteFunc"
      @handlerExpand="handlerExpand"
      @orderByFunc="orderByFunc"
    ></tree-table>
  </div>
</template>
<script>
import datalistdata from "../../../static/alldata.json";
import treeTable from "./TreeTable.vue";
export default {
  name: "datalistview",
  data() {
    return {
      id: this.$route.query.id,
      datalist: datalistdata,
      title: ""
    };
  },
  components: { treeTable },
  computed: {
    name() {
      this.title = this.datalist.filter(p => p.id == this.id)[0].name;
      return this.title;
    },
    treeDataSource() {
      return this.datalist.filter(p => p.id == this.id)[0].children;
    }
  },
  mounted() {
    console.log("id:" + this.id);
  },
  watch: {
    $route() {
      if (this.$route.path == "/datalistview") {
        this.id = this.$route.query.id;
      }
    }
  },
  methods: {
    fetchData() {
      this.treeDataSource = datalistdata.filter(
        p => p.id == this.id
      )[0].children;
      this.name = datalistdata.filter(p => p.id == this.id)[0].name;
    },
    orderByFunc(val) {
      alert(val);
    },
    actionFunc(m) {
      let children = datalistdata.filter(p => p.id == this.id)[0].children;
      if (m.id > 100) {
        var parentId = String(m.id).substring(0, 2);
        children = children.filter(o => o.id == parentId)[0].children;
      }
      let child = children.filter(o => o.id == m.id)[0];
      let _params = child.params;
      let childName = child.name;
      let tags = _params
        .filter(p => p.showReal)
        .map(function(a) {
          return a.tag;
        })
        .join("|");
      let itemId = m.id;
      this.$router.push({
        path: "/realtime/",
        name: "realtimedata",
        query: {
          itemId: itemId,
          tags: tags,
          id: this.id,
          childName: childName
        }
      });
    },
    deleteFunc(m) {
      let children = datalistdata.filter(p => p.id == this.id)[0].children;
      let tableName = "";
      if (m.id > 100) {
        var parentId = String(m.id).substring(0, 2);
        tableName = children.filter(o => o.id == parentId)[0].tableName;
        children = children.filter(o => o.id == parentId)[0].children;
      }
      if (m.id > 10 && m.id < 100) {
        tableName = children.filter(o => o.id == m.id)[0].tableName;
      }
      let child = children.filter(o => o.id == m.id)[0];
      let _params = child.params;
      let childName = child.name;
      let tags = _params
        .filter(p => p.showHistory)
        .map(function(a) {
          return a.tag;
        })
        .join("|");
      let itemId = m.id;
      this.$router.push({
        path: "/historydata/",
        name: "historydata",
        query: {
          itemId: itemId,
          tags: tags,
          id: this.id,
          tableName: tableName,
          childName: childName
        }
      });
    },
    handlerExpand(m) {
      console.log("展开/收缩");
      m.isExpand = !m.isExpand;
    }
  }
};
</script>
<style>
</style>
