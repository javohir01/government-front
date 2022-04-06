<template>
  <div class="container">
    <loading
      :active.sync="isLoading"
      :can-cancel="true"
      :is-full-page="fullPage"
      color="rgb(49, 134, 251)"
      loader="bars"
    />
    <!--    <router-link :to="{ name: 'ChooseType' }">-->
    <!--      <el-button type="text" icon="el-icon-arrow-left">{{ $t('Ортга қайтиш') }}</el-button>-->
    <!--    </router-link>-->
    <h4 class="font-weight-bold">{{ title }}</h4>
    <div v-loading="!loaded" class="bg-white box-shadow p-4">
      <el-button type="success" class="float-right mb-4 font-weight-bold" icon="el-icon-download" :loading="isLoading" @click="exportToXlsx()">{{ $t('Юклаб олиш') }}</el-button>
      <template v-if="user.role_id === 3">
        <router-link :to="{name: 'CitizensCreate', query: { type: $route.query.type } }">
          <el-button type="success" class="float-right mb-4 font-weight-bold" icon="el-icon-plus">{{ $t('Aъзо қўшиш') }}</el-button>
        </router-link>
      </template>
      <el-table
        v-if="loaded"
        class="mb-1 mx-auto table-custom"
        :data="citizens"
        border
      >
        <el-table-column
          label="№"
          width="30"
          type="index"
          :index="indexMethod"
          fixed
        />
        <el-table-column label="" width="130" prop="region">
          <template slot="header">
            <p>{{ $t('ФИО') }}</p>
            <input v-model="filter.full_name" class="form-control form-control-sm w-100">
          </template>
          <template slot-scope="scope">
            <router-link :to="{ name:'CitizensShow', params:{id: scope.row.id}, query: {type: $route.query.type } }">
              {{ [scope.row.l_name, scope.row.f_name,scope.row.m_name ].join(' ') }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="" width="130" prop="region">
          <template slot="header">
            <p>{{ $t('Ҳудуд') }}</p>
            <select v-model="filter.region_id" class="w-100" style="height: 28px" @change="sendFilterRegion">
              <option :value="null">{{ $t('Барчаси') }}</option>
              <template>
                <option v-for="region in regions" :value="region.id" @keyup="sendFilter">{{ region.name_cyrl }}</option>
              </template>
            </select>
          </template>
          <template slot-scope="scope">
            <p>{{ (scope.row.region && scope.row.region.name_cyrl) ? scope.row.region.name_cyrl: '---' }}</p>
<!--            {{filter.region}}-->
          </template>
        </el-table-column>
        <el-table-column width="140" prop="city">
          <template slot="header">
            <p>{{ $t('Туман(Шахар)') }}</p>
            <select v-model="filter.district_id" class="w-100" style="height: 28px" @change="sendFilter">
              <option :value="null">{{ $t('Барчаси') }}</option>
              <template >
                <option v-for="district in districts" :value="district.id" @keyup="sendFilter">{{ district.name_cyrl }}</option>
              </template>
            </select>
          </template>
          <template slot-scope="scope" >
            <p>{{ (scope.row.district && scope.row.district.name_cyrl) ? scope.row.district.name_cyrl: '---' }}</p>
            {{filter.district}}
          </template>
        </el-table-column>
        <el-table-column width="140" prop="city">
          <template slot="header">
            <p>{{ $t('Ижтимоий холати') }}</p>
            <select v-model="filter.social_id" class="w-100" style="height: 28px" @change="sendFilter">
              <option :value="null">{{ $t('Барчаси') }}</option>
              <template >
                <option v-for="social_status in social_statuses" :value="social_status.id" @keyup="sendFilter">{{ social_status.name }}</option>
              </template>
            </select>
          </template>
          <template slot-scope="scope" >
            <p>{{ (scope.row.social_status && scope.row.social_status.name) ? scope.row.social_status.name: '---' }}</p>
            {{filter.social_status}}
          </template>
        </el-table-column>
        <el-table-column width="110">
          <template slot="header">
            <p>{{ $t('Манзили') }}</p>
            <input v-model="filter.address" type="text" class="w-100">
          </template>
          <template slot-scope="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column width="110">
          <template slot="header">
            <p>{{ $t('туғилган куни') }}</p>
            <input v-model="filter.birth_date" type="text" class="w-100">
          </template>
          <template slot-scope="scope">
            {{ scope.row.birth_date }}
          </template>
        </el-table-column>
        <el-table-column
          prop="passport"
          width="100"
        >
          <template slot="header">
            <p>{{ $t('Паспорт') }}</p>
            <input v-model="filter.passport" class="form-control form-control-sm w-100">
          </template>
        </el-table-column>
        <el-table-column width="120">
          <template slot="header">
            <p>{{ $t('ЖШШИР') }}</p>
            <input v-model="filter.pin" class="form-control form-control-sm w-100">
          </template>
          <template slot-scope="scope">
            {{ scope.row.pin }}
          </template>
        </el-table-column>
        <el-table-column
          width="120"
        >
          <template slot="header">
            <el-button class="mt-3" type="primary" size="mini" @click="sendFilter()">{{ $t('Қидириш') }}</el-button>
          </template>
          <template v-if="user.role_id === 3" slot-scope="scope">
            <router-link :to="{ name:'CitizensEdit', params:{id: scope.row.id}, query: { type: $route.query.type } }">
              <el-button size="mini" type="info">{{ $t('Таҳрирлаш') }}</el-button>
            </router-link>
            <el-button size="mini" class="m-1" type="danger" @click="deleteCitizen(scope.row.id)">{{ $t('Ўчириш') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :total="filter.total"
        :page-size="1 * filter.limit"
        layout="prev, pager, next"
        class="mt-3"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { parseTime } from '@/utils/'
import { toXlsx } from '@/utils/exports'
import Swal from 'sweetalert2'

export default {
  name: 'CitizenIndex',
  data() {
    return {
      filter: {
        l_name: '',
        f_name: '',
        m_name: '',
        region_id: null,
        district_id: null,
        social_id: null,
        address: '',
        passport: '',
        birth_date: null,
        pin: null,
        limit: 0,
        page: 0,
        total: 1,
        region: '',
        district: '',
        social_status: '',
        full_name: ''
      },
      loaded: false,
      columns: [
        {
          label: this.$t('Ҳудуд'),
          field: 'region'
        },
        {
          label: this.$t('Туман(Шахар'),
          field: 'district'
        },
        {
          label: this.$t('ФИО'),
          field: 'full_name'
        },
        {
          label: this.$t('Паспорт'),
          field: 'passport'
        },
        {
          label: this.$t('Манзили'),
          field: 'address'
        },
        {
          label: this.$t('ЖШШИР'),
          field: 'pin'
        },
        {
          label: this.$t('туғилган куни'),
          field: 'birth_date'
        },
        {
          label: this.$t('Ижтимоий холати'),
          field: 'social_status'
        }
      ],
      fullPage: true,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({ citizens: 'citizen/GET_CITIZENS', citizens_pagination: 'citizen/GET_CITIZENS_PAGINATION',
      user: 'auth/USER', full_name: 'citizen/FULL_NAME', regions: 'citizen/GET_REGIONS', districts: 'citizen/GET_DISTRICTS', social_statuses: 'citizen/GET_SOCIAL_STATUSES' }),
    title() {
      return this.$t('Фуқаролар рўйхати')
    },
    currentYear() {
      return String(new Date().getFullYear())
    },

    years() {
      var years = []
      for (var i = 1991; i <= this.currentYear; i++) {
        years.push(i)
      }
      return years
    }
  },
  // mounted() {
  //   // if (this.$route.query.l_name) {
  //   this.filter.el_name = this.$route.query.l_name
  //   this.sendFilter()
  //   // } else {
  //   this.fetchCitizens().then((res) => {
  //     this.filter.limit = this.citizens_pagination.limit
  //     this.filter.page = this.citizens_pagination.page
  //     this.filter.total = this.citizens_pagination.total
  //   })
  //   // }
  // },
  mounted() {
    if (this.$route.query.emblef_name) {
      this.filter.emblef_name = this.$route.query.emblef_name
      this.sendFilter()
    } else {
      this.fetchCitizens().then((res) => {
        this.filter.limit = this.citizens_pagination.limit
        this.filter.page = this.citizens_pagination.page
        this.filter.total = this.citizens_pagination.total
      })
    }
    if (this.user.role_id === 1) {
      this.fetchRegions().then((res) => {
        this.sendFilter()
      })
    } else {
      this.fetchDistricts({ region_id: this.user.region_id}).then((res) => {
        this.sendFilter()
      })
    }
    if (this.user.role_id === 1) {
      this.fetchSocialStatuses().then((res) => {
        this.sendFilter()
      })
    }
  },
  methods: {
    ...mapActions({ fetchCitizens: 'citizen/index', indexFull: 'citizen/indexFull',
      fetchDistricts: 'citizen/districts', fetchSocialStatuses: 'citizen/socialStatuses', fetchRegions: 'citizen/regions', deleteCitizenAction: 'citizen/delete' }),
    getTime(date) {
      return parseTime(date)
    },
    handleCurrentChange(val) {
      this.filter.limit = this.citizens_pagination.limit
      this.filter.page = val
      this.sendFilter()
    },
    handleSizeChange(val) {
      this.filter.limit = val
      this.filter.page = this.citizens_pagination.page
      this.sendFilter()
    },
    sendFilter() {
      this.filter.page = null
      this.loaded = false
      this.fetchCitizens(this.filter).then((res) => {
        this.loaded = true
        this.filter.limit = this.citizens_pagination.limit
        this.filter.page = this.citizens_pagination.page
        this.filter.total = this.citizens_pagination.total
      })
    },
    sendFilterRegion() {
      // if (this.user.role.name === 1) {
      this.fetchDistricts({ region_id: this.filter.region_id }).then((res) => {
        this.sendFilter()
        this.filter.district_id = null
      })
      // }
    },
    indexMethod(index) {
      return (this.citizens_pagination.page - 1) * 50 + index + 1
    },
    deleteCitizen(id) {
      if (confirm(this.$t('Ҳақиқатан ҳам ушбу маълумотни ўчирмоқчимисиз?'))) {
        this.deleteCitizenAction(id).then((res) => {
          Swal.fire({
            title: this.$t('Муваффақиятли ўчирилди!'),
            type: 'success',
            timer: 2000,
            showConfirmButton: false,
            confirmButtonText: 'Давом этиш'
          }).finally(() => {
            this.sendFilter()
          })
        })
      }
    },
    exportToXlsx() {
      this.isLoading = true
      this.filter['getAll'] = 1
      this.indexFull(this.filter).then(data => {
        this.isLoading = false
        toXlsx(
          this.exportFormat(data.result.citizens.data),
          this.$t('рўйхат'),
          this.columns,
        )
      })
    },
    exportFormat(data) {
      if (data && data.length) {
        const arr = []
        data.forEach(row => {
          arr.push({
            pin: row.pin,
            full_name: [row.L_name, row.f_name, row.m_name].join(' '),
            passport: row.passport
          })
        })
        return arr
      }
      return []
    }
  }
}
</script>
