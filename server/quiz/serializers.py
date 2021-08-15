from rest_framework import serializers
from .models import Quizzes, Question, Answer,Score



class ScoreSerializer(serializers.ModelSerializer):
    # user = serializers.ReadOnlyField(source='owner.username')
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

class RandomQuestionSerializer(serializers.ModelSerializer):

    answer = AnswerSerializer(many=True, read_only=True)

    class Meta:

        model = Question
        fields = [
            'title','answers',
        ]


class QuestionSerializer(serializers.ModelSerializer):

    answers = AnswerSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    # quiz = QuizSerializer(read_only=True)

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

class QuestionCreateSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = [
            'title','answers'
        ]

    def create(self, validated_data):
        answers_data = validated_data.pop('answers')
        question = Question.objects.create(**validated_data)
        # for answer_data in answers_data:
            # Answer.objects.create(question=question, **answer_data)
        answers.set(answers_data)
        return question

class QuizCreateSerializer(serializers.ModelSerializer):
    question = QuestionCreateSerializer(many=True)

    class Meta:
        model = Quizzes
        fields = [
            'title','question',
        ]

    def create(self, validated_data):
        questions_data = validated_data.pop('question')
        print(questions_data)
        quiz = Quizzes.objects.create(**validated_data)
        for question_data in questions_data:
            Question.objects.create(quiz=quiz, **question_data)
        return quiz

class QuizSerializer(serializers.ModelSerializer):

    # question = QuestionSerializer(many=True,read_only=True)

    class Meta:
        model = Quizzes
        fields = [
            'title','id','date_created','question','image','slug'
        ]