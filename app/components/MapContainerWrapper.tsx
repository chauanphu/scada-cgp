// MapContainerWrapper.jsx
import { forwardRef } from 'react';
import { MapContainer as LeafletMapContainer } from 'react-leaflet';
import { Map as LeafletMap } from 'leaflet';

const MapContainerWrapper = forwardRef<LeafletMap, any>((props, ref) => {
  return <LeafletMapContainer ref={ref} {...props} />;
});

export default MapContainerWrapper;
