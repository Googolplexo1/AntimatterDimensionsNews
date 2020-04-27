"use strict";

Vue.component("autobuyer-toggles", {
  data() {
    return {
      autobuyersOn: false,
      bulkOn: false
    };
  },
  watch: {
    autobuyersOn(newValue) {
      player.options.autobuyersOn = newValue;
    },
    bulkOn(newValue) {
      player.options.bulkOn = newValue;
    }
  },
  methods: {
    update() {
      this.autobuyersOn = player.options.autobuyersOn;
      this.bulkOn = player.options.bulkOn;
    },
    toggleAllAutobuyers() {
      const allAutobuyersDisabled = Autobuyers.unlocked.every(autobuyer => !autobuyer.isActive);
      if (allAutobuyersDisabled) {
        for (const autobuyer of Autobuyers.unlocked) {
          autobuyer.isActive = true;
        }
      } else {
        for (const autobuyer of Autobuyers.unlocked) {
          autobuyer.isActive = false;
        }
      }
    }
  },
  template:
    `<div class="c-subtab-option-container">
      <primary-button-on-off-custom
        v-model="autobuyersOn"
        on="Disable autobuyers"
        off="Enable autobuyers"
        class="o-primary-btn--subtab-option"
      />
      <primary-button
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers()">
        Toggle all autobuyers
      </primary-button>
      <primary-button-on-off-custom
        v-model="bulkOn"
        on="Disable bulk buy"
        off="Enable bulk buy"
        class="o-primary-btn--subtab-option"
      />
    </div>`
});
