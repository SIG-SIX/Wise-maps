import React, { useState, useEffect } from "react";
import "./App.css";
import Map from "./Map";
import { getPoints } from "../src/services/pointsService";

function App() {
  const [points, setPoints] = useState([]);

  const fetchData = async () => {
    try {
      const response = await getPoints();

      const uniqueCoordinates = new Set();

      response.pointsData.forEach((data) => {
        const coordinate = {
          lng: data._source.longitude,
          lat: data._source.latitude,
        };

        if (!uniqueCoordinates.has(JSON.stringify(coordinate))) {
          uniqueCoordinates.add(JSON.stringify(coordinate));
        }
      });

      const pointsToMap = Array.from(uniqueCoordinates).map((coord) =>
        JSON.parse(coord)
      );

      setPoints(pointsToMap);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(points);

  return (
    <div className="App">
      <h1>React Leaflet Map</h1>
      <Map points={points} />
    </div>
  );
}

export default App;
