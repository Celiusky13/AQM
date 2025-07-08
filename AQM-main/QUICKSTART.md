# 🚀 Resumen Ejecutivo - Despliegue AQM

## 📋 Lista de Verificación Pre-Despliegue

### ✅ Archivos Creados
- [x] `DEPLOYMENT.md` - Guía completa de despliegue
- [x] `deploy.sh` - Script automático de despliegue  
- [x] `update.sh` - Script de actualización
- [x] `deployment/nginx.conf` - Configuración de Nginx
- [x] `.env.production.example` - Variables de entorno

### ✅ Preparación del Servidor
- [ ] Conectividad SSH a `187.33.159.68`
- [ ] Credenciales de Supabase configuradas
- [ ] API Key de Google Maps obtenida
- [ ] Dominio configurado (opcional)

---

## 🚀 Despliegue en 5 Pasos

### 1. Conectar al Servidor
```bash
ssh root@187.33.159.68
```

### 2. Subir el Proyecto
```bash
# Opción A: Usar Git (recomendado)
git clone https://github.com/tu-usuario/AQM-main.git /var/www/aqm

# Opción B: Usar SCP desde tu máquina local
scp -r ./AQM-main root@187.33.159.68:/var/www/aqm
```

### 3. Ejecutar Script de Despliegue
```bash
cd /var/www/aqm
chmod +x deploy.sh
./deploy.sh
```

### 4. Configurar Variables de Entorno
```bash
cp .env.production.example .env.production
nano .env.production
# Completar con tus credenciales reales
```

### 5. Verificar Funcionamiento
```bash
# Verificar estado de Nginx
sudo systemctl status nginx

# Ver logs en tiempo real
sudo tail -f /var/log/nginx/aqm_access.log
```

---

## 🌐 URLs de Acceso

### Acceso Inmediato
- **HTTP**: http://187.33.159.68
- **Estado**: http://187.33.159.68/health (después de implementar)

### Con Dominio (Paso Adicional)
```bash
# Configurar SSL gratuito
sudo certbot --nginx -d tu-dominio.com
```
- **HTTPS**: https://tu-dominio.com

---

## 🔧 Comandos de Mantenimiento

### Actualizar la Aplicación
```bash
cd /var/www/aqm
./update.sh
```

### Ver Logs
```bash
# Logs de acceso
sudo tail -f /var/log/nginx/aqm_access.log

# Logs de errores
sudo tail -f /var/log/nginx/aqm_error.log

# Estado de Nginx
sudo systemctl status nginx
```

### Reiniciar Servicios
```bash
sudo systemctl restart nginx
```

---

## 🛡️ Verificación de Seguridad

### Firewall
```bash
sudo ufw status
```

### SSL (Si se configuró dominio)
```bash
sudo certbot certificates
```

### Headers de Seguridad
```bash
curl -I http://187.33.159.68
```

---

## 📞 Soporte Rápido

### Problemas Comunes

**502 Bad Gateway**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

**Permisos**
```bash
sudo chown -R www-data:www-data /var/www/aqm/dist
sudo chmod -R 755 /var/www/aqm/dist
```

**Variables de Entorno**
```bash
# Verificar que el archivo existe y tiene contenido
cat /var/www/aqm/.env.production
```

---

## 🎉 ¡Listo!

Tu aplicación **AQM (Amigas Queer Madriz)** estará disponible en:
- **🌐 URL**: http://187.33.159.68
- **📱 Responsive**: Funciona en móviles y tablets
- **🔒 Seguro**: Headers de seguridad configurados
- **⚡ Rápido**: Compresión gzip y cache habilitados

**¡La comunidad LGBTQIA+ de Madrid ya puede conectar! 🌈✨**
