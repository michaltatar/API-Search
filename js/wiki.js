
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

export { getDescription }