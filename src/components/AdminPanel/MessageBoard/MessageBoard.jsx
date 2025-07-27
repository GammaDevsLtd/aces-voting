"use client"
import React, { useState, useEffect } from "react";  
import styles from "./Message.module.css"

export default function MessageBoard(){
    const [marked, setMarked] = useState(false);
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const fetchMessage = async () =>{
            try {
              setLoading(true);
                const res = await fetch("/api/message");
                const data = await res.json();
                setMessage(data.messages);
                console.log(data.message)
                setLoading(false);
            } catch (error) {
                setMessage("Error while fetching messages")
                console.log(error.message)
            }
        }

        fetchMessage();
    }, [])

    const handleMark = async (id) => {
      try {
        setMarked(true); 

        const res = await fetch("/api/message", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to update");

        // Update local state
        setMessage((prevMessages) => {
          const updatedMessages = prevMessages.map((msg) => {
            if (msg._id === id) {
              return { ...msg, marked: !msg.marked }; // toggle the value locally
            }
            return msg;
          });

          // Sort: unmarked (false) on top, marked (true) below
          return updatedMessages.sort((a, b) => a.marked - b.marked);
        });

        setMarked(false);
      } catch (error) {
        console.log("Error:", error.message);
        setMarked(false);
      }
    };


    if(loading){
        return (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h1>Loading Messages...</h1>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.form}>
                <div className={styles.formEmpty}>
                  <div className={styles.formLoad}>
                    
                  </div>
                  <div className={styles.mark}>
                      <button
                        className={styles.active}
                      >
                        <div className={styles.spinner} ></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }

    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h1>View All Messages</h1>
          <h2>
            Please don't forget to tick the messages when read, so that it
            doesn't repeat
          </h2>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.form}>
            {message.length === 0 ? (
              <div className={styles.formGroup}>
                <div className={styles.formText}>
                  <p>No Messages have been sent</p>
                  <span>Refresh or Come Back Later</span>
                </div>
                <div className={styles.mark}>
                  <button className={styles.active} disabled>
                    <div className={styles.spinner}></div>
                  </button>
                </div>
              </div>
            ) : (
              message.map((info) => (
                <div key={info._id} className={styles.formGroup}>
                  <div className={styles.formText}>
                    <p>{info.fullname}</p>
                    <span>{info.message}</span>
                  </div>
                  <div className={styles.mark}>
                    <button
                      className={info.marked ? styles.inactive : styles.active}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMark(info._id);
                      }}
                      disabled={marked}
                    >
                      {info.marked ? "UnMark as Read" : "Mark as Read"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
}