const meals = [
  {
    name: "🥚 Healthy Egg Toast",
    time: "10 minutes",
    ingredients: ["egg", "bread", "tomato"],
    missing: ["egg", "bread", "tomato"],
    description: "A quick and light breakfast with egg, toast and fresh tomato."
  },
  {
    name: "🥗 Tuna Avocado Salad",
    time: "10 minutes",
    ingredients: ["tuna", "avocado", "lettuce", "tomato"],
    missing: ["tuna", "avocado", "lettuce", "tomato"],
    description: "A fresh and simple salad that is perfect for a light meal."
  },
  {
    name: "🍳 Tomato Egg Rice",
    time: "15 minutes",
    ingredients: ["egg", "rice", "tomato", "onion"],
    missing: ["egg", "rice", "tomato", "onion"],
    description: "Simple egg and tomato rice for a quick student meal."
  },
  {
    name: "🥪 Tuna Cheese Toast",
    time: "10 minutes",
    ingredients: ["tuna", "bread", "cheese"],
    missing: ["tuna", "bread", "cheese"],
    description: "A quick toasted sandwich with tuna and cheese."
  },
  {
    name: "🥗 Chicken Lettuce Wrap",
    time: "20 minutes",
    ingredients: ["chicken", "lettuce", "tomato", "onion"],
    missing: ["chicken", "lettuce", "tomato", "onion"],
    description: "A light chicken wrap with fresh vegetables."
  }
];

let currentMeals = [];
let currentMealIndex = 0;

function showPage(page) {
  const findPage = document.getElementById("findPage");
  const favouritesPage = document.getElementById("favouritesPage");

  if (page === "find") {
    findPage.style.display = "block";
    favouritesPage.style.display = "none";
  } else {
    findPage.style.display = "none";
    favouritesPage.style.display = "block";
    showFavourites();
  }
}

function getSelectedIngredients() {
  const checkboxes = document.querySelectorAll(
    '.ingredients input[type="checkbox"]:checked'
  );

  return Array.from(checkboxes).map(checkbox => checkbox.value);
}

function findMeal() {
  const selected = getSelectedIngredients();
  const message = document.getElementById("message");
  const result = document.getElementById("mealResult");

  result.innerHTML = "";

  if (selected.length === 0) {
    message.textContent = "⚠️ Please select at least one ingredient.";
    return;
  }

  currentMeals = meals.filter(meal => {
    const missingCount = meal.ingredients.filter(
      ingredient => !selected.includes(ingredient)
    ).length;

    return missingCount <= 2;
  });

  if (currentMeals.length === 0) {
    message.textContent =
      "😕 No suitable meal found. Please select different ingredients.";
    return;
  }

  message.textContent = "✨ Here's a meal you can make!";

  currentMealIndex = 0;
  showMeal(currentMeals[currentMealIndex], selected);
}

function showMeal(meal, selected) {
  const result = document.getElementById("mealResult");

  const missingIngredients = meal.ingredients.filter(
    ingredient => !selected.includes(ingredient)
  );

  let missingText = "";

  if (missingIngredients.length > 0) {
    missingText = `
      <div class="missing">
        🛒 Missing: ${missingIngredients.join(", ")}
      </div>
    `;
  } else {
    missingText = `
      <div class="missing">
        ✅ You have all the ingredients!
      </div>
    `;
  }

  result.innerHTML = `
    <div class="meal-card">
      <h3>${meal.name}</h3>

      <div class="meal-info">
        ⏱️ ${meal.time}
      </div>

      <p>${meal.description}</p>

      ${missingText}

      <button class="favourite-btn" onclick="saveFavourite('${meal.name}')">
        ⭐ Favourite
      </button>

      <button class="another-btn" onclick="tryAnotherMeal()">
        🔄 Try Another Meal
      </button>
    </div>
  `;
}

function tryAnotherMeal() {
  if (currentMeals.length === 0) {
    return;
  }

  currentMealIndex++;

  if (currentMealIndex >= currentMeals.length) {
    currentMealIndex = 0;
  }

  const selected = getSelectedIngredients();

  showMeal(currentMeals[currentMealIndex], selected);
}

function saveFavourite(mealName) {
  let favourites = JSON.parse(
    localStorage.getItem("pantryPalFavourites")
  ) || [];

  const meal = meals.find(item => item.name === mealName);

  if (!meal) {
    return;
  }

  const alreadySaved = favourites.some(
    item => item.name === meal.name
  );

  if (!alreadySaved) {
    favourites.push(meal);

    localStorage.setItem(
      "pantryPalFavourites",
      JSON.stringify(favourites)
    );

    alert("⭐ Meal saved to My Favourites!");
  } else {
    alert("⭐ This meal is already in your favourites.");
  }
}

function showFavourites() {
  const favouritesList = document.getElementById("favouritesList");

  const favourites = JSON.parse(
    localStorage.getItem("pantryPalFavourites")
  ) || [];

  if (favourites.length === 0) {
    favouritesList.innerHTML = `
      <div class="meal-card">
        <p>⭐ You don't have any favourite meals yet.</p>
        <button class="another-btn" onclick="showPage('find')">
          🍳 Find a Meal
        </button>
      </div>
    `;
    return;
  }

  favouritesList.innerHTML = favourites.map(meal => `
    <div class="favourite-item">
      <h3>${meal.name}</h3>
      <p>⏱️ ${meal.time}</p>
      <p>${meal.description}</p>
    </div>
  `).join("");
}
