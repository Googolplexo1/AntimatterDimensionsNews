"use strict";

Vue.component("dimboost-autobuyer-box", {
  data() {
    return {
      limitDimBoosts: false,
      isBulkBuyUnlocked: false,
      isBuyMaxUnlocked: false
    };
  },
  watch: {
    limitDimBoosts(newValue) {
      this.autobuyer.limitDimBoosts = newValue;
    }
  },
  computed: {
    autobuyer: () => Autobuyer.dimboost
  },
  methods: {
    update() {
      this.isBulkBuyUnlocked = this.autobuyer.isBulkBuyUnlocked;
      this.isBuyMaxUnlocked = this.autobuyer.isBuyMaxUnlocked;
      this.limitDimBoosts = this.autobuyer.limitDimBoosts;
    }
  },
  template: `
    <autobuyer-box :autobuyer="autobuyer" :showInterval="!isBuyMaxUnlocked" name="Automatic Dimension Boosts">
      <autobuyer-interval-button slot="intervalSlot" :autobuyer="autobuyer" />
      <template :slot=" isBuyMaxUnlocked ? 'toggleSlot' : 'intervalSlot' " style="margin-top: 1.2rem;">
        <div
          class="o-autobuyer-toggle-checkbox c-autobuyer-box__small-text"
          style="margin-top: 1.2rem;"
          @click="limitDimBoosts = !limitDimBoosts"
        >
          <input type="checkbox" :checked="limitDimBoosts" />
          <span>Limit Dimension Boosts to:</span>
        </div>
        <autobuyer-input
          :autobuyer="autobuyer"
          type="int"
          property="maxDimBoosts"
        />
      </template>
      <template :slot=" isBuyMaxUnlocked ? 'checkboxSlot' : 'toggleSlot' ">
        <div class="c-autobuyer-box__small-text" style="height: 3rem;">
          Antimatter Galaxies required to always Dimension Boost,
          ignoring the limit:
        </div>
        <autobuyer-input
          :autobuyer="autobuyer"
          type="int"
          property="galaxies"
        />
      </template>
      <template v-if="isBuyMaxUnlocked" slot="intervalSlot">
        <div class="c-autobuyer-box__small-text" style="margin-top: 1.2rem;">Activates every X seconds:</div>
        <autobuyer-input
          :autobuyer="autobuyer"
          type="float"
          property="buyMaxInterval"
        />
      </template>
      <template v-else-if="isBulkBuyUnlocked" slot="checkboxSlot">
        <div class="c-autobuyer-box__small-text" style="margin-top: 1.2rem;">Bulk Dimension Boost Amount:</div>
        <autobuyer-input
          :autobuyer="autobuyer"
          type="int"
          property="bulk"
        />
      </template>
    </autobuyer-box>`
});
