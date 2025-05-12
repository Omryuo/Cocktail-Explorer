document.addEventListener('DOMContentLoaded', () => {
    // Random Cocktail Button
    const randomCocktailBtn = document.getElementById('randomCocktail');
    
    if (randomCocktailBtn) {
        randomCocktailBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }

    // Search Form Validation
    const searchForm = document.querySelector('.search-form');
    
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            const searchInput = searchForm.querySelector('input[name="cocktail"]');
            
            if (!searchInput.value.trim()) {
                e.preventDefault();
                alert('Please enter a cocktail name to search.');
            }
        });
    }

    // Prevent double form submission
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', () => {
            const submitButtons = form.querySelectorAll('button[type="submit"]');
            submitButtons.forEach(button => {
                button.disabled = true;
                button.textContent = 'Searching...';
            });
        });
    });
});