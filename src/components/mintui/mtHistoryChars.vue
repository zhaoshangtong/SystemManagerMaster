<template>
  <div>
    <div v-show="!IsShowMessage">
      <div id="myChart" :style="{width:'100%',height:'500px',overflow:'auto'}" v-loading="loading"></div>
    </div>
    <div v-show="IsShowMessage">没有需要用图表展示的tag~</div>
  </div>
</template>
<script>
import datalistdata from "../../../static/alldata.json";
export default {
  props:['start_date','end_date'],
  data() {
    return {
      interval: 0,
      tags: this.$route.query.tags,
      itemId: this.$route.query.itemId,
      id: this.$route.query.id,
      tableName: this.$route.query.tableName,
      cur_page: 1,
      loading: false,
      IsShowMessage: false,
      option: {
        title: {
          text: ""
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: [] //tag值数组
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "5%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [] //横坐标
        },
        yAxis: {
          type: "value"
        },
        series: []
      }
    };
  },
  mounted() {
    this.start_date = this.formatDate(new Date());
    this.end_date = this.formatDate(new Date());
    if (this.checkShow()) {
      this.IsShowMessage = false;
      this.getData();
    } else {
      this.IsShowMessage = true;
    }
  },
  methods: {
    checkShow() {
      let id = this.id;
      let itemid = this.itemId;
      var children = datalistdata.filter(o => o.id == id)[0].children;
      if (itemid > 100) {
        var parentId = String(itemid).substring(0, 2);
        children = children.filter(o => o.id == parentId)[0].children;
      }
      var params = children
        .filter(o => o.id == itemid)[0]
        .params.filter(p => p.showEChars);
      if (params.length > 0) {
        return true;
      }
      return false;
    },
    formatDate(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    },
    search() {
      this.getData();
    },
    getData() {
      this.loading = true;
      this.datas = [];
      let start = this.start_date;
      let end = this.end_date;
      let pageIndex = this.cur_page;
      let tags = this.tags; //"A001|A002"
      let tableName = this.tableName;
      let pageSize = 100;
      var url = "http://zxc02.vipgz1.idcfengye.com/api/History/GetHistoryData";
      var postdata = {
        startDate: start,
        endDate: end,
        tableName: tableName,
        pageIndex: pageIndex,
        pageSize: 0
      };
      this.$axios.post(url, postdata).then(res => {
        if (!!res.data) {
          var result = res.data.data;
          this.getOption(result);
        }else{
          this.loading=false;
          this.IsShowMessage = true;
        }
      });
    },
    getOption(result) {
      this.option.xAxis.data = [];
      this.option.legend.data = [];
      this.option.series = [];
      let id = this.id;
      let itemid = this.itemId;
      var children = datalistdata.filter(o => o.id == id)[0].children;
      if (itemid > 100) {
        var parentId = String(itemid).substring(0, 2);
        children = children.filter(o => o.id == parentId)[0].children;
      }
      var params = children.filter(o => o.id == itemid)[0].params;
      let colunms = [];
      params.forEach(element => {
        var new_tag = element.tag.replace(".", "_");
        colunms.push({ name: element.name, tag: new_tag });
      });
      colunms.push({ name: "时间", tag: "time" });

      for (var i = 0; i < result.length; i++) {
        for (var j = 0; j < colunms.length; j++) {
          var tag = colunms[j].tag;
          var showName = colunms[j].name;
          var value = 0;
          if (tag == "time") {
            value = result[i][tag];
            //时间轴
            this.option.xAxis.data.push(value);
          } else {
            value = result[i].item[tag];
            if (value == undefined) {
              value = 0;
            }
            var series1 = this.option.series.filter(o => o.name == showName)[0];
            if (
              this.option.legend.data.indexOf(showName) == -1 &&
              tag != "time"
            ) {
              this.option.legend.data.push(showName);
            }
            if (series1 == undefined) {
              this.option.series.push({
                name: showName,
                type: "line",
                data: [value]
              });
            } else {
              series1.data.push(value);
            }
          }
        }
      }
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.setOption(this.option);
      this.loading = false;
    }
  }
};
</script>
<style>
</style>
