import create from 'zustand';

export const useStore = create((set) => ({
    recipes: [],
    selectedRecipes: [],
    totalRecipes: 0,

    fetchRecipes: async (page, lastPage) => {
        try {

            const response = await fetch(`https://api.punkapi.com/v2/beers?page=${page}`);
            const data = await response.json();


            set((state) => ({
                recipes: [...state.recipes, ...data] }));

            if(lastPage){
                set((state) => ({
                    totalRecipes: state.totalRecipes + data.length,
                }));
            }
            else if(page === 1){
                set((state) => ({
                    totalRecipes: data.length,
                }));
            }



        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    },

    fetchRecipes2: async (recipes) => {
        try {
            // Calculate the page number based on the current number of recipes
            const currentPage = Math.ceil(recipes.length / 15) + 1;
            const response = await fetch(`https://api.punkapi.com/v2/beers?page=${currentPage}`);
            const data = await response.json();

            // Append the new recipes to the existing recipes array
            set((state) => ({ recipes: [...state.recipes, ...data] }));
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    },


    selectRecipe: (recipe) => {
        set((state) => ({
            selectedRecipes: state.selectedRecipes.includes(recipe)
                ? state.selectedRecipes.filter((r) => r !== recipe)
                : [...state.selectedRecipes, recipe],
        }));
    },

    deleteSelectedRecipes: () => {
        set((state) => ({
            recipes: state.recipes.filter((recipe) => !state.selectedRecipes.includes(recipe)),
            selectedRecipes: [],
        }));
    },
}));