from rest_framework import generics
from rest_framework.response import Response
from .models import Quizzes, Question,Score
from .serializers import QuizSerializer,ScoreSerializer,QuestionSerializer
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response


class QuizScore(generics.ListCreateAPIView):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer
    permission_classes = [permissions.IsAuthenticated]


class Quiz(generics.ListAPIView):

    serializer_class = QuizSerializer
    queryset = Quizzes.objects.all()

class QuizQuestion(APIView):

    def get(self, request, format=None, **kwargs):
        quiz = Question.objects.filter(quiz__slug=kwargs['topic'])
        serializer = QuestionSerializer(quiz, many=True,context={"request":request})
        return Response(serializer.data)



