import { StatisticsWidget } from 'statistics/StatisticsWidget';
import { DSWidgetTable } from 'table/TableWidget';
import { SimpleWidget } from 'simple/SimpleWidget';
import { EditorPublicationWidget } from 'EditorPublicationWidget';
import { AppearanceWidget } from 'appearance/AppearanceWidget';
import { BarChartWidget } from 'barchart/BarChartWidget';
import { CalendarWidget } from 'calendar/CalendarWidget';

export function getDSWidgets() {
  return [
    {
      viewType: 'simple-widget',
      name: 'Simple external widget',
      create: () => new SimpleWidget()
    },
    {
      viewType: 'editor-publication-widget',
      name: 'Mode: editor, publication in widget',
      create: (args: WidgetArgs) => new EditorPublicationWidget(args)
    },
    {
      viewType: 'appearance-widget',
      name: 'Sample work with appearance',
      create: (args: WidgetArgs) => new AppearanceWidget(args)
    },
    {
      viewType: 'table-widget',
      name: 'Basic table widget',
      create: (args: WidgetArgs) => new DSWidgetTable(args)
    },
    {
      viewType: 'barchart-widget',
      name: 'Barchart external widget',
      create: (args: WidgetArgs) => new BarChartWidget(args)
    },
    {
      viewType: 'stats-widget',
      name: 'Statistics widget',
      create: (args: WidgetArgs) => new StatisticsWidget(args)
    },
    {
      viewType: 'calendar-widget',
      name: 'Calendar widget',
      create: (args: WidgetArgs) => new CalendarWidget(args)
    }
  ];
}
