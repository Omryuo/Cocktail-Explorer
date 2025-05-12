const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('view engine', 'ejs');

// Base API URL
const COCKTAIL_API_BASE = 'https://www.thecocktaildb.com/api/json/v1/1';

// Routes
app.get('/', async (req, res) => {
  try {
    // Fetch a random cocktail on homepage
    const response = await axios.get(`${COCKTAIL_API_BASE}/random.php`);
    const cocktail = response.data.drinks[0];
    
    // Prepare ingredients list
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({
          name: ingredient,
          measure: measure ? measure.trim() : 'To taste'
        });
      }
    }

    res.render('index', { 
      cocktail: cocktail, 
      ingredients: ingredients 
    });
  } catch (error) {
    console.error('Error fetching random cocktail:', error);
    res.status(500).render('error', { 
      message: 'Unable to fetch cocktail data',
      error: error.message 
    });
  }
});

// Search Route
app.get('/search', async (req, res) => {
  const query = req.query.cocktail;
  
  if (!query) {
    return res.render('search', { cocktails: null, query: null });
  }

  try {
    const response = await axios.get(`${COCKTAIL_API_BASE}/search.php`, {
      params: { s: query }
    });

    const cocktails = response.data.drinks || [];
    
    res.render('search', { 
      cocktails: cocktails, 
      query: query 
    });
  } catch (error) {
    console.error('Error searching cocktails:', error);
    res.status(500).render('error', { 
      message: 'Error searching cocktails',
      error: error.message 
    });
  }
});

// Cocktail Details Route
app.get('/cocktail/:id', async (req, res) => {
  try {
    const response = await axios.get(`${COCKTAIL_API_BASE}/lookup.php`, {
      params: { i: req.params.id }
    });

    const cocktail = response.data.drinks[0];
    
    // Prepare ingredients list
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({
          name: ingredient,
          measure: measure ? measure.trim() : 'To taste'
        });
      }
    }

    res.render('cocktail', { 
      cocktail: cocktail, 
      ingredients: ingredients 
    });
  } catch (error) {
    console.error('Error fetching cocktail details:', error);
    res.status(500).render('error', { 
      message: 'Unable to fetch cocktail details',
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});