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
          <el-col :xs="24" :sm="12" :lg="12" :xl="12" class="mr-10" style="padding-right:20px">
            <el-col :span="24" class="p-5">
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
                    <el-form-item label="Number" prop="number">
                      <el-input ref="number" v-model="form.number" v-mask="'######'" placeholder="ID ни киритинг" class="me-lg-3" />
                    </el-form-item>
                    <el-col :xs="210" :sm="120" :lg="23" :xl="23">
                      <el-form-item label="Code" prop="code" class="me-lg-3">
                        <el-input ref="code" v-model="form.code" v-mask="'#####'" placeholder="Code ни киритинг" />
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="3" :xl="4">
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
            {{ application.status == 1 ? 'Сизнинг аризангиз ' + application.district + ' ҳокими томонидан тасдиқланди' :
              (application.status == 2 ? 'Сизнинг аризангиз ' + application.district + ' ҳокими томонидан рад етилган' :
                  'Сизнинг аризангиз ' + application.district + ' ҳокими томонидан текширилмоқда') }}
          </p>
          <hr>
          <div v-if="application.status === 1 && application.updated_at">
            <p class="checkLabelMobile"><b>Tasdiqlangan sana</b>: </p>
            <p> {{ application.updated_at }}</p>
            <hr>
          </div>
          <div v-if="application.status == 2">
            <p class="checkLabelMobile"><b>Rad etish sababi</b>:</p>
            <p>{{ application.deny_reason }}</p>
            <p class="checkLabelMobile"><b>Izoh</b>:</p>
            <p>{{ application.deny_reason_comment ? application.deny_reason_comment : '-' }}</p>
  <!--            <p class="checkLabelMobile"><b>Rad etilgan sana</b>: </p>-->
  <!--            <p>{{ application.updated_at }}</p>-->
            <hr>
          </div>
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
        updated_at: '',
        deny_reason: '',
        deny_reason_comment: null,
        comment: '',
        district: '',
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
    backRoute() {
      this.$router.push({ name: 'ApplicationCheck' })
      this.isShow = false
    },
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
          if (res.result.application) {
            this.isShow = true
            const application = res.result.application
            this.application.status = application.status
            this.application.district = application.district.name_cyrl
            this.application.fullname = [application.l_name, application.f_name, application.m_name].join(' ')
            this.application.address = (application.region ? application.region.name_cyrl : '') + ', ' + (application.district ? application.district.name_cyrl : '')
            this.application.confirmed_by_name = application.confirmed_by_name
            this.application.updated_at = application.updated_at ? application.updated_at.split('-').reverse().join('.') : '-'
            this.application.deny_reason = application.deny_reason ? application.deny_reason.name : '-'
            this.application.deny_reason_comment = application.deny_reason_comment
          } else {
            Swal.fire({
              title: 'Ma\'lumot topilmadi. ID yoki kodni tekshirib qaytadan kiriting',
              type: 'error',
              timer: 4000,
              showConfirmButton: true,
              confirmButtonText: 'Qaytadan kiritish'
            })
          }
          this.isLoading = false
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
.applicationCheckTable{
  flex-direction: column;
  align-items: flex-start;
  padding: 24px 0px;
  position: static;
  width: 1108px;
  min-height: 497px;
  left: 166px;
  top: 222px;
  background: #FFFFFF;
  border-radius: 4px;
  flex: none;
  order: 1;
  flex-grow: 0;
  margin: 88px 0px;
}
.applicationCheckTableMobile{
  flex-direction: column;
  align-items: flex-start;
  padding: 12px 12px 24px;
  position: static;
  width: 290px;
  min-height: 404px;
  left: 15px;
  top: 108px;
  background: #FFFFFF;
  border-radius: 8px;
  flex: none;
  order: 1;
  flex-grow: 0;
  margin: 32px auto;
}
.applicationCheckBackButton {
  position: static;
  width: 170px;
  height: 24px;
  left: 70px;
  top: 0px;
  font-family: 'SF-UI-Display';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2px;
  color: #0083FC;
  flex: none;
  order: 1;
  flex-grow: 0;
  margin: 0px 6px;
}
.applicationCheckBackButtonMobile {
  position: static;
  width: 100px;
  height: 17px;
  left: 24px;
  top: 0.5px;
  cursor: pointer;
  /* Small Medium */

  font-family: 'SF-UI-Display';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
  /* identical to box height, or 142% */

  text-align: center;
  letter-spacing: 0.2px;

  /* color/blue */

  color: #0083FC;

  /* Inside Auto Layout */

  flex: none;
  order: 1;
  flex-grow: 0;
  margin: 0px 6px;
}
.hrLine{
  width: 1108px;
  height: 0px;
  left: 0px;
  top: 72px;
  opacity: 0.2;
  border: 1px solid #66BFFF;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  margin: 32px 0px;
}
table, td, th {
  border: 1px solid #99D4FF;
  text-align: left;
}
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  padding: 24px;
}
.tableAppCheck{
  margin: 24px 95px 24px 95px;
  width: 918px;
}
.checkLabelMobile{
  height: 14px;
  left: 0px;
  top: 0px;
  font-family: 'SF-UI-Display';
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 14px;
  /* identical to box height, or 140% */

  letter-spacing: 0.2px;
  font-feature-settings: 'pnum' on, 'lnum' on;

  /* $-gray/$-gray-400 */

  color: #858585;

  /* Inside Auto Layout */

  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 6px 0px;
}
.ms-7R{
  margin-left: 7rem !important;
}
@media (max-width: 300px){
  .alert_succ_text {
    width: 200px;
    font-size: 16px;
  }
  .appPrimaryButton{
    width: 157px;
    font-size: 10px;
    padding: 5px;
  }
}
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
