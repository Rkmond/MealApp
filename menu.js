const homeBtn = document.querySelector(".home-btn");
homeBtn.addEventListener('click', ()=>{
    window.location.href = 'index.html'
})

async function fetchMealsByName(letter) {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${letter}`);
      const data = await response.json();
  
      // Check if the request was successful
      if (data && data.meals) {
        // console.log(data.meals);
        return data.meals;
      } else {
        console.error("Error fetching data from the API.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

async function getMealObj(name){
    const meals = await fetchMealsByName(name);
    if(meals){
        return meals[0]
    }
}


let favouriteMeals = [];

function addRemoveFav(key, name){
    if(localStorage.favourites){
        favouriteMeals = JSON.parse(localStorage.favourites)
    }
    let index = favouriteMeals.indexOf(name)
    if(key=='add' && index==-1){
        favouriteMeals.push(name)
    }else if(key=='rev'){
        favouriteMeals.splice(index, 1)
    }
    localStorage.setItem('favourites', JSON.stringify(favouriteMeals));
    return index
}

// home page
function search(value){
    searchedCards.textContent = "";
    populateCards(value)
}

async function populateCards(val, div='searched') {
    const meals = await fetchMealsByName(val);
    if (meals) {
    // Process the fetched data here
    meals.forEach(data => {
        let card;
        if(div==='fav-page'){
            card = favCardTemplate.content.cloneNode(true).children[0];
            const removeBtn = card.querySelector('.remove-btn');
            removeBtn.addEventListener('click', (event)=>{
                event.preventDefault();
                window.location.href = 'favourites.html'
                addRemoveFav('rev', val)
            })
        }
        else{card = menuCardTemplate.content.cloneNode(true).children[0]}
        const image = card.querySelector('[data-image]');
        const name = card.querySelector('[data-name]');
        image.src = data.strMealThumb;
        name.textContent = data.strMeal;
        card.addEventListener('click', ()=>{
            sessionStorage.setItem('mealName', data.strMeal)
        })
        if(div==='searched'){
            searchedCards.append(card);
        }else if(div==='fav'){
            favItems.append(card)
        }
        else{
            favCardCont.append(card)
        }
    });
    }
    else{
        searchedCards.textContent = "No such menu found";
    }
}

const menuCardTemplate = document.querySelector("[menu-card-template]")
const searchedCards = document.querySelector('#search-cards');
const searchInput = document.querySelector('#search');
const searchIcon = document.getElementById('searchicon');
const favItems = document.querySelector("#favourite")


// details page
const favBtn = document.getElementById('fav-btn')
const menuName = document.getElementById("menu-det-name");
const menuImage = document.getElementById("menu-det-image");
const ingredients = document.getElementById("ingredients");
const instructions = document.getElementById("instructions");


function fillIngreds(newObj){
    for(let i=1; i<=20; i++){
        if(newObj[`strIngredient${i}`]!=null){
            let newli = document.createElement('li');
            let text = newObj[`strMeasure${i}`]+' '+newObj[`strIngredient${i}`]
            newli.textContent = text;
            ingredients.append(newli);
        }
    }
}

async function filldetails(newObj){
    newObj = await newObj;
    const name = newObj.strMeal;
    const imageUrl = newObj.strMealThumb;
    const instruct = newObj.strInstructions;
    if(addRemoveFav('none', name)>=0){
        favBtn.textContent = 'Added to Favoutites';
    }
    menuName.textContent = name;
    menuImage.src = imageUrl;
    instructions.textContent = instruct;
    fillIngreds(newObj);
}


//favourite page
const favCardTemplate = document.querySelector('[fav-card-template]')
const favCardCont = document.querySelector('#fav-card-container')




// combining
if (window.location.pathname === '/index.html') {
    // Code specific to index.html
    console.log("inside index")
    if(localStorage.favourites && JSON.parse(localStorage.favourites).length>0){
        favouriteMeals = JSON.parse(localStorage.favourites)
        for(let i=0; i<4; i++){
            if(favouriteMeals[i]){
                populateCards(favouriteMeals[i], 'fav')
            }
        }
    }
    else{
        favItems.textContent = 'No Favourite Meals Found'
    }
    searchInput.addEventListener('input', (e)=>{
        const value = e.target.value;
        search(value)
    })

    searchInput.addEventListener('keydown', (e)=>{
        if(e.key==='Enter'){
            let val = searchInput.value
            search(val)
            searchInput.value ='';
        }
    })

    searchIcon.addEventListener('click', ()=>{
        let val = searchInput.value
        search(val)
        searchInput.value = '';
    })

} else if (window.location.pathname === '/menudetails.html') {
    // Code specific to menudetails.html
    console.log("inside details")
    const mname = sessionStorage.mealName;
    const newObj = getMealObj(mname);
    filldetails(newObj)
    favBtn.addEventListener('click', ()=>{
        addRemoveFav('add', mname);
        favBtn.textContent = 'Added to Favoutites'
    })
}else if(window.location.pathname === '/favourites.html'){
    console.log('inside favourite')
    if(localStorage.favourites && JSON.parse(localStorage.favourites).length>0){
        favouriteMeals = JSON.parse(localStorage.favourites)
        favouriteMeals.forEach(data=>{
            populateCards(data, 'fav-page')
        })
    }
    else{
        favCardCont.textContent = 'No Favourite Meals Found'
    }
}


