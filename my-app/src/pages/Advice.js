import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import articlesData from '../components/articlesData';
import './styles/Advice.css';

const Advice = () => {
    // Use the imported articles data
    const articles = articlesData;
    const [activeFilter, setActiveFilter] = useState('All');
    
    const categories = ['All', ...new Set(articles.map(article => article.category))];
    
    // Filter articles based on active filter
    const filteredArticles = activeFilter === 'All' 
        ? articles 
        : articles.filter(article => article.category === activeFilter);
    
    // Get featured articles
    const featuredArticles = articles.filter(article => article.featured);

    // Function to create route for article page
    const getArticleRoute = (slug) => `/advice/${slug}`;

    return (
        <div className="advice-container">
            <div className="advice-header">
                <h1>Financial Advice & Tips</h1>
                <p className="subtitle">
                    Discover personalized financial insights and expert guidance to help you achieve your financial goals.
                </p>
            </div>
            
            {/* Featured Articles Section */}
            <section className="featured-section">
                <h2 className="section-title">Featured Articles</h2>
                <div className="featured-articles">
                    {featuredArticles.map((article) => (
                        <Link to={getArticleRoute(article.slug)} className="article-link" key={article.id}>
                            <div className="featured-card">
                                <div className="featured-content">
                                    <span className="category-tag">{article.category}</span>
                                    <h3>{article.title}</h3>
                                    <p className="summary">{article.summary}</p>
                                    <div className="card-footer">
                                        <span className="read-time">{article.readTime}</span>
                                        <span className="read-more-btn">Read More</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            
            {/* All Articles Section with Category Filters */}
            <section className="all-articles-section">
                <div className="section-header">
                    <h2 className="section-title">Browse All Articles</h2>
                    <div className="category-filters">
                        {categories.map((category) => (
                            <button 
                                key={category}
                                className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                                onClick={() => setActiveFilter(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="articles-grid">
                    {filteredArticles.map((article) => (
                        <Link to={getArticleRoute(article.slug)} className="article-link" key={article.id}>
                            <div className="article-card">
                                <div className="article-content">
                                    <span className="category-tag">{article.category}</span>
                                    <h3>{article.title}</h3>
                                    <p className="summary">{article.summary}</p>
                                    <div className="card-footer">
                                        <span className="read-time">{article.readTime}</span>
                                        <span className="read-more-btn">Read More</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            
            {/* Newsletter Signup Section */}
            <section className="newsletter-section">
                <div className="newsletter-container">
                    <div className="newsletter-content">
                        <h2>Stay Updated with Financial Tips</h2>
                        <p>Subscribe to our newsletter for the latest financial advice and market insights.</p>
                    </div>
                    <div className="newsletter-form">
                        <input type="email" placeholder="Enter your email" className="email-input" />
                        <button className="subscribe-btn">Subscribe</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Advice;