import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [sectionTitle, setSectionTitle] = useState({ en: 'Categories', az: 'Kateqoriyalar' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
const { language } = useLanguage();

    useEffect(() => {
   const fetchCategories = async () => {
    try {
        setLoading(true);
        // Add cache-busting query parameter
        const timestamp = new Date().getTime();
        const response = await fetch(`https://raw.githubusercontent.com/kenanmusali/ByNaghiyev-Backend/refs/heads/main/src/data/category-data.json?_=${timestamp}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch categories data');
        }
        
        const data = await response.json();
        setCategories(data.categories);
        if (data.sectionTitle) setSectionTitle(data.sectionTitle);
        setLoading(false);
    } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching categories:', err);
    }
};

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className='Category-Group'>
                <div className="loading-container">
                    <p>Loading categories...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='Category-Group'>
                <div className="error-container">
                    <p>Error loading categories: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='Category-Group'>
            {categories.map((category) => (
                <div key={category.id} className="CategoryItem">
                    <img src={category.icon} alt={category.name[language]} />
                    <h2>{category.name[language]}</h2>
                    <p>{category.description[language]}</p>
                </div>
            ))}
        </div>
    )
}

export default Category