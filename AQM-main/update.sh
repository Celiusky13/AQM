#!/bin/bash

# Script de actualización para AQM
# Uso: ./update.sh

set -e

APP_DIR="/var/www/aqm"

echo "🔄 Actualizando AQM..."

cd $APP_DIR

echo "📥 Descargando últimos cambios..."
git pull origin main

echo "📦 Instalando dependencias..."
npm install

echo "🏗️ Construyendo aplicación..."
npm run build

echo "🔧 Configurando permisos..."
sudo chown -R www-data:www-data $APP_DIR/dist
sudo chmod -R 755 $APP_DIR/dist

echo "🔄 Reiniciando Nginx..."
sudo systemctl reload nginx

echo "✅ Actualización completada!"
echo "🌐 Aplicación disponible en: http://187.33.159.68"
