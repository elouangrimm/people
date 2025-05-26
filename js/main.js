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
        return `<div class="break-words"><strong class="block text-muted-foreground">${label}:</strong> <span class="text-card-foreground">${value}</span></div>`;
    }

    function displayPerson(data) {
        personAvatar.src = data.avatar;
        personAvatar.alt = `${data.fullName} avatar`;
        personNameDisplay.textContent = data.fullName;

        personDetailsDisplay.innerHTML = `
            ${displayDetailItem('Address', data.address.replace(/\n/g, '<br>'))}
            ${displayDetailItem("Mother's Maiden Name", data.motherMaidenName)}
            ${displayDetailItem('SSN', data.ssn)}
            ${displayDetailItem('Geo Coordinates', `${data.geo.lat}, ${data.geo.lon}`)}
            ${displayDetailItem('Phone', data.phone)}
            ${displayDetailItem('Country Code', data.countryCode)}
            ${displayDetailItem('Birthday', data.birthday)}
            ${displayDetailItem('Age', data.age)}
            ${displayDetailItem('Email', data.email)}
            ${displayDetailItem('Username', data.username)}
            ${displayDetailItem('Password', data.password)}
            ${displayDetailItem('User Agent', data.userAgent)}
            ${displayDetailItem('Finance', `${data.creditCardType} ${data.creditCardNum} (Expires: ${data.creditCardExpires}, CVV: ${data.creditCardCvv})`)}
            ${displayDetailItem('Employment', `${data.occupation} at ${data.company}`)}
            ${displayDetailItem('Physical', `Height: ${data.height}, Weight: ${data.weight}`)}
            ${displayDetailItem('UPS Tracking', data.upsTracking)}
            ${displayDetailItem('Vehicle', data.vehicle)}
            ${displayDetailItem('GUID', data.guid)}
        `;

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