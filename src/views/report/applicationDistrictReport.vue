<template>
  <div class="container">
    <h4 class="text-center">{{ $t('Ариза топширганлар ҳақида туманлар кесимида') }} <br>{{ $t('ҲИСОБОТ')}} </h4>
<!--    <p class="text-center"><b><img alt="logo" src="@/assets/images/small-calendar.svg" height="14px"> ( {{ today }} {{ $t('ҳолатида') }} )</b></p>-->
    <el-row>
      <router-link :to="{name: 'ApplicationRegionReport'}">
        <el-button type="primary" class="float-left mb-1" icon="el-icon-arrow-left" size="small">Вилоят кесимидаги ҳисоботга қайтиш</el-button>
      </router-link>
    </el-row>
    <div class="bg-white box-shadow p-4">
      <el-button type="success" class="float-right mb-4 font-weight-bold" icon="el-icon-download" :loading="isLoading" @click="exportToXlsx()">{{ $t('Юклаб олиш') }}</el-button>
      <table class="table table-hover table-bordered" v-loading="isLoading" style="height:20px;overflow-y:scroll">
        <thead>
          <tr>
            <th rowspan="2"> {{ $t('Т/р') }}</th>
            <th rowspan="2"> {{ $t('Ҳудудлар') }}</th>
            <th>{{ $t('Жами') }}</th>
            <th>{{ $t('Янги ') }}</th>
            <th>{{ $t('Тасдиқланган') }}</th>
            <th>{{ $t('Рад этилган') }}</th>
          </tr>
        </thead>
        <tbody>
          <template>
            <tr v-for="(app, index) in report_count " :key="index">
              <td colspan="2" class="text-center">{{ $t('Жами') }}</td>
              <td> {{ app.all }} </td>
              <td> {{ app.new }} </td>
              <td> {{ app.confirmed  }} </td>
              <td> {{ app.rejected }} </td>
            </tr>
            <tr v-for="(app, index) in report " :key="index">
              <td>{{ index + 1 }}</td>
              <td> {{ app.district_name }}</td>
              <td> {{ app.all }} </td>
              <td> {{ app.new }} </td>
              <td> {{ app.confirmed  }} </td>
              <td> {{ app.rejected }} </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
// import { toXlsx } from '@/utils/exports'
// import Loading from 'vue-loading-overlay'
// import 'vue-loading-overlay/dist/vue-loading.css'
// import report from "./repo.json";
export default {
  name: 'Report',
  components: {
    // Loading
  },
  data() {
    return {
      limit: 0,
      page: 0,
      total: 1,
      isLoading: true
    }
  },
  created() {
    // return this.allCounts
  },
  mounted() {
    this.fetchReport()
    this.fetchRegions()
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters({
      user: 'auth/USER',
      report: 'report/GET_APPLICATION_DISTRICTS_REPORT',
      regions: 'citizen/GET_REGIONS',
      report_count: 'report/GET_APPLICATION_DISTRICTS_REPORT_COUNT',
      citizens_pagination: 'citizen/GET_CITIZENS_PAGINATION'
    })
  },
  methods: {
    ...mapActions({
      fetchRegionReport: 'report/reportApplicationRegions',
      fetchReport: 'report/reportApplicationDistricts',
      fetchRegions: 'citizen/regions',
      sendFilter() {
        this.loaded = false
        this.fetchRegions(this.filter).then((res) => {
          this.loaded = true
          this.limit = this.citizens_pagination.limit
        })
      },
      showCityReport(region) {
        localStorage.setItem('region_id', region.region)
        this.$router.push({ name: 'DistrictReport', params: { region_id: region.id }})
      }
    })
  }
}
</script>
<style scoped>
table tr:first-child td{
  font-weight: bold;
  font-size: 16px;
}
th{
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  background: #e6e8ec;
  color: #3f3f3f
}
.table thead th{
  border-bottom: none
}
.primary, .primary:hover, .primary:active{
  background-color: #2c79e2 !important;
  color: rgb(245, 241, 241) !important
}
</style>
