<template>
  <div clas="h-100">
    <el-row>
      <el-row>
        <el-col :span="24" class="text-center">
          <h5>
            Ўзбекистон Республикаси Бандлик ва меҳнат муносабатлари вазирлиги <br>«Фуқаролар тизими» га хуш келибсиз
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
                    <el-form-item label="Ариза қолдириш учун телефон рақамингизни киритинг" prop="phone_number">
                      <el-input ref="phone_number" v-model="form.phone_number" v-mask="'#########'" class="phone_number-input" @keyup.enter.native="sendMessage">
                        <template slot="prepend">+998</template>
                      </el-input>
                    </el-form-item>
<!--                    </el-col>-->
                    <el-col v-if="confirmDialog" :xs="210" :sm="120" :lg="23" :xl="23">
                      <el-form-item label="Kod" prop="code" class="me-lg-3">
                        <el-input ref="code" v-model="form.code" v-mask="'#####'" placeholder="SMS kodni kiriting" @keyup.enter.native="confirmation" />
                      </el-form-item>
                    </el-col>
                    <el-row v-if="confirmDialog || (!confirmDialog && !form.is_confirmed)" :xs="2" :sm="24" :lg="3" :xl="confirmDialog ? 3 : 4">
                      <el-form-item label=" ">
                        <el-button v-if="confirmDialog" :loading="loading === 'code'" type="primary" class="w-100 btn-main-color float-end" icon="el-icon-check" @click="confirmation">Tasdiqlash</el-button>
                        <el-button v-if="!confirmDialog" :loading="loading === 'send'" :disabled="startCountDown" type="primary" class="w-100 btn-main-color float-end" icon="el-icon-s-promotion" @click="sendMessage">SMS jo'natish {{ startCountDown ? '( ' + countdown + ' )' : '' }}</el-button>
                      </el-form-item>
                    </el-row>
                  </div>
                </el-form>
              </el-card>
            </el-col>
          </el-col>
        </el-row>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import { mapActions } from 'vuex'

export default {
  name: 'Choose',
  data() {
    return {
      is_disabled: true,
      validated: false,
      confirmDialog: false,
      startCountDown: false,
      loading: '',
      countdown: 60,
      goo: false,
      form: {
        phone_number: '',
        code: ''
      }
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
      confirmationAction: 'application/confirm'
    }),
    sendMessage() {
      if (!this.form.phone_number || this.form.phone_number.length !== 9) {
        this.$message.error('Telefon raqamini to`g`ri kiriting!')
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
    confirmation() {
      if (!this.form.code) {
        this.$message.error('Kodni kiriting!')
        return false
      }
      this.loading = 'code'
      this.confirmationAction({ phone_number: this.form.phone_number, code: this.form.code }).then((res) => {
        if (res.success) {
          this.form.is_confirmed = true
          this.confirmDialog = false
          this.$message.success('Muvaffaqiyatli tasdiqlandi!')
          this.$emit('phone_numberSuccess', true)
          this.goo = true
          this.$router.push({ name: 'ApplicationCreate' })
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

