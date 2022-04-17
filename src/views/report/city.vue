<template>
  <div class="container">
    <el-row>
      <router-link :to="{name: 'RegionReport'}">
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
    <el-divider content-position="left">{{ region.region }}</el-divider>
    <div class="bg-white box-shadow p-4 container">
      <table v-loading="isLoading" class="table table-hover table-bordered">
        <thead>
          <tr>
            <th> {{ $t('Т/р') }}</th>
            <th> {{ $t('Ҳудудлар') }}</th>
            <th> {{ $t('Жами аҳоли сони') }}</th>
            <th v-for="social_status in social_statuses">{{ social_status.name }}</th>
          </tr>
        </thead>
        <tbody>
          <template>
  <!--          <tr>-->
  <!--            <td></td>-->
  <!--            <td>{{ $t('Жами аҳоли сони') }}</td>-->
  <!--            <td>{{ report_city.report_count[0].citizens_count }}</td>-->
  <!--&lt;!&ndash;            <td>{{ report_city.report_count[0].count_social1 }}</td>&ndash;&gt;-->
  <!--            <td>{{ report_city.report_count[0].count_social2 }}</td>-->
  <!--            <td>{{ report_city.report_count[0].count_social3 }}</td>-->
  <!--            <td>{{ report_city.report_count[0].count_social4 }}</td>-->
  <!--            <td>{{ report_city.report_count[0].count_social5 }}</td>-->
  <!--            <td>{{ report_city.report_count[0].count_social6 }}</td>-->
  <!--            <td>{{ report_city.report_count[0].count_social7 }}</td>-->
  <!--            <td>{{ report_city.report_count[0].count_social8 }}</td>-->
  <!--            <td>{{ report_city.report_count[0].count_social9 }}</td>-->
  <!--            <td>{{ report_city.report_count[0].count_social10 }}</td>-->
  <!--            <td>{{ report_city.report_count[0].count_social11 }}</td>-->
  <!--            <td>{{ report_city.report_count[0].count_social12 }}</td>-->
  <!--            <td>{{ report_city.report_count[0].count_social13 }}</td>-->
  <!--            <td>{{ report_city.report_count[0].count_social14 }}</td>-->
  <!--            <td>{{ report_city.report_count[0].count_social15 }}</td>-->
  <!--            <td>{{ report_city.report_count[0].count_social16 }}</td>-->
  <!--            <td>{{ report_city.report_count[0].count_social17 }}</td>-->
  <!--            <td>{{ report_city.report_count[0].count_social18 }}</td>-->
  <!--          </tr>-->
            <tr v-for="(social, index) in districts_report" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ social.district_name }}</td>
              <td> {{ social.socials }}</td>
              <td> {{ social.social1 }}</td>
              <td> {{ social.social2 }}</td>
              <td> {{ social.social3 }}</td>
              <td> {{ social.social4 }}</td>
              <td> {{ social.social5 }}</td>
              <td> {{ social.social6 }}</td>
              <td> {{ social.social7 }}</td>
              <td> {{ social.social8 }}</td>
              <td> {{ social.social9 }}</td>
              <td> {{ social.social10 }}</td>
              <td> {{ social.social11 }}</td>
              <td> {{ social.social12 }}</td>
              <td> {{ social.social13 }}</td>
              <td> {{ social.social14 }}</td>
              <td> {{ social.social15 }}</td>
              <td> {{ social.social16 }}</td>
              <td> {{ social.social17 }}</td>
              <td> {{ social.social18 }}</td>
            </tr>
          </template>
        </tbody>
      </table>
<!--      <el-pagination-->
<!--          background-->
<!--          :total="reports.pagination.total"-->
<!--          :page-size="1 * reports.pagination.limit"-->
<!--          :page-sizes="[10, 20, 50]"-->
<!--          layout="sizes, prev, pager, next"-->
<!--          class="mt-3"-->
<!--          @size-change="handleSizeChange"-->
<!--          @current-change="handleCurrentChange"-->
<!--      />-->
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
  name: 'District',
  // eslint-disable-next-line vue/no-unused-components
  components: { DateDropdown },
  data() {
    return {
      showInfo: true,
      filter: {
        region_id: null,
        passport: '',
        limit: 0,
        page: 0,
        total: 1,
        from_date: null,
        to_date: null,
        insurance_type: null,
        getAll: 0,
        social_statuses: ''
      },
      rules: {},
      loaded: false,
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/USER',
      reports: 'report/GET_DISTRICTS_REPORT',
      regions: 'citizen/GET_REGIONS',
      social_statuses: 'citizen/GET_SOCIAL_STATUSES',
      districts_report: 'report/GET_DISTRICTS_REPORT'
    }),
    current_date() {
      return parseTime(new Date())
    },
    region() {
      return localStorage.getItem('region_name')
    }
  },
  mounted() {
    // this.fetchReport().then(response => {
    //   if (response.success) {
    //     this.isLoading = false
    //   }
    // })
    this.fetchReport()
    this.fetchRegions()
    this.fetchSocialStatuses()
    this.fetchReportDistricts(
      { region_id: this.$route.params.region_id }).then((res) => {
      this.filter.region_id = this.$route.params.region_id
    })
    // this.fetchRegions()
  },
  methods: {
    ...mapActions({
      fetchReportDistricts: 'report/reportDistricts',
      fetchReport: 'report/reportAll',
      fetchSocialStatuses: 'citizen/socialStatuses',
      fetchRegions: 'citizen/regions'
    }),
    handleCurrentChange(val) {
      this.filter.page = val
      this.fetchCityReport(this.filter).then((res) => {
        this.filter.limit = res.result.per_page
        this.filter.page = res.result.current_page
        this.filter.region_id = this.$route.params.region_id
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
