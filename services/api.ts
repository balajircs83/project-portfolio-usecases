import { Document, Category, Subcategory } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Helper function for authenticated requests
const authFetch = async (
  url: string,
  method: string,
  token: string,
  body?: any,
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(url, config);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Something went wrong");
  }
  return response.json();
};

// --- Authentication API Calls ---
export const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const details = new URLSearchParams();
  details.append("username", email);
  details.append("password", password);

  const response = await fetch(`${API_BASE_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: details.toString(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to login");
  }
  return response.json();
};

export const register = async (
  email: string,
  password: string,
): Promise<{ message: string; user_id: number }> => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, hashed_password: password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to register");
  }
  return response.json();
};

export const getMe = async (
  token: string,
): Promise<{ email: string; id: number }> => {
  return authFetch(`${API_BASE_URL}/users/me`, "GET", token);
};

// --- Document API Calls ---
export const getDocuments = async (token: string): Promise<Document[]> => {
  return authFetch(`${API_BASE_URL}/documents/`, "GET", token);
};

export const getDocumentById = async (
  id: number,
  token: string,
): Promise<Document> => {
  return authFetch(`${API_BASE_URL}/documents/${id}`, "GET", token);
};

export const uploadDocument = async (
  doc: Omit<Document, "id" | "created_at" | "owner_id">,
  token: string,
): Promise<Document> => {
  return authFetch(`${API_BASE_URL}/documents/`, "POST", token, doc);
};

export const updateDocument = async (
  id: number,
  doc: Omit<Document, "created_at" | "owner_id">,
  token: string,
): Promise<Document> => {
  return authFetch(`${API_BASE_URL}/documents/${id}`, "PUT", token, doc);
};

export const deleteDocument = async (
  id: number,
  token: string,
): Promise<{ message: string }> => {
  return authFetch(`${API_BASE_URL}/documents/${id}`, "DELETE", token);
};

// --- Category API Calls ---
export const getCategories = async (token: string): Promise<Category[]> => {
  return authFetch(`${API_BASE_URL}/categories/`, "GET", token);
};

export const createCategory = async (
  category: Omit<Category, "id" | "subcategories">,
  token: string,
): Promise<Category> => {
  return authFetch(`${API_BASE_URL}/categories/`, "POST", token, category);
};

export const updateCategory = async (
  id: number,
  category: Omit<Category, "subcategories">,
  token: string,
): Promise<Category> => {
  return authFetch(`${API_BASE_URL}/categories/${id}`, "PUT", token, category);
};

export const deleteCategory = async (
  id: number,
  token: string,
): Promise<{ message: string }> => {
  return authFetch(`${API_BASE_URL}/categories/${id}`, "DELETE", token);
};

// --- Subcategory API Calls ---
export const createSubcategory = async (
  subcategory: Omit<Subcategory, "id" | "parent_category">,
  token: string,
): Promise<Subcategory> => {
  return authFetch(
    `${API_BASE_URL}/subcategories/`,
    "POST",
    token,
    subcategory,
  );
};

export const updateSubcategory = async (
  id: number,
  subcategory: Omit<Subcategory, "parent_category">,
  token: string,
): Promise<Subcategory> => {
  return authFetch(
    `${API_BASE_URL}/subcategories/${id}`,
    "PUT",
    token,
    subcategory,
  );
};

export const deleteSubcategory = async (
  id: number,
  token: string,
): Promise<{ message: string }> => {
  return authFetch(`${API_BASE_URL}/subcategories/${id}`, "DELETE", token);
};
