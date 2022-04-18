<template>
  <div clas="h-100">
    <el-row v-if="!isShow">
      <el-row>
        <el-col :span="24" class="text-center">
          <h5>
            Аризангиз ҳолатини текшириш учун <br> сизга берилган nomer ва code ни киритинг
          </h5>
        </el-col>
      </el-row>
      <el-row class="d-flex justify-content-around mt-100">

        <el-row>
          <el-col :xs="24" :sm="12" :lg="12" :xl="12" class="mr-10" style="padding-right:40px">
            <el-col :span="24" class="p-5">
              <!--              <router-link :to="{ name: 'CitizensIndex', query: { type: 1 } }">-->
              <el-card class="box-card classic-style">
                <el-form
                  ref="form"
                  :model="form"
                  label-width="120px"
                  label-position="top"
                  status-icon
                  class="top-label-custom"
                >
                  <div class="citizen_details">
                    <!--                    <el-col :xs="24" :sm="12" :lg="6" :xl="6">-->
                    <el-form-item label="Number" prop="number">
                      <el-input ref="number" v-model="form.number" v-mask="'######'" placeholder="ID ни киритинг" class="me-lg-3" />
                    </el-form-item>
                    <!--                    </el-col>-->
                    <el-col :xs="210" :sm="120" :lg="23" :xl="23">
                      <el-form-item label="Code" prop="code" class="me-lg-3">
                        <el-input ref="code" v-model="form.code" v-mask="'#####'" placeholder="Code ни киритинг" />
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="3" :xl="confirmDialog ? 3 : 4">
                      <el-form-item label=" ">
                        <el-button type="primary" class="btn-main-color float-end"  @click="check">Текшириш</el-button>
                      </el-form-item>
                    </el-col>
                  </div>
                </el-form>
              </el-card>
            </el-col>
          </el-col>
        </el-row>
      </el-row>
    </el-row>
    <div v-if="isShow" class="container containerMobile">
      <div class="applicationCheckTableMobile">
        <div>
          <div class="applicationCheckBackButtonMobile mb-3" @click="backRoute()">
            &#8592; Orqaga qaytish
          </div>
          <p class="text-center" style="font-size: 16px; margin: 0 0 20px;"> {{ application.fullname }} </p>
          <p class="checkLabelMobile"><b>Manzil</b>:</p>
          <p>{{ application.address }}</p>
          <hr>
          <p class="checkLabelMobile"><b>Ariza holati:</b></p>
          <p>
            {{ application.status == 1 ? '"Yoshlar daftari" ga muvaffaqiyatli kiritildingiz' :
              (application.status == 2 ? 'Sizning "Yoshlar daftari" ga kirish to\'g\'risidagi arizangiz rad etildi' :
                  'Sizning "Yoshlar daftari" ga kirish to\'g\'risidagi arizangiz mutaxassislar tomonidan ko\'rib chiqilyapti') }}
          </p>
          <hr>
          <div v-if="application.status == 1">
            <p class="checkLabelMobile"><b>Tasdiqlangan sana</b>: </p>
            <p> {{ application.confirmed_at }}</p>
            <hr>
          </div>
          <div v-if="application.status == 2">
            <p class="checkLabelMobile"><b>Rad etish sababi</b>:</p>
            <p>{{ application.application_deny_reason ? application.application_deny_reason.name : '-' }}</p>
            <p class="checkLabelMobile"><b>Izoh</b>:</p>
            <p>{{ application.deny_reason }}</p>
            <p class="checkLabelMobile"><b>Rad etilgan sana</b>: </p>
            <p>{{ application.confirmed_at }}</p>
            <hr>
          </div>
        </div>
        <div class="me-5">
          <router-link :to="{ name: 'CitizenComplaint' }">
            <button class=" appPrimaryButton">Shikoyat yuborish </button>
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import { mapActions } from 'vuex'

export default {
  name: 'Choose',
  // props: {
  //   form: {
  //     type: Object,
  //     default() {
  //       return {
  //
  //       }
  //     }
  //   }
  // },
  data() {
    return {
      is_disabled: true,
      validated: false,
      isShow: false,
      form: {
        number: '',
        code: ''
      },
      loading: '',
      goo: false,
      application: {
        address: '',
        status: null,
        confirmed_by_name: '',
        confirmed_at: '',
        deny_reason: '',
        application_deny_reason: null,
        comment: '',
        confirmed_by_phone: '',
        user_city: '',
        user_city_sector: ''
      },
    }
  },
  computed: {
    getTime() {
      let m = Math.trunc(this.countdown / 60)
      let s = this.countdown % 60
      if (m <= 9) m = '0' + m
      if (s <= 9) s = '0' + s
      return s // parseTime(this.countdown, '{m}:{s}')
    }
    // isCodeFull() {
    //   return this.form.code.length >= 5
    // }
  },
  mounted() {
    // this.sendMessageAction()
    // this.getEmployees()
  },
  // watch: {
  //   isCodeFull(newVal) {
  //     if (newVal) this.confirmation()
  //   }
  // },
  methods: {
    ...mapActions({
      sendMessageAction: 'application/sendMessage',
      checkAction: 'application/checkApplication'
    }),
    sendMessage() {
      if (!this.form.phone_number || this.form.phone_number.length !== 9) {
        this.$message.error('Telefon raqamini kiriting!')
        return false
      }
      // console.log('phone_number : ' + this.form.phone_number)
      this.loading = 'send'
      this.sendMessageAction({ phone_number: this.form.phone_number }).then((res) => {
        // console.log(this.phone_number)
        // console.log(res)
        if (res.success) {
          this.confirmDialog = true
          this.countdown = 60
          this.countDownTimer()
          this.startCountDown = true
          setTimeout(() => {
            this.$refs.code.focus()
          }, 200)
        }
      }).catch((res) => {
        if (res.response && res.response.data && res.response.data.msg) {
          Swal.fire({
            title: res.response.data.msg,
            type: 'info',
            timer: 3000,
            showConfirmButton: false,
            confirmButtonText: 'Давом этиш'
          })
        }
      }).finally(() => {
        this.loading = ''
      })
    },
    check() {
      if (!this.form.code) {
        this.$message.error('Kodni kiriting!')
        return false
      }
      if (!this.form.number) {
        this.$message.error('ИДни киритинг!')
        return false
      }
      // this.loading = 'code'
      this.isLoading = true
      this.checkAction({ number: this.form.number, code: this.form.code }).then((res) => {
        if (res.success) {
          console.log(res.result.application)
          if (res.result.application.status === 0) {
            const governor = res.result.application.district.name_cyrl
            this.$message.success('Сизнинг аризангиз ' + governor + ' ҳокими томонидан текширилмоқда')
          }
          if (res.result.application.status === 1) {
            const governor = res.result.application.district.name_cyrl
            this.$message.success('Сизнинг аризангиз ' + governor + ' ҳокими томонидан тасдиқланди')
          }
          if (res.result.application.status === 2) {
            const governor = res.result.application.district.name_cyrl
            this.$message.success('Сизнинг аризангиз ' + governor + ' ҳокими томонидан рад етилган')
          }
          // this.form.is_confirmed = true
          // this.confirmDialog = false
          // this.$message.success('Muvaffaqiyatli tasdiqlandi!')
          // this.$emit('phone_numberSuccess', true)
          // this.goo = true
          // this.$router.push({ name: 'ApplicationCreate' })
        } else {
          this.$message.error('Kod mos emas!')
        }
      }).catch((res) => {
        this.$message.error('Kod mos emas!')
      }).finally(() => {
        this.loading = ''
      })
    },
    focusphone_number() {
      this.$refs.phone_number.focus()
    },
    goToForm() {
      return true
    },
    countDownTimer() {
      if (this.countdown > 0) {
        this.timer = setTimeout(() => {
          this.countdown -= 1
          this.countDownTimer()
        }, 1000)
      } else {
        this.startCountDown = false
      }
    }
  }
}
</script>
<style scoped>

.box-card{
  border-radius: 10px;
  width: 450px !important;
  margin: 0 auto !important;
}
.router-link:hover{
  text-decoration: none !important;
}
a:hover {
  text-decoration: none !important;
}
.large-icon{
  font-size: 80px;
}
.mt-100 {
  margin-top: 80px;
}
.mt-200 {
  margin-top: 240px;
}
</style>
