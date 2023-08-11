from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('search/', views.search, name='search'),
    path('detail/', views.detail, name='detail'),
    path('delete/', views.delete, name='delete'),
]