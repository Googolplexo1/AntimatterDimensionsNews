import GlyphComponent from "@/components/GlyphComponent";

Vue.component("glyph-inventory", {
  components: {
    GlyphComponent
  },
  data() {
    return {
      inventory: [],
      newGlyphs: [],
      doubleClickTimeOut: null,
      clickedGlyphId: null,
      glyphSacrificeUnlocked: false,
      protectedRows: 0,
    };
  },
  created() {
    this.on$(GAME_EVENT.GLYPHS_CHANGED, this.glyphsChanged);
    this.glyphsChanged();
  },
  computed: {
    rowCount: () => Glyphs.totalSlots / 10,
    colCount: () => 10,
  },
  methods: {
    update() {
      this.glyphSacrificeUnlocked = GlyphSacrificeHandler.canSacrifice;
      this.protectedRows = player.reality.glyphs.protectedRows;
      this.newGlyphs = Glyphs.unseen;
    },
    toIndex(row, col) {
      return (row - 1) * this.colCount + (col - 1);
    },
    allowDrag(event) {
      if (event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) event.preventDefault();
    },
    drop(idx, event) {
      const id = parseInt(event.dataTransfer.getData(GLYPH_MIME_TYPE), 10);
      if (isNaN(id)) return;
      const glyph = Glyphs.findById(id);
      if (!glyph) return;
      Glyphs.moveToSlot(glyph, idx);
    },
    removeGlyph(id, force) {
      GlyphSacrificeHandler.removeGlyph(Glyphs.findById(id), force);
    },
    clickGlyph(col, id) {
      const glyph = Glyphs.findById(id);
      // If single click
      if (!this.doubleClickTimeOut) {
        this.doubleClickTimeOut = setTimeout(() => {
          this.clickedGlyphId = null;
          this.doubleClickTimeOut = null;
        }, 200);
        this.clickedGlyphId = id;
        if (!glyph) return;
        if (glyph.symbol === "key266b") {
          new Audio(`audio/note${col}.mp3`).play();
        }
      // Else it's double click, so equip a glyph
      } else if (this.clickedGlyphId === id) {
        clearTimeout(this.doubleClickTimeOut);
        this.doubleClickTimeOut = null;
        const idx = Glyphs.active.indexOf(null);
        if (idx !== -1) Glyphs.equip(glyph, idx);
      }
    },
    glyphsChanged() {
      this.inventory = Glyphs.inventory.map(GlyphGenerator.copy);
    },
    slotClass(index) {
      return index < Glyphs.protectedSlots ? "c-glyph-inventory__protected-slot" : "c-glyph-inventory__slot";
    },
    isNew(index) {
      return player.options.showNewGlyphIcon && this.newGlyphs.includes(this.inventory[index].id);
    }
  },
  template: `
    <div class="l-glyph-inventory">
      Click and drag or double-click to equip Glyphs.
      <div
        v-for="row in rowCount"
        class="l-glyph-inventory__row"
        :key="protectedRows + row"
      >
        <div
          v-for="col in colCount"
          class="l-glyph-inventory__slot"
          :class="slotClass(toIndex(row, col))"
          @dragover="allowDrag"
          @drop="drop(toIndex(row, col), $event)"
        >
          <GlyphComponent
            v-if="inventory[toIndex(row, col)]"
            :glyph="inventory[toIndex(row, col)]"
            :isNew="isNew(toIndex(row, col))"
            :showSacrifice="glyphSacrificeUnlocked"
            :draggable="true"
            @shiftClicked="removeGlyph($event, false)"
            @ctrlShiftClicked="removeGlyph($event, true)"
            @clicked="clickGlyph(col, $event)"
          />
        </div>
      </div>
    </div>`
});
