## Quick start

To run this locally:

1. Run `git clone https://github.com/Megaputer/external-components.git`
2. Go to directory with `cd external-components`
3. Run `yarn`
4. Run `yarn dev`
5. Copy `build/DSWidget.js` to a PA6 installation directory by path `data/externals/DSWidget.js`
6. Edit `data/externals/wr-externals.json` inside PA6 installation directory which will contain `["DSWidget.js"]`


## List of examples:

- SimpleWidget - Example of using component by `html` and `scss`
- EditorPublicationWidget - Example of defining `editor` or `publication` mode with parameter `isEditor`
- AppearanceWidget - Example of how a widget works by save visual settings in appearance
- TableWidget - Example of displaying data using `SimpleTable` and work `EDD-expression`
- BarChartWidget - Example of using the `disctinct` handler, displaying results as a chart and EDD processing (by clicking a bar)
- StatisticsWidget - Example of using the handler `statistics` to get statistics from data
