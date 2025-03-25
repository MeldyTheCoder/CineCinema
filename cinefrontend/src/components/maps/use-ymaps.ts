import {LngLat} from '@yandex/ymaps3-types';
import {useUnit} from 'effector-react';
import {useEffect, useRef, useState} from 'react';

import {$selectedRegion} from '../../effector/regions.store';
import {TRegion} from '../../types';
import {initMap, TYandexMaps} from './ymaps-init';

const getRegionLocation = (region: TRegion): LngLat | null => {
  if (!region.latitude || !region.longitude) {
    return null;
  }

  return [region.longitude, region.latitude];
};

export function useYaMaps(): [TYandexMaps, boolean] {
  const $map = useRef<TYandexMaps>(null);
  const [selectedRegion] = useUnit([$selectedRegion]);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    if (!selectedRegion || !isReady) {
        return;
    }
    const regionLocation = getRegionLocation(selectedRegion!);

    if ($map.current && regionLocation) {
      $map.current.ChangeLocation(regionLocation, 10);
    }
  }, [selectedRegion, isReady]);

  useEffect(() => {
    if (!selectedRegion) {
        return;
    }

    const regionLocation = getRegionLocation(selectedRegion!);
    initMap({
      initialLatitude: regionLocation?.[1],
      initialLongitude: regionLocation?.[0],
    }).then((map) => {
      setReady(true);
      $map.current = map;
    });
  }, [selectedRegion]);

  return [$map.current!, isReady];
}
