import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {Col, Container, Row} from "react-bootstrap";

const RecipePage = ({ recipes }) => {
    const { id } = useParams();
    const recipeId = parseInt(id, 10); // Перетворення рядкового значення на числове
    const recipe = recipes.find((recipe) => recipe.id === recipeId);

    if (!recipe) {
        return <div>Page loading</div>;
    }

    const { name, description, image_url } = recipe;

    return (
        <Container>
            <Row>
                <Col md={4}>
                    <img className="img-fluid" src={image_url} alt="Recipe" />
                </Col>
                <Col md={8}>
                    <h1>{name}</h1>
                    <p>{description}</p>
                    {/* Add more recipe details */}
                </Col>
            </Row>
        </Container>
    );
};
export default RecipePage;