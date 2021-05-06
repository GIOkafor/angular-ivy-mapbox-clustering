import { Component, VERSION } from "@angular/core";
import * as mapboxgl from "mapbox-gl";
import MapboxglSpiderifier from "@bewithjonam/mapboxgl-spiderifier";

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
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });

    this.spiderifier = new MapboxglSpiderifier(this.map, {
      onClick: function(e, spiderLeg) {
        console.log("Clicked on ", spiderLeg);
      },
      markerWidth: 40,
      markerHeight: 40
    });

    this.map.on("style.load", function() {
      this.spiderifier.spiderfy([-74.5, 40], this.features);
    });

    this.map.on("click", function() {
      this.spiderifier.unspiderfy();
    });
  }
}
