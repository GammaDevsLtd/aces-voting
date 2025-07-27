"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Teams.module.css";
import axios from "axios";

export default function TeamForm() {
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInput = useRef();

  // Handle file selection and create preview URL
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  // Getting all the Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        const data = await res.json();
        setAvailableCategories(data.category || []);
      } catch (error) {
        setError(error.message || "Error while fetching categories");
      } finally {
        setFetching(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Toggle category selection
  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate at least one category is selected
    if (selectedCategories.length === 0) {
      setError("Please select at least one category");
      setLoading(false);
      return;
    }

    try {
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", file);
      cloudinaryData.append("upload_preset", "uploads");

      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/divixqupd/image/upload",
        cloudinaryData
      );

      const uploadData = {
        ...formData,
        image: uploadRes.data.secure_url,
        categories: selectedCategories,
      };

      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create team");
      }

      setSuccess("Team successfully created!");
    } catch (error) {
      setError(error.message || "Error creating team");
    } finally {
      setLoading(false);
      setFormData({ name: "", desc: "" });
      setSelectedCategories([]);
      setFile(null);
      setPreviewUrl(null);
      if (fileInput.current) fileInput.current.value = "";
      setTimeout(() => setSuccess(""), 5000);
    }
  };

  return (
    <div className={`${styles.card} ${styles.adminCard}`}>
      <div className={styles.cardHeader}>
        <h1>Create Team</h1>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="desc">Description: </label>
          <textarea
            id="desc"
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            rows={3}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="img">Image: </label>
          <input
            type="file"
            id="img"
            name="img"
            ref={fileInput}
            onChange={handleFileChange}
            required
            accept="image/*"
          />
          {previewUrl && (
            <div className={styles.preview}>
              <img src={previewUrl} alt="Preview" />
            </div>
          )}
        </div>

        {fetching ? (
          <div className={styles.fetch}>
            <span> Loading Categories</span>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          <div className={styles.formGroup}>
            <label>Categories: </label>
            {availableCategories.length === 0 ? (
              <p className={styles.empty}>No available categories</p>
            ) : (
              <div className={styles.categoriesContainer}>
                {availableCategories.map((category) => (
                  <button
                    key={category._id}
                    type="button"
                    className={`${styles.categoryButton} ${
                      selectedCategories.includes(category._id)
                        ? styles.categoryButtonActive
                        : ""
                    }`}
                    onClick={() => toggleCategory(category._id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          className={`${styles.submit} ${loading && styles.disabled}`}
          disabled={loading || selectedCategories.length === 0}
        >
          {loading ? "Creating Team..." : "Create Team"}
        </button>
        {success && <p className={styles.successMessage}>{success}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
      </form>
    </div>
  );
}
