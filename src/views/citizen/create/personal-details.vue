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
          <el-col :span="8">
            <el-form-item type="date" :label="$t('Туғилган куни')">
              <el-input
                v-loading="loading === 'birth_date'"
                ref="birth_date"
                v-model="form.birth_date"
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
              <el-input v-model="form.f_name"  />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Отасининг исми')">
              <el-input v-model="form.m_name"  />
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
            <el-form-item :label="$t('Манзили')">
              <el-input v-model="form.address"  />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :label="$t('Ижтимоий холати')" prop="city_id">
              <el-select v-model="form.social_status.name" class="w-100" filterable>
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
      social_statuses: 'citizen/GET_SOCIAL_STATUSES'
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
    'form.passport'(newVal) {
      this.form.passport = newVal.toUpperCase()
    },
    // isNumberFull(newVal, oldVal) {
    //   if (newVal && newVal !== oldVal) {
    //     this.form.source = 1
    //     this.getPassport()
    //   }
    // },
    // 'isBirthDateFull'(newVal, oldVal) {
    //   if ((newVal && newVal !== oldVal) && this.source === 2) {
    //     this.getPassportMVD()
    //   }
    // }
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
      setMvdForm: 'citizen/setMvdForm'
    })
  }
}
</script>
