import { useMemo } from 'react';
import styled from "styled-components";
import * as turf from "@turf/turf";
import CanvasJSReact from "../assets/lib/canvasjs.react.js";
const { CanvasJSChart } = CanvasJSReact;

const StyledElevationProfile = styled.header`
  display: flex;
  justify-content: center;
  height: 20%;
`;

export default function ElevationProfile({ selectedTrail }) {
  // Returns an array of objects containing information about a coordinate's
  // elevation and distance from the beginning of the trail
  const calculateCoordinateDistances = (coordinateData) => {
    if (Object.keys(coordinateData).length === 0) return [];
    const output = [];
    for (let i = 0; i < coordinateData.geometry.coordinates[0].length; i++) {
      const previousCoordinate = coordinateData.geometry.coordinates[0][i - 1];
      const currentCoordinate = coordinateData.geometry.coordinates[0][i];
      const distanceFromBeginning =
        i === 0
        ? 0
        : output[i - 1].x +
        turf.distance(previousCoordinate, currentCoordinate, {
          units: "kilometers",
        });
      output.push({ 
        x: distanceFromBeginning,
        y: currentCoordinate[2], // elevation of the coordinate
        toolTipContent: "Elevation: {y}m"
      });
    }
    return output;
  }
  
  const pathArray = useMemo(() => calculateCoordinateDistances(selectedTrail), [selectedTrail]);

  const options = {
    animationEnabled: true,
    height: '200',
    theme: "light1",
    title: {
      text: "Elevation Profile",
    },
    axisX: {
      title: "Distance",
      suffix: "km",
    },
    axisY: {
      title: "Elevation",
      suffix: "m",
    },
    data: [
      {
        type: "spline",
        markerSize: 0,
        dataPoints: pathArray,
      },
    ],
  };

  return (
    <StyledElevationProfile>
      <CanvasJSChart options={options} />
    </StyledElevationProfile>
  );
}
