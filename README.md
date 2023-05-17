## Quick start

To run this locally:

1. Run `git clone https://github.com/Megaputer/external-components.git`
2. Go to directory with `cd external-components`
3. Run `yarn dist`
4. Copy `build/MyWidgets.js` to a `<PA6 installation directory>/data/externals/MyWidgets.js` or use parameter `--output-path` for set output location of the bundle file.
 Example: `yarn dist:watch --output-path=\"C:/Megaputer Intelligence/PolyAnalyst 6.5 Server 64-bit/data/externals\"`
5. Edit `data/externals/wr-externals.json` inside PA6 installation directory which will contain `["DSWidget.js"]`


## List of examples:

- SimpleWidget - Example of using component by `html` and `scss`
- EditorPublicationWidget - Example of defining `editor` or `publication` mode with parameter `isEditor`
- AppearanceWidget - Example of how a widget works by save visual settings in appearance
- TableWidget - Example of displaying data using `SimpleTable` and work `EDD-expression`
- BarChartWidget - Example of using the `disctinct` handler, displaying results as a chart and EDD processing (by clicking a bar)
- StatisticsWidget - Example of using the handler `statistics` to get statistics from data
