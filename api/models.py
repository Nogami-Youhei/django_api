from django.db import models
from django.contrib.auth.models import AbstractUser


class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    pass


class Report(models.Model):
    name = models.CharField(max_length=255)
    smile_id = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    abstract = models.CharField(max_length=255)
    box_url = models.URLField(max_length=255)
    datetime = models.DateTimeField(auto_now_add=True)
    categories = models.ManyToManyField(Category, related_name='reports', blank=True)
    author = models.ForeignKey(CustomUser, related_name='written_reports', on_delete=models.CASCADE, null=True)
    readers = models.ManyToManyField(CustomUser, related_name='viewed_reports')
    readers_number = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-datetime']
