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
        <el-table-column label="Ҳудуд номлари">
          <template slot-scope="scope">
            <a href="#" @click="showCityReport(scope.row)">{{ scope.row.region }}</a>
          </template>
        </el-table-column>
        <el-table-column label="Хизмат кўрсатилишини кутаётган фуқаролар сони" prop="total" />
        <el-table-column label="Суғурта полиси берилган фуқаролар сони" prop="counts" />
      </el-table>
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
    ...mapGetters({ report: 'report/GET_REPORT', regions: 'citizen/GET_REGIONS' }),
    current_date() {
      return parseTime(new Date())
    }
  },
  mounted() {
    this.fetchReport()
    this.fetchRegions()
  },
  methods: {
    ...mapActions({ fetchReport: 'report/insurance', fetchRegions: 'region/list' }),
    citizenShow(id) {
      localStorage.setItem('id', id)
      this.$router.push({ name: 'OperatorCitizensShow', params: { id: id }})
    },
    applyfilter() {
      this.fetchCitizens(this.filter)
    },
    showCityReport(region) {
      localStorage.setItem('region_name', region.region)
      this.$router.push({ name: 'InsuranceCityReport', params: { user_id: region.user_id }})
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
