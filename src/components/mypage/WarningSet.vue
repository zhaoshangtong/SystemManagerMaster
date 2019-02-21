<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 报警设置
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="select_cate" placeholder="选择设备" class="handle-select mr10">
          <el-option key="0" label="全部" value="全部"></el-option>
          <el-option key="1" label="排水系统" value="排水系统"></el-option>
          <el-option key="2" label="提升机" value="提升机"></el-option>
        </el-select>

        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        v-loading="loading"
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column prop="id" label="ID" sortable width="150"></el-table-column>
        <el-table-column prop="type" label="type" sortable width="150" style="display:none;"></el-table-column>-->
        <el-table-column prop="sbei" label="所属设备" sortable width="150"></el-table-column>
        <el-table-column prop="sbei_child" label="所属子设备" sortable width="150"></el-table-column>
        <el-table-column prop="name" label="名称" sortable width="150"></el-table-column>
        <el-table-column prop="tag" label="tag" width="120"></el-table-column>
        <el-table-column prop="down_value" label="报警下限值" width="120"></el-table-column>
        <el-table-column prop="down2_value" label="报警下下限值" width="120"></el-table-column>
        <el-table-column prop="up_value" label="报警上限值" width="120"></el-table-column>
        <el-table-column prop="up2_value" label="报警上上限值" width="120"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
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

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="所属设备">
          <el-input v-model="form.sbei"></el-input>
        </el-form-item>
        <el-form-item label="所属子设备">
          <el-input v-model="form.sbei_child"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="tag">
          <el-input v-model="form.tag"></el-input>
        </el-form-item>
        <el-form-item label="报警下限值">
          <el-input v-model="form.down_value"></el-input>
        </el-form-item>
        <el-form-item label="报警下下限值">
          <el-input v-model="form.down2_value"></el-input>
        </el-form-item>
        <el-form-item label="报警上限值">
          <el-input v-model="form.up_value"></el-input>
        </el-form-item>
        <el-form-item label="报警上上限值">
          <el-input v-model="form.up2_value"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "warningset",
  data() {
    return {
      url: "",
      tableData: [],
      totalCount: 0,
      cur_page: 1,
      loading: false,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,

      form: {
        id: 0,
        type: 0,
        sbei: "",
        sbei_child: "",
        name: "",
        tag: "",
        down_value: "",
        down2_value: "",
        up_value: "",
        up2_value: ""
      },
      idx: -1,
      id: 0
    };
  },
  created() {
    this.getData();
  },
  // computed: {
  //   data() {
  //     this.getData();
  //     return this.tableData;
  //   }
  // },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      this.loading = true;
      // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
      var type = 0;
      if (this.select_cate == "全部") {
        type = 0;
      } else if (this.select_cate == "提升机") {
        type = 2;
      } else if (this.select_cate == "排水系统") {
        type = 1;
      }
      this.$axios
        .post(
          "http://zxc02.vipgz1.idcfengye.com/api/Warning/GetWarningSetData",
          {
            pageIndex: this.cur_page,
            type: type
          }
        )
        .then(res => {
          if (!!res.data) {
            this.loading = false;
            this.tableData = res.data.list;
            this.totalCount = res.data.count;
            this.checkData();
          }
        });
    },
    checkData() {
      this.tableData.forEach(o => {
        if (o.down_value == -1.123456) {
          o.down_value = "";
        }
        if (o.down2_value == -1.123456) {
          o.down2_value = "";
        }
        if (o.up_value == -1.123456) {
          o.up_value = "";
        }
        if (o.up2_value == -1.123456) {
          o.up2_value = "";
        }
      });
    },
    search() {
      this.getData();
    },
    //编辑
    handleEdit(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.id = item.id;
      this.form = {
        id: item.id,
        type: item.type,
        sbei: item.sbei,
        sbei_child: item.sbei_child,
        name: item.name,
        tag: item.tag,
        down_value: item.down_value,
        down2_value: item.down2_value,
        up_value: item.up_value,
        up2_value: item.up2_value
      };
      this.editVisible = true;
    },
    //删除
    handleDelete(index, row) {
      this.idx = index;
      this.id = row.id;
      this.delVisible = true;
    },
    delAll() {
      const length = this.multipleSelection.length;
      let str = "";
      this.del_list = this.del_list.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + " ";
      }
      this.$message.error("删除了" + str);
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 保存编辑
    saveEdit() {
      this.$set(this.tableData, this.idx, this.form);
      this.editVisible = false;
      var data = this.form;
      if (data.down_value == "") {
        data.down_value = -1.123456;
      }
      if (data.down2_value == "") {
        data.down2_value = -1.123456;
      }
      if (data.up_value == "") {
        data.up_value = -1.123456;
      }
      if (data.up2_value == "") {
        data.up2_value = -1.123456;
      }
      this.$axios
        .post(
          "http://zxc02.vipgz1.idcfengye.com/api/Warning/EditWarningSet",
          data
        )
        .then(res => {
          var isSuccess = res.data;
          if (isSuccess) {
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.getData();
          }
        });
    },
    // 确定删除
    deleteRow() {
      this.tableData.splice(this.idx, 1);
      this.$axios
        .post(
          "http://zxc02.vipgz1.idcfengye.com/api/Warning/DelWarningSet?id=" +
            this.id
        )
        .then(res => {
          var isSuccess = res.data;
          if (isSuccess) {
            this.$message.success("删除成功");
            this.cur_page = 1;
            this.getData();
          }
        });
      this.delVisible = false;
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
</style>
