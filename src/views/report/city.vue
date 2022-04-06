<template>
  <div class="container">
    <el-row>
      <router-link :to="{name: 'InsuranceRegionReport'}">
        <el-button type="primary" class="float-left mb-1" icon="el-icon-arrow-left" size="small">Вилоят кесимидаги ҳисоботга қайтиш</el-button>
      </router-link>
    </el-row>
    <el-row>
      <div class="container">
        <h4 class="text-center">"Ўзагросуғурта" AЖ томонидан ПФ-5785 сон қарорга мувофиқ
          хорижга вақтинча меҳнат фаолиятини амалга ошириш учун кетаётган Ўзбекистон Республикаси фуқароларига суғурта полиси расмийлаштирилиши бўйича <br> <b>ҲИСОБОТ</b></h4>
        <p class="text-center">{{ current_date }} холатида</p>
      </div>
    </el-row>
    <el-divider content-position="left">{{ region }}</el-divider>
    <div class="bg-white box-shadow p-4 container">
      <el-row class="mb-3">
        <el-form
          :model="filter"
          :rules="rules"
          label-position="top"
          class="top-label-custom mini"
        >
          <el-col :span="5">
            <el-form-item label="Дан">
              <date-dropdown
                v-model="filter.from_date"
                min="2019"
                max="2024"
                months-names="Январь, Февраль, Март, Апрель, Май, Июнь, Июль, Август, Сентябрь, Октябрь, Ноябрь, Декабрь"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="Гача">
              <date-dropdown
                v-model="filter.to_date"
                min="2019"
                max="2024"
                default="12.12.2024"
                months-names="Январь, Февраль, Март, Апрель, Май, Июнь, Июль, Август, Сентябрь, Октябрь, Ноябрь, Декабрь"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="Паспорт">
              <el-input v-model="filter.passport" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="Суғурта тури">
              <el-select v-model="filter.insurance_type" class="w-100" @change="applyfilter">
                <el-option :value="null" label="Барчаси" />
                <el-option label="Ҳаёт ва соғлиқ" value="Ҳаёт ва соғлиқ" />
                <el-option label="Кредит суғуртаси" value="Кредит суғуртаси" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="Қидириш">
              <el-button icon="el-icon-search" size="medium" type="primary" @click="applyfilter" />
            </el-form-item>
          </el-col>
        </el-form>
        <el-col :span="3">
          <el-button type="primary" class="float-right mt-4 font-weight-bold" icon="el-icon-download" :loading="isLoading" @click="exportToXlsx()">Юклаб олиш</el-button>
        </el-col>
      </el-row>
      <el-table
        class="mb-1 mx-auto table-custom"
        :data="reports.data"
        border
      >
        <el-table-column
          fixed
          label="№"
          width="60"
          :index="indexMethod"
          type="index"
        />
        <el-table-column label="ФИО" width="350">
          <template slot="header">
            <label>ФИО</label> <br>
            &nbsp;
          </template>
          <template slot-scope="scope">
            <!--            style="color: #007bff; word-break: break-word; cursor:pointer; font-size: 15px; margin-bottom: 0;" @click.prevent="reportshow(scope.row.id)"-->
            <p>
              {{ [scope.row.s_name, scope.row.f_name,scope.row.m_name ].join(' ') }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="Паспорт"
          prop="passport"
          width="150"
        >
        </el-table-column>
        <el-table-column label="Туғилган санаси">
          <template slot-scope="scope">{{ parseToTime(scope.row.birth_date) }}</template>
        </el-table-column>
        <el-table-column
          label="Фуқаро яшаш манзили"
          width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.region + ', ' + scope.row.city }}
          </template>
        </el-table-column>
        <el-table-column
          label="Суғурта полиси берилган сана"
          width="180"
        >
          <template slot-scope="scope">{{ parseToTime(scope.row.sold_date) }}</template>
        </el-table-column>
        <el-table-column label="Суғурта тури" prop="insurance_type" />
      </el-table>
      <el-pagination
        background
        :total="reports.pagination.total"
        :page-size="1 * reports.pagination.limit"
        :page-sizes="[10, 20, 50]"
        layout="sizes, prev, pager, next"
        class="mt-3"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DateDropdown from 'vue-date-dropdown'
import { parseTime } from '@/utils/'
// import EventBus from '../../operator/event-bus'
import { toXlsx } from '@/utils/exports'

export default {
  name: 'City',
  components: { DateDropdown },
  data() {
    return {
      filter: {
        user_id: null,
        passport: '',
        limit: '',
        page: '',
        from_date: null,
        to_date: null,
        insurance_type: null,
        getAll: 0
      },
      rules: {},
      loaded: false,
      isLoading: false,
      columns: [
        {
          label: 'ФИО',
          field: 'fio'
        },
        {
          label: 'Туғилган сана',
          field: 'birth_date'
        },
        {
          label: 'Паспорт',
          field: 'passport'
        },
        {
          label: 'Фуқаро яшаш манзили',
          field: 'region_city'
        },
        {
          label: 'Суғурта полиси берилган сана',
          field: 'sold_date'
        },
        {
          label: 'Суғурта полиси рақами',
          field: 'serial_number'
        },
        {
          label: 'Суғурта тури',
          field: 'insurance_type'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({ reports: 'report/GET_INSURANCE_CITY', regions: 'region/GET_REGIONS' }),
    current_date() {
      return parseTime(new Date())
    },
    region() {
      return localStorage.getItem('region_name')
    }
  },
  mounted() {
    this.fetchCityReport({ user_id: this.$route.params.user_id }).then((res) => {
      this.filter.limit = res.result.per_page
      this.filter.page = res.result.current_page
      this.filter.user_id = this.$route.params.user_id
    })
    this.fetchRegions()
  },
  methods: {
    ...mapActions({ fetchCityReport: 'report/insurance_city', fetchCityReportAll: 'report/insurance_city_all', fetchRegions: 'region/list' }),
    handleCurrentChange(val) {
      this.filter.page = val
      this.fetchCityReport(this.filter).then((res) => {
        this.filter.limit = res.result.per_page
        this.filter.page = res.result.current_page
        this.filter.user_id = this.$route.params.user_id
      })
    },
    handleSizeChange(val) {
      this.filter.limit = val
      this.fetchCityReport(this.filter).then((res) => {
        this.filter.limit = res.result.per_page
        this.filter.page = res.result.current_page
        this.filter.user_id = this.$route.params.user_id
      })
    },
    indexMethod(index) {
      return index + (20 * (this.reports.pagination.page - 1)) + 1
    },
    parseToTime(date) {
      if (date) return date.split('-').reverse().join('.')
      else return date
    },
    applyfilter() {
      this.filter.page = null
      if (this.filter.to_date && this.filter.from_date) {
        this.filter.from_date = this.filter.from_date.split('.').reverse().join('-')
        this.filter.to_date = this.filter.to_date.split('.').reverse().join('-')
      }
      this.fetchCityReport(this.filter).then((res) => {
        this.filter.limit = res.result.per_page
        this.filter.page = res.result.current_page
        this.filter.user_id = this.$route.params.user_id
      })
    },
    exportToXlsx() {
      this.isLoading = true
      this.filter.page = null
      this.filter.getAll = 1
      if (this.filter.to_date && this.filter.from_date) {
        this.filter.from_date = this.filter.from_date.split('.').reverse().join('-')
        this.filter.to_date = this.filter.to_date.split('.').reverse().join('-')
      }
      this.fetchCityReportAll(this.filter).then(data => {
        this.filter.getAll = 0
        toXlsx(
          this.exportFormat(data.result.data),
          this.region + ' провайдери хизмат кўрсатган фуқаролар',
          this.columns,
        )
        this.isLoading = false
      })
    },
    exportFormat(data) {
      if (data && data.length) {
        const arr = []
        data.forEach(row => {
          arr.push({
            fio: [row.s_name, row.f_name, row.m_name].join(' '),
            birth_date: this.parseToTime(row.birth_date),
            passport: row.passport,
            region_city: row.region + ', ' + row.city,
            sold_date: this.parseToTime(row.sold_date),
            serial_number: row.serial_number,
            insurance_type: row.insurance_type
          })
        })
        return arr
      }
      return []
    }
  }
}
</script>
