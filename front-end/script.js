console.log('Script is running');

function moveItem(fromListId, toListId, button) {
    // get the item to be moved (the parent <li> of the button) [item sticks with the button]
    const item = button.parentElement;
    
    // determine the new button text and function
    const newButtonText = fromListId === 'activities' ? '←' : '→';  // if fromID == activities, show that it can be moved to itinerary, vice versa
    const newButtonFunction = fromListId === 'activities'
        ? `moveItem('itinerary', 'activities', this)`               //move from itinerary to activities if fromID is not activities
        : `moveItem('activities', 'itinerary', this)`;              //else activities -> itinerary
    
    
    // update the button's text (to switch arrows)
    button.textContent = newButtonText;

    /*
        determines what will happen when the button is clicked
        in this case, call newButtonFunction which determines where the item is moved to
    */
    button.setAttribute('onclick', newButtonFunction);
    
    
    // append moved item to new list (will add to bottom of list)
    document.getElementById(toListId).appendChild(item);
};




// Function to handle dragging
function handleDragStart(event) {
    event.target.classList.add('dragging'); // Add dragging class
}

// handle dragging over the drop zone
function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}

// handle drag leave (when dragged item leaves the drop zone)
function handleDragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

// handle dropping the item
function handleDrop(event) {
    event.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    event.currentTarget.classList.remove('drag-over');
    event.currentTarget.appendChild(draggingElement);
    
}

// Attach event listeners
document.querySelectorAll('li').forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    // item.addEventListener('dragend', function() {
    //     // Remove dragging class when drag ends (in case it wasn't dropped)
    //     item.classList.remove('dragging');
    // });
});

document.querySelectorAll('ul').forEach(list => {
    
    list.addEventListener('dragover', handleDragOver);
    list.addEventListener('dragleave', handleDragLeave);
    list.addEventListener('drop', handleDrop);
});





document.addEventListener("DOMContentLoaded", function() {
    var input = document.getElementById("myinput");

    // Initialize Awesomplete
    const awesomplete = new Awesomplete(input, {
        minChars: 1,
        list: [] // Start with an empty list
    });

    // Fetch places from the API endpoint
    fetch('/api/places')
        .then(response => response.json())
        .then(places => {
            // Extract the 'name' field from each place
            // console.log('Fetched places:', places)
            const placeNames = places.map(place => place.name);

            // Update Awesomplete with the full list of place names
            awesomplete.list = placeNames;

            input.addEventListener('input', function() {
                const query = input.value.trim().toLowerCase();

                if (query.length === 0) return;

                // Filter the list of place names based on the query
                let filteredPlaces = placeNames.filter(name => name.toLowerCase().includes(query));

                // Update the Awesomplete list with the filtered results
                awesomplete.list = filteredPlaces;
            });
        })
        .catch(error => console.error('Error loading places:', error));
});



