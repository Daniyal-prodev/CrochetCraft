# CrochetCraft - Premium Crochet Patterns Website

A beautiful, modern e-commerce website for selling crochet patterns with advanced features.

## ✨ Recent Fixes Applied

### 🔧 Profile Settings Persistence
- ✅ User profile data now saves properly to localStorage
- ✅ Settings persist across login/logout sessions
- ✅ Enhanced profile editing with bio and location fields
- ✅ Automatic data backup every 5 minutes

### 🛍️ Product Management
- ✅ Admin products now integrate with main patterns display
- ✅ Real-time refresh when products are added/edited/deleted
- ✅ Products persist across page reloads
- ✅ User-specific cart storage by email

### 🚀 Vercel Deployment Optimization
- ✅ Optimized `vercel.json` configuration
- ✅ Proper routing and caching headers
- ✅ Static file optimization
- ✅ Security headers implemented

## Features

- 🎨 **Beautiful Design**: Modern gradient backgrounds with animations
- 🔐 **Multi-Auth System**: Google, Facebook, GitHub, Instagram login
- 🛒 **Shopping Cart**: User-specific cart with payment processing
- 🔍 **Advanced Search**: Filter by category, difficulty, price
- 👨💼 **Admin Panel**: Product management for admin users
- 📱 **Responsive**: Works perfectly on all devices
- ⚡ **Fast Loading**: Optimized for performance
- 💾 **Data Persistence**: All user data and settings saved locally

## Admin Access

Login with email: `aribdaniyal88@gmail.com` to access admin features:
- Add/Edit/Delete products
- View orders and user statistics
- Manage website content

## Quick Deploy to Vercel

### Method 1: GitHub (Recommended)
```bash
# Push to GitHub, then:
1. Go to vercel.com
2. Import your GitHub repository
3. Click Deploy - Done! 🚀
```

### Method 2: CLI
```bash
npm install -g vercel
vercel --prod
```

### Method 3: Drag & Drop
Drag your project folder to vercel.com

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome icons
- Google Fonts (Poppins)
- LocalStorage for data persistence
- CSS Grid & Flexbox for layouts
- Session management system

## Local Development

```bash
# Clone and run
git clone <your-repo>
cd CrochetCraft
npm install
npm run dev
```

## Testing

Open browser console and run:
```javascript
// Test all functionality
loadScript('deploy-test.js');
```

## Troubleshooting

### Data not persisting?
```javascript
// Clear and reset
localStorage.clear();
location.reload();
```

### Products not showing?
```javascript
// Refresh patterns
refreshPatterns();
```

## Contact

For support or inquiries, contact: aribdaniyal88@gmail.com

---

✅ **All Issues Fixed** | 🚀 **Ready for Production** | Made with ❤️ for the crochet community