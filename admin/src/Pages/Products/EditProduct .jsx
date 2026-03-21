import axios from "axios";
import JoditEditor from "jodit-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData } from "../../services/FetchNodeServices.js";
import { Autocomplete, TextField, Chip, Box } from "@mui/material";

const EditProduct = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [herbsList, setHerbsList] = useState([])
    const [tagList, setTagList] = useState([])
    const [tagInput, setTagInput] = useState(""); // For adding new tags
    const [formData, setFormData] = useState({
        productName: "",
        productDescription: "",
        productSubDescription: "",
        Variant: [{ price: "", discountPrice: "", finalPrice: "" }],
        herbsId: [],
        productImage: [],
        blogImage: [],
        faqs: [{ question: "", answer: "" }],
        urls: [{ url: "" }],
        oldProductImage: [],
        oldBlogImage: [],
        RVUS: [{ RVU: "" }],
        tags: []
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await getData(`api/products/get_product_by_id/${id}`);
                console.log("PRODUCT", productResponse)
                const productData = productResponse?.product;
                if (productResponse?.success) {
                    setFormData({
                        ...productData,
                        productName: productData?.productName || "",
                        productSubDescription: productData?.productSubDescription || "",
                        productDescription: productData?.productDescription || "",
                        Variant: productData?.variant?.length > 0 ? productData?.variant.map(v => ({ 
                            ...v, 
                            price: v?.price || 0, 
                            discountPrice: v?.discountPrice || 0, 
                            finalPrice: v?.finalPrice || 0, 
                            day: v?.day || "", 
                            bottle: v?.bottle || "", 
                            tex: v?.tex || "0", 
                            tagType: v?.tagType?._id 
                        })) : [],
                        oldProductImage: productData?.productImages?.length > 0 ? productData?.productImages : [],
                        oldBlogImage: productData?.blogImages?.length > 0 ? productData?.blogImages : [],
                        faqs: productData?.faqs?.length > 0 ? productData?.faqs.map(faq => ({ 
                            question: faq?.question || "", 
                            answer: faq?.answer || "", 
                        })) : [],
                        urls: productData?.urls?.length > 0 ? productData?.urls.map(url => ({ 
                            url: url?.url || "", 
                        })) : [],
                        RVUS: productData?.RVUS?.length > 0 ? productData?.RVUS.map(RVU => ({ 
                            RVU: RVU?.RVU || "", 
                        })) : [],
                        herbsId: productData?.herbsId?.length > 0 ? productData?.herbsId.map(h => h?._id) : [],
                        tags: productData?.tags || []
                    });
                } else {
                    toast.error("Error fetching product details.");
                }
            } catch (error) {
                toast.error("Error loading product data!");
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchProducts = async () => {
          setIsLoading(true);
          try {
            const response = await getData("api/herbs/get-all-herbs");
            console.log(response)
            if (response?.status === true) {
              setHerbsList(response?.data || []);
            }
          } catch (error) {
            console.error("Error fetching products:", error);
          } finally {
            setIsLoading(false);
          }
        };
    
        const fetchTag = async () => {
          try {
            const response = await getData("api/tag/get-all-tags");
            console.log("response:-", response)
            if (response?.status) {
              setTagList(response?.data);
            }
          } catch (error) {
          } finally {
            setIsLoading(false);
          }
        }
        fetchProducts();
        fetchTag()
    }, []);
    
    const handleInputFaqChange = (index, field, value) => {
        const newfaqs = [...formData?.faqs];
        newfaqs[index][field] = value;
        setFormData({ ...formData, faqs: newfaqs });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length < 3 || files.length > 8) {
            alert("Please select between 3 to 8 images.");
            e.target.value = "";
            return;
        }
        setFormData({ ...formData, productImage: files });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    // Handle adding a new tag
    const handleAddTag = () => {
        if (tagInput.trim() !== "" && !formData.tags.includes(tagInput.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tagInput.trim()]
            });
            setTagInput("");
        }
    };

    // Handle removing a tag
    const handleRemoveTag = (tagToRemove) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToRemove)
        });
    };

    // Handle key press for adding tags
    const handleTagKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleJoditChange = (newValue, name) => {
        setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
    };
    
    const handleVariantChange = (index, event) => {
        const { name, value } = event.target;
        const updatedVariants = [...formData.Variant];

        if (name === "price" || name === "discountPrice") {
            const price = name === "price" ? parseFloat(value) : parseFloat(updatedVariants[index].price);
            const discountPrice = name === "discountPrice" ? parseFloat(value) : parseFloat(updatedVariants[index].discountPrice);
            const finalPrice = price - (price * (discountPrice / 100));
            updatedVariants[index] = { ...updatedVariants[index], [name]: value, finalPrice: finalPrice.toFixed(2) };
        } else {
            updatedVariants[index] = { ...updatedVariants[index], [name]: value };
        }

        setFormData({ ...formData, Variant: updatedVariants });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        // Validation
        if (formData?.productImage?.length > 8) {
            alert("Please select no more than 8 images.");
            setIsLoading(false);
            return;
        }
    
        // Clean variants
        const cleanedVariants = formData.Variant.map(v => ({
            ...v,
            price: parseFloat(v.price) || 0,
            discountPrice: parseFloat(v.discountPrice) || 0,
            finalPrice: parseFloat(v.finalPrice) || 0,
            day: v.day || "",
            bottle: v.bottle || "",
            tex: v.tex || "0",
            tagType: v.tagType && v.tagType !== '' ? v.tagType : null,
        }));
        
        const cleanedFormData = {
            ...formData,
            Variant: cleanedVariants,
            tags: formData.tags // Ensure tags are included as array
        };
        
        const form = new FormData();
        
        Object.keys(cleanedFormData).forEach((key) => {
            if (key === "Variant" || key === "herbsId" || key === "faqs" || key === "urls" || key === 'RVUS' || key === "tags") {
                // For all these fields, stringify them
                form.append(key, JSON.stringify(cleanedFormData[key]));
            } else if (key === "productImage") {
                if (cleanedFormData.productImage && cleanedFormData.productImage.length > 0) {
                    cleanedFormData.productImage.forEach((file) => form.append("productImages", file));
                }
            } else if (key === "blogImage") {
                if (cleanedFormData.blogImage && cleanedFormData.blogImage.length > 0) {
                    cleanedFormData.blogImage.forEach((file) => form.append("blogImages", file));
                }
            } else if (key === "oldBlogImage") {
                if (cleanedFormData?.oldBlogImage?.length > 0) {
                    form.append("oldBlogImages", JSON.stringify(cleanedFormData.oldBlogImage));
                } else {
                    form.append("oldBlogImages", JSON.stringify([]));
                }
            } else if (key === "oldProductImage") {
                if (cleanedFormData.oldProductImage && cleanedFormData.oldProductImage.length > 0) {
                    form.append("oldProductImages", JSON.stringify(cleanedFormData.oldProductImage));
                } else {
                    form.append("oldProductImages", JSON.stringify([]));
                }
            } else if (key !== "tags" && key !== "Variant" && key !== "herbsId" && key !== "faqs" && key !== "urls" && key !== "RVUS") {
                // Append other fields
                if (cleanedFormData[key] !== undefined && cleanedFormData[key] !== null) {
                    form.append(key, cleanedFormData[key]);
                }
            }
        });
    
        // Log FormData contents for debugging
        for (let pair of form.entries()) {
            console.log(pair[0], pair[1]);
        }
    
        try {
            const response = await postData(`api/products/update-product/${id}`, form);
            console.log("Update response:", response);
    
            if (response && response.success === true) {
                toast.success("Product updated successfully!");
                setTimeout(() => {
                    navigate("/all-products");
                }, 1500);
            } else if (response && response.success === false) {
                toast.error(response.message || "Failed to update product. Please check your input.");
            } else {
                toast.error("No valid response from server. Please check backend logs.");
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            toast.error("Network or backend error. Check server logs.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 4) {
            alert("You can only upload up to 4 images.");
            return;
        }
        setFormData({ ...formData, blogImage: files });
    };

    const addVariant = () => {
        setFormData({
            ...formData,
            Variant: [...formData.Variant, { price: "", discountPrice: "", finalPrice: "", day: "", bottle: "", tex: "" }],
        });
    };

    const removeVariant = (index) => {
        const updatedVariants = formData.Variant.filter((_, i) => i !== index);
        setFormData({ ...formData, Variant: updatedVariants });
    };

    const addFAQField = () => {
        setFormData({ ...formData, faqs: [...formData.faqs, { question: "", answer: "" }] });
    };

    const deleteFAQField = (index) => {
        const updatedFaqs = formData.faqs.filter((_, i) => i !== index);
        setFormData({ ...formData, faqs: updatedFaqs });
    };

    const addUrlField = () => {
        setFormData({ ...formData, urls: [...formData.urls, { url: "" }] });
    };

    const deleteUrlField = (index) => {
        const updatedUrls = formData.urls.filter((_, i) => i !== index);
        setFormData({ ...formData, urls: updatedUrls });
    };

    const addRVUSField = () => {
        setFormData({ ...formData, RVUS: [...formData.RVUS, { RVU: "" }] });
    };

    const deleteRVUSField = (index) => {
        const updatedUrls = formData.RVUS.filter((_, i) => i !== index);
        setFormData({ ...formData, RVUS: updatedUrls });
    };

    console.log("FormData with tags:", formData.tags)
    
    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Product</h4>
                </div>
                <div className="links">
                    <Link to="/all-products" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3 mt-2" onSubmit={handleSubmit}>
                    {/* Product Image */}
                    <div className="col-md-4">
                        <label htmlFor="productImage" className="form-label">
                            Product Image<sup className="text-danger">*</sup>
                        </label>
                        <input type="file" name="productImage" className="form-control" id="productImage" multiple onChange={handleFileChange} />
                        {formData.oldProductImage && formData.oldProductImage.length > 0 && (
                            <small className="text-muted">Current images: {formData.oldProductImage.length} images saved</small>
                        )}
                    </div>

                    {/* Product Name */}
                    <div className="col-md-4">
                        <label htmlFor="productName" className="form-label">
                            For which disease<sup className="text-danger">*</sup>
                        </label>
                        <input type="text" name="productName" className="form-control" id="productName" value={formData.productName} onChange={handleChange} required placeholder="Enter Disease" />
                    </div>

                    {/* Tags Field with Chips */}
                    <div className="col-md-4">
                        <label htmlFor="tags" className="form-label">
                            Tags<sup className="text-danger">*</sup>
                        </label>
                        <div className="d-flex">
                            <input
                                type="text"
                                className="form-control"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={handleTagKeyPress}
                                placeholder="Type a tag and press Enter"
                            />
                            <button 
                                type="button" 
                                className="btn btn-primary ms-2"
                                onClick={handleAddTag}
                            >
                                Add
                            </button>
                        </div>
                        <small className="text-muted">Add multiple tags by typing and pressing Enter or clicking Add</small>
                        
                        {/* Display tags as chips */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                            {formData.tags && formData.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    onDelete={() => handleRemoveTag(tag)}
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                        {formData.tags && formData.tags.length === 0 && (
                            <small className="text-muted">No tags added yet</small>
                        )}
                    </div>

                    <div className="col-md-4" style={{ marginTop: '40px' }}>
                        <Autocomplete
                            multiple
                            options={herbsList}
                            value={herbsList.filter((herbs) => formData.herbsId.includes(herbs._id))}
                            getOptionLabel={(option) => option.name}
                            onChange={(e, newValue) => setFormData(prev => ({ ...prev, herbsId: newValue.map(herbs => herbs._id) }))}
                            renderInput={(params) => <TextField {...params} label="Select Herbs" />}
                        />
                    </div>

                    {/* Product Sub Description */}
                    <div className="col-md-12">
                        <label htmlFor="productSubDescription" className="form-label">
                            Product Sub Description<sup className="text-danger">*</sup>
                        </label>
                        <textarea
                            name="productSubDescription"
                            rows={3}
                            className="form-control"
                            id="productSubDescription"
                            placeholder="Product Sub Description"
                            value={formData.productSubDescription}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Product Description (Jodit Editor) */}
                    <div className="col-md-12">
                        <label htmlFor="productDescription" className="form-label">
                            Product Description<sup className="text-danger">*</sup>
                        </label>
                        <JoditEditor
                            className="form-control"
                            placeholder="Product Description"
                            name="productDescription"
                            value={formData.productDescription}
                            onChange={(newValue) => handleJoditChange(newValue, 'productDescription')}
                        />
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="smirini" className="form-label">
                            Product Name<sup className="text-danger">*</sup>
                        </label>
                        <input
                            type="text"
                            name="smirini"
                            className="form-control"
                            id="smirini"
                            value={formData.smirini}
                            onChange={handleChange}
                            required
                            placeholder="Product Name"
                        />
                    </div>

                    {/* Product Variant */}
                    {formData.Variant && formData.Variant.map((variant, index) => (
                        <div key={index} className="variant-container border p-3 mb-3">
                            <div className="row">
                                <div className="col-md-2">
                                    <label className="form-label">
                                        Price<sup className="text-danger">*</sup>
                                    </label>
                                    <input type="number" name="price" className="form-control" value={variant.price} onChange={(e) => handleVariantChange(index, e)} required placeholder="Price" />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label">
                                        Discount %<sup className="text-danger">*</sup>
                                    </label>
                                    <input type="number" name="discountPrice" className="form-control" value={variant.discountPrice} onChange={(e) => handleVariantChange(index, e)} required placeholder="Discount %" />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label">
                                        Final Price<sup className="text-danger">*</sup>
                                    </label>
                                    <input type="number" name="finalPrice" className="form-control" value={variant?.finalPrice} readOnly placeholder="Final Price" />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label">Select Day</label>
                                    <select
                                        name="day"
                                        className="form-control"
                                        value={variant.day || ""}
                                        onChange={(e) => handleVariantChange(index, e)}
                                    >
                                        <option value="">Select Day</option>
                                        <option value="15 Day">15 Day</option>
                                        <option value="30 Day">30 Day</option>
                                        <option value="60 Day">60 Day</option>
                                        <option value="90 Day">90 Day</option>
                                        <option value="120 Day">120 Day</option>
                                    </select>
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label">Select Bottle</label>
                                    <select
                                        name="bottle"
                                        className="form-control"
                                        value={variant.bottle || ""}
                                        onChange={(e) => handleVariantChange(index, e)}
                                    >
                                        <option value="">Select Bottle</option>
                                        <option value="1 Bottle">1 Bottle</option>
                                        <option value="2 Bottle">2 Bottle</option>
                                        <option value="3 Bottle">3 Bottle</option>
                                        <option value="6 Bottle">6 Bottle</option>
                                        <option value="9 Bottle">9 Bottle</option>
                                        <option value="12 Bottle">12 Bottle</option>
                                    </select>
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label">Taxe's</label>
                                    <input
                                        type="text"
                                        name="tex"
                                        className="form-control"
                                        value={variant.tex || ""}
                                        onChange={(e) => handleVariantChange(index, e)}
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label">Select Type</label>
                                    <select name="tagType" className="form-control" value={variant.tagType || ""} onChange={(e) => handleVariantChange(index, e)}>
                                        <option value="">Select Type</option>
                                        {tagList?.map((item) => (<option key={item?._id} value={item?._id}>{item?.tagName}</option>))}
                                    </select>
                                </div>
                            </div>

                            {index > 0 && (
                                <div className="text-end mt-2">
                                    <button type="button" className="btn btn-danger" onClick={() => removeVariant(index)}>
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    <div>
                        <button type="button" className="btn btn-primary" onClick={addVariant}>
                            Add More
                        </button>
                    </div>

                    {/* FAQ */}
                    <div className="mt-4">
                        <h2>Add FAQ</h2>
                        {formData?.faqs?.map((faq, index) => (
                            <div className="row mb-2" key={index}>
                                <div className="col-md-5">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Question"
                                        value={faq.question}
                                        onChange={(e) => handleInputFaqChange(index, "question", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-5">
                                    <input type="text" className="form-control" placeholder="Answer" value={faq.answer} onChange={(e) => handleInputFaqChange(index, "answer", e.target.value)} />
                                </div>
                                <div className="col-md-2">
                                    {index > 0 && (
                                        <button type="button" className="btn btn-danger" onClick={() => deleteFAQField(index)}>
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="col-md-12 mt-3">
                            <button type="button" className="btn btn-primary me-2" onClick={addFAQField}>
                                Add More
                            </button>
                        </div>
                    </div>

                    {/* Blog Image */}
                    <div className="mt-4">
                        <h2>Add Blog Images</h2>
                        <div className="row">
                            <div className="col-md-6">
                                <input type="file" className="form-control" accept="image/*" multiple onChange={handleImageChange} />
                                <small className="text-muted">Select up to 4 images.</small>
                                {formData.oldBlogImage && formData.oldBlogImage.length > 0 && (
                                    <small className="text-muted d-block">Current images: {formData.oldBlogImage.length} images saved</small>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* URL */}
                    <div className="mt-4">
                        <h2>Add Video URLs</h2>
                        {formData?.urls?.map((urlItem, index) => (
                            <div className="row mb-2" key={index}>
                                <div className="col-md-10">
                                    <input
                                        type="url"
                                        className="form-control"
                                        value={urlItem?.url || ""}
                                        onChange={(e) => {
                                            const updatedUrls = [...formData.urls];
                                            updatedUrls[index].url = e.target.value;
                                            setFormData({ ...formData, urls: updatedUrls });
                                        }}
                                        placeholder="URL"
                                    />
                                </div>
                                <div className="col-md-2">
                                    {index > 0 && (
                                        <button type="button" className="btn btn-danger" onClick={() => deleteUrlField(index)}>
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="col-md-12 mt-3">
                            <button type="button" className="btn btn-primary me-2" onClick={addUrlField}>
                                Add More
                            </button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h2>Add Reviews Video URLs</h2>
                        {formData?.RVUS?.map((urlItem, index) => (
                            <div className="row mb-2" key={index}>
                                <div className="col-md-10">
                                    <input type="url" className="form-control" value={urlItem?.RVU || ""} onChange={(e) => { const updatedUrls = [...formData.RVUS]; updatedUrls[index].RVU = e.target.value; setFormData({ ...formData, RVUS: updatedUrls }); }} placeholder="URL" />
                                </div>
                                <div className="col-md-2">
                                    {index > 0 && (
                                        <button type="button" className="btn btn-danger" onClick={() => deleteRVUSField(index)}>
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="col-md-12 mt-3">
                            <button type="button" className="btn btn-primary me-2" onClick={addRVUSField}>
                                Add More
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="col-md-12 mt-4 text-center">
                        <button type="submit" className="btn btn-success" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Product"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditProduct;