"use client";

import { use, useEffect, useState } from 'react';
import { getData, serverURL } from '@/app/services/FetchNodeServices';

const BlogDetail = ({ params }) => {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = use(params); // Getting the dynamic ID from URL

    useEffect(() => {
        if (!id) return;

        const fetchBlogData = async () => {
            try {
                const response = await getData(`api/blogs/get-blog-by-id/${id}`);
                const blogData = await response?.blog;
                setBlog(blogData);
            } catch (error) {
                console.error("Failed to fetch blog data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogData();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!blog) return <p>Blog not found</p>;

    return (
        <>
            <style jsx>{`
                @media (max-width: 768px) {
                    .container {
                        padding: 15px;
                    }
                    .image {
                        width: 100%;
                        height: auto;
                    }
                    .title {
                        font-size: 28px;
                        text-align: center;
                    }
                    .description {
                        font-size: 16px;
                        text-align: left;
                        padding: 0;
                    }
                }
                @media (max-width: 480px) {
                    .title {
                        font-size: 24px;
                    }
                    .description {
                        font-size: 15px;
                    }
                }
            `}</style>

            <div className="container" style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    <h1 className="title" style={{ fontSize: '36px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
                        {blog.blogTitle}
                    </h1>

                    {/* Blog Image */}
                    <div style={{ marginBottom: '30px' }}>
                        <img
                            className="image"
                            src={`${serverURL}/${blog?.blogImage}`}
                            alt={blog.blogTitle}
                            style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '10px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                        />
                    </div>

                    {/* Optional Secondary Heading */}
                    <h2 className="title" style={{ fontSize: '28px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
                        {blog.name}
                    </h2>

                    {/* Description */}
                    <div
                        className="description"
                        style={{
                            lineHeight: '1.8',
                            fontSize: '18px',
                            color: '#555',
                            marginBottom: '30px',
                            padding: '0 10px',
                            textAlign: 'justify',
                        }}
                        dangerouslySetInnerHTML={{ __html: blog.description }}
                    />

                    {/* Date */}
                    <div style={{ fontSize: '14px', color: '#888', marginTop: '20px' }}>
                        <p><strong>Published On:</strong> {new Date(blog.date).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogDetail;
