import json
import os
from google.generativeai import GenerativeModel
from google.api_core.exceptions import ResourceExhausted, GoogleAPIError

def get_ai_suggestions(task_details, context_entries, user_preferences=None, current_workload=None):
    """
    Generates AI-powered suggestions for task prioritization, deadline recommendations,
    enhanced task descriptions, and category/tag recommendations.

    Args:
        task_details (dict): Dictionary containing task details (title, description, category).
        context_entries (list): List of dictionaries, each representing a daily context entry.
        user_preferences (dict, optional): User-specific preferences. Defaults to None.
        current_workload (dict, optional): Information about the user's current workload. Defaults to None.

    Returns:
        dict: A dictionary containing AI-generated suggestions.
    """
    # Placeholder for AI logic
    # In a real implementation, this would involve calls to LLMs or other AI models.

    # Example of dummy suggestions
    suggested_priority = 75  # Example score
    suggested_deadline = "2025-07-10T17:00:00Z"  # Example date/time
    enhanced_description = task_details.get('description', '') + " (AI enhanced)"
    suggested_categories = ["Work", "Urgent"] # Example categories

    return {
        "prioritization": suggested_priority,
        "deadline_recommendation": suggested_deadline,
        "enhanced_description": enhanced_description,
        "category_recommendations": suggested_categories,
    }

def get_ai_chat_response(message, tasks, chat_history):
    """
    Generates an AI response for a given chat message, considering the user's tasks and chat history.

    Args:
        message (str):
        tasks (list): A list of the user's current tasks.
        chat_history (list): A list of previous messages in the chat.

    Returns:
        str: The AI's response.
    """
    history_str = ""
    if chat_history:
        history_str = "\n\nPrevious conversation:\n"
        for msg in chat_history:
            history_str += f"{msg['sender'].capitalize()}: {msg['text']}\n"

    prompt = f"""You are a smart task management assistant. Your goal is to help the user manage their tasks efficiently. 

The user says: '{message}'.

Here are the user's current tasks: {json.dumps(tasks, indent=2)}

Based on the user's message, their tasks, and the previous conversation, provide a helpful and concise response. Consider the following:
- If the user asks about task prioritization, suggest the highest priority tasks or offer to re-prioritize.
- If the user asks about completing tasks, offer to mark a task as done.
- If the user asks for the next task, suggest a relevant task based on priority or deadline.
- If the user is sharing their mood or general thoughts, respond empathetically and offer to help with tasks.
- Keep responses under 100 words and directly actionable if possible.{history_str}"""
    try:
        model = GenerativeModel(os.environ.get("GEMINI_MODEL", "gemini-2.5-pro"))
        response = model.generate_content(prompt)
        return response.text
    except (ResourceExhausted, GoogleAPIError) as e:
        print(f"Error generating AI chat response with primary model: {e}")
        print("Falling back to gemini-2.5-flash...")
        try:
            fallback_model = GenerativeModel("gemini-2.5-flash")
            fallback_response = fallback_model.generate_content(prompt)
            return fallback_response.text
        except Exception as fallback_e:
            print(f"Error generating AI chat response with fallback model: {fallback_e}")
            return "I'm sorry, I couldn't generate a response at this time due to API issues."
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return "I'm sorry, an unexpected error occurred."
