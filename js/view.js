document.addEventListener('DOMContentLoaded', () => {
    const personNameDisplay = document.getElementById('view-person-name');
    const pageTitleHeader = document.getElementById('page-title-header');
    const personDetailsDiv = document.getElementById('view-person-details');
    const editPersonForm = document.getElementById('edit-person-form');
    const editBtn = document.getElementById('edit-btn');
    const saveBtn = document.getElementById('save-btn');

    const urlParams = new URLSearchParams(window.location.search);
    let personData = {};

    for (const [key, value] of urlParams.entries()) {
        if (key === 'geo_lat' || key === 'geo_lon') {
            if (!personData.geo) personData.geo = {};
            personData.geo[key.substring(4)] = value;
        } else if (key.startsWith('_raw_')) {
            if (!personData._raw) personData._raw = {};
            personData._raw[key.substring(5)] = value;
        }
         else {
            personData[key] = value;
        }
    }

    if (personData.fullName) {
        document.title = personData.fullName;
        personNameDisplay.textContent = personData.fullName;
        pageTitleHeader.textContent = personData.fullName;
        displayDetails(personData);
    } else {
        personDetailsDiv.innerHTML = "<p class='text-destructive'>No person data found in URL.</p>";
        editBtn.classList.add('hidden');
        return;
    }

    function displayDetailItem(label, value, isHtml = false) {
        const val = value || 'N/A';
        return `<div class="py-2 border-b border-border last:border-b-0"><strong class="block text-sm text-muted-foreground">${label}:</strong> <span class="text-card-foreground">${isHtml ? val : escapeHtml(val)}</span></div>`;
    }
    
    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
             .replace(/&/g, "&")
             .replace(/</g, "<")
             .replace(/>/g, ">")
             .replace(/"/g, `"`)
             .replace(/'/g, `'`);
    }


    function displayDetails(data) {
        personDetailsDiv.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div class="md:col-span-3 flex justify-center md:justify-start">
                    <img src="${escapeHtml(data.avatar) || 'placeholder.png'}" alt="Avatar" class="w-32 h-32 rounded-full shadow-md object-cover border-2 border-border">
                </div>
                <div class="md:col-span-9 space-y-1">
                    ${displayDetailItem('Address', (data.streetAddress && data.city && data.state && data.zipCode) ? `${escapeHtml(data.streetAddress)}<br>${escapeHtml(data.city)}, ${escapeHtml(data.state)} ${escapeHtml(data.zipCode)}` : escapeHtml(data.address)?.replace(/\n/g, '<br>'), true)}
                    ${displayDetailItem("Mother's Maiden Name", data.motherMaidenName)}
                    ${displayDetailItem('SSN', data.ssn)}
                    ${displayDetailItem('Geo Coordinates', (data.geo && data.geo.lat) ? `${escapeHtml(data.geo.lat)}, ${escapeHtml(data.geo.lon)}` : 'N/A')}
                    ${displayDetailItem('Phone', data.phone)}
                    ${displayDetailItem('Country Code', data.countryCode)}
                    ${displayDetailItem('Birthday', data.birthday)}
                    ${displayDetailItem('Age', data.age)}
                    ${displayDetailItem('Email', data.email)}
                    ${displayDetailItem('Username', data.username)}
                    ${displayDetailItem('Password', data.password)}
                    ${displayDetailItem('User Agent', data.userAgent, true)}
                    ${displayDetailItem('Finance', `${escapeHtml(data.creditCardType)} ${escapeHtml(data.creditCardNum)} (Expires: ${escapeHtml(data.creditCardExpires)}, CVV: ${escapeHtml(data.creditCardCvv)})`)}
                    ${displayDetailItem('Employment', `${escapeHtml(data.occupation)} at ${escapeHtml(data.company)}`)}
                    ${displayDetailItem('Physical', `Height: ${escapeHtml(data.height)}, Weight: ${escapeHtml(data.weight)}`)}
                    ${displayDetailItem('UPS Tracking', data.upsTracking)}
                    ${displayDetailItem('Vehicle', data.vehicle)}
                    ${displayDetailItem('GUID', data.guid)}
                </div>
            </div>
        `;
    }

    editBtn.addEventListener('click', () => {
        populateEditForm(personData);
        personDetailsDiv.classList.add('hidden');
        editPersonForm.classList.remove('hidden');
        editBtn.classList.add('hidden');
        saveBtn.classList.remove('hidden');
    });

    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updatePersonDataFromForm();
        const newParams = new URLSearchParams();
         Object.keys(personData).forEach(key => {
            if (key === 'geo' && personData[key]) {
                newParams.append('geo_lat', personData[key].lat);
                newParams.append('geo_lon', personData[key].lon);
            } else if (key === '_raw' && personData[key]) {
                Object.keys(personData[key]).forEach(subKey => {
                    newParams.append(`_raw_${subKey}`, personData[key][subKey]);
                });
            } else if (typeof personData[key] !== 'object' || personData[key] === null) {
                 newParams.append(key, personData[key]);
            }
        });
        window.location.search = newParams.toString();
    });

    function createFormField(labelText, id, value, type = 'text') {
        const group = document.createElement('div');
        group.className = 'mb-3';
        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.className = 'block text-sm font-medium text-muted-foreground mb-1';
        label.textContent = labelText + ':';
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.name = id;
        input.value = value || '';
        input.className = 'w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:ring-ring focus:ring-1 focus:outline-none shadow-sm';
        group.appendChild(label);
        group.appendChild(input);
        return group;
    }

    function populateEditForm(data) {
        editPersonForm.innerHTML = '';

        const fieldsToEdit = [
            {label: 'Full Name', id: 'fullName', value: data.fullName},
            {label: 'Avatar URL', id: 'avatar', value: data.avatar},
            {label: 'Street Address', id: 'streetAddress', value: data.streetAddress || ''},
            {label: 'City', id: 'city', value: data.city || ''},
            {label: 'State', id: 'state', value: data.state || ''},
            {label: 'Zip Code', id: 'zipCode', value: data.zipCode || ''},
            {label: "Mother's Maiden Name", id: 'motherMaidenName', value: data.motherMaidenName},
            {label: 'SSN', id: 'ssn', value: data.ssn},
            {label: 'Geo Latitude', id: 'geo_lat', value: data.geo ? data.geo.lat : ''},
            {label: 'Geo Longitude', id: 'geo_lon', value: data.geo ? data.geo.lon : ''},
            {label: 'Phone', id: 'phone', value: data.phone},
            {label: 'Birthday', id: 'birthday', value: data.birthday},
            {label: 'Age', id: 'age', value: data.age},
            {label: 'Email', id: 'email', value: data.email},
            {label: 'Username', id: 'username', value: data.username},
            {label: 'Password', id: 'password', value: data.password},
            {label: 'User Agent', id: 'userAgent', value: data.userAgent},
            {label: 'Credit Card Type', id: 'creditCardType', value: data.creditCardType},
            {label: 'Credit Card Number', id: 'creditCardNum', value: data.creditCardNum},
            {label: 'Credit Card Expires', id: 'creditCardExpires', value: data.creditCardExpires},
            {label: 'Credit Card CVV', id: 'creditCardCvv', value: data.creditCardCvv},
            {label: 'Company', id: 'company', value: data.company},
            {label: 'Occupation', id: 'occupation', value: data.occupation},
            {label: 'Height String', id: 'height', value: data.height},
            {label: 'Weight String', id: 'weight', value: data.weight},
            {label: 'UPS Tracking', id: 'upsTracking', value: data.upsTracking},
            {label: 'Vehicle', id: 'vehicle', value: data.vehicle},
            {label: 'GUID', id: 'guid', value: data.guid}
        ];

        fieldsToEdit.forEach(field => {
            editPersonForm.appendChild(createFormField(field.label, field.id, field.value));
        });
    }

    function updatePersonDataFromForm() {
        const inputs = editPersonForm.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.id === 'geo_lat' || input.id === 'geo_lon') {
                if (!personData.geo) personData.geo = {};
                personData.geo[input.id.substring(4)] = input.value;
            } else {
                personData[input.id] = input.value;
            }
        });
        if (personData.streetAddress && personData.city && personData.state && personData.zipCode) {
            personData.address = `${personData.streetAddress}\n${personData.city}, ${personData.state} ${personData.zipCode}`;
        }
    }
});