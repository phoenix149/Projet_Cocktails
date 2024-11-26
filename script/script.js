let searchButton = document.getElementById('searchBut')
searchByingredients();



function searchByingredients(event){
  event.preventDefault();
  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    const searchType = searchByName.checked ? 'name' : 'ingredient';
    if (!query) return alert("Veuillez entrer un terme de recherche.");
    const endpoint = "www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita";
      searchType === 'name'
        ? `${API_BASE}search.php?s=${query}`
        : `${API_BASE}filter.php?i=${query}`;
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => displayResults(data.drinks))
      .catch(console.error);
      
  });
}
function searchByCocktailName (){
  preventDefault();

}
function shakeMeRandomCoktail () {
  preventDefault();
}