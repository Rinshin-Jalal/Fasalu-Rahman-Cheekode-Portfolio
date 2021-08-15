from django.contrib import admin
from . import models

# @admin.register(models.Category)

# class CatAdmin(admin.ModelAdmin):
# 	list_display = [
#         'name',
#         ]

@admin.register(models.Quizzes)

class QuizAdmin(admin.ModelAdmin):
	list_display = [
        'id', 
        'title',
        'image'
        ]

@admin.register(models.Score)

class ScoreAdmin(admin.ModelAdmin):
    list_display = [
        'id', 
        'quiz',
        'score',
        'user',
        ]

class AnswerInlineModel(admin.TabularInline):
    model = models.Answer
    fields = [
        'answer_text', 
        'is_right',
        'image'
        ]

@admin.register(models.Question)

class QuestionAdmin(admin.ModelAdmin):
    fields = [
        'title',
        'quiz',
        'image'
        ]
    list_display = [
        'title', 
        'quiz',
        'date_updated'
        ]
    inlines = [
        AnswerInlineModel, 
        ] 

@admin.register(models.Answer)

class AnswerAdmin(admin.ModelAdmin):
    list_display = [
        'answer_text', 
        'is_right', 
        'question',
        'image'
        ]