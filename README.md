## Quick start

To run this locally:

1. Run `git clone https://github.com/Megaputer/external-components.git`
2. Go to directory with `cd external-components`
3. Run `yarn install`
4. Create an archive with widgets using the command `yarn archive`
5. To add widgets to a PA6, upload the archive (`./build/external-components.zip`) via the PolyAnalyst Administrative Tool

## List of examples:

- SimpleWidget - Example of using component by `html` and `scss`
- EditorPublicationWidget - Example of defining `editor` or `publication` mode with parameter `isEditor`
- AppearanceWidget - Example of how a widget works by save visual settings in appearance
- TableWidget - Example of displaying data using `SimpleTable` and work `EDD-expression`
- BarChartWidget - Example of using the `disctinct` handler, displaying results as a chart and EDD processing (by clicking a bar)
- StatisticsWidget - Example of using the handler `statistics` to get statistics from data
- Calendar - Example of using the `filter` handler, displaying results as a calendar and EDD processing (by clicking a date)
- OpenStreetMap - Example of displaying data on the map
