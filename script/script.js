let searchButton = document.getElementById('searchBut');
let ingrR = document.getElementById('ingR');
let cockR = document.getElementById('cockR');
let form = document.getElementById('form');
let text = document.getElementById('searchChamps');
let shakeM = document.getElementById('shakebutton');
let cardConteneur = document.getElementById('cocktailsConteneur');

let cocktByName = new Array();
let cockByIngre = new Array();


const API_BASE = "https://www.thecocktaildb.com/api/json/v1/1/";

shakeM.addEventListener('click', shakeMeRandomCoktail)

form.addEventListener("submit", click);
function click(event) {
  event.preventDefault();
  const query = text.value.trim();
  console.log(text.value);

  if (ingrR.checked == true && text.value !== "") {
    console.log("Vous avez choisi la recherche par ingredient");
    let endpoint =
      `${API_BASE}filter.php?i=${query}`;
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => AfficheCByCName(data.drinks))
      .catch(console.error);
    console.log(endpoint);

  }
  else if (ingrR.checked == false && cockR.checked == false) {
    alert("Vous n'avez pas coché quel type de recherche vous souhaitiez faire, par nom de cocktail ou par ingrédient ?");
  }
  else if (text.value == null || text.value == undefined || text.value === "") {
    alert("Vous n'avez rien entré");
  }
  else {
    console.log("Vous avez choisi la recherche par Nom de Cocktail");

    let endpoint =
      `${API_BASE}search.php?s=${query}`
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => AfficheCByCName(data.drinks))
      .catch(console.error);
    console.log(endpoint);
  }
}


function shakeMeRandomCoktail() {
  console.log("Vous avez choisi la fonction random cocktail");
}




function AfficheCByCName(drinks) {
  cardConteneur.innerHTML="";
  drinks.forEach(_cocktail => {
    console.log(cardConteneur);
    let ACocktail = document.createElement('article');
    ACocktail.setAttribute("class", "card");

    let cocktailName = _cocktail.strDrink;
    ACocktail.innerHTML = '<img src="'+ _cocktail.strDrinkThumb + '"/><h5>' + cocktailName + '</h5>'+ '<button type="button" class="btn btn-danger">Afficher plus ...</button>';
    cardConteneur.appendChild(ACocktail);

  });

}