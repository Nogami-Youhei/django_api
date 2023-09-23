from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'reports', views.ReportViewSet, basename='report')
router.register(r'authors', views.AuthorViewSet, basename='author')
router.register(r'categories', views.CategoryViewSet, basename='category')

urlpatterns = [
    path('', views.index, name='index'),
    path('search/', views.search, name='search'),
    path('detail/', views.detail, name='detail'),
    path('delete/', views.delete, name='delete'),
    path('update/', views.update, name='update'),
    path('box/', views.box, name='box'),
    path('output/', views.output, name='output'),
    path('analysis/', views.analysis, name='analysis'),
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('rename/', views.rename_view, name='rename'),
    path('setpassword/', views.setpassword_view, name='setpassword'),
    path('token/', views.token_view, name='token'),
    path('root/', include(router.urls)),
]
