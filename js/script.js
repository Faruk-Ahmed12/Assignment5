const searchInput = document.getElementById("search-input");
const mealItemsPanel = document.getElementById("meal-item-panel");
const row = document.getElementById("row");
const searchBtn = document.getElementById("search-btn");

// Search button event handler
searchBtn.addEventListener("click", eventApiWorks);

// input event handler
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    eventApiWorks();
  }
});

// API function JS
function eventApiWorks() {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput.value}`)
    .then((res) => res.json())
    .then((data) => {
      let allItemSearcher = "";
      if (data.meals) {
        data.meals.map((meal) => {
          allItemSearcher += `<div class="col-md-3">
                    <div class="item" mealId="${meal.idMeal}">
                    <a href="#" class="recipe-btn">
                        <img src = "${meal.strMealThumb}" id="meal-thumb" class="w-100 img-fluid">
                        <p id="meal-name">${meal.strMeal}</p>
                    </a>
                    </div>
                </div>`;
        });
        row.classList.remove("wrongMsg");
      } else {
        allItemSearcher = `Sorry, we didn't match your meal Name!`;
        row.classList.add("wrongMsg");
      }
      if (searchInput.value === "") {
        allItemSearcher = `Please Type A Food Name!!!`;
        row.classList.add("wrongMsg");
      }
      document.getElementById("row").innerHTML = allItemSearcher;
    });
}
// Meals
function getMealId(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.meals[0]);
      const meal = data.meals[0];
      mealDetailsContent(meal);
      mealItemsPanel.style.display = 'none';
    });
}

// meal id found
row.addEventListener("click", (e) => {
  const meals = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("item");
    } else {
      return false;
    }
  });
  if (meals) {
    const mealId = meals.getAttribute("mealId");
    getMealId(mealId);
  }
});


function mealDetailsContent(meal) {
  let strIngredient = [];
  for (let i = 1; i <= 15; i++) {
    if (meal[`strIngredient${i}`]) {
      strIngredient.push(
        `${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`
      );
    }
  }
  let mealContent = `
  <div class="row mt-3 mb-3">
      <div class="col-md-6 m-auto">
          <div id="meal-contents">
              <img src="${meal.strMealThumb}" class="img-fluid" />
          </div>
          <div class="meal-name">
              <h2>${meal.strMeal}</h2>
          </div>
              <span id="indgra-heading">Ingradients</span>
          <ul id="ingradients">
          ${strIngredient.map(ingradient=>`<li><span><i class="fas fa-check-square"></i></span> ${ingradient}</li>`).join(' ')}
          </ul>
      </div>
  </div>
  `
  document.getElementById("meal-content").innerHTML = mealContent;
}