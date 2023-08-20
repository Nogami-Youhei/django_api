from api.models import Report
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class ReportSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField()
    smile_id = serializers.ReadOnlyField()
    author = serializers.ReadOnlyField(source='author.last_name' + ' ' + 'author.first_name')
    readers = serializers.SerializerMethodField()
    readers_number = serializers.ReadOnlyField()

    class Meta:
        model = Report
        fields = '__all__'

    def get_readers(self, obj):

        return [user.last_name + ' ' + user.first_name for user in obj.readers.all()]


# class AuthorSerializer(serializers.ModelSerializer):
#     written_reports = serializers.SerializerMethodField()
#     viewed_reports = serializers.SerializerMethodField()

#     class Meta:
#         model = User
#         fields = ['id', 'username', 'written_reports', 'viewed_reports']
    
#     def get_written_reports(self, user):
#         written_reports = user.written_reports.all()
#         return ReportSerializer(written_reports, many=True).data
    
#     def get_viewed_reports(self, user):
#         viewed_reports = user.viewed_reports.all()
#         return ReportSerializer(viewed_reports, many=True).data
    

class AuthorSerializer(serializers.ModelSerializer):
    written_reports = serializers.PrimaryKeyRelatedField(many=True, queryset=Report.objects.all())
    viewed_reports = serializers.PrimaryKeyRelatedField(many=True, queryset=Report.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'written_reports', 'viewed_reports']

