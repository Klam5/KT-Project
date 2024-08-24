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

document.addEventListener("DOMContentLoaded", function() {
    var input = document.getElementById("myinput");
    const country_list = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia",
        "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
        "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
        "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
        "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)",
        "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
        "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. 'Swaziland')", "Ethiopia", "Fiji", "Finland",
        "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
        "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
        "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
        "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
        "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
        "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
        "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State",
        "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
        "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
        "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
        "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
        "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
        "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America",
        "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];

    // Initialize Awesomplete once
    const awesomplete = new Awesomplete(input, {
        minChars: 1,
        list: country_list
    });

    input.addEventListener('input', function() {
        const query = input.value.trim().toLowerCase();

        if (query.length === 0) return;

        // Update the Awesomplete list based on the input
        let filteredList = country_list.filter(country => country.toLowerCase().includes(query));

        if (filteredList.length > 0) {
            awesomplete.list = filteredList;
        } else {
            fetch('/api/cities')
                .then(response => response.json())
                .then(data => {
                    const suggestions = data
                        .filter(city => city.name.toLowerCase().startsWith(query))
                        .map(city => city.name);
                    awesomplete.list = suggestions;
                })
                .catch(error => console.error('Error fetching cities:', error));
        }
    });
});
