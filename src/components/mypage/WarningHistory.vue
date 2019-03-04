<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i>
          历史报警数据
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box" style="margin:10px;">
        <el-select
          v-model="select_cate"
          placeholder="选择设备"
          @change="ChangeSBei"
          class="handle-select mr10"
        >
          <el-option
            v-for="(item,index) in selectSBei"
            :key="index"
            :label="item.sbei"
            :value="item.sbei"
          ></el-option>
        </el-select>
        <el-select v-model="select_name" placeholder="选择参数" class="handle-select mr10">
          <el-option
            v-for="(item,index) in selectTags"
            :key="index"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
        <el-date-picker type="date" placeholder="选择日期" v-model="start_date"></el-date-picker>至
        <el-date-picker type="date" placeholder="选择日期" v-model="end_date"></el-date-picker>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>

      <el-table
        :data="datas"
        border
        stripe
        v-loading="loading"
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-for="(item,index) in ColunmsData"
          :key="index"
          :prop="item.tag"
          :label="item.name"
          align="center"
        ></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="totalCount"
          :page-size="20"
          :pager-count="11"
          :current-page="cur_page"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import datalistdata from "../../../static/alldata.json";
export default {
  name: "warninghistory",

  data() {
    return {
      selectSBei: [],
      select_cate: "",
      datas: [],
      loading: false,
      totalCount: 0,
      cur_page: 1,
      start_date: "",
      end_date: "",
      allWarnTags: [],
      select_name: "",
      tableName: "",
      select_tag: ""
    };
  },
  mounted() {
    this.getAllSBei();
    this.getAllWarnSet();
    // this.getData();
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
    async getAllSBei() {
      this.selectSBei = await this.$axios
        .get("http://zxc02.vipgz1.idcfengye.com/api/Warning/GetAllSBei")
        .then(res => {
          var result = res.data;
          if (!!result) {
            // this.selectSBei = result;
            // this.select_cate = result[0].sbei;
            return result;
          }
        });
      this.select_cate = this.selectSBei[0].sbei;
    },
    ChangeSBei() {
      if (this.allWarnTags.length == 0 || this.selectSBei.length == 0) {
        return [];
      }
      if (this.select_cate == "") {
        return [];
      }
      var type = this.selectSBei.filter(o => o.sbei == this.select_cate)[0]
        .type;
      var stags = this.allWarnTags.filter(
        o => o.type == type && o.sbei == this.select_cate
      );
      this.select_name = stags[0].name;
      this.select_tag = stags[0].tag;
    },
    async getAllWarnSet() {
      this.allWarnTags = await this.$axios
        .get("http://zxc02.vipgz1.idcfengye.com/api/Warning/GetAllWarningTags")
        .then(res => {
          var result = res.data;
          if (!!result) {
            return result;
          }
        });
    },
    getData() {
      this.loading = true;
      this.datas = [];
      let start = this.start_date;
      let end = this.end_date;
      let pageIndex = this.cur_page;
      let name = this.select_name;
      let sData = this.selectTags.filter(o => o.name == name)[0];
      let down_value = sData.down_value;
      let down2_value = sData.down2_value;
      let up_value = sData.up_value;
      let up2_value = sData.up2_value;
      let tableName = this.tableName;
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
          for (var i = 0; i < result.length; i++) {
            var str = "{";
            for (var j = 0; j < this.ColunmsData.length; j++) {
              var tag = this.ColunmsData[j].tag;
              str += '"' + tag + '":';
              if (tag == "time") {
                var vaule = result[i][tag];
                str += '"' + vaule + '",';
              } else {
                var vaule = result[i][tag];
                if (vaule == undefined) {
                  vaule = "";
                }
                str += '"' + vaule + '",';
              }
            }
            str = str.substring(0, str.length - 1);
            str += "}";
            this.datas.push(JSON.parse(str));
          }
          this.totalCount = res.data.count;
        }
        this.loading = false;
      });
    },
    //搜索
    search() {
      this.getData();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  computed: {
    ColunmsData() {
      let colunms = [];
      colunms.push({ name: "时间", tag: "time" });
      colunms.push({ name: this.select_name, tag: "value" });
      colunms.push({ name: "报警信息", tag: "msg" });
      return colunms;
    },
    selectTags() {
      if (this.allWarnTags.length == 0 || this.selectSBei.length == 0) {
        return [];
      }
      if (this.select_cate == "") {
        return [];
      }
      var type = this.selectSBei.filter(o => o.sbei == this.select_cate)[0]
        .type;
      var stags = this.allWarnTags.filter(
        o => o.type == type && o.sbei == this.select_cate
      );
      this.select_name = stags[0].name;
      this.select_tag = stags[0].tag;
      var children = datalistdata.filter(o => o.id == type)[0];
      if (children.length == 0) {
        return [];
      }
      this.tableName = children.children.filter(
        o => o.name == this.select_cate
      )[0].tableName;
      return stags;
    }
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