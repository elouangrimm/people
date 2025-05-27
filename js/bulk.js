// js/bulk.js

function initializeBulkPage() {
    if (typeof window.faker === 'undefined' || typeof window.faker.person === 'undefined') {
        console.error("Bulk Page Error: Faker.js is not ready or not fully initialized on window.faker.");
        alert("Critical Application Error: Core data generation library (Faker.js) failed to load for the bulk page. Please try refreshing. Check console for details.");
        const bulkTableHeader = document.querySelector('#bulk-table thead');
        if(bulkTableHeader) bulkTableHeader.innerHTML = `<tr><th style="color: var(--destructive);">Error: Faker.js library did not load.</th></tr>`;
        const exportCsvBtn = document.getElementById('export-csv-btn');
        if(exportCsvBtn) exportCsvBtn.disabled = true;
        return;
    }
    console.log("Bulk Page: Initializing with Faker.js...");

    const bulkGenerateBtn = document.getElementById('bulk-generate-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const bulkCountInput = document.getElementById('bulk-count');
    const bulkCountrySelect = document.getElementById('bulk-country');
    const bulkTableBody = document.querySelector('#bulk-table tbody');
    const bulkTableHeader = document.querySelector('#bulk-table thead');

    if (typeof generatePersonData !== 'function') {
        console.error("Bulk Page Error: generatePersonData function is not defined. Ensure personGenerator.js is loaded.");
        alert("Critical Application Error: Core data generation function missing for bulk operations.");
        return;
    }

    let generatedBulkData = [];

    bulkGenerateBtn.addEventListener('click', () => {
        const count = parseInt(bulkCountInput.value, 10);
        const locale = bulkCountrySelect.value;
        generatedBulkData = [];
        if(bulkTableBody) bulkTableBody.innerHTML = '';
        if(bulkTableHeader) bulkTableHeader.innerHTML = '';

        if (count <= 0) return;

        const samplePerson = generatePersonData({locale: locale});
        if (!samplePerson) {
            if(bulkTableHeader) bulkTableHeader.innerHTML = `<tr><th style="color: var(--destructive);">Error: Could not generate sample data. Faker.js might have issues.</th></tr>`;
            if(exportCsvBtn) exportCsvBtn.disabled = true;
            return;
        }

        let finalHeaders = [];
        Object.keys(samplePerson).forEach(h => {
            if (h === 'geo' && samplePerson.geo) {
                finalHeaders.push('geo_lat', 'geo_lon');
            } else if (h !== '_raw' && typeof samplePerson[h] !== 'object') {
                finalHeaders.push(h);
            } else if (h !== '_raw' && samplePerson[h] === null) {
                 finalHeaders.push(h);
            }
        });

        if(bulkTableHeader) bulkTableHeader.innerHTML = `<tr>${finalHeaders.map(h => `<th class="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">${h.replace(/([A-Z])/g, ' $1').trim()}</th>`).join('')}</tr>`;

        const displayCount = Math.min(count, 10);

        for (let i = 0; i < count; i++) {
            const gender = Math.random() > 0.5 ? 'male' : 'female';
            const targetAge = window.faker.number.int({ min: 18, max: 70 });
            const person = generatePersonData({ gender, targetAge, locale });

            if (!person) {
                console.error("Skipping a person generation due to Faker.js issue during bulk operation.");
                continue;
            }
            generatedBulkData.push(person);

            if (i < displayCount && bulkTableBody) {
                const row = document.createElement('tr');
                row.className = i % 2 === 0 ? '' : 'bg-muted-alt'; // Simplified or use CSS for :nth-child
                finalHeaders.forEach(header => {
                    const cell = document.createElement('td');
                    let cellValue = '';
                    if (header === 'geo_lat') {
                        cellValue = person.geo ? person.geo.lat : '';
                    } else if (header === 'geo_lon') {
                        cellValue = person.geo ? person.geo.lon : '';
                    } else if (person[header] !== undefined && person[header] !== null && typeof person[header] !== 'object') {
                        cellValue = person[header];
                    } else if (person[header] === null) {
                        cellValue = 'N/A';
                    }
                    cell.textContent = cellValue;
                    row.appendChild(cell);
                });
                bulkTableBody.appendChild(row);
            }
        }
        if (generatedBulkData.length > 0) {
            if(exportCsvBtn) exportCsvBtn.disabled = false;
        } else if (count > 0) {
             if(bulkTableBody) bulkTableBody.innerHTML = `<tr><td colspan="${finalHeaders.length || 1}" style="color: var(--destructive); text-align: center;">Could not generate any data. Faker.js library might not have loaded.</td></tr>`;
             if(exportCsvBtn) exportCsvBtn.disabled = true;
        }
    });

    if(exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
            if (generatedBulkData.length === 0) return;
            exportToCsv('generated_persons.csv', generatedBulkData);
        });
    }

    function exportToCsv(filename, rows) {
        if (!rows || !rows.length) {
            return;
        }
        const separator = ',';
        const samplePerson = rows[0];
        let finalHeaders = [];
         Object.keys(samplePerson).forEach(h => {
            if (h === 'geo' && samplePerson.geo) {
                finalHeaders.push('geo_lat', 'geo_lon');
            } else if (h !== '_raw' && typeof samplePerson[h] !== 'object') {
                finalHeaders.push(h);
            } else if (h !== '_raw' && samplePerson[h] === null) {
                finalHeaders.push(h);
            }
        });

        const csvContent = [
            finalHeaders.join(separator),
            ...rows.map(row => {
                return finalHeaders.map(k => {
                    let cell = "";
                    if (k === 'geo_lat') {
                        cell = row.geo ? row.geo.lat : '';
                    } else if (k === 'geo_lon') {
                        cell = row.geo ? row.geo.lon : '';
                    } else if (row[k] !== undefined && row[k] !== null) {
                        cell = typeof row[k] === 'string' ? `"${row[k].replace(/"/g, '""').replace(/\n/g, ' ')}"` : row[k];
                    }
                    return cell;
                }).join(separator);
            })
        ].join('\n');

        const blob = new Blob([String.fromCharCode(0xFEFF), csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

window.initializeBulkPage = initializeBulkPage;