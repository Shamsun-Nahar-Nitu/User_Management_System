from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient


User = get_user_model()


class UsersApiTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        # Create an admin user
        self.admin_user = User.objects.create_user(
            username='admin', 
            email='admin@example.com', 
            password='adminpass123'
        )
        self.admin_user.is_staff = True
        self.admin_user.save()

        # Create a regular user
        self.user = User.objects.create_user(
            username='user1', 
            email='user1@example.com', 
            password='oldpass123'
        )

    def obtain_tokens(self, username, password):
        resp = self.client.post('/api/auth/login/', {'username': username, 'password': password}, format='json')
        return resp

    def test_register_and_login(self):
        # Register a new user
        data = {'username': 'newuser', 
                'email': 'newuser@example.com', 
                'password': 'newpass123'}
        resp = self.client.post('/api/auth/register/', data, format='json')
        self.assertEqual(resp.status_code, 201)

        # Login with the new user's credentials
        login = self.client.post('/api/auth/login/', {'username': 'newuser', 'password': 'newpass123'}, format='json')
        self.assertEqual(login.status_code, 200)
        self.assertIn('access', login.data)
        self.assertIn('refresh', login.data)

    def test_logout_without_refresh_returns_205(self):
        login = self.obtain_tokens('user1', 'oldpass123')
        self.assertEqual(login.status_code, 200)
        access = login.data['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access}')
        resp = self.client.post('/api/auth/logout/', {}, format='json')
        self.assertEqual(resp.status_code, 205)

    def test_change_password_and_login_with_new(self):
        login = self.obtain_tokens('user1', 'oldpass123')
        self.assertEqual(login.status_code, 200)
        access = login.data['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access}')
        resp = self.client.post(
            '/api/auth/change-password/',
            {'old_password': 'oldpass123', 'new_password': 'newpass456', 'confirm_password': 'newpass456'},
            format='json',
        )
        self.assertEqual(resp.status_code, 200)

        # Old credentials should fail to obtain tokens
        old_login = self.client.post('/api/auth/login/', {'username': 'user1', 'password': 'oldpass123'}, format='json')
        self.assertNotEqual(old_login.status_code, 200)

        # New credentials should succeed
        new_login = self.client.post('/api/auth/login/', {'username': 'user1', 'password': 'newpass456'}, format='json')
        self.assertEqual(new_login.status_code, 200)

    def test_user_list_admin_only(self):
        # Regular user should be forbidden
        login = self.obtain_tokens('user1', 'oldpass123')
        self.assertEqual(login.status_code, 200)
        access = login.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access}')
        resp = self.client.get('/api/users/details')
        self.assertIn(resp.status_code, (401, 403))

        # Admin user should be allowed
        admin_login = self.obtain_tokens('admin', 'adminpass123')
        self.assertEqual(admin_login.status_code, 200)
        admin_access = admin_login.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {admin_access}')
        resp2 = self.client.get('/api/users/details')
        self.assertEqual(resp2.status_code, 200)

