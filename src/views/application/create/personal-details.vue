<template>
  <el-form
    ref="personal-form"
    label-position="top"
    class="top-label-custom"
    :rules="rules"
    :model="form"
  >
    <el-row>
      <el-divider content-position="left">{{ $t('Шахсий маълумотлар') }}</el-divider>
      <el-col :span="24">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('Паспорт')" prop="passport">
              <el-input
                ref="passport"
                v-model="form.passport"
                v-mask="'AA #######'"
                v-loading="loading === 'passport'"
                :value="form.passport"
                suffix-icon="el-icon-check"
                type="text"
              />
            </el-form-item>
          </el-col>
<!--          <el-col :span="form.is_bg ? 4 : 3">-->
<!--            <el-form-item label="Паспорт" prop="passport">-->
<!--              <template v-if="form.is_bg">-->
<!--                <el-row>-->
<!--                  <el-col :span="8">-->
<!--                    <el-select v-model="form.series" @change="concat">-->
<!--                      <el-option label="БГ" value="БГ" />-->
<!--                      <el-option label="ИР" value="ИР" />-->
<!--                    </el-select>-->
<!--                  </el-col>-->
<!--                  <el-col :span="16">-->
<!--                    <el-input-->
<!--                      v-model="form.number"-->
<!--                      v-mask="'#######'"-->
<!--                      type="text"-->
<!--                      placeholder="0000000"-->
<!--                      @blur="concat"-->
<!--                    />-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--              </template>-->
<!--              <template v-else>-->
<!--                <el-input-->
<!--                  v-model="form.passport"-->
<!--                  v-eluppercase-->
<!--                  v-mask-ru="'XX #######'"-->
<!--                  placeholder="AA 0000000"-->
<!--                />-->
<!--              </template>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="8">
            <el-form-item type="date" :label="$t('Туғилган куни')">
              <el-input
                ref="birth_date"
                v-model="form.birth_date"
                v-loading="loading === 'birth_date'"
                v-mask="'##.##.####'"
                placeholder="01.01.2019"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('Фамилия')">
              <el-input v-model="form.l_name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Исм')">
              <el-input v-model="form.f_name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Отасининг исми')">
              <el-input v-model="form.m_name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('ЖШШИР')">
              <el-input
                v-model="form.pin"
                v-mask="'##############'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Ҳудуд')">
              <el-select v-model="form.region_id" class="w-100" filterable value="region.id">
                <!--                <option :value="null">{{ $t('Барчаси') }}</option>-->
                <el-option v-for="region in regions" :key="region.id" :value="region.id" :label="region.name_cyrl" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Туман(Шахар)')">
              <el-select v-model="form.district_id" class="w-100" style="height: 28px">
                <el-option v-for="district in districts" :key="district.id" :value="district.id" :label="district.name_cyrl" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('Манзили')">
              <el-input v-model="form.address" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :label="$t('Ижтимоий холати')" prop="social_status.id">
              <el-select v-model="form.social_id" class="w-100" filterable value="social_status.id">
                <el-option v-for="social_status in social_statuses" :key="social_status.id" :label="social_status.name" :value="social_status.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Swal from 'sweetalert2'

export default {
  name: 'PersonalDetial',
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      // form: {
      //   id: '',
      //   passport: '',
      //   l_name: '',
      //   f_name: '',
      //   m_name: '',
      //   region_id: null,
      //   district_id: null,
      //   social_id: null,
      //   address: '',
      //   birth_date: '',
      //   region: '',
      //   phone_number: null,
      //   district: '',
      //   social_status: '',
      //   social: '',
      //   source: 1,
      //   pin: '',
      //   limit: 0,
      //   page: 0,
      //   total: 1,
      //   full_name: ''
      // },
      loading: '',
      active: 0,
      rules: {
        // passport: [
        //   { required: true, message: this.$t('Паспорт киритилмаган'), trigger: 'change' }
        // ],
        // birth_date: [
        //   { required: true, message: this.$t('Туғилган сана киритилмаган'), trigger: 'change' }
        // ]
      },
      validated: true,
      birth_date_disabled: true
    }
  },
  computed: {
    ...mapGetters({
      social_statuses: 'citizen/GET_SOCIAL_STATUSES', regions: 'citizen/GET_REGIONS', districts: 'citizen/GET_DISTRICTS'
    }),
    isNumberFull() {
      return (this.form.passport.length >= 10)
    },
    isBirthDateFull() {
      return (this.form.birth_date && this.form.birth_date.length >= 10)
    },
    source() {
      return this.form.source
    }
  },
  watch: {
    isPassportFull(newVal, oldVal) {
      if (!this.form.is_bg) {
        if (newVal && newVal !== oldVal) {
          if (this.delay) {
            this.getCitizen()
          }
        } else {
          this.clearForm()
        }
      }
    },
    'form.region_id'(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.fetchDistricts({ region_id: newVal }).then((res) => {
          this.districts = res.result.districts
        })
      }
    },
    'isBirthDateFull'(newVal, oldVal) {
      if ((newVal && newVal !== oldVal) && this.source === 2) {
        if (!this.form.is_bg) {
          this.getCitizenMVD()
        }
      }
    },
    'form.passport'(newVal) {
      this.form.passport = newVal.toUpperCase()
      const a = newVal.slice(0, 2)
      if (a.match(/[0-9]+/)) {
        this.form.passport = this.form.passport.slice(2, this.form.passport.length)
      }
    }
  },
  mounted() {
    this.fetchSocialStatuses()
    this.fetchRegions()
    // if (this.user.role_id !== 10) {
    //   this.fetchRegions().then((res) => {
    //     this.sendFilter()
    //   })
    // } else {
    //   this.fetchDistricts({ region_id: this.form.region_id }).then((res) => {
    //     this.sendFilter()
    //   })
    // }
    this.fetchDistricts({ region_id: this.form.region_id })
    this.fetchSocialStatuses()
  },
  methods: {
    ...mapActions({
      fetchSocialStatuses: 'citizen/socialStatuses',
      getPassportAction: 'citizen/passport',
      setForm: 'citizen/setForm',
      setMvdForm: 'citizen/setMvdForm',
      fetchDistricts: 'citizen/districts',
      fetchRegions: 'citizen/regions',
      getCitizenAction: 'citizen/getCitizenByPassport',

    }),
    concat() {
      this.form.passport = this.form.series + this.form.number
    },
    validateForm() {
      this.$refs['personal-form'].validate((valid) => {
        this.validated = valid
      })
    },
    getCitizen() {
      this.isPassportLoading = true
      const passport = this.form.passport.replace(' ', '')
      this.getCitizenAction({ passport: passport, type: this.app_modul, check: 1 })
        .then(res => {
          if (res.success && res.result.citizen && res.result.citizen.sname) {
            this.setForm(res.result.citizen)
            this.is_disabled = true
          } else if (res.code === 'db') {
            Swal.fire({
              title: typeof res.msg === 'string' ? res.msg : 'Фуқаро топилмади!',
              type: 'error',
              timer: 3000,
              showConfirmButton: false,
              confirmButtonText: 'Давом этиш'
            })
          } else {
            this.source = 2
            this.$message({
              type: 'warning',
              message: 'Туғилган санани киритинг',
              duration: 5000
            })
          }
        }).finally(() => {
          this.isPassportLoading = false
        })
    },
    getCitizenMVD() {
      this.isPassportLoading = true
      const passport = this.form.passport.replace(' ', '')
      this.getCitizenAction({ passport: passport, birth_date: this.form.birth_date, type: this.app_modul, check: 1 })
        .then(res => {
          if (res.success && res.result.citizen) {
            this.setFormMvd(res.result.citizen)
            this.is_disabled = true
          } else {
            Swal.fire({
              title: typeof res.error === 'string' ? res.error : 'Фуқаро топилмади!',
              type: 'error',
              timer: 3000,
              showConfirmButton: false,
              confirmButtonText: 'Давом этиш'
            })
          }
        }).catch((res) => {
          Swal.fire({
            title: 'Фуқаро топилмади!',
            type: 'error',
            timer: 3000,
            showConfirmButton: false,
            confirmButtonText: 'Давом этиш'
          })
        })
        .finally(() => {
          this.isPassportLoading = false
        })
    },
    sendFilterRegion() {
      // if (this.user.role.name === 1) {
      this.fetchDistricts({ region_id: this.filter.region_id }).then((res) => {
        this.sendFilter()
        this.filter.district_id = null
      })
      // }
    }
  }
}
</script>
