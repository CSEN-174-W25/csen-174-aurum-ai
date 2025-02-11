import React from 'react';

const AdvicePage = () => {
    // Sample article data
    const articles = [
        {
            id: 1,
            category: "Budgeting",
            title: "Smart Budgeting for Young Professionals",
            summary: "Learn effective strategies to manage your income and expenses...",
            readTime: "5 min read"
        },
        {
            id: 2,
            category: "Investing",
            title: "Getting Started with Investment Basics",
            summary: "Understanding fundamental investment concepts and strategies...",
            readTime: "7 min read"
        },
        {
            id: 3,
            category: "Real Estate",
            title: "Rent vs. Buy: Making the Right Choice",
            summary: "Analyze the pros and cons of renting versus buying a home...",
            readTime: "6 min read"
        }
    ];

    return (
        <>
            <div className="container">
                <div className="header">
                    <h1>Financial Advice & Tips</h1>
                    <p className="subtitle">
                        Discover personalized financial insights and expert guidance to help you achieve your financial goals.
                    </p>
                </div>
                <div className="articles-grid">
                    {articles.map((article) => (
                        <div className="article-card" key={article.id}>
                            <div className="article-content">
                                <span className="category">{article.category}</span>
                                <h2>{article.title}</h2>
                                <p className="summary">{article.summary}</p>
                                <span className="read-time">{article.readTime}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default AdvicePage;