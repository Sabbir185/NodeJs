const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FiYmlyMTg1IiwiYSI6ImNrdnJvNno0aTI5bXIyd3VwNnIyZXR0MTUifQ.g9bEuK07tqmNxsYF9gPEbw';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
});


