<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
        <header
          class="modal-header"
          id="modalTitle"
        >
          <slot name="header">
            Илтимос рад етиш сабабини танланг
          </slot>
          <button
            type="button"
            class="btn-close"
            @click="close"
            aria-label="Close modal"
          >
            x
          </button>
        </header>

        <section
          class="modal-body"
          id="modalDescription"
        >
          <slot name="body">
            <el-form
              ref="personal-form"
              label-position="top"
              class="top-label-custom"
              :rules="rules"
              :model="form"
            >
              <el-form-item :label="$t('Сабаблар')" prop="social_id">
                <template>
                  <el-select v-model="form.deny_reason_id" class="w-100" filterable value="social_status.id">
                    <el-option v-for="deny_reason in deny_reasons" :key="deny_reason.id" :label="deny_reason.name" :value="deny_reason.id" />
                  </el-select>
<!--                  <p>{{ (scope.row.social_status && scope.row.social_status.name) ? scope.row.social_status.name: '-&#45;&#45;' }}</p>-->
<!--                  {{filter.social_status}}-->
                </template>
              </el-form-item>
            </el-form>
          </slot>
        </section>
        <footer class="modal-footer">
          <button
            type="button"
            class="btn-green"
            @click="close(form.deny_reason)"
            aria-label="OK"
          >
            OK
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ModalDeny',
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
      rules: {
        pin: [
          { required: true, message: 'ЖШШИР киритилмаган', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({ social_statuses: 'application/GET_SOCIAL_STATUSES', deny_reasons: 'application/GET_DENY_REASONS' })
  },
  created() {
    this.fetchSocialStatuses()
    this.fetchDenyReasons()
  },
  mounted() {
    this.fetchDistricts({ region_id: this.user.region_id })
    this.fetchSocialStatuses()
    this.fetchDenyReasons()
  },
  methods: {
    ...mapActions({
      storeApplication: 'application/store',
      setForm: 'application/setForm',
      fetchDistricts: 'citizen/districts',
      fetchSocialStatuses: 'application/socialStatuses',
      fetchDenyReasons: 'application/denyReasons',

      fetchRegions: 'citizen/regions',
      fetchApplications: 'application/index'
    }),
    close() {
      // this.rejectApplication()
      this.$emit('close')
    },
    sendFilter() {
      this.filter.page = null
      this.loaded = false
      this.fetchApplications(this.filter).then((res) => {
        this.loaded = true
        // this.filter.limit = this.applications_pagination.limit
        // this.filter.page = this.applications_pagination.page
        // this.filter.total = this.applications_pagination.total
      })
    }
  }
}
</script>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #FFFFFF;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  color: #4AAE9B;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  flex-direction: column;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}
.modal-body > span {
  color: red;
}
.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: #4AAE9B;
  background: transparent;
}

.btn-green {
  color: white;
  background: #4AAE9B;
  border: 1px solid #4AAE9B;
  border-radius: 2px;
}
</style>
