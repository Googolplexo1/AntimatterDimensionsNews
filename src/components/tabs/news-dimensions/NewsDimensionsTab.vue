<script>
import PrimaryButton from "@/components/PrimaryButton";
import NewsDimensionRow from "./NewsDimensionRow";
import NewsBoostRow from "./NewsBoostRow";
import PaperclipAscensionRow from "./PaperclipAscensionRow";

import { NewsDimensions } from "@/core/dimensions/news-dimension";

export default {
  name: "NewsDimensionsTab",
  components: {
    PrimaryButton,
    NewsDimensionRow,
    NewsBoostRow,
    PaperclipAscensionRow
  },
  data() {
    return {
      paperclips: new Decimal(0),
      newsSpeed: 0,
    };
  },
  methods: {
    update() {
      this.paperclips.copyFrom(Currency.paperclips);
      this.newsSpeed = NewsDimensions.speed();
    },
    maxAll() {
      maxAllNewsDimensions();
    }
  }
};
</script>

<template>
  <div class="l-news-dim-tab l-centered-vertical-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Max all
      </PrimaryButton>
    </div>
    <div>
      <p>
        You have <span class="c-news-dim-description__accent">{{ formatInt(paperclips) }}</span> {{ pluralize("paperclip", paperclips) }}.
      </p>
      <p>
        The 1st News Dimension is producing <span class="c-news-dim-description__accent">{{ format(newsSpeed, 1, 1) }}</span> hectopixels of news per second.
      </p>
    </div>
    <div class="l-dimensions-container">
      <NewsDimensionRow
        v-for="tier in 4"
        :key="tier"
        :tier="tier"
      />
    </div>
    <div class="resets-container">
      <PaperclipAscensionRow/>
      <NewsBoostRow/>
    </div>
  </div>
</template>
