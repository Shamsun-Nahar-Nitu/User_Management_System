# User Management System

This project exposes a JSON REST API with JWT authentication and Swagger documentation.

Quick start

- Create and activate your virtualenv and install requirements from `requirements.txt`.
- Run the development server:

```bash
python manage.py runserver
```

- Open Swagger UI (only available when `DEBUG=True`):

	http://127.0.0.1:8000/swagger/

Verify endpoints from Swagger

1. Inspect available endpoints under the `/api/` prefix. Key endpoints:
	 - `POST /api/auth/register/` — register
	 - `POST /api/auth/login/` — obtain `access` and `refresh` tokens
	 - `POST /api/auth/token/refresh/` — refresh access token
	 - `POST /api/auth/logout/` — blacklist refresh tokens (optional `refresh` body)
	 - `POST /api/auth/change-password/` — change current user's password
	 - `GET  /api/users/details` — admin-only user list

2. Use the Swagger `Try it out` button for each operation and inspect request/response details.
3. Use the top-right `Authorize` button and paste the access token as:

```
Bearer <access_token>
```

Sample requests (curl)

- Register:

```bash
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
	-H "Content-Type: application/json" \
	-d '{"username":"newuser","email":"newuser@example.com","password":"newpass123"}'
```

- Login (obtain tokens):

```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
	-H "Content-Type: application/json" \
	-d '{"username":"newuser","password":"newpass123"}'
```

Will return JSON with `access` and `refresh`.

- Refresh access token:

```bash
curl -X POST http://127.0.0.1:8000/api/auth/token/refresh/ \
	-H "Content-Type: application/json" \
	-d '{"refresh":"<refresh_token>"}'
```

- Change password (authenticated):

```bash
curl -X POST http://127.0.0.1:8000/api/auth/change-password/ \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <access_token>" \
	-d '{"old_password":"oldpass","new_password":"newpass123","confirm_password":"newpass123"}'
```

- Logout (blacklist outstanding refresh tokens):

```bash
curl -X POST http://127.0.0.1:8000/api/auth/logout/ \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <access_token>" \
	-d '{}'   # or send {"refresh":"<refresh_token>"}
```

- Verify refresh token is invalid after logout:

```bash
curl -X POST http://127.0.0.1:8000/api/auth/token/refresh/ \
	-H "Content-Type: application/json" \
	-d '{"refresh":"<refresh_token>"}'
```

Expected: 400 / invalid if the refresh token was blacklisted by logout.

Run tests

```bash
python manage.py test users
```

Notes

- Swagger UI is only exposed when `DEBUG=True` (development). Set `DEBUG=False` for production and use other API docs hosting if needed.
- For production, follow the security checklist in `newdjango/settings.py` comments: set `ALLOWED_HOSTS`, a secure `SECRET_KEY`, HTTPS settings, and enable cookie security.

