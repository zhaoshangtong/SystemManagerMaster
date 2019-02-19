<template>
  <div class="container">
    <el-tabs v-model="tabName">
      <el-tab-pane label="数据表格" name="datatable">
        <el-table :data="datas" :show-header="false" style="width: 100%" v-loading="loading">
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
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="数据图表" name="echars">
        <template v-if="tabName === 'echars'">
          <realTimeCharts/>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import datalistdata from "../../../static/alldata.json";
import querydata from "../../../static/querydata.json";
import realTimeCharts from "../mypage/RealTimeCharts.vue";
export default {
  data() {
    return {
      tabName: "datatable",
      datas: [],
      loading: false,
      tags: this.$route.query.tags,
      itemId: this.$route.query.itemId,
      id: this.$route.query.id,
      childName: this.$route.query.childName,
      interval: 0 //定时器
    };
  },
  components: { realTimeCharts },
  mounted() {
    document.title = "实时: " + this.childName;
    this.loading = true;
    this.interval = setInterval(() => {
      this.getData();
    }, 2000);
  },
  methods: {
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
    getData1() {
      var result = querydata.results;
      let id = this.id;
      let itemid = this.itemId;
      var children = datalistdata.filter(o => o.id == id)[0].children;

      if (itemid > 100) {
        var parentId = String(itemid).substring(0, 2);
        children = children.filter(o => o.id == parentId)[0].children;
      }
      var params = children.filter(o => o.id == itemid)[0].params;
      this.datas = [];
      for (var i = 0; i < result.length; i++) {
        var tag = result[i].name;
        var time = result[i].time;
        var value = result[i].value;
        var name = "测试";
        this.datas.push({ name, tag, time, value });
      }
    },
    getData() {
      let login_str = localStorage.getItem("login");
      let login = {};
      if (login_str != undefined) {
        login = JSON.parse(login_str);
      }
      let exprise = new Date();
      exprise = exprise.setDate(exprise.getDate() - 1);
      exprise = new Date(exprise);
      if (login_str != undefined) {
        exprise = login.exprise;
      }
      var sid;
      var now = new Date();
      //var dateDiff = parseInt(exprise - now) / 1000;
      var dateDiff = 0;
      if (dateDiff < 20) {
        //小于2s时
        //重新登陆
        var login_url =
          this.$HttpApi +
          "login?user=admin" +
          "&pwd=21232F297A57A5A743894A0E4A801FC3";
        this.$axios.get(login_url).then(res => {
          if (res.data.error == 0) {
            //登录成功
            sid = res.data.results.sid;
            let exprise = res.data.results.expiration;
            localStorage.setItem("login", JSON.stringify({ sid, exprise }));
            this.getDataFromApi(sid);
          }
        });
      } else {
        sid = login.sid;
        this.getDataFromApi(sid);
      }
    },
    getDataFromApi(sid) {
      let url =
        "http://zxc.vipgz1.idcfengye.com/webapi/get_snapshot?sid=" +
        sid +
        "&tag=" +
        this.tags;
      //获取json数据中的泵站数据
      this.$axios.get(url).then(res => {
        var result = res.data.results;
        this.loading = false;
        //datas数据编辑
        let id = this.id;
        let itemid = this.itemId;
        var children = datalistdata.filter(o => o.id == id)[0].children;
        if (itemid > 100) {
          var parentId = String(itemid).substring(0, 2);
          children = children.filter(o => o.id == parentId)[0].children;
        }
        var params = children
          .filter(o => o.id == itemid)[0]
          .params.filter(p => p.showReal);
        if (params.length == 0) {
          return;
        }
        this.datas = [];
        for (var i = 0; i < result.length; i++) {
          var tag = result[i].name;
          // var time = result[i].time;
          var time = this.formatDate(new Date());
          var value = result[i].value;
          var names = params.filter(o => o.tag == tag);
          var name = "";
          if (names.length > 0) {
            name = names[0].name;
          }
          if (name != "") {
            this.datas.push({ name, tag, time, value });
          }
        }
      });
    }
  },
  beforeDestroy() {
    //清除定时器
    clearInterval(this.interval);
  }
};
</script>
<style>
.message-title {
  cursor: pointer;
}
.handle-row {
  margin-top: 30px;
}
</style>
