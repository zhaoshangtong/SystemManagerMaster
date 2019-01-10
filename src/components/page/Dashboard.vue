<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="elColSpan" v-for="(menu, index) in firstMenuData" :key="index" :offset="0">
        <el-card :body-style="{ padding: '0px' }">
          <img src="./../../../static/img/img.jpg" class="image">
          <div style="padding: 6px;">
            <span>{{menu.name}}</span>
            <div class="bottom clearfix">
              <el-button type="text" class="button">查看数据详情</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import bus from "../common/bus";

export default {
  name: "dashboard",
  data() {
    return {
      currentDate: new Date(),
      elColSpan: 4,
      firstMenuData: []
    };
  },
  components: { elTable },
  computed: {},
  created() {
    //获取json数据
    let jsonData = [];
    this.$axios.get("./static/alldata.json").then(res => {
      this.firstMenuData = res.data;
    });
  },
  activated() {
    this.handleListener();
  },
  deactivated() {
    window.removeEventListener("resize", this.renderChart);
    bus.$off("collapse", this.handleBus);
  },
  methods: {
    handleListener() {
      bus.$on("collapse", this.handleBus);
    },
    handleBus(msg) {}
  }
};
</script>


<style scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 32px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
