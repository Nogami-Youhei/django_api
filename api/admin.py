from django.contrib import admin
from .models import CustomUser, Report

admin.site.register(CustomUser)
admin.site.register(Report)
