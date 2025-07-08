# 🧡💖 **Amigas Queer Madriz** 🌈✨

<div align="center">

![Banner](https://via.placeholder.com/800x200/FF6E07/FFFFFF?text=AMIGAS+QUEER+MADRIZ)

**La comunidad donde *todes* somos familia. Conecta y celebra tu autenticidad en Madrid.**

[![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 🌈 **Sobre AQM**

**AQM (Amigas Queer Madriz)** es una plataforma digital inclusiva diseñada específicamente para la comunidad LGBTQIA+ de Madrid. Nuestra misión es crear un espacio seguro donde las personas queer puedan conectar, organizar eventos y celebrar su autenticidad.

### 🎨 **Identidad Visual**
- **Paleta de colores**: Inspirada en la bandera lésbica 🧡💖
- **Tipografía**: Fuentes elegantes y diversas que reflejan la diversidad de nuestra comunidad
- **Diseño**: Minimalista, moderno y accesible

---

## ✨ **Características Principales**

### 🗓️ **Gestión de Eventos**
- **Crear eventos**: Organiza picnics, charlas, fiestas y más
- **Vista de mapa**: Visualiza eventos en tiempo real en Madrid
- **Categorías**: 🍻 Bares, 🧺 Picnics, 💬 Charlas, 🪩 Discotecas, ✨ Otros
- **Geolocalización**: Selecciona ubicaciones directamente en el mapa

### 💬 **Chat en Tiempo Real**
- **Comunicación instantánea**: Conecta con la comunidad
- **Moderación**: Ambiente seguro y respetuoso
- **Notificaciones**: Mantente al día con las conversaciones

### 🗺️ **Explorar Madrid**
- **Mapa interactivo**: Descubre eventos cerca de ti
- **Filtros por categoría**: Encuentra exactamente lo que buscas
- **Información detallada**: Fechas, ubicaciones y descripciones completas

### 👥 **Comunidad**
- **Perfiles personalizados**: Crea tu identidad digital
- **Autenticación segura**: Sistema robusto con Supabase
- **Privacidad**: Control total sobre tu información

---

## 🛠️ **Stack Tecnológico**

### **Frontend**
```
🔧 React 18 con TypeScript
🎨 Tailwind CSS para estilos
📱 Diseño responsive (mobile-first)
🔄 React Router para navegación
🪝 Hooks personalizados
```

### **Backend & Base de Datos**
```
🚀 Supabase (PostgreSQL)
🔐 Autenticación integrada
📡 Real-time subscriptions
🗄️ Storage para imágenes
```

### **Herramientas de Desarrollo**
```
⚡ Vite para desarrollo ultrarrápido
📦 ESLint para calidad de código
🎯 TypeScript para type safety
🔧 PostCSS para procesamiento CSS
```

### **Mapas & Geolocalización**
```
🗺️ Integración con Google Maps
📍 Geocoding automático
🎯 Selección interactiva de ubicaciones
```

---

## 🚀 **Instalación & Desarrollo**

### **Prerrequisitos**
```bash
Node.js >= 18.0.0
npm o yarn
Cuenta de Supabase
API Key de Google Maps
```

### **Configuración**
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/aqm.git
cd aqm

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

### **Variables de Entorno**
```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_key
VITE_GOOGLE_MAPS_API_KEY=tu_google_maps_key
```

### **Desarrollo**
```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview
```

---

## 🌐 **Despliegue en Producción**

### **Servidor Ubuntu (IP: 187.33.159.68)**

Para desplegar esta aplicación en tu servidor Ubuntu, sigue la guía completa de despliegue:

📖 **[Ver Guía Completa de Despliegue](./DEPLOYMENT.md)**

### **Resumen rápido de despliegue:**

```bash
# 1. Conectar al servidor
ssh root@187.33.159.68

# 2. Instalar dependencias del sistema
sudo apt update && sudo apt upgrade -y
sudo apt install nginx git nodejs npm -y

# 3. Clonar y configurar la aplicación
git clone https://github.com/tu-usuario/AQM-main.git /var/www/aqm
cd /var/www/aqm
npm install
npm run build

# 4. Configurar Nginx y desplegar
sudo cp deployment/nginx.conf /etc/nginx/sites-available/aqm
sudo ln -s /etc/nginx/sites-available/aqm /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### **URLs de acceso:**
- **Producción**: http://187.33.159.68
- **Con dominio**: http://tu-dominio.com (después de configurar DNS)
- **SSL**: https://tu-dominio.com (después de configurar certificado)

---

## 🏗️ **Estructura del Proyecto**

```
src/
├── 📁 components/          # Componentes reutilizables
│   ├── ui/                # Componentes de UI base
│   ├── Header.tsx         # Navegación principal
│   ├── Footer.tsx         # Pie de página
│   ├── Logo.tsx           # Componente del logo
│   └── EventForm.tsx      # Formulario de eventos
├── 📁 pages/              # Páginas principales
│   ├── Index.tsx          # Página de inicio
│   ├── Events.tsx         # Lista de eventos
│   ├── Map.tsx            # Mapa de Madrid
│   ├── Community.tsx      # Sección comunidad
│   └── Auth.tsx           # Autenticación
├── 📁 contexts/           # Contextos de React
│   └── AuthContext.tsx    # Manejo de autenticación
├── 📁 hooks/              # Hooks personalizados
├── 📁 integrations/       # Integraciones externas
│   └── supabase/          # Configuración Supabase
└── 📁 lib/                # Utilidades y helpers
```

---

## 🎨 **Guía de Estilo**

### **Paleta de Colores - Bandera Lésbica**
```css
🧡 Naranja Oscuro:  #D52D00
🟠 Naranja:         #FF9A56  
⚪ Blanco:          #FFFFFF
🌸 Rosa Claro:      #FFABC7
💖 Rosa Oscuro:     #A40062
```

### **Tipografías**
```css
📖 Texto principal:    "Poppins" (elegante y legible)
🎭 Título artístico:   Fuentes variables por letra
📱 UI Components:      "Inter" (sistema)
```

### **Componentes**
- **Botones**: Gradientes con efectos hover
- **Cards**: Sombras suaves y bordes redondeados
- **Formularios**: Diseño limpio y accesible
- **Navegación**: Responsive con menú móvil

---

## 📱 **Características Responsive**

### **Mobile First**
- 📱 Optimizado para móviles
- 🖥️ Escalable a desktop
- 👆 Gestos táctiles intuitivos
- ⚡ Carga rápida en 3G/4G

### **Accesibilidad**
- ♿ WCAG 2.1 compliant
- ⌨️ Navegación por teclado
- 🔊 Screen reader friendly
- 🎯 Objetivos táctiles de 44px+

---

## 🗄️ **Base de Datos**

### **Esquema Principal**
```sql
-- Eventos
events {
  id: uuid
  title: text
  description: text
  date: timestamp
  location: text
  latitude: float
  longitude: float
  category: text
  max_attendees: integer
  user_id: uuid (foreign key)
}

-- Perfiles de usuario
profiles {
  id: uuid
  email: text
  display_name: text
  created_at: timestamp
}
```

---

## 🌟 **Contribuir**

¡Tu contribución es bienvenida! 

### **Proceso**
1. 🍴 Fork el proyecto
2. 🌿 Crea tu rama feature (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. 📤 Push a la rama (`git push origin feature/AmazingFeature`)
5. 🔀 Abre un Pull Request

### **Código de Conducta**
- 🌈 **Inclusividad**: Respetamos todas las identidades
- 💙 **Empatía**: Tratamos a todes con amabilidad
- 🤝 **Colaboración**: Construimos juntes
- 🔒 **Seguridad**: Priorizamos un ambiente seguro

---

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

## 💖 **Agradecimientos**

- 🌈 **Comunidad LGBTQIA+ de Madrid**: Por inspirar este proyecto
- 🎨 **Diseñadores queer**: Por las referencias visuales
- 💻 **Desarrolladores open source**: Por las herramientas increíbles
- 🏳️‍🌈 **Activistas**: Por crear espacios seguros

---

<div align="center">

**Hecho con 💖 por y para la comunidad queer de Madrid**

[🌐 Website](https://aqm-madrid.vercel.app) • [📧 Contacto](mailto:hola@aqm-madrid.com) • [🐦 Twitter](https://twitter.com/aqm_madrid)

*"La diversidad nos hace más fuertes, la inclusión nos hace invencibles"* ✨

</div>
