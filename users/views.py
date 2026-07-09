from django.urls import reverse_lazy
from django.views import generic
from .forms import CustomSignUpForm

class SignUpView(generic.CreateView):
    form_class = CustomSignUpForm
    success_url = reverse_lazy('login') 
    template_name = 'registration/signup.html'