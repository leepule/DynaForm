<template>
  <div class="demo-container">
    <h2>Custom Components Demo (Array Render)</h2>
    <div class="control-panel">
      <el-radio-group v-model="currentSize" size="small">
        <el-radio-button label="medium">Medium</el-radio-button>
        <el-radio-button label="small">Small</el-radio-button>
        <el-radio-button label="mini">Mini</el-radio-button>
      </el-radio-group>
    </div>
    <el-form :model="form" :rules="rules" ref="form" label-width="150px">
      <el-form-item
        v-for="(itemConfig, index) in configList"
        :key="index"
        :label="itemConfig.label"
        :prop="itemConfig.prop">
        <DynaForm
          :config="itemConfig"
          v-model="form[itemConfig.prop]"
          :options="getOptions(itemConfig.prop)"
          :tableOptions="getTableOptions(itemConfig.prop)"
          :total="getTotal(itemConfig.prop)"
          :size="currentSize"
          :style="{ width: itemConfig.width ? itemConfig.width + 'px' : '' }"
          @node-click="(data) => handleNodeClick(itemConfig.prop, data)"
          @page-change="(params) => handlePageChange(itemConfig.prop, params)">
        </DynaForm>
      </el-form-item>
    </el-form>
    <div class="result-display">
      <h3>Form Data:</h3>
      <pre class="json-code"><code>{{ JSON.stringify(form, null, 2) }}</code></pre>
    </div>
  </div>
</template>
<script>
import { DynaForm } from "../index";

export default {
  name: "FullDemo",
  components: { DynaForm },
  data() {
    return {
      currentSize: "small",
      form: {},
      totalMap: {},
      currentDeptData: {},
      configList: [
        {
          label: "文本框",
          type: "TEXT",
          prop: "text_849",
          placeholder: "请输入",
          paramName: "textbox",
          defaultValue: "2026",
          width: 200,
          clearable: true,
        },
        {
          label: "数字输入框",
          type: "NUMBOX",
          prop: "numbox_838",
          placeholder: "请输入",
          paramName: "number",
          width: 200,
          min: 1,
          max: 100,
          precision: null,
          defaultValue: 1,
        },
        {
          label: "日期",
          type: "DATEPKR",
          prop: "datepkr_225",
          placeholder: "请选择日期",
          paramName: "rq",
          width: 200,
          timeType: "date",
          format: "yyyyMMdd",
          valueFormat: "yyyyMMdd",
          multiple: false,
          defaultValue: "20260301",
        },
        {
          label: "年份选择",
          type: "DATEPKR",
          prop: "datepkr_82",
          placeholder: "请选择年份",
          paramName: "year",
          width: 200,
          timeType: "year",
          format: "yyyy",
          valueFormat: "yyyy",
          multiple: false,
          defaultValue: "2026",
        },
        {
          label: "月份",
          type: "DATEPKR",
          prop: "datepkr_945",
          placeholder: "请选择月份",
          paramName: "month",
          width: 200,
          timeType: "month",
          format: "yyyyMM",
          valueFormat: "yyyyMM",
          multiple: false,
          defaultValue: "202603",
        },
        {
          label: "周",
          type: "DATEPKR",
          prop: "datepkr_157",
          placeholder: "请选择周",
          paramName: "week",
          width: 200,
          timeType: "week",
          format: "yyyyww",
          valueFormat: "yyyyww",
          multiple: false,
          defaultValue: "202609",
        },
        {
          label: "季度",
          type: "DATEPKR",
          prop: "datepkr_295",
          placeholder: "请选择季度",
          paramName: "quarter",
          width: 200,
          timeType: "quarter",
          format: "yyyyQ",
          valueFormat: "yyyyQ",
          multiple: false,
          defaultValue: "202601",
        },
        {
          label: "开关",
          type: "SWITCH",
          prop: "switch_187",
          paramName: "switch",
          activeValue: "true",
          inactiveValue: "false",
          defaultValue: false,
        },
        {
          label: "下拉框",
          type: "SELECTPKR",
          prop: "selectpkr_502",
          placeholder: "请选择",
          paramName: "select",
          width: 200,
          sourceType: "constant",
          options: [
            {
              label: "选项1",
              value: "1",
              _X_ROW_KEY: "row_8",
            },
            {
              label: "选项2",
              value: "2",
              _X_ROW_KEY: "row_9",
            },
            {
              label: "选项3",
              value: "3",
              _X_ROW_KEY: "row_10",
            },
            {
              label: "选项4",
              value: "4",
              _X_ROW_KEY: "row_11",
            },
          ],
          valueField: "value",
          labelField: "label",
          multiple: false,
          defaultValue: "1",
        },
        {
          label: "下拉框",
          type: "SELECTPKR",
          prop: "selectpkr_492",
          placeholder: "请选择",
          paramName: "select",
          width: 200,
          sourceType: "constant",
          options: [
            {
              label: "选项1",
              value: "1",
              _X_ROW_KEY: "row_8",
            },
            {
              label: "选项2",
              value: "2",
              _X_ROW_KEY: "row_9",
            },
            {
              label: "选项3",
              value: "3",
              _X_ROW_KEY: "row_10",
            },
            {
              label: "选项4",
              value: "4",
              _X_ROW_KEY: "row_11",
            },
          ],
          valueField: "value",
          labelField: "label",
          multiple: true,
          defaultValue: "1,2",
        },
        {
          label: "下拉选择树",
          type: "SELTREE",
          prop: "seltree_632",
          placeholder: "请选择",
          paramName: "selecttree",
          width: 200,
          sourceType: "sql",
          writeSql: "select * from o_bm",
          options: [],
          valueField: "bmid",
          labelField: "bmmc",
          idField: "id",
          parentIdField: "sjbmid",
          childrenField: "children",
          checkStrictly: false,
          disableBranchNodes: false,
          multiple: false,
        },
        {
          label: "级联选择",
          type: "CASCADPKR",
          prop: "cascadpkr_632",
          placeholder: "请选择",
          paramName: "cascadpkr",
          width: 200,
          sourceType: "sql",
          writeSql: "select * from o_bm",
          options: [],
          valueField: "bmid",
          labelField: "bmmc",
          idField: "id",
          parentIdField: "sjbmid",
          childrenField: "children",
          checkStrictly: false,
          showAllLevels: false,
          multiple: false,
        },
        {
          label: "人员选择",
          type: "PERSONPKR",
          prop: "personpkr_745",
          placeholder: "请选择人员",
          paramName: "personPicker",
          width: 200,
          multiple: true,
          isScopeData: true,
          topDept: null,
          valueField: "id",
          labelField: "xm",
          columns: [
            {
              prop: "xm",
              label: "姓名",
            },
            {
              prop: "account",
              label: "账号",
            },
            {
              prop: "status",
              label: "状态",
            },
            {
              prop: "deptName",
              label: "部门",
            },
            {
              prop: "phone",
              label: "电话",
            },
          ],
          defaultValue: "api5,api6",
        },
        {
          label: "部门选择",
          type: "DEPTPKR",
          prop: "deptpkr_772",
          placeholder: "请选择部门",
          paramName: "dept",
          width: 200,
          disableBranchNodes: false,
          multiple: false,
          isScopeData: true,
          topDept: null,
          valueField: "bmid",
          labelField: "bmmc",
        }
      ],
      optionsMap: {
        seltree_632: [
          {
            id: "hq",
            bmid: "hq",
            bmmc: "总公司",
            children: [
              { id: "hr", bmid: "hr", bmmc: "人力资源部" },
              { id: "dev", bmid: "dev", bmmc: "研发部", children: [
                  { id: "fed", bmid: "fed", bmmc: "前端组" },
                  { id: "bed", bmid: "bed", bmmc: "后端组" }
              ]}
            ]
          }
        ],
        cascadpkr_632: [
          {
            id: "hq",
            bmid: "hq",
            bmmc: "总公司",
            children: [
              { id: "hr", bmid: "hr", bmmc: "人力资源部" },
              { id: "dev", bmid: "dev", bmmc: "研发部", children: [
                  { id: "fed", bmid: "fed", bmmc: "前端组" },
                  { id: "bed", bmid: "bed", bmmc: "后端组" }
              ]}
            ]
          }
        ],
        personpkr_745: [
          {
            id: "dev",
            label: "研发部",
            children: [
              { id: "fed", label: "前端组" },
              { id: "bed", label: "后端组" },
              { id: "apilist", label: "API动态组 (远程分页)" },
              { id: "biglist", label: "超大列表 (本地分页)" }
            ]
          },
          { id: "hr", label: "人力资源部" }
        ],
        deptpkr_772: [
          {
            id: "hq",
            bmid: "hq",
            bmmc: "总公司",
            children: [
              { id: "hr", bmid: "hr", bmmc: "人力资源部" },
              { id: "dev", bmid: "dev", bmmc: "研发部", children: [
                  { id: "fed", bmid: "fed", bmmc: "前端组" },
                  { id: "bed", bmid: "bed", bmmc: "后端组" }
              ]}
            ]
          }
        ]
      },
      dynamicTableOptions: {
        personpkr_745: [],
      },
      mockDb: {
        fed: [
          { id: "101", xm: "Alice", job: "Engineer" },
          { id: "102", xm: "Bob", job: "Senior Engineer" },
        ],
        bed: [
          { id: "103", xm: "Charlie", job: "Architect" },
          { id: "104", xm: "David", job: "DevOps" },
        ],
        hr: [{ id: "201", xm: "Eva", job: "Recruiter" }],
      },
    };
  },
  computed: {
    rules() {
      const rules = {};
      this.configList.forEach((config) => {
        const itemRules = [];
        if (config.required) {
          itemRules.push({
            required: true,
            message: `${config.label} is required`,
            trigger: "change",
          });
        }
        if (config.minLength || config.maxLength) {
          const rule = { trigger: "blur" };
          if (config.minLength) rule.min = config.minLength;
          if (config.maxLength) rule.max = config.maxLength;
          rule.message = `Length should be ${config.minLength || 0} to ${
            config.maxLength
          } characters`;
          itemRules.push(rule);
        }
        if (config.regular) {
          try {
            itemRules.push({
              pattern: new RegExp(config.regular),
              message: "Format is incorrect",
              trigger: "blur",
            });
          } catch (e) {
            console.warn("Invalid regex in config:", config.regular);
          }
        }
        if (itemRules.length > 0) {
          rules[config.prop] = itemRules;
        }
      });
      return rules;
    },
  },
  created() {
    this.configList.forEach((item) => {
      const defaultValue = item.defaultValue !== undefined ? item.defaultValue : null;
      this.$set(this.form, item.prop, defaultValue);
    });
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    });
  },
  methods: {
    getOptions(prop) {
      const item = this.configList.find((c) => c.prop === prop);
      if (item && item.options && item.options.length > 0) {
        return item.options;
      }
      return this.optionsMap[prop] || [];
    },
    getTableOptions(prop) {
      return this.dynamicTableOptions[prop] || [];
    },
    getTotal(prop) {
      return this.totalMap[prop] || 0;
    },
    handleNodeClick(prop, data) {
      if (["personpkr_745"].includes(prop)) {
        console.log("Fetching employees for", data.label);
        if (data.id === "biglist") {
          const list = [];
          for (let i = 1; i <= 25; i++) {
            list.push({
              id: "u" + i,
              name: "User " + i,
              xm: "User " + i,
              account: "user" + i,
              status: i % 3 === 0 ? "inactive" : "active",
              deptName: "Big List Team",
              phone: "1380000" + (1000 + i),
            });
          }
          this.$set(this.dynamicTableOptions, prop, list);
          this.$set(this.totalMap, prop, 0); // Reset or unused
          return;
        }
        if (data.id === "apilist") {
          const list = [];
          for (let i = 1; i <= 50; i++) {
            list.push({
              id: "api" + i,
              name: "API User " + i,
              xm: "API User " + i,
              account: "api_user_" + i,
              status: "active",
              deptName: "API Team",
              phone: "1390000" + (2000 + i),
            });
          }
          this.$set(this.currentDeptData, prop, list);
          const config = this.configList.find((c) => c.prop === prop) || {};
          const pageSize = config.pageSize || 10;
          this.$set(this.dynamicTableOptions, prop, list.slice(0, pageSize));
          this.$set(this.totalMap, prop, 50);
          return;
        }
        setTimeout(() => {
          this.$set(this.dynamicTableOptions, prop, this.mockDb[data.id] || []);
          this.$set(this.totalMap, prop, 0); // No pagination or small list
        }, 200);
      }
    },
    handlePageChange(prop, { page, pageSize, search }) {
      console.log(`Page change for ${prop}: ${page}, search:`, search);
      if (this.currentDeptData[prop]) {
        let fullList = this.currentDeptData[prop];
        if (search && search.keywords) {
          const kw = search.keywords.toLowerCase();
          fullList = fullList.filter((item) => {
            const matchName = item.name && item.name.toLowerCase().includes(kw);
            const matchAcc = (item.account || "").toLowerCase().includes(kw);
            return matchName || matchAcc;
          });
        }
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const slice = fullList.slice(start, end);
        setTimeout(() => {
          this.$set(this.dynamicTableOptions, prop, slice);
          this.$set(this.totalMap, prop, fullList.length);
        }, 300);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  .demo-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .result-display {
    margin-top: 30px;
    background: #282c34;
    padding: 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);

    h3 {
      margin-top: 0;
      color: #e06c75;
      font-size: 18px;
      border-bottom: 1px solid #3e4451;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
  }

  .json-code {
    margin: 0;
    font-family: 'Fira Code', 'Source Code Pro', monospace;
    font-size: 14px;
    line-height: 1.6;
    color: #abb2bf;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-all;
  }
</style>
