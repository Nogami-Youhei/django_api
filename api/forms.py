from django import forms
from .models import Report, Category
from django.forms.widgets import CheckboxSelectMultiple
from django.utils import timezone
from django.utils.timezone import localtime

class CustomCheckboxSelectMultiple(CheckboxSelectMultiple):
    def create_option(self, name, value, label, selected, index, subindex=None, attrs=None):
        option = super().create_option(name, value, label, selected, index, subindex, attrs)
        option['attrs']['id'] = f"custom_checkbox_{value}"
        return option


class ReportForm(forms.ModelForm):

    class Meta:
        model = Report
        exclude = ['datetime']

        labels = {
            'title': 'タイトル',
            'abstract': '要約',
            'categories': 'カテゴリ',
        }
     
        widgets = {
            'abstract': forms.Textarea(attrs={'rows':6, 'cols':22}),
            'categories': CustomCheckboxSelectMultiple,
        }

class CustomSelectDateWidget(forms.SelectDateWidget):
    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        date_context = {}
        year_choices = [(i, str(i)+'年') for i in self.years]
        if not self.is_required:
            year_choices.insert(0, self.year_none_value)
        year_name = self.year_field % name
        date_context["year"] = self.select_widget(
            attrs, choices=year_choices
        ).get_context(
            name=year_name,
            value=context["widget"]["value"]["year"],
            attrs={**context["widget"]["attrs"], "id": "id_%s" % year_name},
        )
        month_choices = list(self.months.items())
        if not self.is_required:
            month_choices.insert(0, self.month_none_value)
        month_name = self.month_field % name
        date_context["month"] = self.select_widget(
            attrs, choices=month_choices
        ).get_context(
            name=month_name,
            value=context["widget"]["value"]["month"],
            attrs={**context["widget"]["attrs"], "id": "id_%s" % month_name},
        )
        day_choices = [(i, str(i)+'日') for i in range(1, 32)]
        if not self.is_required:
            day_choices.insert(0, self.day_none_value)
        day_name = self.day_field % name
        date_context["day"] = self.select_widget(
            attrs,
            choices=day_choices,
        ).get_context(
            name=day_name,
            value=context["widget"]["value"]["day"],
            attrs={**context["widget"]["attrs"], "id": "id_%s" % day_name},
        )
        subwidgets = []
        for field in self._parse_date_fmt():
            subwidgets.append(date_context[field]["widget"])
        context["widget"]["subwidgets"] = subwidgets
        return context

class SearchForm(forms.Form):

    keyword = forms.CharField(max_length=255, required=False, label='キーワード')
    categories = forms.ModelMultipleChoiceField(queryset=Category.objects.all(), widget=forms.CheckboxSelectMultiple, required=False, label='カテゴリ')
    start_date = forms.DateField(widget=CustomSelectDateWidget(years=range(2000, 2030)), label='開始')
    end_date = forms.DateField(initial=localtime(timezone.now()), widget=CustomSelectDateWidget(years=range(2000, 2030)), label='終了')
