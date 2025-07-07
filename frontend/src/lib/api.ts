const API_BASE_URL = 'http://localhost:8000/api';

export const fetchTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks/`);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories/`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export const createCategory = async (categoryData: { name: string }) => {
  const response = await fetch(`${API_BASE_URL}/categories/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) {
    throw new Error('Failed to create category');
  }
  return response.json();
};

export const updateCategory = async (id: string, categoryData: { name: string }) => {
  const response = await fetch(`${API_BASE_URL}/categories/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) {
    throw new Error('Failed to update category');
  }
  return response.json();
};

export const deleteCategory = async (id: string) => {
  const url = `${API_BASE_URL}/categories/${id}/`;
  console.log("DELETE request to:", url);
  const response = await fetch(url, {
    method: 'DELETE',
  });
  console.log("Category deletion response status:", response.status);
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Category deletion error details:", errorData);
    throw new Error('Failed to delete category');
  }
  // If status is 204 No Content, there's no body to parse
  if (response.status === 204) {
    return {}; // Return an empty object or null to indicate success with no content
  }
  return response.json();
};

export const fetchContextEntries = async () => {
  const response = await fetch(`${API_BASE_URL}/context/`);
  if (!response.ok) {
    throw new Error('Failed to fetch context entries');
  }
  return response.json();
};

export const createTask = async (taskData: any) => {
  const response = await fetch(`${API_BASE_URL}/tasks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw new Error('Failed to create task');
  }
  return response.json();
};

export const submitContext = async (contextData: any) => {
  const response = await fetch(`${API_BASE_URL}/context/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contextData),
  });
  if (!response.ok) {
    throw new Error('Failed to submit context');
  }
  return response.json();
};

export const getAISuggestions = async (suggestionData: any) => {
  const response = await fetch(`${API_BASE_URL}/tasks/suggestions/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(suggestionData),
  });
  if (!response.ok) {
    throw new Error('Failed to get AI suggestions');
  }
  return response.json();
};

export const getAIChatResponse = async (message: string, tasks: any[], chat_history: any[]) => {
  const response = await fetch(`${API_BASE_URL}/ai-chat/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, tasks, chat_history }),
  });
  if (!response.ok) {
    throw new Error('Failed to get AI chat response');
  }
  return response.json();
};

export const deleteTask = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
  return response.json();
};

export const updateTask = async (id: string, taskData: any) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw new Error('Failed to update task');
  }
  return response.json();
};
