// js/personGenerator.js

// This function is defined but relies on window.faker being set before it's called.
function generatePersonData(options = {}) {
    const { gender = 'male', targetAge = 30, locale = 'en' } = options;

    if (typeof window.faker === 'undefined' || typeof window.faker.person === 'undefined') {
        console.error("generatePersonData Error: Faker.js (window.faker) is not available or not fully initialized!");
        // The calling functions (initializeMainPage/initializeBulkPage) should handle this
        // and prevent calling generatePersonData if Faker isn't ready.
        // However, if called directly, this check provides a fallback.
        return null;
    }
    const { faker } = window;

    if (faker.locale !== locale) {
        try {
            faker.setLocale(locale);
        } catch (e) {
            console.warn(`Locale ${locale} not found, using ${faker.locale}. Error: ${e.message}`);
            if (faker.locale !== 'en') {
                try { faker.setLocale('en'); } catch (e2) { console.error("Failed to set fallback locale 'en'");}
            }
        }
    }

    const sex = gender === 'female' ? 'female' : 'male';
    const firstName = faker.person.firstName(sex);
    const lastName = faker.person.lastName(sex);
    const middleInitial = faker.string.alpha(1).toUpperCase();
    const fullName = `${firstName} ${middleInitial}. ${lastName}`;

    const birthDate = faker.date.birthdate({ min: targetAge, max: targetAge, mode: 'age' });
    const age = Math.floor((new Date() - new Date(birthDate)) / (1000 * 60 * 60 * 24 * 365.25));

    const streetAddress = faker.location.streetAddress();
    const city = faker.location.city();
    const state = faker.location.state({ abbreviated: true });
    const zipCode = faker.location.zipCode();
    const fullAddress = `${streetAddress}\n${city}, ${state} ${zipCode}`;

    const heightCm = faker.number.int({ min: 150, max: 200 });
    const weightKg = faker.number.int({ min: 50, max: 120 });

    const heightInchesTotal = heightCm / 2.54;
    const heightFeet = Math.floor(heightInchesTotal / 12);
    const heightInches = Math.round(heightInchesTotal % 12);
    const weightLbs = (weightKg * 2.20462).toFixed(1);

    return {
        avatar: faker.image.personPortrait({ sex: sex }),
        fullName: fullName,
        address: fullAddress,
        streetAddress: streetAddress,
        city: city,
        state: state,
        zipCode: zipCode,
        motherMaidenName: faker.person.lastName(),
        phone: faker.phone.number(),
        countryCode: locale.toUpperCase().includes('US') ? '1' : faker.location.countryCode('alpha-2'),
        birthday: birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        age: `${age} years old`,
        email: faker.internet.email({ firstName, lastName }),
        username: faker.internet.userName({ firstName, lastName }),
        password: faker.internet.password(12, false, /[a-zA-Z0-9!@#$%^&*]/),
        creditCardType: 'Visa',
        creditCardNum: faker.finance.creditCardNumber('visa'),
        creditCardExpires: faker.date.future({ years: 4 }).toLocaleDateString('en-US', {month: 'numeric', year: '2-digit'}).replace('/20','/'),
        creditCardCvv: faker.finance.creditCardCVV(),
        company: faker.company.name(),
        occupation: faker.person.jobTitle(),
        height: `${heightFeet}' ${heightInches}" (${heightCm} centimeters)`,
        weight: `${weightLbs} pounds (${weightKg.toFixed(1)} kilograms)`,
        heightCm: heightCm,
        weightKg: weightKg,
        vehicle: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()} ${faker.date.past({years: 10}).getFullYear()}`,
        guid: faker.string.uuid(),
        _raw: {
            gender: gender,
            targetAge: targetAge,
            locale: locale,
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate.toISOString().split('T')[0]
        }
    };
}