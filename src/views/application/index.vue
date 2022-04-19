<template>
  <div class="container">
    <loading
      :active.sync="isLoading"
      :can-cancel="true"
      :is-full-page="fullPage"
      color="rgb(49, 134, 251)"
      loader="bars"
    />

    <h4 class="font-weight-bold">{{ title }}</h4>
    <div v-loading="!loaded" class="bg-white box-shadow p-4">
      <router-link :to="{ name:'ApplicationRegionReport', query: { type: $route.query.type } }">
        <el-button type="primary" class="float-right mb-4 font-weight-bold"><i class="el-icon-reading text-white" /> Ҳисобот </el-button>
      </router-link>
      <el-button type="success" class="float-right mb-4 font-weight-bold" icon="el-icon-download" :loading="isLoading" @click="exportToXlsx()">{{ $t('Юклаб олиш') }}</el-button>
      <el-radio-group v-model="filter.status" style="margin-bottom: 30px;" @change="sendFilter">
        <el-radio-button value="0" label="0">Barchasi</el-radio-button>
        <el-radio-button value="1" label="1">Tasdiqlangan</el-radio-button>
        <el-radio-button value="2" label="2">Rad etilgan</el-radio-button>
      </el-radio-group>
      <el-table
        v-if="loaded"
        class="mb-1 mx-auto table-custom"
        :data="applications"
        border
      >
        <el-table-column
          label="№"
          width="30"
          type="index"
          :index="indexMethod"
          fixed
        />
        <el-table-column label="" width="200" prop="region">
          <template slot="header">
            <p>{{ $t('ФИО') }}</p>
            <input v-model="filter.full_name" class="form-control form-control-sm w-100">
          </template>
          <template slot-scope="scope">
            <router-link :to="{ name:'ApplicationsShow', params:{id: scope.row.id}, query: {type: $route.query.type } }">
              {{ [scope.row.l_name, scope.row.f_name,scope.row.m_name ].join(' ') }}
            </router-link>
          </template>
        </el-table-column>
<!--        <el-table-column label="" width="130" prop="region">-->
<!--          <template slot="header">-->
<!--            <p>{{ $t('Ҳудуд') }}</p>-->
<!--            <select v-model="filter.region_id" class="w-100" style="height: 28px" @change="sendFilter">-->
<!--              <option :value="null">{{ $t('Барчаси') }}</option>-->
<!--              <template>-->
<!--                <option v-for="region in regions" :value="region.id" @keyup="sendFilter">{{ region.name_cyrl }}</option>-->
<!--              </template>-->
<!--            </select>-->
<!--          </template>-->
<!--          <template slot-scope="scope">-->
<!--            <p>{{ (scope.row.region && scope.row.region.name_cyrl) ? scope.row.region.name_cyrl: '-&#45;&#45;' }}</p>-->
<!--            {{filter.region}}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column width="140" prop="city">-->
<!--          <template slot="header">-->
<!--            <p>{{ $t('Туман(Шахар)') }}</p>-->
<!--            <select v-model="filter.district_id" class="w-100" style="height: 28px" @change="sendFilter">-->
<!--              <option :value="null">{{ $t('Барчаси') }}</option>-->
<!--              <template >-->
<!--                <option v-for="district in districts" :value="district.id" @keyup="sendFilter">{{ district.name_cyrl }}</option>-->
<!--              </template>-->
<!--            </select>-->
<!--          </template>-->
<!--          <template slot-scope="scope" >-->
<!--            <p>{{ (scope.row.district && scope.row.district.name_cyrl) ? scope.row.district.name_cyrl: '-&#45;&#45;' }}</p>-->
<!--            {{filter.district}}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column width="310" prop="social_status">
          <template slot="header">
            <p>{{ $t('Ижтимоий холати') }}</p>
            <select v-model="filter.social_id" class="w-250" style="height: 28px" @change="sendFilter">
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
        <el-table-column width="150">
          <template slot="header">
            <p>{{ $t('Манзили') }}</p>
            <input v-model="filter.address" type="text" class="w-100">
          </template>
          <template slot-scope="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column width="130">
          <template slot="header">
            <p>{{ $t('Телефон рақами') }}</p>
            <input v-model="filter.phone_number" type="text" class="w-100">
          </template>
          <template slot-scope="scope">
            {{ scope.row.phone_number }}
          </template>
        </el-table-column>
        <el-table-column width="150">
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
          width="140"
        >
          <template slot="header">
            <p>{{ $t('Паспорт') }}</p>
            <input v-model="filter.passport" class="form-control form-control-sm w-100">
          </template>
        </el-table-column>
        <el-table-column width="150">
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
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0" size="mini" type="info" @click="confirmApplication(scope.row.id)">{{ $t('Тасдиқлаш') }}</el-button>
            <el-button v-if="scope.row.status === 0" size="mini" class="m-1" type="danger" @click="showDialog(scope.row.id)">{{ $t('Рад етиш') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :total="filter.total"
        :page-size="1 * filter.limit"
        layout="prev, pager, next"
        class="mt-3"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      title="Илтимос рад етиш сабабини танланг"
      :visible.sync="warningDialog"
      width="20%"
      center
    >
      <section
        class="modal-body"
        id="modalDescription"
      >
        <slot name="body">
          <el-form
            ref="personal-form"
            label-position="top"
            class="top-label-custom"
            :rules="rules"
            :model="form"
          >
            <el-form-item :label="$t('Сабаблар')" prop="social_id">
              <template>
                <el-select v-model="form.deny_reason_id" class="w-100" filterable value="social_status.id">
                  <el-option v-for="deny_reason in deny_reasons" :key="deny_reason.id" :label="deny_reason.name" :value="deny_reason.id" />
                </el-select>
              </template>
            </el-form-item>
            <el-form-item :label="$t('Сабаблар')" prop="social_id">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="Изоҳ ёзиб қолдиринг"
                v-model="form.deny_reason_comment">
              </el-input>
            </el-form-item>
          </el-form>
        </slot>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="warningDialog = false">Бекор қилиш</el-button>
        <el-button type="primary" @click="rejectApplication(form)">Ок</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { parseTime } from '@/utils/'
import { toXlsx } from '@/utils/exports'
import Swal from 'sweetalert2'

export default {
  name: 'ApplicationIndex',
  data() {
    return {
      rejectedApp: '',
      tabPosition: 'left',
      activeName: 'first',
      isModalVisible: false,
      warningDialog: false,
      form: {
        id: '',
        deny_reason: '',
        deny_reason_id: '',
        deny_reason_comment: ''
      },
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
        limit: 50,
        page: 1,
        total: null,
        region: '',
        district: '',
        social_status: '',
        full_name: ''
      },
      status: 1,
      loaded: false,
      fullPage: true,
      isLoading: false,
      rules: {
        deny_reason_id: [
          { required: true, message: 'Сабаблардан бирини танланг', trigger: 'change' }
        ]
      },
      columns: [
        {
          label: this.$t('Ҳудуд'),
          field: 'region'
        },
        {
          label: this.$t('Туман(Шахар)'),
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
      ]
    }
  },
  computed: {
    ...mapGetters({ applications: 'application/GET_APPLICATIONS', applications_pagination: 'application/GET_APPLICATIONS_PAGINATION', deny_reasons: 'application/GET_DENY_REASONS',
      user: 'auth/USER', full_name: 'application/FULL_NAME', regions: 'citizen/GET_REGIONS', districts: 'citizen/GET_DISTRICTS', social_statuses: 'citizen/GET_SOCIAL_STATUSES' }),
    title() {
      return this.$t('Аризалар рўйхати')
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
  mounted() {
    if (this.user.role_id === 1) {
      this.fetchRegions().then((res) => {
        this.sendFilter()
      })
    } else {
      this.fetchDistricts({ region_id: this.user.region_id }).then((res) => {
        this.sendFilter()
      })
    }
    if (this.user.role_id === 1) {
      this.fetchSocialStatuses().then((res) => {
        this.sendFilter()
      })
    }
    this.fetchDenyReasons()
  },
  methods: {
    ...mapActions({ fetchApplications: 'application/index', fetchDenyReasons: 'application/denyReasons',
      fetchDistricts: 'application/districts', fetchSocialStatuses: 'application/socialStatuses', fetchRegions: 'application/regions', rejected: 'application/rejected', confirmed: 'application/confirmed' }),
    showModal(id) {
      this.rejectedApp = id
      this.isModalVisible = true
    },
    showDialog(id) {
      this.form.id = id
      this.warningDialog = true
    },
    closeModal() {
      this.isModalVisible = false
      this.$router.push({ name: 'ApplicationIndex' })
    },
    rejectApplication(data) {
      console.log(data)
      this.status = 2
      this.rejected(data)
      this.warningDialog = false
      this.$router.go(0)
    },
    confirmApplication(id) {
      this.status = 1
      this.confirmed(id)
      this.$router.go(0)
    },
    getTime(date) {
      return parseTime(date)
    },
    handleCurrentChange(val) {
      this.filter.limit = this.applications_pagination.limit
      this.filter.page = val
      this.sendFilter()
    },
    handleSizeChange(val) {
      this.filter.limit = val
      this.filter.page = this.applications_pagination.page
      this.sendFilter()
    },
    sendFilter() {
      this.filter.page = null
      this.loaded = false
      this.fetchApplications(this.filter).then((res) => {
        this.loaded = true
        // this.filter.limit = this.applications_pagination.limit
        // this.filter.page = this.applications_pagination.page
        // this.filter.total = this.applications_pagination.total
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
      // return (this.applications_pagination.page - 1) * 50 + index + 1
      return index + 1
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
            region: row.region.name_cyrl,
            district: row.district.name_cyrl,
            pin: row.pin,
            full_name: [row.l_name, row.f_name, row.m_name].join(' '),
            passport: row.passport,
            address: row.address,
            phone_number: row.phone_number,
            birth_date: row.birth_date,
            social_status: row.social_status.name
          })
        })
        return arr
      }
      return []
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
