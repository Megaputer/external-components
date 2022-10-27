## Quick start

To run this locally:

1. Run `git clone https://github.com/Megaputer/external-components.git`
2. Install all dependencies using `yarn` or `npm install`
3. Create symbolic link from `./data/externals` to `./external-components/build`
4. Create file `wr-externals.json` in folder `buid` contain `["DSWidget.js"]`. A file `DSWidget.js` contain the compiled sources of external widgets.
5. Start the development server using `yarn dev:watch` or `npm run dev:watch`
6. Build external components using `yarn dev` or `npm run dev`


## List of examples:

- SimpleWidget - Example of using component by `html` and `scss`
- EditorPublicationWidget - Example of defining `editor` or `publication` mode with parameter `isEditor`
- AppearanceWidget - Example of how a widget works by save visual settings in appearance
- TableWidget - Example of displaying data using `SimpleTable` and work `EDD-expression`
- BarChartWidget - Example of using the `disctinct` handler, displaying results as a chart and EDD processing (by clicking a bar)
- StatisticsWidget - Example of using the handler `statistics` to get statistics from data
