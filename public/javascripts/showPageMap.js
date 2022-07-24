mapboxgl.accessToken = mapToken;//SET MAP
const map = new mapboxgl.Map({//CREATE MAP
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: location.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(location.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${location.title}</h3><p>${location.location}</p>`
            )
    )
    .addTo(map)
