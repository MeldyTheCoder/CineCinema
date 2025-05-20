import { YMaps, Map, Placemark } from "react-yandex-maps";
import { TOffice } from "../../types";
import { useMemo } from "react";
import { Card } from "@chakra-ui/react";
import { useUnit } from "effector-react";
import { $selectedRegion } from "../../effector/regions.store";

type CoordsType = {
  center: [number, number];
  zoom: number;
}

type OfficesMapProps = {
  readonly offices: TOffice[];
  readonly selectedOffice?: TOffice;
  readonly onOfficeSelect?: (_: TOffice) => void;
};

const DEFAULT_ZOOM = 9;
const INITIAL_COORDS: CoordsType = {center: [56.85836, 35.90057], zoom: DEFAULT_ZOOM};

export function OfficesMap({
  offices,
  selectedOffice,
  onOfficeSelect,
}: OfficesMapProps) {
  const [selectedRegion] = useUnit([$selectedRegion]);

  const initialCoords: CoordsType = selectedRegion ? {center: [selectedRegion.latitude, selectedRegion.longitude], zoom: 9} : INITIAL_COORDS;
  const currentCoords: CoordsType = useMemo(() => {
    if (selectedOffice) {
      return {center: [selectedOffice.latitude, selectedOffice.longitude], zoom: 15};
    }
    return initialCoords;
  }, [selectedOffice]);

  return (
    <Card.Root width="100%" height="250px">
      <YMaps>
        <Map
          state={currentCoords}
          defaultState={initialCoords}
          width="100%"
          height="250px"
        >
          {offices.map((office) => (
            <Placemark
              geometry={[office.latitude, office.longitude]}
              properties={{onclick: () => onOfficeSelect?.(office)}}
            />
          ))}
        </Map>
      </YMaps>
    </Card.Root>
  );
}
