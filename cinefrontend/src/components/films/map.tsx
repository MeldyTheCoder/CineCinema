import React from "react";
import GoogleMapReact from "google-map-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Box, BoxProps } from "@chakra-ui/react";
import { useUnit } from "effector-react";
import { $selectedRegion } from "../../effector/regions.store";
import { Map as PigeonMap, Marker } from "pigeon-maps";
import styled, { createGlobalStyle } from "styled-components";

type MapProps = {
  readonly longitude: number;
  readonly latitude: number;
};

export function Map({ longitude, latitude }: MapProps) {
  return (
    <>
      <PigeonMap
        defaultCenter={[latitude, longitude]}
        defaultZoom={11}
        attribution={false}
      >
        <Marker width={25} anchor={[latitude, longitude]} color="purple" />
      </PigeonMap>
    </>
  );
}
