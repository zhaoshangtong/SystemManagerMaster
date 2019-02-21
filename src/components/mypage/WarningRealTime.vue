<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i>
          实时报警数据
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box" style="margin:10px;">
        <el-select
          v-model="select_cate"
          placeholder="选择设备"
          @change="SelectChange"
          class="handle-select mr10"
        >
          <el-option key="1" label="排水系统" value="排水系统"></el-option>
          <el-option key="2" label="提升机" value="提升机"></el-option>
        </el-select>
      </div>
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
        <el-table-column>
          <template slot-scope="scope">
            <span class="message-title">{{scope.row.msg}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "warningreal",
  data() {
    return {
      datas: [],
      loading: false,
      select_cate: "排水系统",
      interval: 0 //定时器
    };
  },
  mounted() {
    this.loading = true;
    this.getWarnSet();
    this.interval = setInterval(() => {
      this.getData();
    }, 5000);
  },
  methods: {
    SelectChange() {
      this.getWarnSet();
      this.loading = true;
    },
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
    getWarnSet() {
      var type = 1;
      if (this.select_cate == "排水系统") {
        type = 1;
      } else {
        type = 2;
      }
      this.$axios
        .get("http://localhost:8000/api/Warning/GetWarnTagByType?type=" + type)
        .then(res => {
          var result = res.data;
          if (!!result) {
            localStorage.setItem("warning_data", JSON.stringify(result));
            return result;
          }
        });
    },
    getData() {
      var data;
      if (!localStorage.getItem("warning_data")) {
        data = this.getWarnSet();
      } else {
        data = JSON.parse(localStorage.getItem("warning_data"));
      }
      var tags = data
        .map(function(a) {
          return a.tag;
        })
        .join("|");

      var login_url =
        "http://zxc.vipgz1.idcfengye.com/webapi/login?user=admin" +
        "&pwd=21232F297A57A5A743894A0E4A801FC3";
      this.$axios.get(login_url).then(res => {
        if (res.data.error == 0) {
          //登录成功
          let sid = res.data.results.sid;
          let exprise = res.data.results.expiration;
          localStorage.setItem("login", JSON.stringify({ sid, exprise }));
          this.getDataFromApi(sid, tags, data);
        }
      });
    },
    getDataFromApi(sid, tags, params) {
      let url =
        "http://zxc.vipgz1.idcfengye.com/webapi/get_snapshot?sid=" +
        sid +
        "&tag=" +
        tags;
      //获取json数据中的泵站数据
      this.$axios.get(url).then(res => {
        var result = res.data.results;
        this.loading = false;
        //datas数据编辑
        this.datas = [];
        for (var i = 0; i < result.length; i++) {
          var tag = result[i].name;
          // var time = result[i].time;
          var time = this.formatDate(new Date());
          var value = result[i].value;
          var names = params.filter(o => o.tag == tag);
          var name = "";
          var down_value = NaN;
          var down2_value = NaN;
          var up_value = NaN;
          var up2_value = NaN;
          var msg = ""; //报错信息
          if (names.length > 0) {
            name = names[0].name;
            down_value = names[0].down_value;
            if (down_value != -1.123456 && value < down_value) {
              msg = "当前已低于报警下限值:" + down_value;
            }
            down2_value = names[0].down2_value;
            if (down2_value != -1.123456 && value < down2_value) {
              msg = "当前已低于报警下下限值:" + down2_value;
            }
            up_value = names[0].up_value;
            if (up_value != -1.123456 && value > up_value) {
              msg = "当前已高于报警上限值:" + up_value;
            }
            up2_value = names[0].up2_value;
            if (up2_value != -1.123456 && value > up2_value) {
              msg = "当前已高于报警上上限值:" + up2_value;
            }
          }
          if (name != "" && msg != "") {
            this.datas.push({ name, tag, time, value, msg });
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
