<template>
  <div class="container">
    <el-row>
      <div class="container">
        <h4 class="text-center">"Ўзагросуғурта" AЖ томонидан ПФ-5785 сон қарорга мувофиқ
          хорижга вақтинча меҳнат фаолиятини амалга ошириш учун кетаётган Ўзбекистон Республикаси фуқароларига суғурта полиси расмийлаштирилиши бўйича <br> <b>ҲИСОБОТ</b></h4>
        <p class="text-center">{{ current_date }} холатида</p>
      </div>
    </el-row>
    <div class="bg-white box-shadow p-4 container">
      <el-table
        class="mb-1 mx-auto table-custom"
        :data="report"
        border
      >
        <el-table-column
          fixed
          label="№"
          width="60"
          type="index"
        />
        <el-table-column label="Вилоятлар">
          <template slot-scope="scope" >
            <a href="#" @click="showCityReport(scope.row)">{{ scope.row.region_name }}</a>
          </template>
        </el-table-column>
        <el-table-column v-for="social_status in social_statuses" :label=" social_status.name " >
          <template slot-scope="scope" v-for="repo in report">
            <p> {{ scope.row.social1 }} </p>
          </template>
        </el-table-column>
      </el-table>

<!--      <table v-loading="isLoading" class="table table-hover table-bordered">-->
<!--        <thead>-->
<!--          <tr>-->
<!--            <th> {{ $t('№') }}</th>-->
<!--            <th> {{ $t('Ҳудудлар') }}</th>-->
<!--            <th> {{ $t('Жами аҳоли сони') }}</th>-->
<!--            <th v-for="social_status in social_statuses">{{ social_status.name }}</th>-->
<!--          </tr>-->
<!--        </thead>-->
<!--&lt;!&ndash;        <tbody>&ndash;&gt;-->
<!--&lt;!&ndash;        </tbody>&ndash;&gt;-->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { parseTime } from '@/utils/'
export default {
  name: 'Region',
  data() {
    return {
      filter: {
        passport: ''
      },
      loaded: false,
      degrees: [
        'Барчаси',
        'Бакалавр',
        'Магистр'
      ]
    }
  },
  computed: {
    ...mapGetters({
      report: 'report/GET_REPORT',
      regions: 'citizen/GET_REGIONS',
      social_statuses: 'citizen/GET_SOCIAL_STATUSES'
    }),
    current_date() {
      return parseTime(new Date())
    }
  },
  mounted() {
    this.fetchReport()
    this.fetchRegions()
  },
  methods: {
    ...mapActions({
      fetchReport: 'report/reportAll',
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
    showCityReport(region) {
      localStorage.setItem('region_name', region.region)
      this.$router.push({ name: 'DistrictReport', params: { region_id: region.region_id }})
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
</style>
