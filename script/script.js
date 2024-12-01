// Récupère les éléments DOM nécessaires
let searchButton = document.getElementById('searchBut');
let ingrR = document.getElementById('ingR');
let cockR = document.getElementById('cockR');
let form = document.getElementById('form');
let text = document.getElementById('searchChamps');
let shakeM = document.getElementById('shakebutton');
let cardConteneur = document.getElementById('cocktailsConteneur');
let modalTitle = document.getElementById('modalTitle');
let modalImage = document.getElementById('modalImage');
let modalIngredients = document.getElementById('modalIngredients');
let modalInstructions = document.getElementById('modalInstructions');

// Déclaration des tableaux pour stocker les cocktails
let cocktByName = new Array();
let cockByIngre = new Array();

// Base de l'URL de l'API pour les cocktails
const API_BASE = "https://www.thecocktaildb.com/api/json/v1/1/";

// Ajoute un écouteur d'événement pour le bouton "shakebutton"
shakeM.addEventListener('click', shakeMeRandomCoktail);

// Ajoute un écouteur d'événement pour le formulaire
form.addEventListener("submit", click);

// Fonction appelée lors de la soumission du formulaire
function click(event) {
  // Empêche le comportement par défaut de soumission du formulaire
  event.preventDefault();

  // Récupère la valeur entrée dans le champ de recherche
  const query = text.value.trim();
  console.log(text.value);

  // Vérifie si la recherche par ingrédient est cochée et si le champ de recherche n'est pas vide
  if (ingrR.checked == true && text.value !== "") {
    console.log("Vous avez choisi la recherche par ingrédient");

    // Définit l'URL de l'API pour la recherche par ingrédient
    let endpoint = `${API_BASE}filter.php?i=${query}`;

    // Fait une requête fetch à l'API
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        // Vérifie si des résultats sont retournés
        if (Array.isArray(data.drinks)) {
          AfficheCByCName(data.drinks);
        } else {
          alert("L'ingrédient choisi ne figure pas dans la liste");
        }
      })
      .catch(console.error);
  }
  // Vérifie si aucune option de recherche n'est cochée
  else if (ingrR.checked == false && cockR.checked == false) {
    alert("Vous n'avez pas coché quel type de recherche vous souhaitiez faire, par nom de cocktail ou par ingrédient ?");
  }
  // Vérifie si le champ de recherche est vide ou non défini
  else if (text.value == null || text.value == undefined || text.value === "") {
    alert("Vous n'avez rien entré");
  }
  else {
    console.log("Vous avez choisi la recherche par Nom de Cocktail");

    // Définit l'URL de l'API pour la recherche par nom de cocktail
    let endpoint = `${API_BASE}search.php?s=${query}`;

    // Fait une requête fetch à l'API
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        // Vérifie si des résultats sont retournés
        if (Array.isArray(data.drinks)) {
          AfficheCByCName(data.drinks);
        } else {
          alert("Le cocktail que vous avez saisi ne figure pas dans notre base de données.");
        }
      })
      .catch(console.error);
  }
}

// Fonction pour afficher un cocktail aléatoire
function shakeMeRandomCoktail() {
  console.log("Vous avez choisi la fonction random cocktail");

  // Définir l'endpoint pour la requête API
  let endpoint = `${API_BASE}random.php`;
  
  // Effectuer la requête fetch pour obtenir un cocktail aléatoire
  fetch(endpoint)
    .then((response) => response.json())  // Convertir la réponse en JSON
    .then((data) => {
      console.log(data.drinks);  // Afficher les données obtenues dans la console
      
      // Appeler la fonction ModalDetails avec les détails du premier cocktail
      ModalDetails(data.drinks[0]);
      
      // Récupérer le nom du cocktail
      let cockShake = data.drinks[0].strDrink;
      
      // Récupérer l'élément HTML avec l'ID 'titleCocktail'
      let titleCocktail = document.getElementById('titleCocktail');
      
      // Réinitialiser le contenu de l'élément pour éviter l'accumulation
      titleCocktail.innerHTML = '';
      
      // Définir le texte du paragraphe
      titleCocktail.textContent = '"' + cockShake + '"';
      console.log(cockShake);
    })
    .catch((error) => {
      // Gérer les erreurs potentielles lors de la requête
      console.error('Erreur:', error);
    });
}

// Fonction pour obtenir les détails d'un cocktail par son ID
function getDetails(id) {
  let endpoint = `${API_BASE}lookup.php?i=${id}`;
  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.drinks);
      ModalDetails(data.drinks[0]);
    })
    .catch(console.error);
}

// Fonction pour afficher les détails d'un cocktail dans une modal
function ModalDetails(drink) {
  // Définir le contenu HTML de la modal avec les détails du cocktail
  modalTitle.innerHTML = `<h4>` + drink.strDrink + `</h4>
         <div class="container-fluid"> 
            <div class="row">
                <div class="col-md-4">
                    <p><strong>Category :</strong> ${drink.strCategory}</p>
                </div>
                <div class="col-md-4">
                    <p><strong>Glass To Use :</strong> ${drink.strGlass}</p>
                </div>
                <div class="col-md-4">
                    <p><strong>Type :</strong> ${drink.strAlcoholic}</p>
                </div>
            </div>
        </div> `;
  modalImage.src = drink.strDrinkThumb;

  // Vider le contenu précédent des ingrédients
  modalIngredients.innerHTML = "";

  // Liste des ingrédients avec dosages
  // je récupère toutes les clés (propriétés de l'objet drink)
  Object.keys(drink)
    .filter((key) => key.startsWith('strIngredient') && drink[key]) // je filtre les clés et ne récupère que celles qui commencent par strIngredient
    .forEach((key, index) => { // puis je boucle dessus
      const ingredient = drink[key];
      const measureKey = `strMeasure${index + 1}`;
      const measure = drink[measureKey] || "Not specified quantity";
      modalIngredients.innerHTML += `<li>${ingredient} - ${measure}</li>`;
    });

  // Définir les instructions du cocktail
  modalInstructions.textContent = drink.strInstructions;
}

// Fonction pour afficher les cocktails dans le conteneur de cartes
function AfficheCByCName(drinks) {
  // Vider le conteneur de cartes
  cardConteneur.innerHTML = "";

  // Parcourt chaque cocktail et crée un élément article pour chacun
  drinks.forEach(_cocktail => {
    let ACocktail = document.createElement('article');
    ACocktail.setAttribute("class", "card h-100 flex-wrap");

    // Récupérer le nom du cocktail
    let cocktailName = _cocktail.strDrink;

    // Définir le contenu HTML de la carte du cocktail
    ACocktail.innerHTML = '<img src="' + _cocktail.strDrinkThumb + '" class="imgCard"/><h5 class="cName">' + cocktailName + '</h5>' + '<button type="button" class="btn btn-danger boutonAF" data-bs-target="#detailsModal" data-bs-toggle="modal" onclick="getDetails(' + _cocktail.idDrink + ')">Afficher plus ...</button>';

    // Ajouter la carte du cocktail au conteneur
    cardConteneur.appendChild(ACocktail);
  });
}
