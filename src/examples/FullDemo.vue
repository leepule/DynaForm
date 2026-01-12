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
      <el-form-item v-for="(itemConfig, index) in configList" :key="index" :label="itemConfig.label" :prop="itemConfig.prop">
        <MultiPeriodPicker
          v-if="itemConfig.type === 'multiPeriod'"
          :value="form[itemConfig.prop]"
          @input="(val) => $set(form, itemConfig.prop, val)"
          :config="itemConfig"
        />
        <DynaForm
            v-else
            :config="itemConfig"
            v-model="form[itemConfig.prop]"
            :options="getOptions(itemConfig.prop)"
            :tableOptions="getTableOptions(itemConfig.prop)"
            :total="getTotal(itemConfig.prop)"
            :size="currentSize"
            @node-click="(data) => handleNodeClick(itemConfig.prop, data)"
            @page-change="(params) => handlePageChange(itemConfig.prop, params)"
        >
          <!-- Slots can still be used if config type is not mapped, or for custom overrides if logic changes -->
        </DynaForm>
      </el-form-item>
    </el-form>
    <div class="result-display">
      <h3>Form Data:</h3>
      <pre>{{ form }}</pre>
    </div>
  </div>
</template>
<script>
  // Relative path to src/index.js if running inside the repo
  import { DynaForm } from "../index";
  import MultiPeriodPicker from "../components/MultiPeriodPicker.vue";

  export default {
    name: "FullDemo",
    components: { DynaForm, MultiPeriodPicker },
    data() {
      return {
        currentSize: "small",
        form: {},
        totalMap: {}, // Store total for pagination for each prop
        currentDeptData: {}, // Store current full list for simulation
        // Configuration Array
        configList: [
          {
            prop: "text",
            type: "text",
            label: "Text (Basic)",
            placeholder: "Enter text",
            required: true,
            showPassword: true
          },
          {
            prop: "text",
            type: "text",
            label: "Text (Readonly)",
            placeholder: "Readonly text",
            readonly: true,
            required: true
          },
          {
            prop: "validatedText",
            type: "text",
            label: "Text (Validation)",
            placeholder: "3-10 chars, letters only",
            minLength: 3,
            maxLength: 10,
            regular: "^[a-zA-Z]+$",
            required: true
          },
          {
            prop: "number",
            type: "number",
            label: "Number",
            placeholder: "Enter number",
            min: 0,
            max: 100,
            precision: 2,
            required: true
          },
          {
            prop: "select",
            type: "select",
            label: "Select (Search)",
            placeholder: "Select item",
            multiple: false,
            filterable: true,
            required: true
          },
          {
            prop: "selectGroup",
            type: "select",
            label: "Select (Grouped)",
            placeholder: "Select city",
            multiple: true,
            filterable: true,
            limit: 2,
            required: true,
            tagColor: 'red',
            tagBackgroundColor: 'yellow'
          },
          {
            prop: "selectAllowCreate",
            type: "select",
            label: "Select (Create)",
            placeholder: "Select or create",
            multiple: true,
            filterable: true,
            allowCreate: true,
            required: true
          },
          {
            prop: "treeAllowCreate",
            type: "selecttree",
            label: "Tree (Create)",
            placeholder: "Select or create tree node",
            multiple: true,
            checkStrictly: false,
            disableBranchNodes: false,
            allowCreate: true,
            required: true
          },
          {
            prop: "tree",
            type: "selecttree",
            label: "TreeSelect",
            placeholder: "Select tree node",
            multiple: true,
            checkStrictly: false,
            disableBranchNodes: true,
            limit: 0,
            required: true,
            tagColor: 'red',
            tagBackgroundColor: 'yellow'
          },
          {
            prop: "tree1",
            type: "selecttree",
            label: "TreeSelect",
            placeholder: "Select tree node",
            multiple: false,
            checkStrictly: false,
            disableBranchNodes: false,
            required: true
          },
          {
            prop: "cascader",
            type: "cascader",
            label: "Cascader",
            placeholder: "Select cascade",
            checkStrictly: false,
            required: true,
            multiple: true,
            tagColor: 'red',
            tagBackgroundColor: 'yellow'
          },
          {
            prop: "date",
            type: "date",
            label: "Date",
            placeholder: "Select date",
            format: "yyyy-MM-dd",
            required: true
          },
          {
            prop: "date",
            type: "date",
            label: "Date (Readonly)",
            placeholder: "Readonly date",
            readonly: true,
            required: true
          },
          {
            prop: "weekPeriod",
            type: "multiPeriod",
            label: "Period (Week)",
            placeholder: "Select weeks",
            multiple: false,
            defaultValue: [],
            required: true
          },
          {
            prop: "quarterPeriod",
            type: "multiPeriod",
            label: "Period (Quarter)",
            periodType: "quarter",
            placeholder: "Select quarters",
            multiple: true,
            defaultValue: [],
            required: true
          },
          {
            prop: "dept",
            type: "deptPicker",
            label: "Dept (Tree)",
            placeholder: "Select department",
            required: true
          },
          { 
              prop: "person", 
              type: "personPicker", 
              label: "Person (API - Old)", 
              required: true, 
              columns: [
                  { prop: 'account', label: '登录账号', minWidth: 90 },
                  { prop: 'name', label: '姓名', minWidth: 80 },
                  { prop: 'deptName', label: '归属部门', minWidth: 100 },
                  { prop: 'status', label: '状态', width: 70, align: 'center' },
                  { prop: 'phone', label: '手机号码', width: 110 }
              ]
          },
          { 
              prop: "personSingle", 
              type: "personPicker", 
              label: "Person (Single - API)", 
              multiple: false, 
              required: true, 
              columns: [
                  { prop: 'account', label: '登录账号', minWidth: 90 },
                  { prop: 'name', label: '姓名', minWidth: 80 },
                  { prop: 'deptName', label: '归属部门', minWidth: 100 },
                  { prop: 'status', label: '状态', width: 70, align: 'center' },
                  { prop: 'phone', label: '手机号码', width: 110 }
              ]
          },
          { 
              prop: "personLocal", 
              type: "personPicker", 
              label: "Person (Local Paging)", 
              multiple: false, 
              required: true, 
              columns: [
                  { prop: 'account', label: '登录账号', minWidth: 90 },
                  { prop: 'name', label: '姓名', minWidth: 80 },
                  { prop: 'deptName', label: '归属部门', minWidth: 100 },
                  { prop: 'status', label: '状态', width: 70, align: 'center' },
                  { prop: 'phone', label: '手机号码', width: 110 }
              ]
          },
          { 
              prop: "personMulti", 
              type: "personPicker", 
              label: "Person (Multi)", 
              multiple: true, 
              required: true, 
              columns: [
                  { prop: 'account', label: '登录账号', minWidth: 90 },
                  { prop: 'name', label: '姓名', minWidth: 80 },
                  { prop: 'deptName', label: '归属部门', minWidth: 100 },
                  { prop: 'status', label: '状态', width: 70, align: 'center' },
                  { prop: 'phone', label: '手机号码', width: 110 }
              ]
          },
          { 
              prop: "personMultiPaging", 
              type: "personPicker", 
              label: "人员选择", 
              multiple: true, 
              required: true, 
              pageSize: 5,
              columns: [
                  { prop: 'account', label: '登录账号', minWidth: 90 },
                  { prop: 'name', label: '姓名', minWidth: 80 },
                  { prop: 'deptName', label: '归属部门', minWidth: 100 },
                  { prop: 'status', label: '状态', width: 70, align: 'center' },
                  { prop: 'phone', label: '手机号码', width: 110 }
              ]
          },
        ],
        // Options Data Map
        optionsMap: {
          person: [
            { id: 'dev', label: 'Development Dept', children: [
                { id: 'fed', label: 'Frontend Team' },
                { id: 'bed', label: 'Backend Team' }
            ]},
            { id: 'hr', label: 'HR Dept' }
          ],
          select: [
            { value: 1, label: "Option 1" },
            { value: 2, label: "Option 2" },
            { value: 3, label: "Option 3" },
          ],
          selectGroup: [
            {
              label: 'China',
              options: [
                { value: 'Beijing', label: 'Beijing' },
                { value: 'Shanghai', label: 'Shanghai' }
              ]
            },
            {
              label: 'USA',
              options: [
                { value: 'New York', label: 'New York' },
                { value: 'LA', label: 'Los Angeles' }
              ]
            }
          ],
          selectAllowCreate: [
             { value: 'Existing', label: 'Existing Item'}
          ],
          treeAllowCreate: [
             { id: 't1', label: 'Tree Item 1' }
          ],
          tree: [
            {
              id: "a",
              label: "Root A",
              children: [
                { id: "a1", label: "Child A1" },
                { id: "a2", label: "Child A2" },
                { id: "a3", label: "Child A3" },
                { id: "a4", label: "Child A4" },
                { id: "a5", label: "Child A5" },
                { id: "a6", label: "Child A6" },
                { id: "a7", label: "Child A7" },
                { id: "a8", label: "Child A8" },
                { id: "a9", label: "Child A9" },
                { id: "a10", label: "Child A10" },
                { id: "a11", label: "Child A11" },
                { id: "a12", label: "Child A12" },
                { id: "a13", label: "Child A13" },
                { id: "a14", label: "Child A14" },
                { id: "a15", label: "Child A15" },
                { id: "a16", label: "Child A16" },
                { id: "a17", label: "Child A17" },
                { id: "a18", label: "Child A18" },
                { id: "a19", label: "Child A19" },
                { id: "a20", label: "Child A20" },
              ],
            },
            {
              id: "b",
              label: "Root B",
            },
          ],
          tree1: [
            {
              id: "a",
              label: "Root A",
              children: [
                { id: "a1", label: "Child A1" },
                { id: "a2", label: "Child A2" },
                { id: "a3", label: "Child A3" },
                { id: "a4", label: "Child A4" },
                { id: "a5", label: "Child A5" },
                { id: "a6", label: "Child A6" },
                { id: "a7", label: "Child A7" },
                { id: "a8", label: "Child A8" },
                { id: "a9", label: "Child A9" },
                { id: "a10", label: "Child A10" },
                { id: "a11", label: "Child A11" },
                { id: "a12", label: "Child A12" },
                { id: "a13", label: "Child A13" },
                { id: "a14", label: "Child A14" },
                { id: "a15", label: "Child A15" },
                { id: "a16", label: "Child A16" },
                { id: "a17", label: "Child A17" },
                { id: "a18", label: "Child A18" },
                { id: "a19", label: "Child A19" },
                { id: "a20", label: "Child A20" },
              ],
            },
            {
              id: "b",
              label: "Root B",
            },
          ],
          cascader: [
            {
              value: "guide",
              label: "Guide",
              children: [
                {
                  value: "disciplines",
                  label: "Disciplines",
                  children: [
                    { value: "consistency", label: "Consistency" },
                    { value: "feedback", label: "Feedback" },
                  ],
                },
              ],
            },
          ],
          dept: [
            {
              id: "hq",
              label: "Headquarters",
              children: [
                { id: "hr", label: "Human Resources" },
                { id: "it", label: "IT Department" },
                { id: "bigdata", label: "Big Data Dept" }
              ],
            },
            {
              id: "branch",
              label: "Branch Office",
              children: [{ id: "sales", label: "Sales" }],
            },
          ],
          personSingle: [
            { id: 'dev', label: 'Development Dept', children: [
                { id: 'fed', label: 'Frontend Team' },
                { id: 'bed', label: 'Backend Team' },
                { id: 'apilist', label: 'API List Team (Remote Paging)' }
            ]},
            { id: 'hr', label: 'HR Dept' }
          ],
          personLocal: [
             { id: 'dev', label: 'Development Dept', children: [
                { id: 'biglist', label: 'Big List Team (Local Paging)' }
             ]}
          ],
          personMultiPaging: [
             { id: 'dev', label: 'Development Dept', children: [
                { id: 'apilist', label: 'API List Team (Remote Paging)' }
            ]}
          ],
          personMulti: [
              { id: 'fed', label: 'Frontend Team' },
              { id: 'bed', label: 'Backend Team' },
              { id: 'hr', label: 'HR Dept' }
          ],
        },
        dynamicTableOptions: {
           person: []
        },
        // Mock DB
        mockDb: {
            fed: [
                { id: '101', name: 'Alice', job: 'Engineer' },
                { id: '102', name: 'Bob', job: 'Senior Engineer' }
            ],
            bed: [
                { id: '103', name: 'Charlie', job: 'Architect' },
                { id: '104', name: 'David', job: 'DevOps' }
            ],
            hr: [
                 { id: '201', name: 'Eva', job: 'Recruiter' }
            ]
        }
      };
    },
    computed: {
      rules() {
        const rules = {};
        this.configList.forEach(config => {
          const itemRules = [];
          if (config.required) {
            itemRules.push({ required: true, message: `${config.label} is required`, trigger: 'change' });
          }
          if (config.minLength || config.maxLength) {
            const rule = { trigger: 'blur' };
            if (config.minLength) rule.min = config.minLength;
            if (config.maxLength) rule.max = config.maxLength;
            rule.message = `Length should be ${config.minLength || 0} to ${config.maxLength} characters`;
            itemRules.push(rule);
          }
          if (config.regular) {
            try {
              itemRules.push({ 
                pattern: new RegExp(config.regular), 
                message: 'Format is incorrect', 
                trigger: 'blur' 
              });
            } catch (e) {
              console.warn('Invalid regex in config:', config.regular);
            }
          }
          if (itemRules.length > 0) {
            rules[config.prop] = itemRules;
          }
        });
        return rules;
      }
    },
    created() {
      // Initialize form data based on config
      this.configList.forEach((item) => {
        this.$set(this.form, item.prop, item.defaultValue || null);
      });
      // Set some initial values
      this.form.text = "Hello World";
      this.form.number = 42;
      this.form.date = "2023-01-01";
      this.form.date = "2023-01-01";
      this.form.date = "2023-01-01";
      this.form.weekPeriod = [];
      this.form.quarterPeriod = [];
      this.form.person = [];
      this.form.personSingle = null;
      this.form.personLocal = null;
      this.form.personMulti = [];
      this.form.personMultiPaging = [];
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
        return this.optionsMap[prop] || [];
      },
      getTableOptions(prop) {
        return this.dynamicTableOptions[prop] || [];
      },
      getTotal(prop) {
          return this.totalMap[prop] || 0;
      },
      handleNodeClick(prop, data) {
          if (['person', 'personSingle', 'personLocal', 'personMulti', 'personMultiPaging'].includes(prop)) {
              console.log('Fetching employees for', data.label);
              
              // Special case for our local paging test
              if (data.id === 'biglist') {
                  // Generate 25 items
                  const list = [];
                  for(let i=1; i<=25; i++) {
                      list.push({ 
                          id: 'u'+i, 
                          name: 'User '+i, 
                          account: 'user'+i,
                          status: i % 3 === 0 ? 'inactive' : 'active',
                          deptName: 'Big List Team',
                          phone: '1380000'+ (1000+i)
                      });
                  }
                  // Local paging: total not needed (ItemPersonPicker calcs it), or can pass it.
                  // But we want component to slice it. So just set options.
                  this.$set(this.dynamicTableOptions, prop, list);
                  this.$set(this.totalMap, prop, 0); // Reset or unused
                  return;
              }

              // Special case for API paging test
              if (data.id === 'apilist') {
                  // Simulate 50 items database
                  const list = [];
                  for(let i=1; i<=50; i++) {
                      list.push({ 
                          id: 'api'+i, 
                          name: 'API User '+i, 
                          account: 'api_user_'+i,
                          status: 'active',
                          deptName: 'API Team',
                          phone: '1390000'+(2000+i) 
                      });
                  }
                  // Store "Server" data
                  this.$set(this.currentDeptData, prop, list);
                  
                  // Return FIRST PAGE
                  const config = this.configList.find(c => c.prop === prop) || {};
                  const pageSize = config.pageSize || 10;
                  this.$set(this.dynamicTableOptions, prop, list.slice(0, pageSize));
                  this.$set(this.totalMap, prop, 50);
                  return;
              }

              // Simulate API call for others (legacy/small)
              setTimeout(() => {
                  this.$set(this.dynamicTableOptions, prop, this.mockDb[data.id] || []);
                  this.$set(this.totalMap, prop, 0); // No pagination or small list
              }, 200);
          }
      },
      handlePageChange(prop, { page, pageSize, search }) {
          console.log(`Page change for ${prop}: ${page}, search:`, search);
          // Simulate fetching next page
          if (this.currentDeptData[prop]) {
              let fullList = this.currentDeptData[prop];

              // API Simulation: Filter first
              if (search && search.keywords) {
                  const kw = search.keywords.toLowerCase();
                  fullList = fullList.filter(item => {
                       const matchName = item.name && item.name.toLowerCase().includes(kw);
                       const matchAcc = (item.account || '').toLowerCase().includes(kw);
                       return matchName || matchAcc;
                  });
              }
              
              const start = (page - 1) * pageSize;
              const end = start + pageSize;
              const slice = fullList.slice(start, end);
              
              // Simulate Network Delay
              setTimeout(() => {
                 this.$set(this.dynamicTableOptions, prop, slice);
                 // Update total based on filter
                 this.$set(this.totalMap, prop, fullList.length);
              }, 300);
          }
      },
      handlePersonClick() {
        this.$message.info("Slots working! You clicked the person picker.");
        this.form = {
          ...this.form,
          person: "Selected: Alice",
        };
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
    background: #f4f4f5;
    padding: 15px;
    border-radius: 4px;
  }
</style>