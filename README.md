# UNAB Student Retention Platform (SRP)

![Project Status](https://img.shields.io/badge/Status-Prototype-orange)
![Python Version](https://img.shields.io/badge/Python-3.10%2B-3776AB)
![License](https://img.shields.io/badge/License-MIT-green)

## Executive Summary

**UNAB Student Retention Platform** is a modular software solution designed to address high dropout rates in undergraduate engineering programs. The system integrates Large Language Models (LLMs) with institutional data to provide scalable academic assistance, early mental health risk detection, and administrative support.

Unlike generic chatbots, this platform enforces **Role-Based Access Control (RBAC)** and **Retrieval-Augmented Generation (RAG)** to ensure data privacy and hallucinaton-free academic responses based strictly on official university syllabi.

---

## 🏗️ Technical Architecture

The system follows a micro-modular architecture designed for zero-cost deployment and high scalability.

| Layer | Component | Implementation Details |
| :--- | :--- | :--- |
| **User Interface** | Frontend | **Streamlit** (Reactive Python Framework). |
| **Authentication** | Security | **Supabase Auth** with strict domain validation (`@uandresbello.edu`). |
| **Data Persistence** | Database | **PostgreSQL** with Row Level Security (RLS) policies. |
| **Inference Engine** | LLM | **Llama 3 (70B)** via Groq API for low-latency processing. |
| **Knowledge Base** | RAG | **pgvector** for semantic search over course PDFs. |
| **Safety Layer** | Middleware | Custom **Sentinel Protocol** for PII redaction and crisis detection. |

---

## 📦 Key Modules

### 1. Academic Assistance Module (RAG)
* **Contextual Tutoring:** Ingests official course documentation (PDFs) to answer technical queries.
* **Socratic Method Implementation:** System prompts are engineered to guide students through logic rather than providing direct solutions.
* **Academic Integrity:** Integrated vision analysis to detect and refuse real-time exam cheating attempts.

### 2. Student Well-being & Risk Detection
* **Sentinel Protocol:** A background process that monitors inputs for keywords related
