'use client'

import L from 'leaflet'

const CustomMarker = new L.Icon({
    iconUrl: '/marker.svg',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
})

export default CustomMarker

