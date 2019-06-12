import { getDescription } from './wiki.js';
import { listCities } from './cities.js';

const loadCities = (code, list, submit) => {
    let url = `https://api.openaq.org/v1/measurements?country=${code}&limit=10&order_by=value&sort=desc`;

    $.ajax({

        url: url,
        method: 'GET',
        dataType: 'json'

    }).done(function(response) {

        listCities(response.results, list);
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

export { loadCities }