import React, { useMemo } from 'react';
import styled from "styled-components";
import * as turf from "@turf/turf";
import PropTypes from 'prop-types';

import CanvasJSReact from "../assets/lib/canvasjs.react.js";
const { CanvasJSChart } = CanvasJSReact;

const StyledElevationProfile = styled.header`
  display: flex;
  justify-content: center;
  height: 20%;
`;

export default function ElevationProfile({ selectedTrail, setMouseOverCoords }) {
  // Returns an array of objects containing information about a coordinate's
  // elevation and distance from the beginning of the trail
  const calculateCoordinateDistances = (coordinateData) => {
    if (Object.keys(coordinateData).length === 0) return [];
    const output = [];
    const coordinateArr = coordinateData.geometry.coordinates[0];
    coordinateArr.forEach((coordinate, i) => {
      const previousCoordinate = i === 0 ? coordinate : coordinateArr[i - 1];
      const distanceFromBeginning =
        i === 0
          ? 0
          : output[i - 1].x +
            turf.distance(previousCoordinate, coordinate, {
              units: "kilometers",
            });
      output.push({
        x: distanceFromBeginning,
        y: coordinate[2],
        toolTipContent: "Elevation: {y}m",
        mouseover: () => setMouseOverCoords(coordinate)
      })
    })
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
      crosshair: {
        enabled: true,
        snapToDataPoint: true,
        thickness: 0,
        label: "",
        updated: (e) => {
          pathArray.find(coordinate => {
            return coordinate.x === e.value ? coordinate.mouseover() : null
          })
        }
      }
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

ElevationProfile.propTypes = {
  selectedTrail: PropTypes.object,
  setMouseOverCoords: PropTypes.func,
};