from django.urls import reverse_lazy
from django.views.generic import TemplateView
from django.views.generic.edit import CreateView
from .forms import CustomSignUpForm

class HomeView(TemplateView):
    template_name = 'home.html'

class SignUpView(CreateView):
    form_class = CustomSignUpForm
    template_name = 'registration/signup.html'
    success_url = reverse_lazy('login')