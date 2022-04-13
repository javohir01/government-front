<template>
  <div class="header">
    <div class="w-100 bg-white py-2">
      <div class="container bg-white">
        <div class="d-flex justify-content-between">
          <div class="d-flex" style="font-size: 14px">
            <img alt="logo" src="@/assets/images/small-calendar.svg" height="14px" class="mr-2 mt-1"> Сана: {{ date }} г.
          </div>
          <div v-if="is_auth" class="d-flex" style="cursor: pointer" @click="logoutHandle()">
            {{ $t('Тизимдан чиқиш') }} <img alt="logo" src="@/assets/images/logout.svg" height="14px" class="ml-2 mt-1">
          </div>
          <div v-else class="d-flex" style="cursor: pointer" @click="loginAdmin()">
            {{ $t('Aдминистраторлар учун кириш') }}
            <img
                alt="logo"
                src="@/assets/images/login.svg"
                height="14px"
                class="ml-2 mt-1"
            >
          </div>
        </div>
      </div>
    </div>
    <el-menu
      class="el-menu-custom px-1"
      mode="horizontal"
      active-text-color="#fff"
      text-color="#fff"
      background-color="#3186FB"
      @select="handleSelect"
    >
      <el-menu-item index="1" class="d-none d-sm-none d-md-block"><router-link :to="'/'"> <img alt="logo" width="300px" height="60px" src="@/assets/images/logouz.png"> </router-link></el-menu-item>
      <el-menu-item v-if="is_auth" index="3" style="float: right;">{{ user.login }}</el-menu-item>
      <el-submenu index="2" style="float: right;">
        <template slot="title">
          {{ selectedLanguage }}
        </template>
        <el-menu-item index="2-1" @click="selectedLanguage = 'O\'zbekcha'">O'zbekcha</el-menu-item>
        <el-menu-item index="2-1" @click="selectedLanguage = 'Ўзбекча'">Ўзбекча</el-menu-item>
        <el-menu-item index="2-1" @click="selectedLanguage = 'Русский'">Русский</el-menu-item>
      </el-submenu>
      <router-link v-if="is_auth" :to="{name: 'CitizensIndex'}">
        <el-menu-item index="10" style="float: right; line-height: 90px; height: 90px;">
          {{ $t('Aсосий рўйхат') }}
        </el-menu-item>
      </router-link>
      <router-link v-if="is_auth" :to="{name: 'RegionReport'}">
        <el-menu-item index="10" style="float: right; line-height: 90px; height: 90px;">
          <i class="el-icon-reading text-white" /> Ҳисобот
        </el-menu-item>
      </router-link>
      <router-link v-if="!is_auth" :to="{name: 'ApplicationCheck'}">
        <el-menu-item index="10" style="float: right; line-height: 90px; height: 90px;">
          <i class="el-icon-reading text-white" /> Ариза ҳолатини текшириш
        </el-menu-item>
      </router-link>
    </el-menu>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Header',
  data() {
    return {
      selectedLanguage: 'Ўзбекча',
      authServiceLink: process.env.VUE_APP_AUTH_SERVICE_URL
    }
  },
  computed: {
    ...mapGetters({ is_auth: 'auth/GET_IS_AUTH', user_full_name: 'auth/USER_FULL_NAME', user: 'auth/USER' }),
    date() {
      var today = new Date()
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
      var yyyy = today.getFullYear()
      return dd + '.' + mm + '.' + yyyy
    }
  },
  methods: {
    ...mapActions({ logout: 'auth/logout' }),
    handleSelect(index, indexPath) {
      console.log(index)
    },
    loginAdmin() {
      this.$router.push({ name: 'Login' })
    },
    loginViaAuthService() {
      window.location = String(this.authServiceLink).replace('[domain]', window.location.hostname)
    },
    logoutHandle() {
      this.logout()
        .then(res => {
          var fullUrl = window.location.origin + '/' + this.$router.resolve({ name: 'Login' }).href
          window.location = fullUrl
        })
    }
  }
}
</script>
