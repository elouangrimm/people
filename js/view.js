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

function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
         .replace(/&/g, "&")
         .replace(/</g, "<")
         .replace(/>/g, ">")
         .replace(/"/g, `"`)
         .replace(/'/g, `'`);
}

function displayDetailItem(label, value, isHtml = false) {
    const val = value || 'N/A';
    const item = document.createElement('div');
    item.classList.add('detail-pair');
    item.innerHTML = `<strong>${label}:</strong> <span>${isHtml ? val : escapeHtml(val)}</span>`;
    return item;
}


function displayDetails(data) {
    personDetailsDiv.innerHTML = ''; // Clear previous

    const detailGrid = document.createElement('div');
    detailGrid.classList.add('detail-grid');

    const avatarContainer = document.createElement('div');
    avatarContainer.classList.add('view-avatar-container');
    const avatarImg = document.createElement('img');
    avatarImg.src = escapeHtml(data.avatar) || 'placeholder.png';
    avatarImg.alt = "Avatar";
    avatarImg.classList.add('view-avatar');
    avatarContainer.appendChild(avatarImg);
    detailGrid.appendChild(avatarContainer);

    const detailsGroup = document.createElement('div');
    detailsGroup.classList.add('detail-group');

    detailsGroup.appendChild(displayDetailItem('Address', (data.streetAddress && data.city && data.state && data.zipCode) ? `${escapeHtml(data.streetAddress)}<br>${escapeHtml(data.city)}, ${escapeHtml(data.state)} ${escapeHtml(data.zipCode)}` : escapeHtml(data.address)?.replace(/\n/g, '<br>'), true));
    detailsGroup.appendChild(displayDetailItem("Mother's Maiden Name", data.motherMaidenName));
    detailsGroup.appendChild(displayDetailItem('SSN', data.ssn));
    detailsGroup.appendChild(displayDetailItem('Geo Coordinates', (data.geo && data.geo.lat) ? `${escapeHtml(data.geo.lat)}, ${escapeHtml(data.geo.lon)}` : 'N/A'));
    detailsGroup.appendChild(displayDetailItem('Phone', data.phone));
    detailsGroup.appendChild(displayDetailItem('Country Code', data.countryCode));
    detailsGroup.appendChild(displayDetailItem('Birthday', data.birthday));
    detailsGroup.appendChild(displayDetailItem('Age', data.age));
    detailsGroup.appendChild(displayDetailItem('Email', data.email));
    detailsGroup.appendChild(displayDetailItem('Username', data.username));
    detailsGroup.appendChild(displayDetailItem('Password', data.password));
    detailsGroup.appendChild(displayDetailItem('User Agent', data.userAgent, true));
    detailsGroup.appendChild(displayDetailItem('Finance', `${escapeHtml(data.creditCardType)} ${escapeHtml(data.creditCardNum)} (Expires: ${escapeHtml(data.creditCardExpires)}, CVV: ${escapeHtml(data.creditCardCvv)})`));
    detailsGroup.appendChild(displayDetailItem('Employment', `${escapeHtml(data.occupation)} at ${escapeHtml(data.company)}`));
    detailsGroup.appendChild(displayDetailItem('Physical', `Height: ${escapeHtml(data.height)}, Weight: ${escapeHtml(data.weight)}`));
    detailsGroup.appendChild(displayDetailItem('Vehicle', data.vehicle));
    detailsGroup.appendChild(displayDetailItem('GUID', data.guid));
    
    detailGrid.appendChild(detailsGroup);
    personDetailsDiv.appendChild(detailGrid);
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
    group.className = 'form-group';
    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = labelText + ':';
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.name = id;
    input.value = value || '';
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