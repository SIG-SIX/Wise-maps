import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import "leaflet-draw";

function Map({ points }) {
  const [pointsInShape, setPointsInShape] = useState([]);

  useEffect(() => {
    const map = L.map("map").setView([45.9432, 24.9668], 7); // Set the initial view to Romania

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map
    );

    const drawnItemsGroup = new L.FeatureGroup();
    map.addLayer(drawnItemsGroup);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItemsGroup,
      },
      draw: {
        polygon: true,
        circle: false,
        polyline: false,
        rectangle: true,
        marker: false,
        circlemarker: false,
      },
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (event) => {
      const layer = event.layer;
      drawnItemsGroup.addLayer(layer);

      if (layer instanceof L.Circle || layer instanceof L.Polygon) {
        const shape = layer.toGeoJSON();
        const shapeLayer = L.geoJSON(shape);
        const shapeBounds = shapeLayer.getBounds();

        const pointsInShape = points.filter((point) => {
          const latLng = L.latLng(point.lat, point.lng);
          return shapeBounds.contains(latLng);
        });

        setPointsInShape(pointsInShape);
      }
    });

    return () => {
      map.remove();
    };
  }, [points]);

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "500px" }}></div>
      <div>
        <h2>Coordonate gasite:</h2>
        <p>Total Results: {pointsInShape.length}</p>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Latitude</th>
                <th>Longitude</th>
              </tr>
            </thead>
            <tbody>
              {pointsInShape.map((point, index) => (
                <tr key={index}>
                  <td>{point.lat}</td>
                  <td>{point.lng}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Map;
