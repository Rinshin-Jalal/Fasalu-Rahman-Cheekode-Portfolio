from rest_framework import serializers
from .models import Quizzes, Question, Answer,Score



class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = [
            'quiz',
            'score',
            'user',
        ]
class AnswerSerializer(serializers.ModelSerializer):

    class Meta:

        model = Answer
        fields = [
            'id',
            'answer_text',
            'is_right',
            'image'
        ]


class QuestionSerializer(serializers.ModelSerializer):

    answers = AnswerSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:

        model = Question
        fields = [
            'quiz','title','answers','image','image_url'
        ]
    
    def get_image_url(self, question):
        request = self.context.get('request')
        if question.image and hasattr(question.image, 'url'):
            image_url = question.image.url
            return request.build_absolute_uri(image_url)
        else:
            return None


class QuizSerializer(serializers.ModelSerializer):


    class Meta:
        model = Quizzes
        fields = [
            'title','id','date_created','question','image','slug'
        ]