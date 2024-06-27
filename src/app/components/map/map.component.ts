import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {
  private map: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadLeaflet();
    }
  }

  private async loadLeaflet() {
    const L = await import('leaflet');
    this.initMap(L);
  }

  private initMap(L: any): void {
    // this.map = L.map('map').setView([51.505, -0.09], 13);
    this.map = L.map('map').setView([39.75621, -104.99404], 3);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // L.marker([51.5, -0.09]).addTo(this.map)
    // L.marker([39.75621, -104.99404]).addTo(this.map)
    //   .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    //   .openPopup();

    var circle = L.circle([51.508, -0.11], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(this.map);

    var polygon = L.polygon([
      [51.509, -0.08],
      [51.503, -0.06],
      [51.51, -0.047]
    ]).addTo(this.map);

    circle.bindPopup("I am a circle.");
    polygon.bindPopup("I am a polygon.");

    const onMapClick = (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      // Create a marker at the clicked location
      const marker = L.marker([lat, lng]).addTo(this.map);
      // Create a popup with the latitude and longitude information
      const popupContent = `Latitude: ${lat}<br>Longitude: ${lng}`;
      // Bind the popup to the marker
      marker.bindPopup(popupContent).openPopup();
    }

    // this.map.on('click', onMapClick);

    var geojsonFeature = {
      "type": "Feature",
      "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
      }
    };

    L.geoJSON(geojsonFeature).addTo(this.map);

    var myLines = [{
      "type": "LineString",
      "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
    }, {
      "type": "LineString",
      "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
    }];

    L.geoJSON(myLines).addTo(this.map);

    var states = [{
      "type": "Feature",
      "properties": {
        "party": "Republican",
        "description": "This area is governed by the Republican party."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-104.05, 48.99],
          [-97.22, 48.98],
          [-96.58, 45.94],
          [-104.03, 45.94],
          [-104.05, 48.99]
        ]]
      }
    }, {
      "type": "Feature",
      "properties": {
        "party": "Democrat",
        "description": "This area is governed by the Democrat party."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-109.05, 41.00],
          [-102.06, 40.99],
          [-102.03, 36.99],
          [-109.04, 36.99],
          [-109.05, 41.00]
        ]]
      }
    }];

    L.geoJSON(states, {
      style: function (feature: any) {
        switch (feature.properties.party) {
          case 'Republican': return { color: "#ff0000" };
          case 'Democrat': return { color: "#0000ff" };
          default: return { color: "#808080" };
        }
      },
      onEachFeature: function (feature: any, layer: any) {
        if (feature.properties && feature.properties.description) {
          layer.bindPopup(feature.properties.description);
        }
      }
    }).addTo(this.map);

    var geojsonMarkerOptions = {
      radius: 8,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };

    var circleFeature = {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "properties": {
          "name": "Dinagat Islands",
          "description": "Dinagat Islands"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [125.6, 10.4]
        }
      }]
    };

    L.geoJSON(circleFeature, {
      pointToLayer: function (feature: any, latlng: any) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      },
      onEachFeature:
        function (feature: any, layer: any) {
          if (feature.properties && feature.properties.description) {
            layer.bindPopup(feature.properties.description);
          }
        }
    }).addTo(this.map);

    function onEachFeature(feature: any, layer: any) {
      // does this feature have a property named popupContent?
      if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
      }
    }

    var someFeatures = [{
      "type": "Feature",
      "properties": {
        "name": "Coors Field",
        "show_on_map": true
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
      }
    }, {
      "type": "Feature",
      "properties": {
        "name": "Busch Field",
        "show_on_map": false
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
      }
    }];

    L.geoJSON(someFeatures, {
      filter: function (feature: any, layer: any) {
        return feature.properties.show_on_map;
      }
    }).addTo(this.map);

    // Create markers for cities
    var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
      denver = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
      aurora = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
      golden = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');

    var cities = L.layerGroup([littleton, denver, aurora, golden]);

    // Create markers for parks
    var crownHill = L.marker([39.75, -105.09]).bindPopup('This is Crown Hill Park.'),
      rubyHill = L.marker([39.68, -105.00]).bindPopup('This is Ruby Hill Park.');

    var parks = L.layerGroup([crownHill, rubyHill]);

    // Add layer control for only the overlay layers
    var overlayMaps = {
      "Cities": cities,
      "Parks": parks
    };

    var layerControl = L.control.layers(null, overlayMaps).addTo(this.map);

  }
}
