<template>
  <div class="container">
    <el-tabs v-model="tabName">
      <el-tab-pane label="数据表格" name="datatable">
        <div class="handle-box" style="margin:10px;">
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
      </el-tab-pane>
      <el-tab-pane label="数据图表" name="echars">
        <template v-if="tabName === 'echars'">
          <historyChart/>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import datalistdata from "../../../static/alldata.json";
import historyChart from "../mypage/HistoryCharts";
export default {
  data() {
    return {
      tags: this.$route.query.tags,
      itemId: this.$route.query.itemId,
      id: this.$route.query.id,
      tableName: this.$route.query.tableName,
      tabName: "datatable",
      childName: this.$route.query.childName,
      datas: [],
      loading: false,
      totalCount: 0,
      cur_page: 1,
      start_date: "",
      end_date: ""
    };
  },
  components: { historyChart },
  mounted() {
    document.title = "历史: " + this.childName;
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      this.datas = [];
      let start = this.start_date;
      let end = this.end_date;
      let pageIndex = this.cur_page;
      let tags = this.tags; //"A001|A002"
      let tableName = this.tableName;
      var url = "http://localhost:8000/api/History/GetHistoryData";
      var postdata = {
        startDate: start,
        endDate: end,
        tableName: tableName,
        pageIndex: pageIndex
      };
      this.$axios.post(url, postdata).then(res => {
        if (!!res.data) {
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
                var vaule = result[i].item[tag.toUpperCase()];
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
          this.loading = false;
        }
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
      let id = this.id;
      let itemid = this.itemId;
      var children = datalistdata.filter(o => o.id == id)[0].children;

      if (itemid > 100) {
        var parentId = String(itemid).substring(0, 2);
        children = children.filter(o => o.id == parentId)[0].children;
      }
      var params = children.filter(o => o.id == itemid)[0].params;
      let colunms = [];
      colunms.push({ name: "时间", tag: "time" });

      params.forEach(element => {
        var new_tag = element.tag.replace(".", "_");
        colunms.push({ name: element.name, tag: new_tag });
      });

      return colunms;
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