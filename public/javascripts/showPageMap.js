mapboxgl.accessToken = mapToken;//SET MAP
const map = new mapboxgl.Map({//CREATE MAP
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: locations.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(locations.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${locations.title}</h3><p>${locations.location}</p>`
            )
    )
    .addTo(map)
