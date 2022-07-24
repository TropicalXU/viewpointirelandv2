mapboxgl.accessToken = mapToken;//SET MAP
const map = new mapboxgl.Map({//CREATE MAP
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: locationMap.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(locationMap.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${locationMap.title}</h3><p>${locationMap.location}</p>`
            )
    )
    .addTo(map)
