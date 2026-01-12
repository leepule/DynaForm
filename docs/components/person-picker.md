# 人员选择器 (PersonPicker)

支持组织架构选择的复杂业务组件。

## 配置类型
- `personPicker`

## 演示 (Demo)

<template>
  <div class="demo-card">
    <el-row :gutter="20">
      <el-col :span="12">
        <h4>多选 (Multiple)</h4>
        <div class="tip">点击模拟打开选择框</div>
        <DynaForm
          v-model="multiIds"
          :config="multiConfig"
          :options="deptTree"
          :table-options="tableData"
        />
        <div class="demo-value">Value: {{ multiIds }}</div>
      </el-col>
      <el-col :span="12">
        <h4>单选 (Single)</h4>
        <div class="tip">点击模拟打开选择框</div>
        <DynaForm
          v-model="singleId"
          :config="singleConfig"
          :options="deptTree"
          :table-options="tableData"
        />
        <div class="demo-value">Value: {{ singleId }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <h4>模拟接口请求 (Simulated API)</h4>
        <div class="tip">打开对话框后模拟 1s 延迟加载数据</div>
        <DynaForm
          v-model="apiIds"
          :config="apiConfig"
          :options="deptTree"
          :table-options="apiTableData"
          :total="apiTotal"
          @page-change="handleApiPageChange"
          @node-click="handleApiNodeClick"
        />
        <div class="demo-value">Value: {{ apiIds }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      multiIds: [],
      singleId: null,
      apiIds: [],
      apiTableData: [],
      apiTotal: 0,
      
      deptTree: [
        {
          id: 100,
          label: '总部',
          children: [
             { id: 101, label: '技术部' },
             { id: 102, label: '行政部' }
          ]
        }
      ],
      
      tableData: [
         { id: 'u1', name: '张三', deptName: '技术部', account: 'zhangsan', status: 'active' },
         { id: 'u2', name: '李四', deptName: '技术部', account: 'lisi', status: 'inactive' },
         { id: 'u3', name: '王五', deptName: '行政部', account: 'wangwu', status: 'active' }
      ],
      
      multiConfig: {
        type: 'personPicker',
        label: '人员多选',
        multiple: true,
        pageSize: 5,
        columns: [
           { prop: 'name', label: '姓名' },
           { prop: 'deptName', label: '部门' },
           { prop: 'status', label: '状态' }
        ]
      },
      singleConfig: {
        type: 'personPicker',
        label: '人员单选',
        multiple: false,
        columns: [
           { prop: 'name', label: '姓名' },
           { prop: 'account', label: '账号' }
        ]
      },
      apiConfig: {
        type: 'personPicker',
        label: '异步加载',
        multiple: true,
        pageSize: 5,
        columns: [
           { prop: 'name', label: '姓名' },
           { prop: 'email', label: '邮箱' },
           { prop: 'deptName', label: '部门' }
        ]
      }
    };
  },
  methods: {
    handleApiPageChange({ page, pageSize, deptId, search }) {
        // 模拟 API 请求
        console.log('Fetch Data:', { page, pageSize, deptId, search });
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
          target: '.person-picker-dialog .el-dialog'
        });
        
        setTimeout(() => {
            // 模拟数据生成
            const start = (page - 1) * pageSize;
            const res = [];
            for(let i = 0; i < pageSize; i++) {
                const id = start + i + 1;
                res.push({
                    id: 'api_' + id,
                    name: `User ${id}`,
                    email: `user${id}@example.com`,
                    deptName: deptId ? `Dept ${deptId}` : 'Unknown'
                });
            }
            
            this.apiTableData = res;
            this.apiTotal = 100; // 假设总数 100
            loading.close();
        }, 800);
    },
    handleApiNodeClick(data) {
        // Tree node click -> Trigger fetch (reset page to 1)
        this.handleApiPageChange({
            page: 1,
            pageSize: this.apiConfig.pageSize,
            deptId: data.id,
            search: {}
        });
    }
  }
};
</script>

<style scoped>
.demo-card { border: 1px solid #EBEEF5; padding: 20px; border-radius: 4px; margin: 20px 0; }
.demo-value { margin-top: 15px; padding: 10px; background: #f5f7fa; font-size: 13px; color: #606266; }
.tip { font-size: 12px; color: #E6A23C; margin-bottom: 5px; }
h4 { margin-top: 0; font-size: 14px; margin-bottom: 10px; }
</style>

## 示例代码

```vue
<!-- 1. 多选 -->
<DynaForm
  v-model="ids"
  :config="{ 
      type: 'personPicker', 
      multiple: true, 
      columns: [{prop: 'name', label: '姓名'}] 
  }"
  :options="deptTree"
  :table-options="userList"
/>

```

```vue
<!-- 2. 单选 -->
<DynaForm
  v-model="id"
  :config="{ 
      type: 'personPicker', 
      multiple: false, 
      columns: [{prop: 'name', label: '姓名'}] 
  }"
  :options="deptTree"
  :table-options="userList"
/>
```

```vue
<!-- 3. 模拟接口请求 (Simulated API) -->
<template>
  <DynaForm
    v-model="ids"
    :config="{
        type: 'personPicker',
        pageSize: 10,
        columns: [{prop: 'name', label: '姓名'}, {prop: 'email', label: '邮箱'}]
    }"
    :options="deptTree"
    :table-options="tableData"
    :total="total"
    @page-change="fetchData"
    @node-click="handleNodeClick"
  />
</template>

<script>
export default {
  data() {
    return {
      ids: [],
      tableData: [],
      total: 0,
      deptTree: [...] 
    };
  },
  methods: {
    fetchData({ page, pageSize, deptId, search }) {
      // 模拟请求
      setTimeout(() => {
         // Generate mock data based on page/pageSize
         const mockData = Array.from({ length: pageSize }, (_, i) => ({
             id: (page - 1) * pageSize + i,
             name: 'User ' + ((page - 1) * pageSize + i),
             email: 'test@example.com'
         }));
         this.tableData = mockData;
         this.total = 100;
      }, 500);
    }
  }
}
```

## 属性列表 (config)

| 属性名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `multiple` | Boolean | 是否多选 |
| `pageSize` | Number | 每页显示数量 |
| `columns` | Array | **(必填)** 表格列配置 |
| `childrenField` | String | 树子结构字段 |
| `labelField` | String | 树显示字段 |
