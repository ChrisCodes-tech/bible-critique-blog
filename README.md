
# bible-critique-blog
A home for honest, rigorous inquiry into scripture, theology, and religious tradition — free from dogma, open to reason.

# BibleCritique — Full-Stack Setup Guide
## Termux (Android) + Acode Editor

---

## Project Overview

**BibleCritique** is a full-stack biblical criticism blog with:

- **Public readers** — browse and read essays without an account
- **Registered users** — log in to comment and reply to other users
- **Admin** — create, edit, delete essays (staff users only)

**Stack:** Django 4.2 · DRF · SimpleJWT · React 18 · TypeScript · Tailwind CSS · Vite · SQLite

---

## Directory Structure

```
biblecritique/
├── backend/               ← Django project
│   ├── core/              ← settings, urls, wsgi
│   ├── apps/
│   │   ├── users/         ← Custom User model, JWT auth
│   │   ├── blog/          ← Posts, Tags
│   │   └── comments/      ← Threaded comments (2 levels)
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/              ← React + TypeScript + Tailwind
    ├── src/
    │   ├── api/           ← Axios clients (auth, posts, comments)
    │   ├── components/    ← UI, Blog, Comments, Layout
    │   ├── context/       ← AuthContext (JWT session)
    │   ├── pages/         ← Home, PostDetail, Login, Register, Admin
    │   ├── types/         ← TypeScript interfaces
    │   └── utils/         ← Date helpers, error parser
    ├── tailwind.config.js
    ├── vite.config.ts
    └── package.json
```

---

## Part 1 — Install Termux Packages

Open Termux and run each block:

```bash
# Update and upgrade
pkg update && pkg upgrade -y

# Core tools
pkg install -y python nodejs git curl wget

# Build dependencies (needed for Pillow)
pkg install -y libjpeg-turbo libpng freetype

# Optional but useful
pkg install -y nano
```

---

## Part 2 — Backend Setup (Django)

### 2.1  Navigate into the backend directory

```bash
cd ~/storage/shared/biblecritique/backend
# OR wherever you placed the project, e.g.:
# cd /data/data/com.termux/files/home/biblecritique/backend
```

### 2.2  Create a Python virtual environment

```bash
python -m venv venv
source venv/bin/activate
```

> **Every time** you open a new Termux session, you must re-activate:
> `source venv/bin/activate`

### 2.3  Install dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

If Pillow fails on Termux, install it without JPEG support:

```bash
pip install Pillow --global-option="build_ext" \
    --global-option="--disable-jpeg" 2>/dev/null || \
pip install Pillow
```

### 2.4  Create your .env file

```bash
cp .env.example .env
```

Open `.env` in Acode and set a strong SECRET_KEY:

```
SECRET_KEY=replace-this-with-a-long-random-string-at-least-50-chars
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

**Generate a secret key quickly:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(60))"
```

### 2.5  Run migrations

```bash
python manage.py makemigrations users blog comments
python manage.py migrate
```

### 2.6  Create the admin (superuser)

```bash
python manage.py createsuperuser
```

Enter your email, username, and password when prompted.
This user will have `is_staff=True` automatically, giving them full admin access on the blog.

### 2.7  (Optional) Load sample data

```bash
python manage.py shell
```

Inside the shell:
```python
from apps.users.models import User
from apps.blog.models import Post, Tag

admin = User.objects.first()  # your superuser
t1, _ = Tag.objects.get_or_create(name="Old Testament")
t2, _ = Tag.objects.get_or_create(name="Historicity")

post = Post.objects.create(
    author=admin,
    title="Did Moses Really Write the Pentateuch?",
    body="""<p>The Documentary Hypothesis, first systematized by Julius Wellhausen in 1878, 
proposes that the first five books of the Bible are not the work of a single author 
but a composite of at least four distinct literary strands — J, E, D, and P.</p>

<h2>The Evidence</h2>
<p>Several lines of evidence support the composite authorship theory. Most strikingly, 
the same events are often narrated twice with contradictory details.</p>

<blockquote>Genesis 6–9 contains two interleaved flood accounts with 
irreconcilable timelines and different divine names.</blockquote>

<p>In the Yahwist (J) account, Noah takes seven pairs of clean animals. 
In the Priestly (P) account, he takes one pair of each. Both cannot be 
original to the same author.</p>""",
    status="published",
)
post.tags.add(t1, t2)
print("Post created:", post.slug)
exit()
```

### 2.8  Start the backend server

```bash
python manage.py runserver 0.0.0.0:8000
```

Leave this running. Open a **second Termux session** (swipe right) for the frontend.

---

## Part 3 — Frontend Setup (React + Vite)

### 3.1  Navigate to the frontend directory

In your second Termux session:

```bash
cd ~/storage/shared/biblecritique/frontend
# adjust path as needed
```

### 3.2  Install Node dependencies

```bash
npm install
```

> If npm is slow on Termux, you can use:
> ```bash
> npm install --prefer-offline
> ```

### 3.3  Start the development server

```bash
npm run dev
```

You'll see:
```
  VITE v5.x.x  ready in ...ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

### 3.4  Open in browser

On your Android device, open your browser and go to:
```
http://localhost:5173
```

---

## Part 4 — API Endpoints Reference

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/register/` | None | Register new user |
| POST | `/api/auth/login/` | None | Get JWT tokens |
| POST | `/api/auth/token/refresh/` | None | Refresh access token |
| POST | `/api/auth/logout/` | Required | Blacklist refresh token |
| GET/PATCH | `/api/auth/profile/` | Required | View/update own profile |
| GET | `/api/blog/posts/` | None | List published posts |
| POST | `/api/blog/posts/` | Admin | Create post |
| GET | `/api/blog/posts/{slug}/` | None | Get post detail |
| PATCH | `/api/blog/posts/{slug}/` | Admin | Update post |
| DELETE | `/api/blog/posts/{slug}/` | Admin | Delete post |
| GET | `/api/blog/tags/` | None | List tags |
| POST | `/api/blog/tags/` | Admin | Create tag |
| GET | `/api/comments/posts/{id}/` | None | List comments for post |
| POST | `/api/comments/posts/{id}/` | Required | Create comment/reply |
| PATCH | `/api/comments/{id}/` | Author/Admin | Edit comment |
| DELETE | `/api/comments/{id}/` | Author/Admin | Delete comment |

---

## Part 5 — Making a User an Admin

Only superusers can grant admin (staff) access. There are two ways:

**Option A — Django Admin panel**
1. Go to `http://localhost:8000/admin/`
2. Log in with your superuser credentials
3. Click Users → find the user → check `Staff status` → Save

**Option B — Shell**
```bash
python manage.py shell
```
```python
from apps.users.models import User
u = User.objects.get(email="user@example.com")
u.is_staff = True
u.save()
exit()
```

---

## Part 6 — Acode Editor Tips

Acode is a capable mobile code editor. Recommended settings for this project:

1. **Open project folder** — tap the folder icon and navigate to `biblecritique/`
2. **Syntax highlighting** — Acode supports TypeScript, Python, and JSX natively
3. **File tree** — use the sidebar to navigate between backend and frontend folders
4. **Terminal integration** — use Termux for all CLI commands; Acode is for editing only
5. **Auto-save** — enable it in Acode settings to avoid losing changes

---

## Part 7 — Common Issues & Fixes

### `ModuleNotFoundError: No module named 'decouple'`
```bash
source venv/bin/activate  # re-activate virtual environment
pip install python-decouple
```

### `CORS` errors in the browser
Make sure both servers are running. In `.env`, confirm:
```
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### `Pillow` install fails
```bash
CFLAGS="-I/data/data/com.termux/files/usr/include" \
LDFLAGS="-L/data/data/com.termux/files/usr/lib" \
pip install Pillow
```

### Frontend can't reach the backend
The Vite config proxies `/api` to `http://127.0.0.1:8000`. Make sure Django is running on port 8000 and you're accessing the frontend on port 5173.

### `npm: command not found`
```bash
pkg install nodejs
```

### `python: command not found`
```bash
pkg install python
```

### SQLite error on Termux
SQLite is bundled with Python. If you see issues:
```bash
pkg install sqlite
```

---

## Part 8 — Production Considerations

When you're ready to deploy (not required for local development):

1. Set `DEBUG=False` in `.env`
2. Generate a fresh `SECRET_KEY`
3. Use `python manage.py collectstatic`
4. Use **gunicorn** + **nginx** for serving Django
5. Use `npm run build` → serve the `dist/` folder with nginx
6. Consider PostgreSQL instead of SQLite for production
7. Set proper `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`

---

## Part 9 — Design System

The blog uses a dark editorial aesthetic:

| Token | Value | Usage |
|-------|-------|-------|
| `ink` | `#0C0B09` | Page background |
| `ink-soft` | `#1A1916` | Card backgrounds |
| `ink-muted` | `#2E2C28` | Borders, dividers |
| `parchment` | `#F2EDE4` | Primary text |
| `parchment-muted` | `#C9BFB0` | Secondary text |
| `amber-blog` | `#C8833A` | Accent / CTA |
| `crimson-blog` | `#8B2020` | Danger / delete |

**Fonts:**
- `Cormorant Garamond` — display headings (classical, scholarly)
- `Crimson Text` — body copy (warm, readable serif)
- `DM Sans` — UI labels, tags, metadata

---

## Quick Start Summary

```bash
# Terminal 1 — Backend
cd biblecritique/backend
source venv/bin/activate
python manage.py runserver 0.0.0.0:8000

# Terminal 2 — Frontend
cd biblecritique/frontend
npm run dev

# Browser
open http://localhost:5173
```

6b5b446 (Initial commit)
