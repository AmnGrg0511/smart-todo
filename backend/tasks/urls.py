from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TaskViewSet, ContextEntryViewSet, AISuggestionViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'context', ContextEntryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('tasks/suggestions/', AISuggestionViewSet.as_view({'post': 'post'}), name='ai-suggestions'),
    path('ai-chat/', AISuggestionViewSet.as_view({'post': 'chat'}), name='ai-chat'),
]