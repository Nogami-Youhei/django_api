from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

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
    path('reports/', views.ReportList.as_view()),
    path('reports/<int:pk>/', views.ReportDetail.as_view()),
    path('authors/', views.AuthorList.as_view()),
    path('authors/<int:pk>/', views.AuthorDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
