import type {
  LngLat,
  YMap as TYMap,
  YMapLocationRequest,
} from '@yandex/ymaps3-types';

export type TYandexMaps = {
  map: TYMap;
  ChangeLocation: (location: LngLat, zoom?: number) => void;
  AddMarker: (coordinates: LngLat) => void;
  RenderMap: (root: HTMLElement) => void;
};

type InitMapProps = {
  initialLongitude?: number;
  initialLatitude?: number;
};

export async function initMap({
  initialLongitude,
  initialLatitude,
}: InitMapProps): Promise<TYandexMaps> {
  await ymaps3.ready;

  const {YMap, YMapDefaultSchemeLayer, YMapMarker, YMapDefaultFeaturesLayer} =
    ymaps3;

  const location: YMapLocationRequest = {
    center: [
      initialLongitude || 37.617106,
      initialLatitude || 55.753855,
    ] as LngLat,
    zoom: 10,
  };

  let map: TYMap;

  const createMarker = () => {
    const markerElement = document.createElement('img');
    markerElement.className = 'icon-marker';
    markerElement.src =
      'https://kdltver.ru/wp-content/uploads/2018/03/favicon-kdllab.png';
    markerElement.setAttribute('title', "I'm marker!");
    markerElement.onclick = () => console.log('click on marker');

    return markerElement;
  };

  const ChangeLocation = (center: LngLat, zoom?: number) => {
    map.setLocation({
      center,
      zoom: zoom || 15,
      duration: 100,
    });
  };

  const AddMarker = (coordinates: LngLat) => {
    //[35.922514, 56.856801]
    const marker = new YMapMarker(
      {
        coordinates,
        draggable: false,
        mapFollowsOnDrag: true,
      },
      createMarker(),
    );
    map.addChild(marker);
  };

  const RenderMap = (root: HTMLElement) => {
    if (map) return;

    map = new YMap(
      root,
      {
        location,
      },
      [new YMapDefaultSchemeLayer({}), new YMapDefaultFeaturesLayer({})],
    );
  };

  return {
    map,
    ChangeLocation,
    AddMarker,
    RenderMap,
  };
}
