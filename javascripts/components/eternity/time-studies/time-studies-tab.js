Vue.component("time-studies-tab", {
  mixins: [remMixin],
  data: function() {
    const layout = TimeStudyTreeLayout.instance;
    return {
      width: this.rem(layout.width),
      height: this.rem(layout.height + 10),
      studies: layout.studies,
      secretStudySetup: layout.secretStudy,
      connections: layout.connections,
      secretConnectionSetup: layout.secretStudyConnection
    };
  },
  computed: {
    tabStyleObject: function() {
      return {
        width: this.width,
        height: this.height
      };
    }
  },
  methods: {
    studyComponent(study) {
      switch (study.type) {
        case TimeStudyType.NORMAL: return "normal-time-study";
        case TimeStudyType.ETERNITY_CHALLENGE: return "ec-time-study";
        case TimeStudyType.DILATION: return "dilation-time-study";
      }
      throw "Unknown study type";
    }
  },
  template:
    `<div class="l-time-studies-tab" :style="tabStyleObject">
      <component
        v-for="(setup, index) in studies"
        :key="'study' + index"
        :setup="setup"
        :is="studyComponent(setup.study)"
      />
      <secret-time-study :setup="secretStudySetup" />
      <svg :style="tabStyleObject" class="l-time-study-connection">
        <time-study-connection
          v-for="(setup, index) in connections"
          :key="'connection' + index"
          :setup="setup"
        />
        <secret-time-study-connection :setup="secretConnectionSetup" />
      </svg>
      <tt-shop />
    </div>`
});

class TimeStudyRow {
  constructor(layout, items) {
    this.layout = layout;
    this.items = items;
  }

  get width() {
    const itemCount = this.items.length;
    const layout = this.layout;
    return itemCount * layout.itemWidth + (itemCount - 1) * layout.spacing;
  }

  itemPosition(column, treeLayout) {
    const layout = this.layout;
    const treeWidth = treeLayout.width;
    const rowLeft = (treeWidth - this.width) / 2;
    return rowLeft + column * layout.itemWidth + column * layout.spacing;
  }
}

class TimeStudyRowLayout {
  constructor(props) {
    this.itemWidth = props.itemWidth;
    this.itemHeight = props.itemHeight;
    this.spacing = props.spacing;
  }
}

class TimeStudyTreeLayout {
  constructor() {
    this.spacing = 4;

    const normalRowLayout = new TimeStudyRowLayout({
      itemWidth: 17,
      itemHeight: 8,
      spacing: 3
    });

    const wideRowLayout = new TimeStudyRowLayout({
      itemWidth: 12,
      itemHeight: 8,
      spacing: 0.6
    });
    const normalRow = (...items) => new TimeStudyRow(normalRowLayout, items);
    const wideRow = (...items) => new TimeStudyRow(wideRowLayout, items);

    const TS = id => TimeStudy(id);
    const EC = id => TimeStudy.eternityChallenge(id);

    /**
     * @type {TimeStudyRow[]}
     */
    this.rows = [
      normalRow(                       null,   TS(11),   null                         ),
      normalRow(                           TS(21), TS(22)                             ),
      normalRow(                   TS(33), TS(31), TS(32), null                       ),
      normalRow(                           TS(41), TS(42)                             ),
      normalRow(                       null,   TS(51),  EC(5)                         ),
      normalRow(                       null,   TS(61),  TS(62)                        ),
      normalRow(                      TS(71),  TS(72),  TS(73)                        ),
      normalRow(                      TS(81),  TS(82),  TS(83)                        ),
      normalRow(                      TS(91),  TS(92),  TS(93)                        ),
      normalRow(                      TS(101), TS(102), TS(103)                       ),
      normalRow(                       EC(7),  TS(111),  null                         ),
      normalRow(                      TS(121), TS(122), TS(123)                       ),
      normalRow(               EC(6), TS(131), TS(132), TS(133), EC(8)                ),
      normalRow(                      TS(141), TS(142), TS(143)                       ),
      normalRow(               null,   EC(9), TS(151),   null,   EC(4)                ),
      normalRow(                          TS(161), TS(162)                            ),
      normalRow(                               TS(171)                                ),
      normalRow(                         EC(1), EC(2), EC(3)                          ),
      normalRow(                               TS(181)                                ),
      normalRow(                               EC(10)                                 ),
      normalRow(             TS(191),          TS(192),          TS(193)              ),
      normalRow(                               TS(201)                                ),
      normalRow(    TS(211),          TS(212),          TS(213),          TS(214)     ),
      wideRow  (TS(221), TS(222), TS(223), TS(224), TS(225), TS(226), TS(227), TS(228)),
      normalRow(    TS(231),          TS(232),          TS(233),          TS(234)     ),
      normalRow(              EC(11),                             EC(12)              ),
      normalRow(                          TimeStudy.dilation                          ),
      normalRow(          TimeStudy.timeDimension(5), TimeStudy.timeDimension(6)      ),
      normalRow(          TimeStudy.timeDimension(7), TimeStudy.timeDimension(8)      ),
      normalRow(                          TimeStudy.reality                           ),
    ];

    /**
     * @type {TimeStudySetup[]}
     */
    this.studies = [];
    for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
      const row = this.rows[rowIndex];
      for (let columnIndex = 0; columnIndex < row.items.length; columnIndex++) {
        const study = row.items[columnIndex];
        if (study === null) continue;
        this.studies.push(new TimeStudySetup({
          study: study,
          row: rowIndex,
          column: columnIndex
        }));
      }
    }
    const secretStudy = {};
    this.secretStudy = new TimeStudySetup({
      study: secretStudy,
      row: 0,
      column: 2
    });

    /**
     * @type {TimeStudyConnectionSetup[]}
     */
    this.connections = TimeStudy.allConnections
      .map(c => new TimeStudyConnectionSetup(c));
    this.secretStudyConnection = new TimeStudyConnectionSetup(
      new TimeStudyConnection(TS(11), secretStudy)
    );

    this.width = this.rows.map(row => row.width).max();
    const heightNoSpacing = this.rows.map(r => r.layout.itemHeight).sum();
    this.height = heightNoSpacing + (this.rows.length - 1) * this.spacing;

    for (let study of this.studies) {
      study.setPosition(this);
    }
    this.secretStudy.setPosition(this);

    for (let connection of this.connections) {
      connection.setPosition(this.studies);
    }
    this.secretStudyConnection.setPosition(this.studies.concat(this.secretStudy));
  }

  itemPosition(row) {
    const rows = this.rows.slice(0, row);
    const heightNoSpacing = rows.map(r => r.layout.itemHeight).sum();
    return heightNoSpacing + rows.length * this.spacing;
  }

  static get instance() {
    if (this._instance === undefined) {
      this._instance = new TimeStudyTreeLayout();
    }
    return this._instance;
  }
}