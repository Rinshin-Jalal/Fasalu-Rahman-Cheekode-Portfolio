from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import Post,Comment,WImage,Gallery,AwardGallery,ContactForm
# from .serializers import PostSerializer
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status


class PostSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    comments = serializers.PrimaryKeyRelatedField(many=True,queryset=Comment.objects.all())
    # categories = CategorySerializer(many=True)
    def __init__(self, *args, **kwargs):
        kwargs['partial'] = True
        super(PostSerializer, self).__init__(*args, **kwargs)
    class Meta:
        model = Post
        fields = ['id', 'title','slug', 'body','owner','notify_users' ,'comments','image','created']


class CommentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Comment
        fields = ['id', 'body', 'owner', 'post']


class UserSerializer(serializers.ModelSerializer):
    # posts = PostSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    # categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username',  'comments', 'is_staff']#, 'categories']

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username','first_name','last_name','email','password',)
        extra_kwargs = {'password': {'write_only': True}}
        # permi

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class WImageSerializer(serializers.ModelSerializer):
      class Meta:
        model= WImage
        fields= ('image','name')

class ContactFormSerializer(serializers.ModelSerializer):
      class Meta:
        model= ContactForm
        fields= ('name','no','message')

class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = '__all__'

class AwardGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = AwardGallery
        fields = '__all__'