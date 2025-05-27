document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const personDisplayCard = document.getElementById('person-display-card');
    const personAvatar = document.getElementById('person-avatar');
    const personNameDisplay = document.getElementById('person-name');
    const personDetailsDisplay = document.getElementById('person-details');
    const viewDetailsLink = document.getElementById('view-details-link');

    const genderSelect = document.getElementById('gender');
    const ageInput = document.getElementById('age');
    const countrySelect = document.getElementById('country');

    let currentPersonData = null;

    generateBtn.addEventListener('click', () => {
        const options = {
            gender: genderSelect.value,
            targetAge: parseInt(ageInput.value, 10),
            locale: countrySelect.value
        };

        currentPersonData = generatePersonData(options);
        displayPerson(currentPersonData);
    });

    function displayDetailItem(label, value) {
        // Create a div for each detail item to allow for better styling control if needed
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('detail-item'); // Add a class for potential styling
        itemDiv.innerHTML = `<strong>${label}:</strong> <span>${value.replace(/\n/g, '<br>')}</span>`;
        return itemDiv;
    }

    function displayPerson(data) {
        personAvatar.src = data.avatar;
        personAvatar.alt = `${data.fullName} avatar`;
        personNameDisplay.textContent = data.fullName;

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
        personDetailsDisplay.appendChild(displayDetailItem('UPS Tracking', data.upsTracking));
        personDetailsDisplay.appendChild(displayDetailItem('Vehicle', data.vehicle));
        personDetailsDisplay.appendChild(displayDetailItem('GUID', data.guid));


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

        viewDetailsLink.href = `view.html?${params.toString()}`;
        personDisplayCard.classList.remove('hidden');
    }
});