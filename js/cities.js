
const listCities = (cities, list) => {
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

export { listCities }