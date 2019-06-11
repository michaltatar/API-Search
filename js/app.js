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

    const listCities = cities => {
        list.empty();

        for(let i=0; i<cities.length; i++) {
            let city = cities[i].city;

            let newCity = $(`
                            <li class="city">
                                <h3 class="city_header">${city} <i class="more fas fa-angle-down"></i></h3>
                                <div class="city_desc"></div>
                            </li>
                            `);
            list.append(newCity);
        }
    };

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

    const addDescription = (name, description) => {
        let cityEl = document.querySelectorAll('.city');
        cityEl.forEach(item => {
            const cityName = item.firstElementChild.innerText;
            const cityDesc = item.lastElementChild;
            if(`${cityName}` === name) {
                cityDesc.innerText = description;
            }
        })
    };

    const getDescription = cities => {

        cities.forEach(city => {
            let url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&redirects=1&indexpageids&titles=${city.city}`;

                $.ajax({

                    url: url,
                    method: 'GET',
                    dataType: 'jsonp'

                }).done(function(response) {

                    let redirects = response.query.redirects;
                    let ids = response.query.pageids;
                    let name = response.query.pages[ids].title;
                    let description = response.query.pages[ids].extract;
                    if(redirects) {
                        name = redirects[0].from;
                    }
                    addDescription(name, description);

                }).fail(function(error) {

                    console.log(error);

                })
        });

    };

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

            const loadCities = () => {
                let url = `https://api.openaq.org/v1/measurements?country=${countryCode}&limit=10&order_by=value&sort=desc`;

                $.ajax({

                    url: url,
                    method: 'GET',
                    dataType: 'json'

                }).done(function(response) {

                    listCities(response.results);
                    getDescription(response.results);
                    if(response.results.length === 0) {
                        list.html('<h2>No results found</h2>');
                    }

                }).fail(function(error) {

                    console.log(error);

                }).always(function() {
                    submit.attr('disabled', false);
                    submit.removeClass('loading');
                })
            };

            loadCities();

            list.off().on('click', '.more', function() {
                $(this).toggleClass('rotate');
                const slide = $(this).closest('li').find('.city_desc');
                slide.slideToggle();
            })
        }

    })

});
