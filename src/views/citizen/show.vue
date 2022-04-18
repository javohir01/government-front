<template>
  <div class="container">
    <router-link :to="{ name:'CitizensIndex', query: { type: $route.query.type } }">
      <el-button type="text" class="mb-1" icon="el-icon-arrow-left">{{ $t('Рўйҳатга қайтиш') }}</el-button>
    </router-link>
    <div class="bg-white box-shadow p-4">
      <el-table
        class="table-custom"
        :data="formdata"
        border
      >
        <el-table-column
          :label="$t('Номи')"
          prop="name"
          width="300"
          class="font-weight-bold"
    />
        <el-table-column
          prop="value"
          :label="$t('Қиймати')"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'CitizenShow',
  computed: {
    ...mapGetters({ citizen: 'citizen/GET_CITIZEN' }),
    formdata() {
      return [
        {
          name: this.$t('ФИО'),
          value: [this.citizen.l_name, this.citizen.f_name, this.citizen.m_name].join(' ')
        },
        {
          name: this.$t('Паспорт'),
          value: this.citizen.passport
        },
        {
          name: this.$t('ЖШШИР'),
          value: this.citizen.pin
        },
        {
          name: this.$t('Ҳудуд'),
          value: this.citizen.region.name_cyrl
        },
        {
          name: this.$t('Туман(Шахар)'),
          value: this.citizen.district.name_cyrl
        },
        {
          name: this.$t('Манзили'),
          value: this.citizen.address
        },
        {
          name: this.$t('туғилган куни'),
          value: this.citizen.birth_date
        },
        {
          name: this.$t('Ижтимоий холати'),
          value: this.citizen.social_status.name
        }
      ]
    }
  },
  mounted() {
    this.fetchCitizen(this.$route.params.id)
  },
  methods: {
    ...mapActions({ fetchCitizen: 'citizen/show' })
  }
}
</script>
