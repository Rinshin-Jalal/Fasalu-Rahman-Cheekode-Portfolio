from django.urls import path
from .views import Quiz, QuizQuestion, QuizScore
app_name='quiz'

urlpatterns = [
    path('', Quiz.as_view(), name='quiz'),
    path('q/<str:topic>/', QuizQuestion.as_view(), name='questions' ),
    path('score/', QuizScore.as_view(), name='score' ),
]
