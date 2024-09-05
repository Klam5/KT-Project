// Global drag and drop functions
function handleDragStart(event) {
    event.target.classList.add('dragging');
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');
}

function handleDragOver(event) {
    event.preventDefault(); // Necessary to allow dropping
    event.currentTarget.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    event.currentTarget.classList.remove('drag-over');
    event.currentTarget.appendChild(draggingElement);
}

document.addEventListener('DOMContentLoaded', function() {
    // Drag and drop initialization
    const items = document.querySelectorAll('.activities li, .itinerary li');
    const lists = document.querySelectorAll('.activities, .itinerary');

    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.setAttribute('draggable', 'true');
    });

    lists.forEach(list => {
        list.addEventListener('dragover', handleDragOver);
        list.addEventListener('dragleave', handleDragLeave);
        list.addEventListener('drop', handleDrop);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Search and Autocomplete initialization
    var input = document.getElementById("myinput");

    const awesomplete = new Awesomplete(input, {
        minChars: 1,
        list: []
    });

    fetch('/api/places')
        .then(response => response.json())
        .then(places => {
            const placeNames = places.map(place => place.name);
            awesomplete.list = placeNames;

            input.addEventListener('input', function () {
                const query = input.value.trim().toLowerCase();
                if (query.length === 0) return;

                let filteredPlaces = placeNames.filter(name => name.toLowerCase().includes(query));
                awesomplete.list = filteredPlaces;
            });
        })
        .catch(error => console.error('Error loading places:', error));
});

document.getElementById('myinput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter' && event.target.value.trim()) {
        document.getElementById('loading-spinner').style.display = 'block';
        let query = event.target.value.trim();
        fetch(`/getTravelInfo?location=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data);
                displayTravelInfo(data);
                document.getElementById('loading-spinner').style.display = 'none';
            })
            .catch(error => console.error('Error:', error));
    }
});

function displayTravelInfo(data) {
    document.getElementById('items').innerHTML = '';
    document.getElementById('activities').innerHTML = '';
    document.getElementById('itinerary').innerHTML = '';

    if (!data.travelInfo || !Array.isArray(data.travelInfo)) {
        alert('No travel information found or data is malformed.');
        return;
    }

    let items = [];
    let activities = [];
    let itinerary = [];

    let category = 'items';
    data.travelInfo.forEach(info => {
        if (info.toLowerCase().includes('must bring items')) {
            category = 'items';
        } else if (info.toLowerCase().includes('must see')) {
            category = 'activities';
        } else if (info.trim() !== '' && !info.includes('Title')) {
            if (category === 'items') {
                items.push(info);
            } else if (category === 'activities') {
                activities.push(info);
            } else if (category === 'itinerary') {
                itinerary.push(info);
            }
        }
    });

    let itemsList = document.getElementById('items');
    items.forEach(item => {
        let li = document.createElement('li');
        li.textContent = item;
        itemsList.appendChild(li);
    });

    let activitiesList = document.getElementById('activities');
    activities.forEach(activity => {
        let li = document.createElement('li');
        li.textContent = activity;

        // allow all added items to be draggable
        li.setAttribute("draggable", "true");

        // dragstart and dragend added to items being appeneded by api allowing for drag and drop in/out of possible activities list
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragend', handleDragEnd);
        activitiesList.appendChild(li);
    });

    let itineraryList = document.getElementById('itinerary');
    itinerary.forEach(item => {
        let li = document.createElement('li');
        li.textContent = item;

        // allow all added items to be draggable
        li.setAttribute("draggable", "true");

        // dragstart and dragend added to items being appeneded by api allowing for drag and drop in/out of itinerary list
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragend', handleDragEnd);
        itineraryList.appendChild(li);
    });
}
