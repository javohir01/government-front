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
                      @blur="concat"
                    />
                  </el-col>
                </el-row>
              </template>
              <template v-else>
                <el-input
                  ref="passport"
                  v-model="form.passport"
                  v-mask="'XX #######'"
                  placeholder="AA 0000000"
                  :class="{ 'full-input': isNumberFull }"
                />
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('ЖШШИР')" :disabled="is_disabled" prop="pin">
              <el-input
                ref="pin"
                v-model="form.pin"
                v-mask="'##############'"
                :class="{ 'full-input': isNumberPinFull }"
                @keyup.enter.native="getCitizen"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t(' ')">
              <el-button type="primary" icon="el-icon-check" :disabled="is_disabled" @click="getCitizen">{{ $t('Qidirish') }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('Фамилия')">
              <el-input v-model="form.l_name" :disabled="is_disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Исм')">
              <el-input v-model="form.f_name" :disabled="is_disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Отасининг исми')">
              <el-input v-model="form.m_name" :disabled="is_disabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item type="date" :label="$t('Туғилган куни')" prop="form.birth_date">
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
          <el-col :span="6">
            <el-form-item :label="$t('Манзили')" prop="form.address">
              <el-input v-model="form.address" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('Телефон рақами')" prop="phone_number">
              <el-input v-model="form.phone_number" v-mask="'########'">
                <template slot="prepend">+998</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('Ижтимоий холати')" prop="social_id">
              <el-select v-model="form.social_id" class="w-100" filterable>
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
        return { }
      }
    }
  },
  data() {
    return {
      loading: '',
      active: 0,
      is_disabled: true,
      rules: {
        l_name: [
          { required: true, message: 'Фамилияси киритилмаган', trigger: 'change' }
        ],
        f_name: [
          { required: true, message: 'Исми киритилмаган', trigger: 'change' }
        ],
        m_name: [
          { required: false, message: 'Отасининг исми киритилмаган', trigger: 'change' }
        ],
        pin: [
          { required: true, message: 'ЖШШИР киритилмаган', min: 14, max: 14, trigger: 'change' }
        ],
        passport: [
          { required: true, message: 'Паспорт киритилмаган', min: 9, max: 10, trigger: 'change' }
        ],
        // address: [
        //   { required: true, message: 'Манзили киритилмаган', trigger: 'change' }
        // ],
        phone_number: [
          { required: true, message: 'Телефон рақами киритилмаган', trigger: 'change' }
        ],
        social_id: [
          { required: true, message: 'Ижтимоий холати киритилмаган', trigger: 'change' }
        ]
      },
      validated: true,
      birth_date_disabled: true
    }
  },
  computed: {
    ...mapGetters({
      social_statuses: 'citizen/GET_SOCIAL_STATUSES'
    }),
    isPassportFull() {
      return this.form.passport.length >= 10
    },
    isNumberFull() {
      return (this.form.passport.length >= 9)
    },
    isNumberPinFull() {
      return (this.form.pin.length >= 14)
    },
    source() {
      return this.form.source
    }
  },

  watch: {
    // isPinFull(newVal, oldVal) {
    //   // if (!this.form.is_bg) {
    //   console.log('newVal')
    //   console.log(newVal)
    //   console.log('oldVal')
    //   console.log(oldVal)
    //   if (newVal && newVal !== oldVal) {
    //     this.form.source = 1
    //     this.getPassport()
    //   }
    // },
    isPassportFull(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.$refs.pin.focus()
        if (this.delay) {
          this.getCitizen()
        }
      } else {
        this.clearForm()
        this.is_disabled = true
      }
    },
    isNumberPinFull(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        if (this.form.passport.length >= 9) {
          this.is_disabled = false
        }
        if (this.delay) {
          this.getCitizen()
        }
      } else {
        this.clearForm()
        this.is_disabled = true
      }
    },
    'form.region_id'(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.fetchDistricts({ region_id: newVal }).then((res) => {
          this.districts = res.result.districts
        })
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
  },
  methods: {
    validateForm() {
      this.$refs['personal-form'].validate((valid) => {
        this.validated = valid
      })
    },
    ...mapActions({
      fetchSocialStatuses: 'citizen/socialStatuses',
      getPassportAction: 'citizen/passport',
      setForm: 'citizen/setForm',
      setMvdForm: 'citizen/setMvdForm',
      getCitizenAction: 'citizen/getCitizenByPassport'
    }),
    concat() {
      this.form.passport = this.form.series + this.form.number
    },
    getCitizen() {
      this.isPassportLoading = true
      const passport = this.form.passport.replace(' ', '')
      this.getCitizenAction({ passport: passport, pin: this.form.pin, type: this.app_modul, check: 1 })
        .then(res => {
          if (res.success && res.result.citizen && res.result.citizen.l_name) {
            this.setForm(res.result.citizen)
            this.is_disabled = true
          } else if (!res.result['0']) {
            this.source = 2
            this.$message({
              type: 'warning',
              message: 'Фуқаро топилмади!',
              duration: 5000
            })
          } else {
            this.$message({
              type: 'alert',
              message: 'Бу фуқаро базада мавжуд',
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
      this.getCitizenAction({ passport: passport, pin: this.form.pin, type: this.app_modul, check: 1 })
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
    clearForm() {
      this.form.f_name = ''
      this.form.l_name = ''
      this.form.m_name = ''
      this.form.address = ''
      // this.form.pin = ''
      this.form.birth_date = ''
    },
    clearPinForm() {
      this.form.f_name = ''
      this.form.l_name = ''
      this.form.m_name = ''
      this.form.address = ''
      // this.form.passport = ''
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
