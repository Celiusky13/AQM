#!/bin/bash

# Script de despliegue automático para AQM
# Uso: ./deploy.sh

set -e

echo "🚀 Iniciando despliegue de AQM..."

# Variables
SERVER_IP="187.33.159.68"
APP_DIR="/var/www/aqm"
NGINX_CONF="/etc/nginx/sites-available/aqm"

# Función para mostrar mensajes
log() {
    echo "📝 $1"
}

error() {
    echo "❌ Error: $1"
    exit 1
}

success() {
    echo "✅ $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    error "No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
fi

log "Actualizando sistema..."
sudo apt update && sudo apt upgrade -y

log "Instalando dependencias del sistema..."
sudo apt install -y nginx nodejs npm git certbot python3-certbot-nginx ufw

log "Verificando versiones..."
node --version || error "Node.js no está instalado correctamente"
npm --version || error "npm no está instalado correctamente"

log "Creando directorio de la aplicación..."
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

log "Copiando archivos..."
rsync -av --delete . $APP_DIR/ --exclude node_modules --exclude .git --exclude dist

log "Instalando dependencias de Node.js..."
cd $APP_DIR
npm install

log "Construyendo la aplicación..."
npm run build

log "Configurando Nginx..."
sudo cp deployment/nginx.conf $NGINX_CONF
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/aqm

# Eliminar configuración por defecto si existe
sudo rm -f /etc/nginx/sites-enabled/default

log "Verificando configuración de Nginx..."
sudo nginx -t || error "Error en la configuración de Nginx"

log "Configurando firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
echo "y" | sudo ufw enable

log "Reiniciando servicios..."
sudo systemctl restart nginx
sudo systemctl enable nginx

log "Configurando permisos..."
sudo chown -R www-data:www-data $APP_DIR/dist
sudo chmod -R 755 $APP_DIR/dist

success "🎉 Despliegue completado!"
echo ""
echo "🌐 Tu aplicación está disponible en:"
echo "   http://$SERVER_IP"
echo ""
echo "📋 Próximos pasos opcionales:"
echo "   1. Configurar un dominio apuntando a $SERVER_IP"
echo "   2. Ejecutar: sudo certbot --nginx -d tu-dominio.com"
echo "   3. Configurar las variables de entorno en .env.production"
echo ""
echo "📊 Para ver logs:"
echo "   sudo tail -f /var/log/nginx/aqm_access.log"
echo "   sudo tail -f /var/log/nginx/aqm_error.log"
