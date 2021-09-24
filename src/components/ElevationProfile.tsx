import React, { useMemo } from 'react';
import styled from "styled-components";
import * as turf from "@turf/turf";
import { Feature, MultiLineString, Position } from "geojson";
import { LngLatLike } from "mapbox-gl"
import CanvasJSReact from "../assets/lib/canvasjs.react.js";
const { CanvasJSChart } = CanvasJSReact;

const StyledElevationProfile = styled.header`
  display: flex;
  justify-content: center;
  height: 20%;
`;

interface Props {
  selectedTrail: Feature<MultiLineString> | undefined;
  setMouseOverCoords: (coordinate: LngLatLike) => void;
}

interface OutputElements {
  x: number;
  y: number;
  toolTipContent: string;
  mouseover: () => void;
}

interface Event {
  chart: {};
  crosshair: {};
  axis: string;
  value: number;
}

export default function ElevationProfile({ selectedTrail, setMouseOverCoords }: Props) {
  // Returns an array of objects containing information about a coordinate's
  // elevation and distance from the beginning of the trail
  const calculateCoordinateDistances = (): OutputElements[] => {
    const output: OutputElements[] = [];
    if (selectedTrail === undefined) return output;
    const coordinateArr: Position[] = selectedTrail.geometry.coordinates[0];
    coordinateArr.forEach((coordinate: any, i) => {
      const previousCoordinate: any = i === 0 ? coordinate : coordinateArr[i - 1];
      const distanceFromBeginning: number =
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
  
  const pathArray = useMemo(() => calculateCoordinateDistances(), [selectedTrail]);

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
        updated: (e: Event) => {
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
