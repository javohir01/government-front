<template>
  <div class="container">
    <el-row>
      <router-link :to="{name: 'RegionReport'}">
        <el-button type="primary" class="float-left mb-1" icon="el-icon-arrow-left" size="small">Вилоят кесимидаги ҳисоботга қайтиш</el-button>
      </router-link>
    </el-row>
    <el-row>
      <div class=" box-shadow p-4">
        <div class="container   ">
          <h4 class="text-center">Туманлар кесимида фуқаролар ҳақида <br> <b>ҲИСОБОТ</b></h4>
          <p class="text-center">{{ current_date }} холатида</p>
          <div class="bg-white box-shadow horizontal-scrollable" style="overflow-x:scroll!important;">
            <table v-loading="isLoading" id="dtHorizontalVerticalExample" class="table table-hover table-bordered">
              <thead>
                <tr>
                  <th rowspan="2"> {{ $t('Т/р') }}</th>
                  <th rowspan="2"> {{ $t('Ҳудудлар') }}</th>
                  <th colspan="2"> {{ $t('Жами аҳоли сони') }}</th>
                  <th rowspan="2" v-for="social_status in social_statuses">{{ social_status.name }}</th>
                </tr>
                <tr>
                  <th>Ариза бўйича</th>
                  <th>Туман ҳокими томонидан</th>
                </tr>
              </thead>
              <tbody>
                <template>
                  <tr v-for="(count, index) in districts_report_count" :key="index">
                    <td colspan="2"> Жами </td>
                    <td> {{ count.sociala }}</td>
                    <td> {{ count.socialt }}</td>
                    <td> {{ count.social1 }}</td>
                    <td> {{ count.social2 }}</td>
                    <td> {{ count.social3 }}</td>
                    <td> {{ count.social4 }}</td>
                    <td> {{ count.social5 }}</td>
                    <td> {{ count.social6 }}</td>
                    <td> {{ count.social7 }}</td>
                    <td> {{ count.social8 }}</td>
                    <td> {{ count.social9 }}</td>
                    <td> {{ count.social10 }}</td>
                    <td> {{ count.social11 }}</td>
                    <td> {{ count.social12 }}</td>
                    <td> {{ count.social13 }}</td>
                    <td> {{ count.social14 }}</td>
                    <td> {{ count.social15 }}</td>
                    <td> {{ count.social16 }}</td>
                    <td> {{ count.social17 }}</td>
                    <td> {{ count.social18 }}</td>
                  </tr>
                  <tr v-for="(social, index) in districts_report" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ social.district_name }}</td>
                    <td> {{ social.sociala }}</td>
                    <td> {{ social.socialt }}</td>
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
          </div>
        </div>
      </div>
    </el-row>
    <el-divider content-position="left">{{ region.region }}</el-divider>
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
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/USER',
      reports: 'report/GET_DISTRICTS_REPORT',
      regions: 'citizen/GET_REGIONS',
      social_statuses: 'citizen/GET_SOCIAL_STATUSES',
      districts_report: 'report/GET_DISTRICTS_REPORT',
      districts_report_count: 'report/GET_DISTRICTS_REPORT_COUNT'
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
<!--<script>-->
<!--$(document).ready(function () {-->
<!--  $('#dtHorizontalVerticalExample').DataTable({-->
<!--    "scrollX": true,-->
<!--    "scrollY": 200,-->
<!--  });-->
<!--  $('.dataTables_length').addClass('bs-select');-->
<!--});-->
<!--</script>-->

<style>
.form-control {
  display: block;
  width: 100%;
  height: calc(1.5em + .75rem + 2px);
  padding: .375rem .75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: .25rem;
  -webkit-transition: border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
  transition: border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
}
table tbody tr:first-child {
  font-weight: bold;
  color: #2F2F2F;
}
.table-responsive::-webkit-scrollbar {
  height: 10px;
}

.table-responsive::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px #333333;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #333333;
  outline: 1px solid #333333;
}

.info {
  position: absolute;
  width: 200px;
  height: 100%;
  background: linear-gradient(to right, transparent, #ffffff);
  top: 0;
  right: 0;
  padding: 20px;
  text-align: right;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  transition: opacity 300ms ease-in-out, visibility 300ms ease-in-out;
  opacity: 0;
  visibility: hidden;
  z-index: 1;
  pointer-events: none;
}

.show {
  opacity: 1;
  visibility: visible;
}

tr th:first-child, tr td:first-child {
  position: sticky;
  min-width: 50px;
  left: 0;
  background: white;
}
</style>
