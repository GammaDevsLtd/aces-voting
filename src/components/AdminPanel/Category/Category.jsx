"use client"
import React, {useState} from "react"
import IconPicker from "./IconPicker"
import styles from "./Category.module.css"

export default function CategoryForm() {
    const [formData, setFormData] = useState({
        name: "",
        icon: "Monitor",
        desc: "",
         maxPoints: 25,
    });
    const [loading, setloading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
       const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: name === "maxPoints" ? Number(value) : value,
      });
    };

     const handleIconSelect = (icon) => {
       setFormData({
         ...formData,
         icon: icon,
       });
     };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setloading(true);

      if (!formData.name || !formData.desc || !formData.icon || formData.maxPoints <= 0) {
        setError("All fields are required");
        setloading(false);
        return;
      }

      try {
        const res = await fetch("/api/categories", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
              name: formData.name,
              icon: formData.icon,
              description: formData.desc,
              maxPoints: formData.maxPoints,
            })
        });

        if(!res.ok){
            errorData = await res.json();
            throw new Error(errorData.message || "Error while creating category")
        }

        setSuccess("Category Created!!")
      } catch (error) {
        setError(error.message || "An error occurred")
      }finally{
        setFormData({
          name: "",
          icon: "",
          desc: "",
          maxPoints: 25,
        });
        setloading(false);
        setError("")
        setTimeout(()=>setSuccess(""), 5000);
      }

    };

    return (
      <div className={styles.container}>
        <div className={styles.cardHeader}>
          <h1>Create the Voting Categories</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              name="name"
              onChange={handleChange}
              value={formData.name}
              type="text"
            ></input>
          </div>
          <div className={styles.formGroup}>
            <label>Icon</label>
            <IconPicker
              selectedIcon={formData.icon}
              onSelect={handleIconSelect}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="desc">Description:</label>
            <input
              id="desc"
              name="desc"
              onChange={handleChange}
              value={formData.desc}
              type="text"
            ></input>
          </div>
           <div className={styles.formGroup}>
            <label htmlFor="maxPoints">Max Points:</label>
            <input
              id="maxPoints"
              name="maxPoints"
              onChange={handleChange}
              value={formData.maxPoints}
              type="number"
              min="1"
              max="100"
            ></input>
          </div>
          <button
            className={`${styles.submit} ${loading && styles.disabled}`}
            disabled={loading}
          >
            {loading ? "Uploading Category" : "Upload Category"}
          </button>
          {success && <p className={styles.successMessage}>{success}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>
      </div>
    );
}