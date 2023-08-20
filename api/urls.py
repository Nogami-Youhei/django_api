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
    path('root/reports/', views.ReportList.as_view(), name='report-list'),
    path('root/reports/<int:pk>/', views.ReportDetail.as_view(), name='report-detail'),
    path('root/authors/', views.AuthorList.as_view(), name='author-list'),
    path('root/authors/<int:pk>/', views.AuthorDetail.as_view(), name='author-detail'),
    path('root/categories/', views.CategoryList.as_view(), name='category-list'),
    path('root/categories/<int:pk>/', views.CategoryDetail.as_view(), name='category-detail'),
    path('root/', views.api_root, name='api-root'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
