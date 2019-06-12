import { loadCities } from './aq.js';

document.addEventListener('DOMContentLoaded', () => {

    const countries = [
        {
            name: 'Poland',
            code: 'PL'
        },
        {
            name: 'Germany',
            code: 'DE'
        },
        {
            name: 'Spain',
            code: 'ES'
        },
        {
            name: 'France',
            code: 'FR'
        }
    ];
    const form = document.querySelector('form.country_select');
    const input = document.querySelector('input[type=text]');
    const autocomplete = document.querySelector('.autocomplete');
    const list = $('.cities_list');
    const submit = $('button[type=submit]');
    let storedValue = localStorage.getItem('search');

    if(storedValue) {
        input.value = storedValue;
    }

    input.addEventListener('input', () => {
        let matches = countries.filter(country => {
            const regex = new RegExp(`^${input.value}`, 'gi');
            return country.name.match(regex);
        });

        if(input.value.length === 0) {
            matches = [];
            autocomplete.classList.remove('show');
            autocomplete.innerHTML = '';
        }

        showMatches(matches);
    });

    const showMatches = matches => {
        if(matches.length > 0) {
            const suggestion = matches.map(match => {
                return match.name;
            });
            autocomplete.innerText = suggestion;
            autocomplete.classList.add('show');
        } else {
            autocomplete.classList.remove('show');
        }
    };

    document.addEventListener('click', function(event) {
       if(event.target !== autocomplete && event.target !== input) {
           autocomplete.classList.remove('show');
        }
    });

    autocomplete.addEventListener('click', event => {
        let newValue = event.target.innerText;
        input.value = newValue;
        autocomplete.classList.remove('show');
    });

    form.addEventListener('submit', event => {
        event.preventDefault();

        submit.attr('disabled', true);
        submit.addClass('loading');
        autocomplete.classList.remove('show');

        localStorage.setItem('search', input.value);

        let matchNum = 0;

        countries.forEach(country => {
           if(country.name.toLowerCase() === input.value.toLowerCase()) {
               matchNum++;
           }
        });

        if(matchNum !== 1) {
            let list = countries.map(country => {
               return ` ${country.name}`;
            });

            Swal.fire({
                title: 'Wrong input',
                text: `Type one of the following: ${list}`,
                type: 'warning',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#4c6d9e',
                animation: false
            });

            submit.attr('disabled', false);
            submit.removeClass('loading');
        } else {

            let countryObj = countries.filter(country => {
                return country.name.toLowerCase() === input.value.toLowerCase();
            });

            let countryCode = countryObj[0].code;

            loadCities(countryCode, list, submit);

            list.off().on('click', '.more', function() {
                $(this).toggleClass('rotate');
                const slide = $(this).closest('li').find('.city_desc');
                slide.slideToggle();
            })
        }

    });

});