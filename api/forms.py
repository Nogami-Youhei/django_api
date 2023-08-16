from django import forms
from .models import Report, Category
from django.forms.widgets import CheckboxSelectMultiple
from django.utils import timezone
from datetime import timedelta
from django.utils.timezone import localtime
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, UserChangeForm, SetPasswordForm
from django.contrib.auth import get_user_model

class CustomCheckboxSelectMultiple(CheckboxSelectMultiple):
    def create_option(self, name, value, label, selected, index, subindex=None, attrs=None):
        option = super().create_option(name, value, label, selected, index, subindex, attrs)
        timestamp = timezone.now().timestamp()
        option['attrs']['id'] = f"{value}_{timestamp}"
        return option


class ReportForm(forms.ModelForm):
    class Meta:
        model = Report
        exclude = ['name', 'smile_id', 'datetime', 'readers', 'readers_number']

        labels = {
            'title': '題目',
            'abstract': '要約',
            'categories': '分野',
        }
     
        widgets = {
            'title': forms.TextInput(attrs={'placeholder': '50文字以内'}),
            'abstract': forms.Textarea(attrs={'placeholder': '200文字以内'}),
            'box_url': forms.TextInput(attrs={'placeholder': 'https://sekisui.box.com/...'}),
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
    keyword = forms.CharField(max_length=255, required=False, label='ワード')
    categories = forms.ModelMultipleChoiceField(queryset=Category.objects.all(), widget=forms.CheckboxSelectMultiple, required=False, label='分野')
    start_date = forms.DateField(widget=CustomSelectDateWidget(years=range(2000, 2030)), label='開始')
    end_date = forms.DateField(initial=timezone.now() + timedelta(hours=9), widget=CustomSelectDateWidget(years=range(2000, 2030)), label='終了')
    sort = forms.fields.ChoiceField(
        label='取得順',
        choices = (
            ('0', '登録日[新しい順]'),
            ('1', '登録日[古い順]'),
            ('2', '報告書名順'),
            ('3', '閲覧者数順[多い順]'),
        ),
        widget=forms.widgets.Select(attrs={'class': 'select'})
    )


User = get_user_model()

class SignupForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'last_name', 'first_name', 'password1', 'password2']

        labels = {
            'username': 'Sから始まるID',
        }


class LoginForm(AuthenticationForm):
    error_messages = {
        'invalid_login': (
            "ユーザー名またはパスワードが違います。"
        ),
        'inactive': ("このアカウントは無効です。"),
    }
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-style'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-style'}))


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ['username', 'last_name', 'first_name']
        exclude = ['password']

        labels = {
            'username': 'Sから始まるID',
        }


class CustomSetPasswordForm(SetPasswordForm):
    class Meta:
        model = User
