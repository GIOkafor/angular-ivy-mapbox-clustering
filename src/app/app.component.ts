import { Component, VERSION } from "@angular/core";
import * as mapboxgl from "mapbox-gl";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular " + VERSION.major;
  map: mapboxgl.Map;

  features = [
    { id: 0, type: "car", color: "red" },
    { id: 1, type: "bicycle", color: "#ff00ff" },
    { id: 2, type: "bus", color: "blue" },
    { id: 3, type: "cab", color: "orange" },
    { id: 4, type: "train", color: "red" }
  ];

  spiderifier: any;

  ngOnInit() {
    this.map = new mapboxgl.Map({
      accessToken:
        "pk.eyJ1IjoiaXlrMzAwc3RhY2tzIiwiYSI6ImNqd3VuMGI4azAzbGU0OXF6enJld2Nuem8ifQ.jGtol4PJuK1vHxXp9s78Lg",
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [-103.59179687498357, 40.66995747013945], // starting position [lng, lat]
      zoom: 5 // starting zoom
    });

    this.map.on("load", function(e) {
      e.target.addSource("earthquakes", {
        type: "geojson",
        data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      });

      e.target.addLayer({
        id: "clusters",
        type: "circle",
        source: "earthquakes",
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1"
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });

      e.target.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "earthquakes",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12
        }
      });

      e.target.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "earthquakes",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#da5b11",
          "circle-radius": 5,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff"
        }
      });
    });

    this.map.on("click", "clusters", function(e: any) {
      const features = e.target.queryRenderedFeatures(e.point, {
        layers: ["clusters"]
      });

      const clusterId = features[0].properties.cluster_id;

      e.target
        .getSource("earthquakes")
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          e.target.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
          });
        });
    });

    this.map.on("click", "unclustered-point", (e: any) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const mag = e.features[0].properties.mag;
      let tsunami;

      if (e.features[0].properties.tsunami === 1) tsunami = "yes";
      else tsunami = "no";

      // Ensure that if the map is zoomed out such that
      // multiple copies of the feature are visible, the
      // popup appears over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML("magnitude: " + mag + "<br>Was there a tsunami?: " + tsunami)
        .addTo(this.map);
    });
  }
}
