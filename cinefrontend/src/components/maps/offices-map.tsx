import { useEffect, useRef } from "react";
import { TOffice } from "../../types";
import { useYaMaps } from "./use-ymaps";
import { Card } from "@chakra-ui/react";

type OfficesMapProps = {
  readonly selectedOffice?: TOffice;
  readonly offices: TOffice[];
};

export function OfficesMap({ selectedOffice, offices }: OfficesMapProps) {
  const root = useRef<HTMLDivElement>(null);
  const [map, isReady] = useYaMaps();

  useEffect(() => {
    if (isReady && root.current && map) {
      map.RenderMap(root.current);
      if (offices) {
        offices.forEach((office) => {
          map.AddMarker([Number(office.longitude), Number(office.latitude)]);
        });
      }
    }
  }, [map, isReady, root, offices]);

  useEffect(() => {
    if (map && selectedOffice) {
      map.ChangeLocation([
        Number(selectedOffice.longitude),
        Number(selectedOffice.latitude),
      ]);
    }
  }, [map, selectedOffice]);

  return (
    <Card.Root width="100%" height={300}>
      <div ref={root} style={{ width: "auto", height: "auto" }} />
    </Card.Root>
  );
}
