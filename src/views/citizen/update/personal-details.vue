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
                :value="form.passport"
                :class="{ 'full-input': isNumberFull }"
                suffix-icon="el-icon-check"
                type="text"
                :disabled="is_disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('ЖШШИР')">
              <el-input
                v-model="form.pin"
                v-mask="'##############'"
                :disabled="is_disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item type="date" :label="$t('Туғилган куни')">
              <el-input
                v-loading="loading === 'birth_date'"
                ref="birth_date"
                v-model="form.birth_date"
                v-mask="'##.##.####'"
                placeholder="01.01.2019"
                :disabled="is_disabled"
              />
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
          <el-col :span="8">
            <el-form-item :label="$t('Манзили')">
              <el-input v-model="form.address" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Телефон рақами')">
              <el-input v-model="form.phone_number" />
            </el-form-item>
          </el-col>
<!--          <el-col :span="6">-->
<!--            <el-form-item :label="$t('Ижтимоий ҳолати')" prop="address">-->
<!--              <select v-model="form.social_status" @change="instantValue" >-->
<!--                <option :value="null">{{ $t('Барчаси') }}</option>-->
<!--                <template>-->
<!--                  <option v-for="social_status in social_statuses" :value="social_status.id" @keyup="instantValue">{{ social_status.name }}</option>-->
<!--                </template>-->
<!--              </select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="6">
            <el-form-item :label="$t('Ижтимоий холати')" prop="city_id">
              <el-select v-model="form.social_status" class="w-100" filterable>
                <el-option v-for="social_status in social_statuses" :key="social_status.id" :label="social_status.name" :value="form.social_id" />
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
        passport: [
          { required: true, message: this.$t('Паспорт киритилмаган'), trigger: 'change' }
        ],
        birth_date: [
          { required: true, message: this.$t('Туғилган сана киритилмаган'), trigger: 'change' }
        ]
      },
      validated: false,
      birth_date_disabled: true,
      delaying: false
    }
  },
  computed: {
    isNumberFull() {
      return (this.form.passport.length >= 10)
    },
    // isBirthDateFull() {
    //   return (this.form.birth_date.length >= 10)
    // },
    ...mapGetters({
      social_statuses: 'citizen/GET_SOCIAL_STATUSES'
    }),
    source() {
      return this.form.source
    }
  },
  watch: {
    'form.passport'(newVal) {
      this.form.passport = newVal.toUpperCase()
    },
    'isBirthDateFull'(newVal, oldVal) {
      if ((newVal && newVal !== oldVal) && this.delaying) {
        this.getPassportMVD()
      }
    }
  },
  mounted() {
    // eslint-disable-next-line no-return-assign
    setTimeout(() => this.delaying = true, 500)
    this.fetchSocialStatuses()
  },
  methods: {
    getPassport() {
      this.loading = 'passport'
      this.getPassportAction({ passport: this.form.passport, birth_date: '' })
        .then(res => {
          if (res.result.citizen !== undefined) {
            this.setForm({ form: this.form, citizen: res.result.citizen })
          } else {
            this.clearForm()
            this.birth_date_disabled = false
            this.loading = ''
            this.form.source = 2
            this.$refs.passport.focus()
          }
          this.loading = ''
        })
        .catch(res => {
          this.clearForm()
          this.birth_date_disabled = false
          this.loading = ''
          this.form.source = 2
          this.$refs.passport.focus()
        })
    },
    getPassportMVD() {
      this.loading = 'birth_date'
      this.getPassportAction({ passport: this.form.passport, birth_date: this.form.birth_date })
        .then(res => {
          if (res.result.citizen.pAnswereMessage === 'Берилган критериялар бўйича фуқаро топилмади' || res.result.pAnswereMessage === 'Излашда базада ҳато' || res.result.citizen.pAnswereMessage === 'Излаш критерияларини текширида ҳато') {
            this.$message({
              message: this.$t('Маълмот топилмади'),
              type: 'warning',
              duration: 5 * 1000,
              offset: 80
            })
          } else {
            this.setMvdForm({ form: this.form, citizen: res.result.citizen })
          }
          this.loading = ''
        })
        .catch(res => {
          console.log(res)
          this.$message({
            message: this.$t('Маълмот топилмади'),
            type: 'warning',
            duration: 5 * 1000,
            offset: 80
          })
        })
        .finally(() => {
          this.loading = ''
        })
    },
    clearForm() {
      this.form.birth_date = ''
      this.form.m_name = ''
      this.form.l_name = ''
      this.form.f_name = ''
    },
    validateForm() {
      this.$refs['personal-form'].validate((valid) => {
        this.validated = valid
      })
    },
    ...mapActions({
      setForm: 'citizen/setForm',
      setMvdForm: 'citizen/setMvdForm',
      fetchSocialStatuses: 'citizen/socialStatuses',
      getPassportAction: 'citizen/passport',

    })
  }
}
</script>
