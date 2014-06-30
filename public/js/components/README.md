

   body

   	header
   		navbar
   			ul
   				li
   					a

   	templateContainer
   		rawView ← changes:extent
   			tripInfo
   			sensorCharts [dp]
   				chart
   				chart
   				chart
   			sensorTables [dp]
   				table
   				table
   				table
   			harBrush [dp]
   				brush

   	footer



[dp] data provider

[rawView] orchestriert zwischen angular und react. kein data provider.

[sensorCharts, sensorTables, harBrush] sind data provider, d.h. sie bereiten die zu rendernden daten für d3 vor.

[chart, table, brush] sind kleinere komponenten, in denen möglichst abstrakt die letztendliche arbeit getan wird.
















RawView.jsx
-----------

### Default Props:

- 






























React Components
================

Raw View
--------

```
RawView
	SensorChart
		ChartInfo
		Chart
			Path
			Circles
			Brush
```

# RawView.jsx

Props:

Default Props:

State: