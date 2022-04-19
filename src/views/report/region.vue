<template>
  <div class="container">
    <el-row>
      <div class="container   ">
        <h4 class="text-center">Вилоятлар кесимида фуқаролар ҳақида <br> <b>ҲИСОБОТ</b></h4>
        <p class="text-center">{{ current_date }} холатида</p>
        <div class="bg-white box-shadow horizontal-scrollable" style="overflow-x:scroll!important;">
          <table id="dtHorizontalVerticalExample" v-loading="isLoading" class="table table-hover table-bordered" :data="regions_report" style="height:20px; overflow-x:scroll!important;">
            <thead>
              <tr>
                <th rowspan="2"> {{ $t('Т/р') }}</th>
                <th rowspan="2"> {{ $t('Ҳудудлар') }}</th>
                <th colspan="2"> {{ $t('Жами аҳоли сони') }}</th>
                <th v-for="social_status in social_statuses" rowspan="2">{{ social_status.name }}</th>
              </tr>
              <tr>
                <th>Ариза бўйича</th>
                <th>Туман ҳокими томонидан</th>
              </tr>
            </thead>
            <tbody>
              <template>
                <tr v-for="(count, index) in regions_report_count" :key="index">
                  <td colspan="2" class="text-center"> Жами </td>
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
                <tr v-for="(social, index) in regions_report" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td><a href="#" @click="showCityReport(social.region_id)">{{ social.region_name }}</a></td>
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
    </el-row>
    <el-divider content-position="left">{{ region.region }}</el-divider>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { parseTime } from '@/utils/'
export default {
  name: 'Region',
  data() {
    return {
      showInfo: true,
      region() {
        return undefined
      },
      filter: {
        passport: ''
      },
      loaded: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      // report: 'report/GET_REPORT',
      regions: 'citizen/GET_REGIONS',
      social_statuses: 'citizen/GET_SOCIAL_STATUSES',
      regions_report: 'report/GET_REGIONS_REPORT',
      regions_report_count: 'report/GET_REGIONS_REPORT_COUNT'
    }),
    current_date() {
      return parseTime(new Date())
    },
  },
  mounted() {
    this.fetchReport()
    this.fetchRegions()
    this.fetchSocialStatuses()
    // this.fetchReportDistricts(
    //   { region_id: this.$route.params.region_id }).then((res) => {
    //   this.filter.region_id = this.$route.params.region_id
    // })
  },
  methods: {
    ...mapActions({
      fetchReport: 'report/reportAll',
      fetchReportDistricts: 'report/reportDistricts',
      fetchSocialStatuses: 'citizen/socialStatuses',
      fetchRegions: 'citizen/regions'
    }),
    citizenShow(id) {
      localStorage.setItem('id', id)
      this.$router.push({ name: 'OperatorCitizensShow', params: { id: id }})
    },
    applyfilter() {
      this.fetchCitizens(this.filter)
    },
    sendFilter() {
      this.loaded = false
      this.fetchRegions(this.filter).then((res) => {
        this.loaded = true
      })
    },
    showCityReport(region_id) {
      localStorage.setItem('region_id', region_id)
      console.log(region_id)
      this.$router.push({ name: 'DistrictReport', params: { region_id: region_id }})
    }
  }
}
</script>

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
