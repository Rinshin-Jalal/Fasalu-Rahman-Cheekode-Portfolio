from django.db import models
from django.utils.translation import gettext_lazy as _
import string 
from django.utils.text import slugify 
import random 
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver


def random_string_generator(size = 10, chars = string.ascii_lowercase + string.digits): 
    return ''.join(random.choice(chars) for _ in range(size)) 
  
def unique_slug_generator(instance, new_slug = None): 
    slug =""
    if new_slug is not None: 
        slug = new_slug 
    else: 
        slug = slugify(instance.title+"_"+random_string_generator(size=12)) 
    Klass = instance.__class__ 
    qs_exists = Klass.objects.filter(slug = slug).exists() 
    if qs_exists: 
        new_slug = "{slug}-{randstr}".format( 
            slug = slug, randstr = random_string_generator(size = 4)) 
        print(new_slug)
              
        return unique_slug_generator(instance, new_slug = new_slug) 
    return slug 


class Quizzes(models.Model):

    class Meta:
        verbose_name = _("Quiz")
        verbose_name_plural = _("Quizzes")
        ordering = ['id']

    title = models.CharField(max_length=255, default=_(
        "New Quiz"), verbose_name=_("Quiz Title"))
    slug = models.SlugField(null=True, blank=True,max_length=1500)
    date_created = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(blank=True,null=True)

    def __str__(self):
        return self.title

@receiver(pre_save, sender=Quizzes)
def post_pre_save(sender, instance, *args, **kwargs):
    if not instance.slug: 
       instance.slug = unique_slug_generator(instance)

class Updated(models.Model):

    date_updated = models.DateTimeField(
        verbose_name=_("Last Updated"), auto_now=True)

    class Meta:
        abstract = True

class Question(Updated):

    class Meta:
        verbose_name = _("Question")
        verbose_name_plural = _("Questions")
        ordering = ['id']




    quiz = models.ForeignKey(
        Quizzes, related_name='question', on_delete=models.CASCADE)
    title = models.CharField(max_length=255, verbose_name=_("Title"))
    date_created = models.DateTimeField(
        auto_now_add=True, verbose_name=_("Date Created"))
    image = models.ImageField(blank=True,null=True)

    def __str__(self):
        return self.title


class Answer(Updated):

    class Meta:
        verbose_name = _("Answer")
        verbose_name_plural = _("Answers")
        ordering = ['id']

    question = models.ForeignKey(
        Question, related_name='answers', on_delete=models.CASCADE)
    answer_text = models.CharField(
        max_length=255, verbose_name=_("Answer Text"))
    is_right = models.BooleanField(default=False)
    image = models.ImageField(blank=True,null=True)

    def __str__(self):
        return self.answer_text

class Score(Updated):
    class Meta:
        verbose_name = _("Score")
        verbose_name_plural = _("Score")
        ordering = ['id']
    quiz = models.ForeignKey(
        Quizzes, related_name='quiz', on_delete=models.CASCADE)
    score = models.PositiveIntegerField(null=False,blank=False)
    user = models.CharField(max_length=1000)