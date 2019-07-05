import React, { useState, useRef } from 'react';
import DeckGL from '@deck.gl/react';
import { ArcLayer } from '@deck.gl/layers';
import { MapboxLayer } from '@deck.gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css'; // eslint-disable-line

// Necessary because Mapbox
const { default: ReactMapGL } = !global.SERVER ? require('react-map-gl') : {};

const ArcLayerMap = (props) => {
  // Props and state
  const { mapboxToken, data } = props;
  const [state, setState] = useState({});

  // Refs
  const mapRef = useRef(null);
  const deckRef = useRef(null);

  // Prop functions
  const onWebGLInitialized = gl => setState({ gl });
  const onMapLoad = () => {
    const map = mapRef.current;
    const deck = deckRef.current;

    map.addLayer(new MapboxLayer({ id: 'arcs', deck }));
  };

  // Prop values
  const layers = [
    new ArcLayer({
      id: 'arcs',
      data,
      pickable: true,
      getSourcePosition: d => d.from.coordinates,
      getTargetPosition: d => d.to.coordinates,
      getSourceColor: [26, 236, 255, 255],
      getTargetColor: [26, 236, 255, 255],
      getWidth: 4,
    }),
  ];
  const initialViewState = {
    longitude: -100,
    latitude: 40.7,
    zoom: 3,
  };
  const { gl } = state;

  return (
    <DeckGL
      ref={(ref) => {
        deckRef.current = ref && ref.deck;
      }}
      layers={layers}
      initialViewState={initialViewState}
      controller
      onWebGLInitialized={onWebGLInitialized}
    >
      {gl && ReactMapGL && (
        <ReactMapGL
          ref={(ref) => {
            mapRef.current = ref && ref.getMap();
          }}
          gl={gl}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          mapboxApiAccessToken={mapboxToken}
          onLoad={onMapLoad}
        />
      )}
    </DeckGL>
  );
};

export default ArcLayerMap;
