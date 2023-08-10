from django.db import models

class Document(models.Model):
    description = models.CharField(max_length=256)
    date = models.DateField(auto_now_add=True)
