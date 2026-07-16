from django.urls import reverse_lazy
from django.views.generic.edit import CreateView
from django.views.generic import TemplateView
from .forms import CustomSignUpForm


class HomeView(TemplateView):
    template_name = 'home.html'


class SignUpView(CreateView):
    form_class = CustomSignUpForm
    success_url = reverse_lazy('login') 
    template_name = 'registration/signup.html'