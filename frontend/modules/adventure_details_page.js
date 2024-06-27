import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Get the Adventure Id from the URL
  let data = new URLSearchParams(search);
  let id = data.get("adventure")
  console.log(id);
  if(id){
    return id;
  }
  // Place holder for functionality to work in the Stubs
  return null;
}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Fetch the details of the adventure by making an API call
  try{
    let respo = await fetch(`${config.backendEndpoint}/adventures/detail?adventure=${adventureId}`);
    let data = await respo.json();
    console.log(data)
  
    return data;
  }
  catch(err){
    return null;

  }
  // Place holder for functionality to work in the Stubs
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the details of the adventure to the HTML DOM
  let nameEle = document.getElementById('adventure-name');
  let subtitleEle = document.getElementById('adventure-subtitle');
  let imageEle = document.getElementById('photo-gallery');
  let contentEle = document.getElementById('adventure-content');
  
  nameEle.textContent = adventure.name;
  subtitleEle.textContent = adventure.subtitle;
  
  let imageArr = adventure.images;
  let newImageArr = imageArr.map(img=>{
    let parent = createEle('div');

    let imageChild = createEle('img');
    imageChild.setAttribute('src',img);
    imageChild.setAttribute('alt','image not found');
    imageChild.setAttribute('class','activity-card-image')

    parent.append(imageChild);
    return parent;
  })
  //console.log(newImageArr)
  newImageArr.forEach(eachImg=>{
    imageEle.append(eachImg)
  })
  contentEle.textContent = adventure.content;
}
function createEle(ele){
  let res = document.createElement(ele);
  return res;
}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the bootstrap carousel to show the Adventure 
  let ele = document.getElementById('photo-gallery');
  ele.innerHTML="";

  let carouselSlide = createEle('div');
  carouselSlide.setAttribute('class','carousel slide');
  carouselSlide.setAttribute('id','carouselExampleIndicators');

  carouselSlide.innerHTML=`
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>`

  let parent = createEle('div');
  parent.setAttribute('class','carousel-inner');

  let arrImages = images.map((ele,i)=>{
    let child = createEle('div');
    if(i==0){
      child.setAttribute('class','carousel-item active');
    }else{
      child.setAttribute('class','carousel-item');
    }
    let image = createEle('img');
    image.setAttribute('src',ele);
    image.setAttribute('alt','image not found');
    image.setAttribute('class','activity-card-image');
    child.append(image);
    return child;
  })

  arrImages.forEach(eachEle=>{
    parent.append(eachEle);
  })
  carouselSlide.append(parent);
  
  carouselSlide.innerHTML+=`<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
  <span class="visually-hidden">Previous</span>
</button>
<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
  <span class="carousel-control-next-icon" aria-hidden="true"></span>
  <span class="visually-hidden">Next</span>
</button>`

  ele.append(carouselSlide)
}

//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If the adventure is already reserved, display the sold-out message.
  let soldOut = document.getElementById('reservation-panel-sold-out');
  let mForm = document.getElementById('reservation-panel-available');

  let cost = document.getElementById('reservation-person-cost');
  
  if(adventure.available){
    soldOut.style.display = 'none';
    mForm.style.display='block';
    cost.textContent = adventure.costPerHead;

  }
  else{
    mForm.style.display='none';
    soldOut.style.display='block';
  }

}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  // TODO: MODULE_RESERVATIONS
  // 1. Calculate the cost based on number of persons and update the reservation-cost field
  let totalfield = document.getElementById('reservation-cost');
  //console.log(typeof persons);
  let totalCost = adventure.costPerHead*Number(persons);
  totalfield.textContent = totalCost;
  //console.log(totalCost) 
}




function captureFormSubmit(adventure) {
  //Implementation of reservation form submission
  let resObj;
  // TODO: MODULE_RESERVATIONS
  // 1. Capture the query details and make a POST API call using fetch() to make the reservation
  document.getElementById('myForm').addEventListener('submit',(event)=>{
    //console.log(location)
    event.preventDefault();
    let ele = document.getElementById('myForm');
    
    let name = ele.elements['name'].value;
    let date = ele.elements['date'].value;
    let person = ele.elements['person'].value;
    //console.log(name,date,person);
    resObj = {'name':name,'date':date,'person':person};
    
    //console.log(resObj)
    resObj['adventure'] = adventure.id;
    console.log(resObj)
    async function exec(){
      try{
       let res = await fetch(`${config.backendEndpoint}/reservations/new`,{
          method:'POST',
          body:JSON.stringify(resObj),
          headers:{
            'Content-type':'application/json'
          }
      })
      alert('success')
      }
      catch(err){
        alert('afiled')
      }
     
      location.reload();
    }
    exec()
      // fetch(`${config.backendEndpoint}/reservations/new`,{
      //   method:'POST',
      //   body:JSON.stringify(resObj),
      //   headers:{
      //     'Content-type':'application/json'
      //   }
      // }).then(resp=>resp.json()).then(data=>alert('Success!')).catch((err)=>alert('Failed (try again)'));
       

     
  })
  
  
  // 2. If the reservation is successful, show an alert with "Success!" and refresh the page. If the reservation fails, just show an alert with "Failed!".
}



//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If user has already reserved this adventure, show the reserved-banner, else don't
  let ele =  document.getElementById('reserved-banner');
  console.log(adventure)
  if(adventure.reserved){
    ele.style.display = 'block';
  }
  else{
    ele.style.display = 'none'
  }
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
