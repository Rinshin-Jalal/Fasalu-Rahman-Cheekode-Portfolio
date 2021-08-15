from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import Post,WImage,Gallery,AwardGallery,ContactForm
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status



class PostSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    def __init__(self, *args, **kwargs):
        kwargs['partial'] = True
        super(PostSerializer, self).__init__(*args, **kwargs)
    class Meta:
        model = Post
        fields = ['id', 'title','slug', 'body','owner','notify_users' ,'image','created']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username',   'is_staff']

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username','first_name','last_name','email','password',)
        extra_kwargs = {'password': {'write_only': True}}

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