# Hostinger VPS Setup Guide — SimpliFly Finland
## "From Zero to a Live Server"

> This guide assumes you've upgraded to **Hostinger KVM2 VPS** with **Ubuntu 22.04 LTS**.
> Follow every step exactly. Each command is explained.

---

## Step 1: Access Your VPS (SSH Connection)

**What is SSH?** It's like a secure remote control for your server. You type commands on your laptop and they run on the server in Finland (or wherever Hostinger's datacenter is).

### On Your Windows Laptop:
1. Open **PowerShell** or **Windows Terminal**
2. Run this command (replace with YOUR server's IP):
```bash
ssh root@YOUR_SERVER_IP
```
3. First time? Type `yes` when it asks "Are you sure you want to continue?"
4. Enter your VPS root password (from Hostinger email)

**You'll see something like:** `root@srv123456:~#`
That `#` means you're logged into the server. 🎉

---

## Step 2: Update the Server

**Why?** Servers come with outdated software. This installs all security patches.
```bash
apt update && apt upgrade -y
```
⏱️ Takes 2-3 minutes. Wait for it to finish.

---

## Step 3: Create a Non-Root User (Security Best Practice)

**Why?** Using `root` for everything is dangerous. We create a regular user for daily work.
```bash
# Create a user called "deploy"
adduser deploy

# Give it admin powers (sudo)
usermod -aG sudo deploy

# Switch to this user
su - deploy
```

---

## Step 4: Set Up SSH Key Login (No More Passwords!)

**On your LAPTOP (new PowerShell window):**
```powershell
# Generate an SSH key pair (public + private key)
ssh-keygen -t ed25519 -C "simplifly-deploy"

# Press Enter 3 times to accept defaults
# This creates two files:
# ~/.ssh/id_ed25519       ← PRIVATE KEY (never share this!)
# ~/.ssh/id_ed25519.pub   ← PUBLIC KEY (this goes on the server)
```

**Copy your public key to the server:**
```powershell
# This command copies your public key to the server
ssh-copy-id deploy@YOUR_SERVER_IP
```

Now you can SSH in without a password: `ssh deploy@YOUR_SERVER_IP`

---

## Step 5: Configure the Firewall (UFW)

**What is UFW?** Ubuntu's simple firewall. It blocks ALL connections except the ones we allow.

```bash
# Allow SSH (IMPORTANT: do this FIRST or you'll lock yourself out!)
sudo ufw allow 22/tcp

# Allow HTTP (website on port 80)
sudo ufw allow 80/tcp

# Allow HTTPS (secure website on port 443)
sudo ufw allow 443/tcp

# Turn the firewall ON
sudo ufw enable

# Check it's working
sudo ufw status
```

**Expected output:**
```
Status: active
To                  Action      From
22/tcp              ALLOW       Anywhere
80/tcp              ALLOW       Anywhere
443/tcp             ALLOW       Anywhere
```

---

## Step 6: Install Docker

**What is Docker?** Imagine a shipping container. Inside the container, everything your app needs is packed perfectly. You run the container, and your app works — regardless of what else is on the server.

```bash
# One command installs Docker:
curl -fsSL https://get.docker.com | sh

# Add your user to the docker group (so you don't need "sudo" every time)
sudo usermod -aG docker deploy

# Log out and back in for the change to take effect
exit
ssh deploy@YOUR_SERVER_IP

# Test Docker is working:
docker run hello-world
```

**Expected:** You'll see "Hello from Docker!" — Docker is working! ✅

---

## Step 7: Install Docker Compose

**What is Docker Compose?** If Docker runs ONE container, Docker Compose runs MULTIPLE containers at once. We need 5 containers running together (Next.js, Express, PostgreSQL, Redis, Nginx).

```bash
# Install Docker Compose plugin
sudo apt install -y docker-compose-plugin

# Test it works
docker compose version
```

---

## Step 8: Create the App Directory

```bash
# Create a folder for our app
sudo mkdir -p /opt/simplifly
sudo chown deploy:deploy /opt/simplifly

# This is where our code will live on the server
cd /opt/simplifly
```

---

## Step 9: Set Up GitHub SSH Key (For Automated Deploys)

**Why?** The GitHub Actions robot needs to SSH into your server to deploy. We give it a special key.

```bash
# On the SERVER, generate a deploy key
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions

# Show the PUBLIC key (we'll add this to GitHub)
cat ~/.ssh/github_actions.pub

# Add to authorized keys (allows GitHub Actions to SSH in with this key)
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

**Show the PRIVATE key** (we'll add this to GitHub Secrets):
```bash
cat ~/.ssh/github_actions
# Copy everything including -----BEGIN... and -----END...
```

---

## Step 10: Add Secrets to GitHub

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets:

| Secret Name | Value | Where to Find |
|------------|-------|---------------|
| `VPS_HOST` | Your server IP | Hostinger dashboard |
| `VPS_USER` | `deploy` | The user we created |
| `VPS_SSH_KEY` | Content of `~/.ssh/github_actions` | From Step 9 |
| `DATABASE_URL` | `postgresql://simplifly:PASSWORD@db:5432/simplifly` | We'll set the password |
| `JWT_SECRET` | Run: `openssl rand -hex 64` | Generate it below |
| `REDIS_URL` | `redis://redis:6379` | Fixed value |

**Generate a secure JWT_SECRET:**
```bash
# Run this on the server
openssl rand -hex 64
# Copy the output — that's your JWT_SECRET
```

---

## ✅ Server Setup Complete!

Your server now has:
- ✅ Updated Ubuntu 22.04
- ✅ Non-root deploy user
- ✅ SSH key authentication
- ✅ UFW firewall (only ports 22, 80, 443)
- ✅ Docker + Docker Compose
- ✅ App directory at /opt/simplifly
- ✅ GitHub Actions deploy key

**Next step:** Set up Cloudflare to point your domain to this server.
See `docs/CLOUDFLARE_SETUP.md`
