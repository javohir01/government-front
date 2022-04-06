<template>
  <div class="container">
    <el-button type="primary" icon="el-icon-arrow-left" @click="back">{{ $t('Орқага') }}</el-button>
    <h4 v-if="user.role_id === 1" class="text-center">{{ $t('Халқ депутатлари кенгаши аъзолари базага киритилиши бўйича') }} <br>{{ $t('МАЪЛУМОТ')}} </h4>
    <p class="text-center"><b><img alt="logo" src="@/assets/images/small-calendar.svg" height="14px"> ( {{ today }} {{ $t('ҳолатида') }} )</b></p>
    <div class="bg-white box-shadow p-4">
      <el-button type="success" class="float-right mb-4 font-weight-bold" icon="el-icon-download" :loading="isLoading" @click="exportToXlsx()">{{ $t('Юклаб олиш') }}</el-button>
      <table class="table table-hover table-bordered" v-loading="isLoading">
        <!-- <loading
          :active.sync="isLoading"
          :can-cancel="true"
          :is-full-page="true"
          color="rgb(49, 134, 251)"
          loader="bars"
        /> -->
        <thead>
        <tr>
          <th> {{ $t('Вилоятлар') }}</th>
          <th v-for="social in social_areas">{{ social.name_cyrl }}</th>
        </tr>
        </thead>
        <tbody>
        <template>
          <tr v-for="social in parties_report">
            <td><router-link :to="{ name: 'Report', query: { region_id: social.region_id } }">  {{ social.region_name }} </router-link> </td>
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
import { toXlsx } from '@/utils/exports'
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
      parties_report: {
        report: report
      },
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
      isLoading: true,
    }
  },
  created() {
    // return this.allCounts
  },
  mounted() {
    this.setReport().then(response => {
      if (response.success) {
        this.isLoading = false
      }
    })
    this.fetchSocialAreas().then((res) => {
      this.sendFilter()
    })
    this.fetchRegions().then((res) => {
      this.sendFilter()
    })
  },
  computed: {
    ...mapGetters({
      parties_report: 'report/GET_REPORT',
      user: 'auth/USER',
      social_areas: 'citizen/GET_SOCIAL_STATUSES',
      regions: 'citizen/GET_REGIONS'
    })
  },
  methods: {
    ...mapActions({ setReport: 'report/reportAll',
      fetchSocialAreas: 'citizen/social_status',
      fetchRegions: 'citizen/regions'
    }),
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
