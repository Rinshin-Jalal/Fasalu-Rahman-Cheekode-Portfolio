from rest_framework import generics
from api import serializers
from django.contrib.auth.models import User
from api.models import Post,WImage,Gallery,AwardGallery
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser,FormParser
from api.permissions import IsAdminUserOrReadOnly

class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = serializers.PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,IsAdminUserOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    # def perform_create(self, serializer):
    #     serializer.save(owner=self.request.user)
    def post(self, request, *args, **kwargs):
        file_serializer = serializers.PostSerializer(data=request.data)
        if file_serializer.is_valid():
                file_serializer.save(owner=self.request.user)
                return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
                return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    lookup_field = 'slug'
    serializer_class = serializers.PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,]


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer


class AwardGallery(generics.ListAPIView):
    queryset = AwardGallery.objects.all()
    serializer_class = serializers.AwardGallerySerializer

class GalleryList(generics.ListAPIView):
    queryset = Gallery.objects.all()
    serializer_class = serializers.GallerySerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer


class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserCreateSerializer
    permission_classes = [permissions.AllowAny]


class ContactFormView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.ContactFormSerializer
    permission_classes = [permissions.AllowAny]

class WImageView(generics.ListCreateAPIView):
    queryset = WImage.objects.all()
    serializer_class = serializers.WImageSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.AllowAny]


