<template>
    <div>
        <mt-spinner v-show="loading" type="triple-bounce" style="position:absolute;left:50%;top:50%;transform:translate(0,-50%);"></mt-spinner>
        <div v-for="(item,index) in datas" :key="index" style="margin-top:5px;border:1px solid #26a2ff;">
            <mt-cell :title="item.time" style="color:blue;background-color:aliceblue;">
            </mt-cell>
            <mt-cell :title="item.sbei" style="color:blue;background-color:aliceblue;">
            </mt-cell>
            <mt-cell :title="item.name">
            {{item.value}}
            </mt-cell>
            <mt-cell :title="item.msg" style="color:red;">
            </mt-cell>
        </div>
    </div>
</template>
<script>
export default {
    name:"mtRealWarning",
    data(){
        return{
            interval:0,
            datas:[],
            loading:false,
            id:this.$route.query.id,

        }
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
      if (this.id == 1) {
        type = 1;
      } else {
        type = 2;
      }
      //zxc02.vipgz1.idcfengye.com
      this.$axios
        .get(
          "http://zxc02.vipgz1.idcfengye.com/api/Warning/GetWarnTagByType?type=" +
            type
        )
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
          var sbei = "";
          var sbei_child = "";
          var down_value = NaN;
          var down2_value = NaN;
          var up_value = NaN;
          var up2_value = NaN;
          var msg = ""; //报错信息
          if (names.length > 0) {
            name = names[0].name;
            sbei = names[0].sbei;
            sbei_child = names[0].sbei_child;
            if (!sbei_child) {
              sbei_child = "";
            }
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
            sbei = sbei + sbei_child;
            this.datas.push({ sbei, name, tag, time, value, msg });
          }
        }
      });
    }
  },
  beforeDestroy() {
    //清除定时器
    clearInterval(this.interval);
  }
}
</script>
<style>

</style>
