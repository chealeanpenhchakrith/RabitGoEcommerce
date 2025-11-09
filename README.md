# 🛒 E-Commerce Website - ShopHub

Site e-commerce complet avec système d'authentification, gestion de panier et persistance des données.

## ✨ Fonctionnalités

### Core Features
- 🔐 **Authentification utilisateur** (inscription, connexion, sessions)
- 🛒 **Panier personnalisé** par utilisateur avec persistance en base de données
- 📦 **Système de commandes** complet avec historique détaillé
- 👤 **Page de profil** avec statistiques (commandes, montant total dépensé)
- 🔍 **Recherche et filtres** par catégorie
- 📱 **Design responsive** adapté à tous les écrans
- 🔒 **Sécurité** (mots de passe hashés, sessions HTTP-only)

### UI/UX Features
- ✨ **Modals avec effet de flou** (backdrop-blur) pour un design moderne
- 🗑️ **Confirmations de suppression** avant de retirer des articles du panier
- 📊 **Statistiques en temps réel** sur la page de profil
- 🎯 **Navigation améliorée** avec scroll automatique vers le haut
- 🎨 **Interface cohérente** avec boutons stylisés et palette de couleurs harmonieuse

## 🚀 Démarrage Rapide

### 1. Installation (première fois)
```bash
npm run setup-all
```

### 2. Lancement
```bash
npm run dev
```

**C'est tout !** Le backend et frontend démarrent automatiquement. 🎉

Accès :
- 🌐 Site : http://localhost:5173
- 🔧 API : http://localhost:3000

## � Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `npm run setup-all` | Installation + migration DB (première fois) |
| `npm run dev` | Lance backend + frontend (mode développement) |
| `npm start` | Lance backend + frontend (mode production) |
| `npm run migrate` | Migration base de données uniquement |

## 🛠️ Technologies

**Backend :** Express.js, SQLite, Bcrypt, Express-Session  
**Frontend :** Vue 3, Vite, Tailwind CSS, DaisyUI, Axios

## 🐛 Dépannage

### Erreur PowerShell
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
```
Ou utilisez **CMD** au lieu de PowerShell.

### Port déjà utilisé
```bash
netstat -ano | findstr :3000
taskkill /PID <numéro> /F
```

### Réinitialiser la base de données
```bash
cd back-end
del ecommerce.sqlite
cd ..
npm run migrate
```

## 📊 Structure du Projet

```
e-commerce-website/
├── back-end/              # API Express + SQLite
│   ├── api.js            # Routes (auth, cart, orders)
│   ├── db.js             # Configuration base de données
│   └── migrate.js        # Script de migration
├── front-end/            # Application Vue 3
│   └── src/
│       ├── App.vue       # Composant principal + routing
│       └── components/   # Composants Vue
│           ├── LoginModal.vue         # Modal de connexion/inscription
│           ├── Navbar.vue             # Barre de navigation
│           ├── ProductCard.vue        # Carte produit
│           ├── CategoryFilter.vue     # Filtres catégories
│           ├── ShoppingCart.vue       # Panier avec modals
│           ├── CheckoutModal.vue      # Modal de validation commande
│           ├── DeleteConfirmModal.vue # Modal de confirmation suppression
│           ├── Profile.vue            # Page profil utilisateur
│           ├── Orders.vue             # Historique des commandes
│           └── Footer.vue             # Pied de page
└── package.json          # Scripts npm globaux
```

## 🎯 Utilisation

### Première utilisation
1. Lancez : `npm run dev`
2. Ouvrez http://localhost:5173
3. Cliquez sur **"Login"** → **"Sign up"**
4. Créez un compte (exemple : john@example.com / password123)
5. Ajoutez des produits au panier
6. Cliquez sur **"Proceed to Checkout"** pour valider votre commande
7. Déconnectez-vous et reconnectez-vous : votre panier est toujours là ! ✨

### Fonctionnalités à explorer
- **Profile** : Consultez vos statistiques (Client ID, nombre de commandes, montant total dépensé)
- **Orders** : Accédez à l'historique de toutes vos commandes avec détails
- **Shopping Cart** : Modifiez les quantités ou supprimez des articles (avec confirmation)
- **Checkout** : Validez vos achats avec une modal de confirmation élégante
- **Navigation** : Le scroll revient automatiquement en haut lors des changements de page

## 🔒 Architecture Sécurité

- Mots de passe hashés avec bcrypt (10 rounds)
- Sessions HTTP-only (protection XSS)
- CORS configuré pour le frontend uniquement
- Routes API protégées par middleware d'authentification
- Clés étrangères avec CASCADE sur la base de données

## 🎓 Contexte

Projet académique - OO Systems Development, EFREI Paris (Semestre 7)

---

**Développé par Leanpenhchakrith CHEA ,Alexandre Kalaydjian et Yuhao HUANG**
