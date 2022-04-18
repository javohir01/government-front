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
      <el-col>
        <el-row>
          <el-col :span="form.is_bg ? 8 : 8">
            <el-form-item label="Паспорт" prop="passport">
              <template v-if="form.is_bg">
                <el-row>
                  <el-col :span="8">
                    <el-select v-model="form.series" @change="concat">
                      <el-option label="БГ" value="БГ" />
                      <el-option label="ИР" value="ИР" />
                    </el-select>
                  </el-col>
                    <el-col :span="16">
                    <el-input
                      v-model="form.number"
                      v-mask="'#######'"
                      type="text"
                      placeholder="0000000"
                      filterable
                      @blur="concat"
                    />
                  </el-col>
                </el-row>
              </template>
              <template v-else>
                <el-input
                  v-model="form.passport"
                  v-mask="'XX #######'"
                  placeholder="AA 0000000"
                  :class="{ 'full-input': isPassportFull }"
                />
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('ЖШШИР')" prop="pin">
              <el-input
                v-model="form.pin"
                v-mask="'##############'"
                :class="{ 'full-input': isPinFull }"
                suffix-icon="el-icon-check"
                @keyup.enter.native="getCitizen"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t(' ')">
              <el-button class="" type="primary" icon="el-icon-check" :disabled="is_disabled" @click="getCitizen">{{ $t('Qidirish') }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="show">
          <el-col :span="8">
            <el-form-item :label="$t('Фамилия')" prop="l_name">
              <el-input v-model="form.l_name" :disabled="is_disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Исм')" prop="f_name">
              <el-input v-model="form.f_name" :disabled="is_disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Отасининг исми')" prop="m_name">
              <el-input v-model="form.m_name" :disabled="is_disabled"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  v-if="show">
          <el-col :span="8">
            <el-form-item type="date" :label="$t('Туғилган куни')" prop="birth_date">
              <el-input
                ref="birth_date"
                v-model="form.birth_date"
                v-loading="loading === 'birth_date'"
                v-mask="'##.##.####'"
                placeholder="01.01.2019"
                :disabled="is_disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Ҳудуд')" prop="region_id">
              <el-select v-model="form.region_id" class="w-100" filterable value="region.id">
                <!--                <option :value="null">{{ $t('Барчаси') }}</option>-->
                <el-option v-for="region in regions" :key="region.id" :value="region.id" :label="region.name_cyrl" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Туман(Шахар)')" prop="district_id">
              <el-select v-model="form.district_id" class="w-100" style="height: 28px">
                <el-option v-for="district in districts" :key="district.id" :value="district.id" :label="district.name_cyrl" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  v-if="show">
          <el-col :span="8">
            <el-form-item :label="$t('Манзили'+ phone_number)" prop="address">
              <el-input v-model="form.address" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Ижтимоий холати')" prop="social_id">
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
  name: 'PersonalDetail',
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
      is_disabled: false,
      loading: '',
      isPassportLoading: false,
      show: false,
      active: 0,
      rules: {
        pin: [
          { required: true, message: 'ЖШШИР киритилмаган', trigger: 'change' }
        ],
        passport: [
          { required: true, message: 'Паспорт киритилмаган', trigger: 'change' }
        ],
        address: [
          { required: true, message: 'Манзил киритилмаган', trigger: 'change' }
        ],
        district_id: [
          { required: true, message: 'Туман(Шахар) киритилмаган', trigger: 'change' }
        ],
        region_id: [
          { required: true, message: 'Ҳудуд киритилмаган', trigger: 'change' }
        ],
        social_id: [
          { required: true, message: 'Ижтимоий холати киритилмаган', trigger: 'change' }
        ]
      },
      validated: false,
      birth_date_disabled: true
    }
  },
  computed: {
    ...mapGetters({
      social_statuses: 'citizen/GET_SOCIAL_STATUSES', regions: 'citizen/GET_REGIONS', districts: 'citizen/GET_DISTRICTS', phone_number: 'application/GET_PHONE_NUMBER'
    }),
    isPassportFull() {
      // console.log(this.form.passport)
      return this.form.passport.length >= 9
    },
    isPinFull() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.is_disabled = false
      return this.form.pin.length >= 13
    },
    isNumberFull() {
      return (this.form.passport.length >= 9)
    },
    isBirthDateFull() {
      return (this.form.birth_date && this.form.birth_date.length >= 10)
    },
    source() {
      return this.form.source
    }
  },
  watch: {
    watch: {
      // isPassportFull(newVal, oldVal) {
      //   console.log(newVal)
      //   if (newVal && newVal !== oldVal) {
      //     this.$refs.pin.focus()
      //   } else {
      //     this.clearForm()
      //   }
      // },
      'isPassportFull'(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          if (this.passport) {
            setTimeout(() => {
              this.$refs.pin.focusPin()
            }, 8)
          }
        }
      },
      'isBirthDateFull'(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          if (this.isBirthDateTrue) {
            setTimeout(() => {
              this.$refs.phoneForm.focusPhone()
            }, 10)
          }
        }
      },
      'form.passport'(newVal) {
        const a = newVal.slice(0, 2)
        if (a.match(/[0-9]+/)) {
          this.form.passport = this.form.passport.slice(2, this.form.passport.length)
        }
      },
      'form.get_type'(newVal) {
        if (this.delay) {
          this.clearForm()
        }
      }
    },
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
    isPinFull(newVal, oldVal) {
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

    this.fetchDistricts({ region_id: this.form.region_id })
  },

  methods: {
    ...mapActions({
      fetchSocialStatuses: 'citizen/socialStatuses',
      getPassportAction: 'citizen/passport',
      setForm: 'application/setForm',
      setMvdForm: 'citizen/setMvdForm',
      fetchDistricts: 'citizen/districts',
      fetchRegions: 'citizen/regions',
      getCitizenAction: 'application/getCitizenByPassport'
    }),
    focusPassport() {
      this.$refs.pin.focus()
    },
    concat() {
      this.form.passport = this.form.series + this.form.number
    },
    validateForm() {
      this.$refs['personal-form'].validate((valid) => {
        this.validated = valid
      })
      return this.validated
    },
    getCitizen() {
      this.isPassportLoading = true
      const passport = this.form.passport.replace(' ', '')
      this.isPassportLoading = true
      this.getCitizenAction({ passport: passport, pin: this.form.pin, type: this.app_modul, check: 1 })
        .then(res => {
          if (res.success && res.result.citizen && res.result.citizen.l_name) {
            this.setForm(res.result.citizen)
            this.is_disabled = true
            this.show = true
          }
          // else if (res.code === 'db') {
          //   Swal.fire({
          //     title: typeof res.msg === 'string' ? res.msg : 'Фуқаро топилмади!',
          //     type: 'error',
          //     timer: 3000,
          //     showConfirmButton: false,
          //     confirmButtonText: 'Давом этиш'
          //   })
          // }
          else {
            this.$message({
              type: 'alert',
              message: 'Сиз аввал ариза жўнатгансиз ' + ' Ариза ҳолатини ' + 'ID: ' + res.result['0'].number + ' va Code: ' + res.result['0'].code + ' орқали текширинг ',
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
    },
    clearForm() {
      this.form.f_name = ''
      this.form.l_name = ''
      this.form.m_name = ''
      this.form.address = ''
      this.form.pin = ''
      this.form.birth_date = ''
    },
    setForm(citizen) {
      this.form.f_name = citizen.f_name
      this.form.l_name = citizen.l_name
      this.form.m_name = citizen.m_name
      this.form.pin = citizen.pin
      this.form.birth_date = citizen.birth_date
    },
    setFormMvd(citizen) {
      this.form.f_name = citizen.f_name
      this.form.l_name = citizen.l_name
      this.form.m_name = citizen.m_name
      this.form.pin = citizen.pin
      this.form.birth_date = citizen.birth_date
    }
  }
}
</script>
