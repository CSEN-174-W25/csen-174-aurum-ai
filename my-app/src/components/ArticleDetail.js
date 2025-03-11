import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import articlesData from './articlesData';
import './styles/ArticleDetail.css';

const ArticleDetail = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);
    
    // Use the imported articles data
    const articles = articlesData;

    useEffect(() => {
        // Find the article that matches the slug
        const foundArticle = articles.find(article => article.slug === slug);
        
        if (foundArticle) {
            setArticle(foundArticle);
            
            // Find related articles in the same category (up to 3)
            const related = articles
                .filter(a => a.category === foundArticle.category && a.id !== foundArticle.id)
                .slice(0, 3);
            
            setRelatedArticles(related);
        }
    }, [slug, articles]);

    if (!article) {
        return <div className="article-not-found">Article not found</div>;
    }

    return (
        <div className="article-detail-container">
            <div className="article-header">
                <div className="breadcrumbs">
                    <Link to="/advice">Financial Advice</Link> &gt; 
                    <Link to={`/advice?category=${article.category}`}>{article.category}</Link> &gt; 
                    <span>{article.title}</span>
                </div>
                <span className="category-tag">{article.category}</span>
                <h1>{article.title}</h1>
                <div className="article-meta">
                    <span className="read-time">{article.readTime}</span>
                    {article.author && <span className="author">By {article.author}</span>}
                    {article.publishDate && <span className="publish-date">Published on {article.publishDate}</span>}
                </div>
            </div>
            
            <div className="article-content">
                {/* Render the article content as HTML */}
                {article.content ? (
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                ) : (
                    <p className="article-summary">{article.summary}</p>
                )}
            </div>
            
            {relatedArticles.length > 0 && (
                <div className="related-articles">
                    <h3>Related Articles</h3>
                    <div className="related-articles-grid">
                        {relatedArticles.map(relatedArticle => (
                            <Link 
                                to={`/advice/${relatedArticle.slug}`} 
                                className="related-article-card" 
                                key={relatedArticle.id}
                            >
                                <h4>{relatedArticle.title}</h4>
                                <p>{relatedArticle.summary.substring(0, 100)}...</p>
                                <span className="read-more-btn">Read More</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="back-to-articles">
                <Link to="/advice">← Back to All Articles</Link>
            </div>
        </div>
    );
};

export default ArticleDetail;