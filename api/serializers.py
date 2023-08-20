from api.models import Report, Category
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class ReportSerializer(serializers.HyperlinkedModelSerializer):
    name = serializers.ReadOnlyField()
    smile_id = serializers.ReadOnlyField()
    author = serializers.HyperlinkedRelatedField(view_name='author-detail', read_only=True)
    categories = serializers.HyperlinkedRelatedField(many=True, view_name='category-detail', read_only=True)
    readers = serializers.HyperlinkedRelatedField(many=True, view_name='author-detail', read_only=True)
    readers_number = serializers.ReadOnlyField()

    class Meta:
        model = Report
        fields = '__all__'


class AuthorSerializer(serializers.HyperlinkedModelSerializer):
    written_reports = serializers.HyperlinkedRelatedField(many=True, view_name='report-detail', read_only=True)
    viewed_reports = serializers.HyperlinkedRelatedField(many=True, view_name='report-detail', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'written_reports', 'viewed_reports']


class CategorySerializer(serializers.HyperlinkedModelSerializer):
    reports = serializers.HyperlinkedRelatedField(many=True, view_name='report-detail', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'reports']


# class ReportSerializer(serializers.ModelSerializer):
#     name = serializers.ReadOnlyField()
#     smile_id = serializers.ReadOnlyField()
#     author = serializers.ReadOnlyField(source='author.last_name' + ' ' + 'author.first_name')
#     categories = serializers.SerializerMethodField()
#     readers = serializers.SerializerMethodField()
#     readers_number = serializers.ReadOnlyField()

#     class Meta:
#         model = Report
#         fields = '__all__'

#     def get_readers(self, obj):
#         return [user.last_name + ' ' + user.first_name for user in obj.readers.all()]
    
#     def get_categories(self, obj):
#         return [category.name for category in obj.categories.all()]


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
