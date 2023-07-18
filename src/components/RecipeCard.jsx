import React from 'react';
import {Link, useNavigate} from "react-router-dom";

const RecipeCard = ({ recipe, selected, onLeftClick, onRightClick  }) => {

    const navigate = useNavigate();

    const handleCardClick = () => {
        onLeftClick(recipe);
        navigate(`/recipe/${recipe.id}`);
    };


    return (
        <div
            className={`card ${selected ? 'selected' : ''}`}
            onClick={onLeftClick}
            onContextMenu={(event) => {
                event.preventDefault();
                onRightClick();
            }}
        >
            <div className="card-body" onClick={handleCardClick}>
                <h5 className="card-title">{recipe.name}</h5>
                <p className="card-text">{recipe.description}</p>
            </div>
        </div>
    );
};

export default RecipeCard;