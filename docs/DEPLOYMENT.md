# Production Deployment Guide

Target layout:

| Host | Serves | Port |
|---|---|---|
| `https://www.avsinsotech.com` | Next.js website + admin (`/admin`) | 3000 (behind Nginx or IIS) |
| `https://api.avsinsotech.com` | ASP.NET Core Web API + uploaded files | 5080 (behind Nginx) or IIS in-process |
| SQL Server 2016+ | `AvsWebsite` database | 1433 (private network only) |

Two supported paths are documented: **A. Linux (Ubuntu + Nginx)** and **B. Windows Server (IIS)**, which matches the AVS team's existing IIS experience.

---

## 1. Prerequisites

- Node.js 20 or 22 LTS, npm
- .NET 8 SDK (build machine) / ASP.NET Core 8 Runtime (server). On IIS, install the **ASP.NET Core 8 Hosting Bundle**.
- SQL Server 2016 or newer (JSON functions are used)
- DNS: `www`, apex and `api` A-records pointing to the server
- SMTP account for lead emails (e.g. Microsoft 365 / Google Workspace `noreply@avsinsotech.com`)

## 2. Database

```sql
CREATE DATABASE AvsWebsite;
CREATE LOGIN avs_web WITH PASSWORD = '<strong password>';
USE AvsWebsite;
CREATE USER avs_web FOR LOGIN avs_web;
ALTER ROLE db_datareader ADD MEMBER avs_web;
ALTER ROLE db_datawriter ADD MEMBER avs_web;
GRANT EXECUTE TO avs_web;
-- For the one-time migrate step, run it as a login with db_ddladmin (or dbo).
```

## 3. Build & configure the API

```bash
cd backend/AvsWebsite.Api
dotnet publish -c Release -o ./publish
```

Set secrets **outside** source control – environment variables (Linux: `/etc/avs-api.env`, IIS: site → Configuration Editor → environmentVariables) or `appsettings.Production.json` (git-ignored):

| Key | Value |
|---|---|
| `ConnectionStrings__ConnectionString` | SQL Server connection string |
| `Jwt__Key` | 64+ random characters (`openssl rand -base64 64`) |
| `Smtp__Host / Port / User / Password / From` | SMTP account |
| `Smtp__LeadRecipients__0` | `sales@avsinsotech.com` |
| `Cors__AllowedOrigins__0` | `https://www.avsinsotech.com` |
| `Uploads__PublicBaseUrl` | `https://api.avsinsotech.com` |
| `Recaptcha__SecretKey` | optional – enables reCAPTCHA v3 checks |

Initialise the database and the first admin user (from the publish folder):

```bash
dotnet AvsWebsite.Api.dll migrate
dotnet AvsWebsite.Api.dll create-admin admin@avsinsotech.com "AVS Website Admin"
```

`migrate` is idempotent; the seed never overwrites content edited in the admin.

## 4. Build the website

```bash
cd frontend
cp .env.example .env.production
#   NEXT_PUBLIC_SITE_URL=https://www.avsinsotech.com
#   NEXT_PUBLIC_API_URL=https://api.avsinsotech.com
#   NEXT_PUBLIC_GA_ID=G-XXXXXXX            (optional)
#   NEXT_PUBLIC_GSC_VERIFICATION=xxxxxxxx  (optional)
npm ci
npm run build
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
```

The deployable website is the `.next/standalone` folder (contains `server.js`).

---

## A. Linux (Ubuntu + Nginx)

```bash
# API
sudo mkdir -p /var/www/avs-api && sudo cp -r backend/AvsWebsite.Api/publish/* /var/www/avs-api/
sudo cp deploy/avs-api.env.example /etc/avs-api.env && sudo nano /etc/avs-api.env && sudo chmod 600 /etc/avs-api.env
sudo chown -R www-data:www-data /var/www/avs-api
sudo cp deploy/avs-api.service /etc/systemd/system/ && sudo systemctl enable --now avs-api

# Website
sudo npm i -g pm2
pm2 start deploy/ecosystem.config.js && pm2 save && pm2 startup

# Nginx + TLS
sudo cp deploy/nginx/avsinsotech.conf /etc/nginx/sites-available/ && sudo ln -s /etc/nginx/sites-available/avsinsotech.conf /etc/nginx/sites-enabled/
sudo certbot --nginx -d avsinsotech.com -d www.avsinsotech.com -d api.avsinsotech.com
sudo nginx -t && sudo systemctl reload nginx
```

## B. Windows Server (IIS)

1. Install IIS, **URL Rewrite**, **Application Request Routing** (enable proxy: IIS Manager → server → ARR → Server Proxy Settings → *Enable proxy*), the **ASP.NET Core 8 Hosting Bundle** and Node.js LTS.
2. **API site** – create site `api.avsinsotech.com` pointing to the API `publish` folder (it includes `web.config`). App pool: *No Managed Code*. Give the app pool identity write access to `wwwroot\uploads`.
3. **Website** – copy `.next\standalone` to e.g. `D:\Sites\avs-website`. Run it as a Windows service (PM2 with `pm2-installer`, or NSSM: `nssm install AvsWebsite "C:\Program Files\nodejs\node.exe" D:\Sites\avs-website\server.js`, set env `PORT=3000`, `HOSTNAME=127.0.0.1`, `NODE_ENV=production`).
4. Create IIS site `www.avsinsotech.com` with an empty folder containing `deploy\iis\web.config.website` renamed to `web.config` (reverse-proxies to port 3000).
5. Bind HTTPS certificates to both sites (win-acme for Let's Encrypt, or the company's certificate).

---

## 5. Post-deployment checklist

- [ ] `https://api.avsinsotech.com/api/health` → `{"status":"ok","db":"ok"}`
- [ ] Submit each form (Contact, Demo, Product Enquiry) → appears in **Admin → Enquiries** and arrives at sales@avsinsotech.com
- [ ] Admin login works; change the initial password; edit a product and confirm the change appears on the site within 5 minutes
- [ ] Upload a brochure and a screenshot to a product; verify download/display
- [ ] `https://www.avsinsotech.com/sitemap.xml` and `/robots.txt` load with the production domain
- [ ] Submit the sitemap in Google Search Console; verify GA4 real-time hits
- [ ] Run Lighthouse (mobile) – target ≥ 90 for Performance, SEO, Accessibility, Best Practices
- [ ] Database backups scheduled (full daily + log backups) and `wwwroot/uploads` included in file backups
- [ ] Check every page on desktop, tablet and mobile (Chrome, Edge, Safari)

## 6. Updating the site

```bash
git pull
cd frontend && npm ci && npm run build && cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/ && pm2 restart avs-website
cd backend/AvsWebsite.Api && dotnet publish -c Release -o ./publish   # copy to server, restart service / recycle app pool
```

Content updates (products, articles, FAQs, homepage numbers, contact details, SEO) need **no deployment** – use `/admin`.
