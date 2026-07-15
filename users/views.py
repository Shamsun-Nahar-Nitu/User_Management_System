from django.urls import reverse_lazy
from django.views.generic.edit import CreateView
from .forms import CustomSignUpForm

class SignUpView(CreateView):
    form_class = CustomSignUpForm
    success_url = reverse_lazy('login') 
    template_name = 'registration/signup.html'