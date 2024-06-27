import config from "../conf/index.js";

async function init() {
  //Fetches list of all cities along with their images and description
  let cities = await fetchCities();
  
  console.log(cities)

  //Updates the DOM with the cities
  if (cities) {
    cities.forEach((key) => {
      addCityToDOM(key.id, key.city, key.description, key.image);
    });
  }
}
console.log(`${config.backendEndpoint}/cities`)

//Implementation of fetch call
async function fetchCities() {
  // TODO: MODULE_CITIES
  // 1. Fetch cities using the Backend API and return the data
  // console.log(`${config.backendEndpoint}/cities`)
 try{
    let data = await fetch(`${config.backendEndpoint}/cities`);

    let jsonCities = await data.json();
    return jsonCities;
  }
  catch(err){
    return null;
  }
}


//Implementation of DOM manipulation to add cities
function addCityToDOM(id, city, description, image) {
  // TODO: MODULE_CITIES
  // 1. Populate the City details and insert those details into the DOM
  //creating column
  console.log(id);
  let row = document.querySelector('.row');
  let colum = createEle('div');
  colum.setAttribute('class',"col col-12 col-sm-6 col-lg-3 mb-3 px-2")

  //main div
  let parent = createEle('div');
  parent.setAttribute('class','tile')
  parent.setAttribute('id',id);

  //image
  let imag = createEle('img');
  imag.setAttribute("src",image);
  imag.setAttribute("alt","image is not found");

  //div for text
  let textDiv = createEle('div');
  textDiv.setAttribute('class','tile-text')
  let cityName = createEle("h2");
  cityName.textContent=city;
  let cityPlace = createEle('h2');
  cityPlace.textContent=description;
  textDiv.append(cityName,cityPlace);
  
  let a = createEle('a');
  a.setAttribute('href',`../pages/adventures/?city=${id}`)
  a.setAttribute('id',`${id}`);
  
  parent.append(imag,textDiv);
  a.append(parent);
  colum.append(a);
  row.append(colum)
  
  /*    <row>
          <column>
           <a href id>
             <div>
                <img><text>
              </div>
            <a>
          </column>
        </row>

  */
}

function createEle(tag){
  let ele = document.createElement(tag);
  return ele;
}

// let footerData = document.querySelector('footer span');
// let date = new Date();
// footerData.textContent = date.getFullYear();
export { init, fetchCities, addCityToDOM };

