<template>
  <div class="container">
    <h4 class="text-center">{{ $t('Халқ депутатлари кенгаши аъзолари базага киритилиши бўйича') }} <br>{{ $t('МАЪЛУМОТ')}} </h4>
<!--    <p class="text-center"><b><img alt="logo" src="@/assets/images/small-calendar.svg" height="14px"> ( {{ today }} {{ $t('ҳолатида') }} )</b></p>-->
    <div class="bg-white box-shadow p-4">
      <el-button type="success" class="float-right mb-4 font-weight-bold" icon="el-icon-download" :loading="isLoading" @click="exportToXlsx()">{{ $t('Юклаб олиш') }}</el-button>
      <table class="table table-hover table-bordered" v-loading="isLoading">
        <thead>
          <tr>
            <th> {{ $t('Вилоятлар') }}</th>
            <th v-for="social in social_statuses">{{ social.name }}</th>
          </tr>
        </thead>
        <tbody>
          <template>
            <tr v-for="social in report">
              <td>
                <a href="#" @click="showCityReport(social.region_id)">{{ social.region_name }}</a>
              </td>
              <td> {{ social.social1 }} </td>
              <td> {{ social.social2 }} </td>
              <td> {{ social.social3 }} </td>
              <td> {{ social.social4 }} </td>
              <td> {{ social.social5 }} </td>
              <td> {{ social.social6 }} </td>
              <td> {{ social.social7 }} </td>
              <td> {{ social.social8 }} </td>
              <td> {{ social.social9 }} </td>
              <td> {{ social.social10 }} </td>
              <td> {{ social.social11 }} </td>
              <td> {{ social.social12 }} </td>
              <td> {{ social.social13 }} </td>
              <td> {{ social.social14 }} </td>
              <td> {{ social.social15 }} </td>
              <td> {{ social.social16 }} </td>
              <td> {{ social.social17 }} </td>
              <td> {{ social.social18 }} </td>
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
    this.fetchSocialStatuses().then((res) => {
      this.sendFilter()
    })
    this.fetchRegions().then((res) => {
      this.sendFilter()
    })
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters({
      report: 'report/GET_REPORT',
      parties_report: 'report/GET_REPORT',
      user: 'auth/USER',
      social_statuses: 'citizen/GET_SOCIAL_STATUSES',
      regions: 'citizen/GET_REGIONS',
      citizens_pagination: 'citizen/GET_CITIZENS_PAGINATION'
    })
  },
  methods: {
    ...mapActions({
      fetchReport: 'report/reportAll',
      fetchSocialStatuses: 'citizen/socialStatuses',
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
