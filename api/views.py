from django.shortcuts import render
from .forms import ReportForm, SearchForm
from .models import Report
from django.http import HttpResponse
from django.utils import timezone
import datetime
import pytz
from django.db.models import Q

def index(request):
    
    if request.method == 'POST':
        form = ReportForm(request.POST)

        if form.is_valid():
            form.save()
            
            return HttpResponse('success')
        
        else:
            search_form = SearchForm()
            params = {
                'report_form': form,
                'search_form': search_form,
            }
            return render(request, 'api/index.html', params)
    
    search_form = SearchForm()
    report_form = ReportForm()
    
    params = {
        'report_form': report_form,
        'search_form': search_form,
    }

    return render(request, 'api/index.html', params)


def search(request):

    form = SearchForm(request.POST)

    if form.is_valid():
        keywords = form.cleaned_data.get('keyword')
        categories = form.cleaned_data.get('categories')
        start_date = form.cleaned_data.get('start_date')
        end_date = form.cleaned_data.get('end_date')

        items = Report.objects.all()
        if keywords:
            keywords = keywords.split()
            query_filter = (Q(title__icontains=keywords[0]) | Q(abstract__icontains=keywords[0]))

            for keyword in keywords:
                query_filter &= (Q(title__icontains=keyword) | Q(abstract__icontains=keyword))
            
            items = items.filter(query_filter)
        if categories:
            items = items.filter(categories__in=categories)
        if start_date and end_date:
            timezone = pytz.timezone('Asia/Tokyo')

            # datetime.date オブジェクトを datetime.datetime オブジェクトに変換してタイムゾーン情報を追加
            start_date = datetime.datetime.combine(start_date, datetime.time())
            end_date = datetime.datetime.combine(end_date, datetime.time(23, 59, 59, 999999))

            start_date = timezone.localize(start_date)
            end_date = timezone.localize(end_date)
            items = items.filter(datetime__range=(start_date, end_date))

        items = items.distinct()
        params = {
            'items': items,
        }

        return render(request, 'api/items.html', params)
    
    else:
        return HttpResponse('error')

def detail(request):
    id = request.POST.get('detail')
    report = Report.objects.get(id=id)
    categories = report.categories.all()
    categories = [category.name for category in categories]
    params = {
        'report': report,
        'categories': categories,
    }

    return render(request, 'api/detail.html', params)

def delete(request):
    id = request.POST.get('delete')
    report = Report.objects.get(id=id)
    report.delete()
    return HttpResponse('delete')