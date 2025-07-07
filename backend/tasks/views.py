from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, Task, ContextEntry
from .serializers import CategorySerializer, TaskSerializer, ContextEntrySerializer
from ai_module.ai_service import get_ai_suggestions, get_ai_chat_response

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class ContextEntryViewSet(viewsets.ModelViewSet):
    queryset = ContextEntry.objects.all()
    serializer_class = ContextEntrySerializer

class AISuggestionViewSet(viewsets.ViewSet):
    def post(self, request):
        task_details = request.data.get('task_details')
        context_entries = request.data.get('context_entries')
        user_preferences = request.data.get('user_preferences')
        current_workload = request.data.get('current_workload')

        if not task_details or not context_entries:
            return Response({"error": "task_details and context_entries are required."}, status=status.HTTP_400_BAD_REQUEST)

        suggestions = get_ai_suggestions(
            task_details,
            context_entries,
            user_preferences,
            current_workload
        )
        return Response(suggestions, status=status.HTTP_200_OK)

    def chat(self, request):
        message = request.data.get('message')
        tasks = request.data.get('tasks')
        chat_history = request.data.get('chat_history', [])
        if not message:
            return Response({"error": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        response = get_ai_chat_response(message, tasks, chat_history)
        return Response({"response": response}, status=status.HTTP_200_OK)