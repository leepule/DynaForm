<template>
  <div class="multi-period-picker">
    <el-popover v-model="visible" placement="bottom-start" :width="width" trigger="click"
      popper-class="multi-period-picker-popper p-0">
      <div class="picker-panel">
        <!-- 头部：年份选择和类型切换 -->
        <div class="picker-header">
          <button class="header-btn" @click="prevYear">
            <i class="el-icon-arrow-left"></i>
          </button>
          <span class="current-year">{{ currentYear }} 年 {{ currentType === 'week' ? '' : '' }}</span>
          <button class="header-btn" @click="nextYear">
            <i class="el-icon-arrow-right"></i>
          </button>
        </div>
        <!-- 主体：周/季度选择区域 -->
        <div class="picker-content" ref="pickerContent">
          <!-- 周选择 -->
          <div v-if="currentType === 'week'" class="week-list">
            <div v-for="week in weekList" :key="week.value"
              :class="['week-item', { 'is-selected': isSelected(week.value) }]" @click="toggleSelect(week.value)">
              <div class="week-label">第{{ week.week }}周</div>
              <div class="week-range">{{ week.range }}</div>
            </div>
          </div>
          <!-- 季度选择 -->
          <div v-if="currentType === 'quarter'" class="quarter-list">
            <div v-for="quarter in quarterList" :key="quarter.value"
              :class="['quarter-item', { 'is-selected': isSelected(quarter.value) }]"
              @click="toggleSelect(quarter.value)">
              <div class="quarter-label">{{ quarter.label }}</div>
              <div class="quarter-range">{{ quarter.months }}</div>
            </div>
          </div>
        </div>
        <!-- 底部：操作按钮 -->
        <div v-if="isMultiple" class="picker-footer">
          <el-button size="small" type="text" @click="handleClear">清空</el-button>
          <el-button size="small" type="primary" @click="handleConfirm">确定</el-button>
        </div>
      </div>
      <!-- 触发输入框 -->
      <el-input slot="reference" :value="displayValue" :placeholder="currentPlaceholder" :size="size" readonly
        prefix-icon="el-icon-date" class="picker-input">
        <template v-if="selectedValues.length > 0" slot="suffix">
          <i class="el-select__caret el-input__icon el-icon-circle-close clear-icon" @click.stop="handleClear"></i>
        </template>
      </el-input>
    </el-popover>
  </div>
</template>
<script>
  export default {
    name: 'ItemQuarterWeekPicker',
    props: {
      value: {
        type: [Array, String],
        default: () => []
      },
      config: {
        type: Object,
        default: () => ({})
      },
      multiple: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: '请选择周期'
      },
      size: {
        type: String,
        default: 'mini'
      }
    },
    data() {
      return {
        visible: false,
        currentYear: new Date().getFullYear(),
        selectedValues: []
      }
    },
    computed: {
      currentType() {
        return this.config.timeType;
      },
      isMultiple() {
        return this.config.multiple !== undefined ? this.config.multiple : this.multiple;
      },
      currentPlaceholder() {
        return this.config.placeholder || this.placeholder;
      },
      width() {
        return 450
      },
      weekList() {
        const weeks = []
        for (let i = 1; i <= 52; i++) {
          const weekStart = this.getWeekStartDate(this.currentYear, i)
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekEnd.getDate() + 6)

          weeks.push({
            week: i,
            value: this.getFormattedValue(this.currentYear, i),
            range: `${this.formatDate(weekStart)} 至 ${this.formatDate(weekEnd)}`
          })
        }
        return weeks
      },
      quarterList() {
        const quarters = [
          { quarter: 1, label: '第一季度', months: '1-3月', range: '01月 - 03月' },
          { quarter: 2, label: '第二季度', months: '4-6月', range: '04月 - 06月' },
          { quarter: 3, label: '第三季度', months: '7-9月', range: '07月 - 09月' },
          { quarter: 4, label: '第四季度', months: '10-12月', range: '10月 - 12月' }
        ]
        return quarters.map(q => ({
          ...q,
          value: this.getFormattedValue(this.currentYear, q.quarter)
        }))
      },
      displayValue() {
        if (this.selectedValues.length === 0) return ''

        const formatted = this.selectedValues.map(v => this.formatSelectedValue(v))

        if (this.isMultiple) {
          return formatted.join('、')
        } else {
          return formatted[0] || ''
        }
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (this.isMultiple) {
            if (typeof val === 'string' && val) {
              this.selectedValues = val.split(',');
            } else if (Array.isArray(val)) {
              this.selectedValues = [...val];
            } else {
              this.selectedValues = [];
            }
          } else {
            this.selectedValues = val ? [val] : [];
          }
        }
      },
      visible(val) {
        if (val && this.selectedValues.length) {
          this.initCurrentYear()
          this.scrollToSelection()
        }
      }
    },
    methods: {
      getWeekStartDate(year, week) {
        const jan1 = new Date(year, 0, 1)
        const daysToMonday = (jan1.getDay() === 0 ? 6 : jan1.getDay() - 1)
        const firstMonday = new Date(year, 0, 1 + (7 - daysToMonday) % 7)
        const targetDate = new Date(firstMonday)
        targetDate.setDate(firstMonday.getDate() + (week - 1) * 7)
        return targetDate
      },
      formatDate(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${month}-${day}`
      },
      formatSelectedValue(value) {
        const strVal = String(value);
        const yearMatch = strVal.match(/^(\d{4})/);
        const year = yearMatch ? yearMatch[1] : this.currentYear;

        const restVal = yearMatch ? strVal.slice(4) : strVal;
        const numMatch = restVal.match(/(\d+)/);
        const num = numMatch ? parseInt(numMatch[1], 10) : '';

        if (this.currentType === 'week') {
          return `${year}年第${num}周`
        } else {
          return `${year}年第${num}季度`
        }
      },
      getFormattedValue(year, period) {
        let format = this.config.format;
        if (!format) {
          format = this.currentType === 'week' ? 'yyyy-ww' : 'yyyy-Q';
        }
        let result = format.replace(/yyyy/gi, year);
        if (this.currentType === 'week') {
          const pStr = String(period).padStart(format.toLowerCase().includes('ww') ? 2 : 1, '0');
          result = result.replace(/ww/gi, pStr).replace(/w/gi, period);
        } else {
          result = result.replace(/[Qq]/g, String(period).padStart(2, '0'));
        }
        return result;
      },
      emitChange() {
        let val;
        if (this.isMultiple) {
          val = this.selectedValues.join(',');
        } else {
          val = this.selectedValues[0] || '';
        }
        this.$emit('input', val);
        this.$emit('change', val);
      },
      isSelected(value) {
        return this.selectedValues.includes(value)
      },
      toggleSelect(value) {
        if (this.isMultiple) {
          const index = this.selectedValues.indexOf(value)
          if (index > -1) {
            this.selectedValues.splice(index, 1)
          } else {
            this.selectedValues.push(value)
          }
        } else {
          this.selectedValues = [value]
          this.handleConfirm()
        }
      },
      prevYear() {
        this.currentYear--
      },
      nextYear() {
        this.currentYear++
      },
      handleClear() {
        this.selectedValues = []
        this.emitChange()
        this.visible = false
      },
      handleConfirm() {
        this.emitChange()
        this.visible = false
      },
      getQuarterStartDate(year, quarter) {
        const month = (quarter - 1) * 3
        const date = new Date(year, month, 1)
        return this.formatDateFull(date)
      },
      formatDateFull(date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      },
      initCurrentYear() {
        if (this.selectedValues.length) {
          const strVal = String(this.selectedValues[0]);
          const yearMatch = strVal.match(/^(\d{4})/);
          if (yearMatch) {
            this.currentYear = parseInt(yearMatch[1], 10);
          }
        }
      },
      scrollToSelection() {
        this.$nextTick(() => {
          const container = this.$refs.pickerContent
          const selected = container ? container.querySelector('.is-selected') : null
          if (selected) {
            selected.scrollIntoView({
              block: 'center'
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .multi-period-picker {
    width: 100%;

    .clear-icon {
      cursor: pointer;
    }
  }

  .picker-input .el-input__inner {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .multi-period-picker-popper {
    .picker-panel {
      padding: 0;
    }

    .picker-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      padding: 0 12px;
      margin: 0;
      border-bottom: 1px solid #E4E7ED;

      .header-btn {
        background: none;
        border: none;
        color: #606266;
        font-size: 16px;
        cursor: pointer;
        padding: 4px;
        line-height: 1;
        transition: color 0.2s;

        &:hover {
          color: #409EFF;
        }
      }

      .current-year {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
        flex: 1;
        text-align: center;
      }
    }

    .picker-content {
      padding: 16px 12px;
      max-height: 300px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #fff;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: #DCDFE6;
        border-radius: 3px;

        &:hover {
          background: #909399;
        }
      }
    }

    .week-list {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
    }

    .week-item {
      padding: 6px 4px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s;
      border: 1px solid transparent;
      color: #606266;

      &:hover {
        background-color: #F5F7FA;
      }

      &.is-selected {
        background-color: #409EFF;
        color: #fff;

        &:hover {
          opacity: 0.8;
        }
      }

      .week-label {
        font-size: 13px;
        font-weight: 500;
        margin-bottom: 2px;
      }

      .week-range {
        font-size: 11px;
        opacity: 0.85;
        white-space: nowrap;
      }
    }

    .quarter-list {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }

    .quarter-item {
      padding: 12px 4px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s;
      border: 1px solid #DCDFE6;
      color: #606266;

      &:hover {
        border-color: #409EFF;
        background-color: #F5F7FA;
      }

      &.is-selected {
        border-color: #409EFF;
        background-color: #409EFF;
        color: #fff;

        &:hover {
          opacity: 0.8;
        }
      }

      .quarter-label {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 6px;
      }

      .quarter-range {
        font-size: 12px;
        opacity: 0.85;
      }
    }

    .picker-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-top: 1px solid #E4E7ED;
      background-color: #fff;

      .el-button--text {
        color: #606266;

        &:hover {
          color: #409EFF;
        }
      }
    }
  }
</style>
<style lang="scss">
  .multi-period-picker-popper {
    padding: 0 !important;
  }
</style>