export const SPECTRA_DARK_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#090D18' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#090D18' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38BDF8' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#60A5FA' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#0c1a2e' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3b82f6' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1E293B' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#0F172A' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#94A3B8' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#2563EB' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1D4ED8' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#E2E8F0' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1E293B' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38BDF8' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#050811' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38BDF8' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#050811' }],
  },
]
