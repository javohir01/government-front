<template>
  <div class="container">
    <h4 class="text-center">{{ $t('Ариза юбориш') }}</h4>
    <el-card class="box-card box-shadow">
      <personal-detail ref="personalForm" :form="form" />
      <el-col :span="24" class="d-flex justify-content-end mb-3">
        <el-button type="primary" icon="el-icon-check" :disabled="is_disable"  @click="save">{{ $t('Сақлаш') }}</el-button>
        <Modal
          v-show="isModalVisible"
          @close="closeModal"
        />
      </el-col>
    </el-card>
  </div>
</template>

<script>
import PersonalDetail from './personal-details'
import { mapActions, mapGetters } from 'vuex'
import Swal from 'sweetalert2'
import Modal from '@/views/application/components/Modal'

export default {
  name: 'ApplicationCreate',
  components: {
    PersonalDetail,
    Modal
  },
  data() {
    return {
      loading: true,
      is_disable: false,
      isPassportLoading: false,
      isModalVisible: false,
      source: 1,
      form: {
        is_bg: false,
        id: '',
        passport: '',
        series: '',
        number: '',
        code: '',
        l_name: '',
        f_name: '',
        m_name: '',
        region_id: null,
        district_id: null,
        social_id: null,
        address: '',
        birth_date: '',
        region: '',
        phone_number: '',
        district: '',
        social_status: '',
        social: '',
        source: 1,
        pin: '',
        limit: 0,
        page: 0,
        total: 1,
        full_name: '',
        get_type: 1
      },
      delay: false
    }
  },
  computed: {
    ...mapGetters({ citizens: 'citizen/GET_CITIZENS', citizens_pagination: 'citizen/GET_CITIZENS_PAGINATION', user: 'auth/USER', full_name: 'citizen/FULL_NAME',
      check_details: 'application/GET_CHECK_DETAILS', regions: 'citizen/GET_REGIONS', districts: 'citizen/GET_DISTRICTS', social_statuses: 'citizen/GET_SOCIAL_STATUSES',
      phone_number: 'application/GET_PHONE_NUMBER' })
  },
  mounted() {
    this.fetchRegions()
    this.fetchDistricts({ region_id: this.user.region_id })
    this.fetchSocialStatuses()
  },
  created() {
    if (!this.phone_number) {
      this.$router.push({ name: 'Choose' })
      return false
    }
  },
  methods: {
    showModal() {
      this.isModalVisible = true
    },
    closeModal() {
      this.isModalVisible = false
      this.$router.push({ name: 'Choose' })
    },
    clearForm() {
      this.form.f_name = ''
      this.form.l_name = ''
      this.form.m_name = ''
      this.form.phone_number = ''
      this.form.pin = ''
      this.form.birth_date = ''
      this.form.passport = ''
      this.form.series = ''
      this.form.number = ''
      this.form.address = ''
    },
    save() {
      this.form.phone_number = this.phone_number
      // console.log(this.form)
      if (this.validate()) {
        this.is_disable = true
        // console.log(this.form)
        this.storeApplication({ data: this.form })
          .then(res => {
            if (res.success) {
              this.showModal().then(() => {
                if (this.closeModal()) {
                  Swal.fire({
                    title: this.$t('Маълумот сақланди!'),
                    type: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    confirmButtonText: 'Давом этиш'
                  })
                }
              })
                .then(() => {
                  this.$router.push({ name: 'Choose', query: { type: this.$route.query.type }})
                })
            } else if (res.error === 'Bu ma\'lumotlar bazada mavjud') {
              this.is_disable = false
              Swal.fire({
                title: this.$t('Ушбу маълумотлар базада мавжуд!'),
                type: 'error',
                timer: 2000,
                showConfirmButton: false,
                confirmButtonText: 'Давом этиш'
              })
            }
          })
          // .catch((res) => {
          //   this.is_disable = false
          //   Swal.fire({
          //     title: this.$t('Сервернинг ички хатолиги!'),
          //     type: 'error',
          //     timer: 2000,
          //     showConfirmButton: false,
          //     confirmButtonText: 'Давом этиш'
          //   })
          // })
      }
    },
    validate() {
      this.$refs['personalForm'].validateForm()
      return this.$refs['personalForm'].validated
    },
    ...mapActions({
      // getNumber: 'application/getNumber',
      storeApplication: 'application/store',
      updateCitizen: 'citizen/update',
      setForm: 'application/setForm',
      fetchDistricts: 'citizen/districts',
      fetchSocialStatuses: 'citizen/socialStatuses',
      fetchRegions: 'citizen/regions'
    })
  }
}
</script>

<style>
  @keyframes zoominoutsinglefeatured {
    0% {
        transform: scale(0.8);
    }
    100% {
        transform: scale(1);
    }
}

.single-featured {
	animation: zoominoutsinglefeatured 0.5s forwards;
}
.swal2-title{
  font-size: 20px;
}
</style>
