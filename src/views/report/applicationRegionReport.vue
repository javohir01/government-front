<template>
  <div class="container">
    <h4 class="text-center">{{ $t('Ариза топширганлар ҳақида вилоятлар кесимида') }} <br>{{ $t('ҲИСОБОТ')}} </h4>
<!--    <p class="text-center"><b><img alt="logo" src="@/assets/images/small-calendar.svg" height="14px"> ( {{ today }} {{ $t('ҳолатида') }} )</b></p>-->
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
            <tr v-for="app in report_count">
              <td colspan="2" class="text-center"> {{ $t('Жами') }} </td>
              <td> {{ app.all }} </td>
              <td> {{ app.new }} </td>
              <td> {{ app.confirmed  }} </td>
              <td> {{ app.rejected }} </td>
            </tr>
            <tr v-for="(app1, index) in report " :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <a href="#" @click="showCityReport(app1.region_id)">{{ app1.region_name }}</a>
              </td>
              <td> {{ app1.all }} </td>
              <td> {{ app1.new }} </td>
              <td> {{ app1.confirmed  }} </td>
              <td> {{ app1.rejected }} </td>
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
      columns: [
        {
          label: ' ',
          field: 'name'
        },
        {
          label: this.$t('Режа'),
          field: 'plan',
          dataFormat: this.formatPrice
        },
        {
          label: this.$t('Киритилди(кечаги ҳолат)'),
          field: 'yesterday',
          dataFormat: this.formatPrice
        },
        {
          label: this.$t('Киритилди(бугунги ҳолат)'),
          field: 'actual',
          dataFormat: this.formatPrice
        },
        {
          label: this.$t('Фарқ'),
          field: 'difference',
          dataFormat: this.formatPrice
        },
        {
          label: this.$t('Фоиз'),
          field: 'percent'
        }
      ],
      isLoading: true
    }
  },
  created() {
    // return this.allCounts
  },
  mounted() {
    this.fetchReport().then(response => {
      if (response.success) {
        this.isLoading = false
      }
    })
    this.fetchRegions().then((res) => {
      this.sendFilter()
    })
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters({
      report: 'report/GET_APPLICATION_REGIONS_REPORT',
      report_count: 'report/GET_APPLICATION_REGIONS_REPORT_COUNT',
      user: 'auth/USER',
      regions: 'citizen/GET_REGIONS',
      citizens_pagination: 'citizen/GET_CITIZENS_PAGINATION'
    })
  },
  methods: {
    ...mapActions({
      fetchReport: 'report/reportApplicationRegions',
      fetchRegions: 'citizen/regions',
      sendFilter() {
        this.loaded = false
        this.fetchRegions(this.filter).then((res) => {
          this.loaded = true
          this.limit = this.citizens_pagination.limit
        })
      },
      // showCityReport(region) {
      //   localStorage.setItem('region_id', region.region)
      //   this.$router.push({ name: 'ApplicationDistrictReport', params: { region_id: region.id }})
      // }
      showCityReport(region_id) {
        console.log(region_id)
        localStorage.setItem('region_id', region_id)
        console.log(region_id)
        this.$router.push({ name: 'ApplicationDistrictReport', params: { region_id: region_id }})
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
