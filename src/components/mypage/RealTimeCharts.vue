<template>
  <div>
    <div
      id="myChart"
      v-show="!IsShowMessage"
      :style="{width:'100%',height:'800px'}"
      v-loading="loading"
    ></div>
    <div v-show="IsShowMessage">没有需要用图表展示的tag~</div>
  </div>
</template>
<script>
import datalistdata from "../../../static/alldata.json";
import querydata from "../../../static/querydata.json";
export default {
  data() {
    return {
      maxPoint: 100,
      interval: 0,
      tags: this.$route.query.tags,
      itemId: this.$route.query.itemId,
      id: this.$route.query.id,
      IsShowMessage: false,
      loading: false,
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
          right: "4%",
          bottom: "3%",
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
    if (this.checkShow()) {
      this.IsShowMessage = false;
      this.loading = true;
      this.interval = setInterval(() => {
        this.getData();
      }, 2000);
    } else {
      this.IsShowMessage = true;
    }
  },
  methods: {
    getData1() {
      var result = querydata.results;
      this.getOption(result);
    },
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
    getOption(result) {
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
      for (var i = 0; i < result.length; i++) {
        var tag = result[i].name;
        var time = result[i].time;
        var value = result[i].value;
        var nameParam = params.filter(o => o.tag == tag)[0];
        var name = "";
        if (nameParam != undefined) {
          name = nameParam.name;
        } else {
          continue;
        }

        if (this.option.legend.data.indexOf(name) == -1) {
          this.option.legend.data.push(name);
        }

        var series = this.option.series.filter(o => o.name == name)[0];
        if (series == undefined) {
          series = {
            name: name,
            type: "line",
            smooth: true,
            data: []
          };
          this.option.series.push(series);
        } else {
          if (series.data.length > this.maxPoint) {
            series.data.shift();
          }
        }
        series.data.push(value);

        if (time.indexOf("1970-01-01") == -1 && this.option.xAxis.data.indexOf(time) == -1) {
          this.option.xAxis.data.push(time);
        }
      }
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.setOption(this.option);
      this.loading = false;
    },
    getData() {
      // this.loading = true;
      let login_str = localStorage.getItem("login");
      let login = {};
      if (login_str != undefined) {
        login = JSON.parse(login_str);
      }

      let exprise = new Date();
      exprise = exprise.setDate(exprise.getDate() - 1);
      if (login_str != undefined) {
        exprise = login.exprise;
      }
      exprise = new Date(exprise);
      var sid;
      var now = new Date();
      //var dateDiff = parseInt(exprise - now) / 1000;(如果别的人请求了会导致sid变)
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
            let url =
              "http://zxc.vipgz1.idcfengye.com/webapi/get_snapshot?sid=" +
              sid +
              "&tag=" +
              this.tags;

            //let postdata = { sid: sid, tag: this.tags };
            //获取json数据中的泵站数据
            this.$axios.post(url).then(res => {
              var result = res.data.results;
              //datas数据编辑
              var isSucess = false;
              if (result.length > 0) {
                result.forEach(element => {
                  if (element.error != 0) {
                    isSucess = false;
                    return;
                  } else {
                    isSucess = true;
                  }
                });
              }
              if (isSucess) {
                this.getOption(result);
              }
            });
          }
        });
      } else {
        sid = login.sid;
        let url =
          "http://zxc.vipgz1.idcfengye.com/webapi/get_snapshot?sid=" +
          sid +
          "&tag=" +
          this.tags;
        //let postdata = { sid: sid, tag: this.tags };
        //获取json数据中的泵站数据
        this.$axios.post(url).then(res => {
          var result = res.data.results;
          //datas数据编辑
          this.getOption(result);
        });
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>
