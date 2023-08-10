from django.shortcuts import render
from .forms import DocumentForm


def index(request):
    
    form = DocumentForm(request.POST)

    if request.method == 'POST':
        if form.is_valid():
            form.save()
    
    params = {
        'form': form,
    }

    return render(request, 'api/index.html', params)