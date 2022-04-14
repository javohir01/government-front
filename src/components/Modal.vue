<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
        <header
          class="modal-header"
          id="modalTitle"
        >
          <slot name="header">
            Бу сизнинг шахсий "ID" ва "Code"ингиз <br> Аризани текшириш учун эслаб қолинг
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
            ID: {{ check_details }}
          </slot>
        </section>

        <footer class="modal-footer">
          <slot name="footer">
            Code: {{ 'code' }}
          </slot>
          <button
            type="button"
            class="btn-green"
            @click="close"
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

import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'Modal',
  data() {
    return {
      number: this.check_details.number,
      code: this.check_details.code
    }
  },
  computed: {
    ...mapGetters({ check_details: 'application/GET_CHECK_DETAILS' })
  },
  mounted() {
    this.check_details()
    this.fetchDistricts({ region_id: this.user.region_id })
    this.fetchSocialStatuses()
  },
  methods: {
    ...mapActions({
      // getNumber: 'application/getNumber',
      storeApplication: 'application/store',
      updateCitizen: 'citizen/update',
      setForm: 'application/setForm',
      fetchDistricts: 'citizen/districts',
      fetchSocialStatuses: 'citizen/socialStatuses',
      fetchRegions: 'citizen/regions'
    }),
    close() {
      this.$emit('close')
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
