# 🚀 Guía de Despliegue - AQM (Amigas Queer Madriz)

## 📋 Requisitos del Servidor

### Sistema Operativo
- Ubuntu 20.04 LTS o superior
- IP del servidor: `187.33.159.68`

### Software Necesario
- Node.js (versión 18.x o superior)
- npm o yarn
- Nginx (servidor web)
- PM2 (gestor de procesos)
- Certbot (para SSL)
- Git

---

## 🛠️ Instalación Paso a Paso

### 1. Conectar al Servidor

```bash
ssh root@187.33.159.68
# o
ssh usuario@187.33.159.68
```

### 2. Actualizar el Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Instalar Node.js y npm

```bash
# Instalar Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

### 4. Instalar PM2 (Gestor de Procesos)

```bash
sudo npm install -g pm2
```

### 5. Instalar Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 6. Instalar Git

```bash
sudo apt install git -y
```

### 7. Clonar el Repositorio

```bash
# Crear directorio para la aplicación
sudo mkdir -p /var/www/aqm
sudo chown -R $USER:$USER /var/www/aqm

# Clonar el repositorio
cd /var/www/aqm
git clone https://github.com/Celiusky13/AQM-main.git 
```

### 8. Instalar Dependencias

```bash
npm install
```

### 9. Configurar Variables de Entorno

```bash
# Crear archivo de configuración
nano .env.production

# Agregar las siguientes variables:
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key
```

### 10. Compilar la Aplicación

```bash
npm run build
```

### 11. Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/aqm
```

Agregar la siguiente configuración:

```nginx
server {
    listen 80;
    server_name 187.33.159.68 tu-dominio.com;
    root /var/www/aqm/dist;
    index index.html;

    # Configuración para SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Compresión gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
```

### 12. Activar el Sitio

```bash
sudo ln -s /etc/nginx/sites-available/aqm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 13. Configurar Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

### 14. Instalar SSL con Let's Encrypt (Opcional pero Recomendado)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tu-dominio.com
```

---

## 🔄 Automatización con PM2 (Para Aplicaciones con Backend)

Si tu aplicación tuviera un backend, usarías PM2:

```bash
# Crear archivo ecosystem
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'aqm-app',
    script: 'npm',
    args: 'run preview',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 🔧 Scripts de Mantenimiento

### Script de Actualización

```bash
nano /var/www/aqm/update.sh
```

```bash
#!/bin/bash
cd /var/www/aqm
git pull origin main
npm install
npm run build
sudo systemctl reload nginx
echo "Actualización completada"
```

```bash
chmod +x update.sh
```

### Script de Backup

```bash
nano /var/www/aqm/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backup/aqm_backup_$DATE.tar.gz /var/www/aqm
echo "Backup creado: aqm_backup_$DATE.tar.gz"
```

---

## 🌐 Configuración de Dominio

### Configurar DNS

Si tienes un dominio, configura los registros DNS:

```
Tipo: A
Nombre: @
Valor: 187.33.159.68

Tipo: A  
Nombre: www
Valor: 187.33.159.68
```

### Actualizar Nginx

```bash
sudo nano /etc/nginx/sites-available/aqm
```

Cambiar `server_name`:
```nginx
server_name tu-dominio.com www.tu-dominio.com 187.33.159.68;
```

---

## 📊 Monitoreo y Logs

### Ver logs de Nginx

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Verificar estado del servicio

```bash
sudo systemctl status nginx
sudo nginx -t
```

---

## 🛡️ Seguridad Adicional

### 1. Configurar Fail2Ban

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 2. Configurar Headers de Seguridad

Agregar a la configuración de Nginx:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

---

## 🚨 Solución de Problemas

### Error 502 Bad Gateway
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Error de permisos
```bash
sudo chown -R www-data:www-data /var/www/aqm
sudo chmod -R 755 /var/www/aqm
```

### Aplicación no carga
1. Verificar que el build se completó correctamente
2. Revisar logs de Nginx
3. Verificar configuración de rutas

---

## 📞 Soporte

En caso de problemas:
1. Revisar logs: `/var/log/nginx/error.log`
2. Verificar configuración: `sudo nginx -t`
3. Reiniciar servicios: `sudo systemctl restart nginx`

---

**¡Tu aplicación AQM estará disponible en http://187.33.159.68 (o tu dominio)!** 🌈✨
