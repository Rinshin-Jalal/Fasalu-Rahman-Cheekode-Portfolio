from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from api import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView



urlpatterns = [
    path('users/', views.UserList.as_view()),
    path('users/new/', views.UserCreate.as_view()),
    path('users/<int:pk>/', views.UserDetail.as_view()),
    path('posts/', views.PostList.as_view()),
    path('posts/<slug:slug>/', views.PostDetail.as_view()),
    path('gallery/', views.GalleryList.as_view()),
    path('images/post/',views.WImageView.as_view()),
    path('awardgallery/',views.AwardGallery.as_view()),
    path('contact/form/mailer',views.ContactFormView.as_view()),
    path('api/token/access/', TokenRefreshView.as_view(), name='token_get_access'),
    path('api/token/both/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]

urlpatterns = format_suffix_patterns(urlpatterns)