import React, { useEffect, useRef, useState } from 'react';
import { useStore } from './store';
import './App.css';
import RecipeCard from './components/RecipeCard';
import Button from 'react-bootstrap/Button';
import RecipePage from './components/RecipePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    const { recipes, selectedRecipes, fetchRecipes, selectRecipe, deleteSelectedRecipes, totalRecipes } = useStore();
    const [page, setPage] = useState(1);
    const [visibleRecipes, setVisibleRecipes] = useState(15);
    const [lastPage, setLastPage] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const visibleRecipesRef = useRef(15);
    const [changeTotalRecipes, setChangeTotalRecipes] = useState(0);

    useEffect(() => {
        fetchRecipes(page, lastPage);
        setLastPage(false);
    }, [page]);

    // Update the ref whenever the visibleRecipes state changes
    useEffect(() => {
        visibleRecipesRef.current = visibleRecipes;
    }, [visibleRecipes]);

    useEffect(() => {
        window.addEventListener('scroll', handleLazyScroll);
        return () => {
            window.removeEventListener('scroll', handleLazyScroll);
        };
    }, []);

    // Check if the visibleRecipes should be updated based on totalRecipes and changeTotalRecipes
    useEffect(() => {
        if (totalRecipes !== 0) {
            if (((totalRecipes - changeTotalRecipes) - visibleRecipesRef.current) < 5 && (totalRecipes - changeTotalRecipes) !== 0) {
                setLastPage(true);
                setPage(page + 1);
            }
        }
    }, [visibleRecipes, changeTotalRecipes]);

    const handleLazyScroll = () => {
        if (isFetching) return;

        const scrolledToBottom =
            document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight;

        if (scrolledToBottom && visibleRecipesRef.current < 325) {
            // Scroll to the previous position before fetching more recipes
            window.scrollTo(0, window.scrollY - 200);

            setIsFetching(true);

            // Simulate a delay before updating the visibleRecipes state
            setTimeout(() => {
                setVisibleRecipes(prevVisibleRecipes => prevVisibleRecipes + 5);
                setIsFetching(false);
            }, 300);
        }

        const scrolledToTop = window.scrollY === 0;

        if (scrolledToTop && visibleRecipesRef.current > 15) {
            // Scroll to the previous position before updating the visibleRecipes state
            setTimeout(() => {
                window.scrollTo(0, window.scrollY + 200);
                setVisibleRecipes(prevVisibleRecipes => prevVisibleRecipes - 5);
                setIsFetching(false);
            }, 300);
        }
    };

    const openRecipePage = recipeId => {
        console.log(`Open recipe page for recipe with ID: ${recipeId}`);
    };

    const handleDeleteClick = () => {
        // Increase the changeTotalRecipes based on the selectedRecipes length
        setChangeTotalRecipes(changeTotalRecipes => changeTotalRecipes + selectedRecipes.length);

        deleteSelectedRecipes();
    };

    // Calculate the start index for slicing the recipes array
    const startIdx = Math.max(visibleRecipes - 15, 0);
    const renderedRecipes = recipes.slice(startIdx, visibleRecipes);

    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={
                            <div>
                                {selectedRecipes.length > 0 && (
                                    <div className="button-container">
                                        <Button onClick={handleDeleteClick}>Delete</Button>
                                    </div>
                                )}
                                <div className="d-flex flex-wrap ">
                                    {renderedRecipes.map((recipe, index) => (
                                        <div key={index}>
                                            <RecipeCard
                                                recipe={recipe}
                                                selected={selectedRecipes.includes(recipe)}
                                                onRightClick={() => selectRecipe(recipe)}
                                                onLeftClick={() => openRecipePage(recipe.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                    />
                    <Route path="/recipe/:id" element={<RecipePage recipes={recipes} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;