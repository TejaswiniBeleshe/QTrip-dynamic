
import config from "../conf/index.js";

//Implementation to extract city from query params
function getCityFromURL(search) {
  // TODO: MODULE_ADVENTURES
  // 1. Extract the city id from the URL's Query Param and return it
  let city = new URLSearchParams(search);
  let valCity = city.get('city');
  console.log(valCity)
  return valCity;
}

//Implementation of fetch call with a paramterized input based on city
let addAdv;
async function fetchAdventures(city) {
  // TODO: MODULE_ADVENTURES
  // 1. Fetch adventures using the Backend API and return the data
  //console.log(city)
  addAdv=city;
  try{
    let data = await fetch(`${config.backendEndpoint}/adventures/?city=${city}`);
    let jsonData = await data.json();
    console.log(jsonData);
    return jsonData;
  }
  catch(err){
    return null;
  }
  
}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
  // console.log(adventures)
  let row = document.querySelector('.row');
  // TODO: MODULE_ADVENTURES
  // 1. Populate the Adventure Cards and insert those details into the DOM
  let cityCards = adventures.map((adventure)=>{
    return createCard(adventure);
    // console.log(city)
  })
  cityCards.forEach(city=>row.append(city));
  // console.log('exuted when filter called')
}

//createing card by extracting obj data
function createCard(adventure){
  let col = createEle('div');
    col.setAttribute('class','col col-6 col-md-3');
    let parent = createEle('div');
    parent.setAttribute('class','activity-card mb-3');

    let aTag = createEle('a');
    aTag.setAttribute('href',`./detail/?adventure=${adventure.id}`)
    aTag.setAttribute('id',adventure.id);
  
    let cardImage = createEle('img');
    cardImage.setAttribute('src',adventure.image);
    cardImage.setAttribute('alt','Not found');

    let banner = createEle('span');
    banner.setAttribute('class','category-banner');
    banner.textContent = adventure.category;

    let cardDetails = createEle('div');
    cardDetails.setAttribute('class','card-body d-flex flex-column align-items-between w-100')
    
    let place = createEle('div');
    place.setAttribute('class','d-flex justify-content-between align-items-center');
    place.innerHTML=`<h5>${adventure.name}</h5>
                  <a href="#"><span>&#8377</span>${adventure.costPerHead}</a>`

    let hour = createEle('div');
    hour.setAttribute('class','d-flex justify-content-between align-items-center ');
    hour.innerHTML=`<h5>Hour</h5>
    <span>${adventure.duration}</span>`
    
    cardDetails.append(place,hour);
    // aTag.append(cardImage,cardDetails);                         
    parent.append(cardImage,banner,cardDetails);
    aTag.append(parent)
    col.append(aTag);
    // parent.append(aTag);
    // col.append(parent);
    
    return col;
}
//Create element node
function createEle(tag){
  let ele = document.createElement(tag);
  return ele;
}

//Adding new adventure by clicking button
document.querySelector('#add-card').addEventListener('click',()=>{
   addNewCard()
})

async function addNewCard(){
  let data = await fetch(`${config.backendEndpoint}/adventures/new`,{
    method:'POST',
    body:JSON.stringify({"city":`${addAdv}`}),
    headers:{
      'Content-type':'application/json'
    }
  })
  let respo = await data.json();
  // let {name} = respo;
  let row = document.querySelector('.row')
  row.append(createCard(respo)); 
}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on Duration and return filtered list
  // console.log('hi',typeof low)
  let byDuration = list.filter((ele)=>{
    return ele.duration >= low && ele.duration <= high;
  })
  // console.log(byDuration)
  return byDuration;
}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on their Category and return filtered list
  let byCategory = list.filter((ele)=>{
    return categoryList.includes(ele.category);
    // return ele.category == categoryList[categoryList.length-1];
  })
  console.log(categoryList)
  return byCategory;
}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
  // TODO: MODULE_FILTERS
  // 1. Handle the 3 cases detailed in the comments above and return the filtered list of adventures

  // 2. Depending on which filters are needed, invoke the filterByDuration() and/or filterByCategory() methods
  if(filters.duration.length > 0 && filters.category.length == 0){
    let val = filters.duration;
    let arr = val.split('-');
    let [low,high] = arr;
    // console.log(typeof low,high)
    let filtDuration = filterByDuration(list,Number(low),Number(high));
    console.log(filtDuration)
    return filtDuration;
  }
  if(filters.duration.length == 0 && filters.category.length > 0){
    let val = filters.category;
    let filtCategory = filterByCategory(list,val);
    console.log(filtCategory)
    return filtCategory;
  } 
  if(filters.duration.length > 0 && filters.category.length > 0){
    let val1 = filters.duration;
    let arr = val1.split('-');
    const [low,high] = arr;
    // let filtDuration = filterByDuration(list,low,high);

    // let val2 = filters.category;
    // let filtCategory = filterByCategory(list,val2);
    // return [...filtDuration,filtCategory];

    let res = list.filter(ele=>{
      return ((ele.duration >= Number(low) && ele.duration <= Number(high)) && filters.category.includes(ele.category) );
      //ele.category == filters.category[0]
    })
    console.log('me here',res)
    return res;
  }
  // Place holder for functionality to work in the Stubs
  return list;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  // TODO: MODULE_FILTERS
  // 1. Store the filters as a String to localStorage
  filters = JSON.stringify(filters);
  localStorage.setItem('filters',filters);
  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
  // TODO: MODULE_FILTERS
  // 1. Get the filters from localStorage and return String read as an object
  let obj = localStorage.getItem('filters')
  if(obj){
    return JSON.parse(obj);
  }
  // Place holder for functionality to work in the Stubs
  return null;
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
  // TODO: MODULE_FILTERS
  // 1. Use the filters given as input, update the Duration Filter value and Generate Category Pills
  let parent = document.getElementById("category-list");
  let categoryArr = filters.category;
  console.log(categoryArr);
  categoryArr.forEach(ele =>{
    parent.innerHTML+=`<span class="category-filter">${ele}</span>`;
  }) 
}

export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};
