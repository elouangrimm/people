// js/main.js

function initializeMainPage() {
    if (typeof window.faker === 'undefined' || typeof window.faker.person === 'undefined') {
        console.error("Main Page Error: Faker.js is not ready or not fully initialized on window.faker.");
        alert("Critical Application Error: Core data generation library (Faker.js) failed to load for the main page. Please try refreshing. Check console for details.");
        const personNameDisplay = document.getElementById('person-name');
        const personDetailsDisplay = document.getElementById('person-details');
        if(personNameDisplay) personNameDisplay.textContent = "Error Loading";
        if(personDetailsDisplay) personDetailsDisplay.innerHTML = '<div class="detail-item" style="color: var(--destructive);">Faker.js did not load. Cannot generate data.</div>';
        return;
    }
    console.log("Main Page: Initializing with Faker.js...");

    const generateBtn = document.getElementById('generate-btn');
    const personDisplayCard = document.getElementById('person-display-card');
    const personAvatar = document.getElementById('person-avatar');
    const personNameDisplay = document.getElementById('person-name');
    const personDetailsDisplay = document.getElementById('person-details');
    const viewDetailsLink = document.getElementById('view-details-link');

    const genderSelect = document.getElementById('gender');
    const ageInput = document.getElementById('age');
    const countrySelect = document.getElementById('country');

    if (typeof generatePersonData !== 'function') {
        console.error("Main Page Error: generatePersonData function is not defined. Ensure personGenerator.js is loaded.");
        alert("Critical Application Error: Core data generation function missing.");
        return;
    }

    generateBtn.addEventListener('click', () => {
        const options = {
            gender: genderSelect.value,
            targetAge: parseInt(ageInput.value, 10),
            locale: countrySelect.value
        };

        const currentPersonData = generatePersonData(options);

        if (!currentPersonData) {
            if (personNameDisplay) personNameDisplay.textContent = "Error Generating Data";
            if (personDetailsDisplay) personDetailsDisplay.innerHTML = '<div class="detail-item" style="color: var(--destructive);">Could not generate data. Faker.js might have had an issue.</div>';
            if (personAvatar) personAvatar.src = "";
            if (personDisplayCard) personDisplayCard.classList.remove('hidden');
            return;
        }
        displayPerson(currentPersonData);
    });

    function displayDetailItem(label, value) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('detail-item');
        itemDiv.innerHTML = `<strong>${label}:</strong> <span>${value.replace(/\n/g, '<br>')}</span>`;
        return itemDiv;
    }

    function displayPerson(data) {
        if (personAvatar) {
            personAvatar.src = data.avatar;
            personAvatar.alt = `${data.fullName} avatar`;
        }
        if (personNameDisplay) personNameDisplay.textContent = data.fullName;

        if (personDetailsDisplay) {
            personDetailsDisplay.innerHTML = ''; // Clear previous details

            personDetailsDisplay.appendChild(displayDetailItem('Address', data.address));
            personDetailsDisplay.appendChild(displayDetailItem("Mother's Maiden Name", data.motherMaidenName));
            personDetailsDisplay.appendChild(displayDetailItem('SSN', data.ssn));
            personDetailsDisplay.appendChild(displayDetailItem('Geo Coordinates', `${data.geo.lat}, ${data.geo.lon}`));
            personDetailsDisplay.appendChild(displayDetailItem('Phone', data.phone));
            personDetailsDisplay.appendChild(displayDetailItem('Country Code', data.countryCode));
            personDetailsDisplay.appendChild(displayDetailItem('Birthday', data.birthday));
            personDetailsDisplay.appendChild(displayDetailItem('Age', data.age));
            personDetailsDisplay.appendChild(displayDetailItem('Email', data.email));
            personDetailsDisplay.appendChild(displayDetailItem('Username', data.username));
            personDetailsDisplay.appendChild(displayDetailItem('Password', data.password));
            personDetailsDisplay.appendChild(displayDetailItem('User Agent', data.userAgent));
            personDetailsDisplay.appendChild(displayDetailItem('Finance', `${data.creditCardType} ${data.creditCardNum} (Expires: ${data.creditCardExpires}, CVV: ${data.creditCardCvv})`));
            personDetailsDisplay.appendChild(displayDetailItem('Employment', `${data.occupation} at ${data.company}`));
            personDetailsDisplay.appendChild(displayDetailItem('Physical', `Height: ${data.height}, Weight: ${data.weight}`));
            personDetailsDisplay.appendChild(displayDetailItem('Vehicle', data.vehicle));
            personDetailsDisplay.appendChild(displayDetailItem('GUID', data.guid));
        }

        const params = new URLSearchParams();
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'object' && data[key] !== null && key !== '_raw' && key !== 'geo') {
                 Object.keys(data[key]).forEach(subKey => {
                     params.append(`${key}_${subKey}`, data[key][subKey]);
                });
            } else if (key === 'geo' && data[key] !== null) {
                params.append('geo_lat', data[key].lat);
                params.append('geo_lon', data[key].lon);
            }
             else if (key !== '_raw') {
                 params.append(key, data[key]);
            }
        });
        Object.keys(data._raw).forEach(key => {
            params.append(`_raw_${key}`, data._raw[key]);
        });

        if (viewDetailsLink) viewDetailsLink.href = `view.html?${params.toString()}`;
        if (personDisplayCard) personDisplayCard.classList.remove('hidden');
    }
}

window.initializeMainPage = initializeMainPage;