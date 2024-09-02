console.log('Script is running');

function moveItem(fromListId, toListId, button) {
    const item = button.parentElement;

    const newButtonText = fromListId === 'activities' ? '←' : '→';
    const newButtonFunction = fromListId === 'activities'
        ? `moveItem('itinerary', 'activities', this)`
        : `moveItem('activities', 'itinerary', this)`;

    button.textContent = newButtonText;
    button.setAttribute('onclick', newButtonFunction);

    document.getElementById(toListId).appendChild(item);
}

function handleDragStart(event) {
    event.target.classList.add('dragging');
}

function handleDragOver(event) {
    event.preventDefault();
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

function attachDragAndDropListeners() {
    document.querySelectorAll('ul').forEach(list => {
        // Only allow dropping in "itinerary" or "activities"
        if (list.id === 'itinerary' || list.id === 'activities') {
            list.addEventListener('dragover', handleDragOver);
            list.addEventListener('dragleave', handleDragLeave);
            list.addEventListener('drop', handleDrop);
        }
    });

    document.querySelectorAll('li').forEach(item => {
        // Only allow dragging from "itinerary" or "activities"
        const parentId = item.parentElement.id;
        if (parentId === 'itinerary' || parentId === 'activities') {
            item.setAttribute("draggable", "true");
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragend', function () {
                item.classList.remove('dragging');
            });
        } else {
            item.setAttribute("draggable", "false");
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    attachDragAndDropListeners();

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
        let query = event.target.value.trim();
        fetch(`/getTravelInfo?location=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data);
                displayTravelInfo(data);
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
        li.setAttribute("draggable", "true");
        li.addEventListener('dragstart', handleDragStart);
        activitiesList.appendChild(li);
    });

    let itineraryList = document.getElementById('itinerary');
    itinerary.forEach(item => {
        let li = document.createElement('li');
        li.textContent = item;
        li.setAttribute("draggable", "true");
        li.addEventListener('dragstart', handleDragStart);
        itineraryList.appendChild(li);
    });

    attachDragAndDropListeners();
}
