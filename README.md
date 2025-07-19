# 📅 Gestionnaire de Planning Scolaire

Une application web moderne pour la gestion des emplois du temps scolaires avec des fonctionnalités avancées.

## 🚀 Comment lancer l'application

### Option 1 : Serveur HTTP local (Recommandé)

Pour éviter les restrictions CORS et bénéficier de toutes les fonctionnalités :

```bash
# Dans le dossier du projet
python3 -m http.server 8000
# Ou avec Python 2
python -m SimpleHTTPServer 8000
# Ou avec Node.js (si npx est installé)
npx serve .
```

Puis ouvrez votre navigateur sur `http://localhost:8000`

### Option 2 : Ouverture directe

Double-cliquez sur `main.html` ou ouvrez-le directement dans votre navigateur.

⚠️ **Note** : Certaines fonctionnalités (export/import) peuvent ne pas fonctionner avec cette méthode.

## ✨ Fonctionnalités

### 🎯 Gestion complète
- **Classes** : Gestion des effectifs et plannings
- **Enseignants** : Attribution des modules et horaires
- **Salles** : Capacités et disponibilités
- **Modules** : Organisation des matières

### 🔧 Fonctionnalités avancées
- **Recherche intelligente** : Trouvez rapidement vos données
- **Détection de conflits** : Évitez les chevauchements
- **Export/Import** : Sauvegardez et restaurez vos données
- **Rapports** : Statistiques et analyses
- **Thème sombre/clair** : Interface adaptable
- **Responsive** : Compatible mobile et tablette

### ⌨️ Raccourcis clavier
- `Ctrl+S` : Sauvegarde rapide
- `Ctrl+E` : Exporter les données
- `Ctrl+Shift+R` : Réinitialiser les données

## 🎨 Interface

### Navigation
- **Cartes de navigation** : Cliquez sur Classes, Enseignants, Salles ou Modules
- **Sélecteur** : Choisissez l'entité spécifique à afficher
- **Planning hebdomadaire** : Vue d'ensemble de la semaine

### Ajout de cours
1. Cliquez sur le `+` à côté du jour souhaité
2. Sélectionnez le module, l'enseignant et la salle
3. Définissez les heures de début et fin
4. Le système vérifie automatiquement les conflits

### Gestion des données
- **Bouton 📥** : Exporter toutes les données au format JSON
- **Bouton 📤** : Importer des données depuis un fichier
- **Bouton 🔄** : Réinitialiser aux données par défaut
- **Bouton 📊** : Générer un rapport de statistiques
- **Bouton ⚠️** : Détecter les conflits de planning

## 🗂️ Structure des données

Les données sont stockées localement dans le navigateur avec la structure suivante :

```javascript
// Classe
{
  id: number,
  nom: string,
  effectif: number,
  semaine: string,
  planning: [jour1[], jour2[], ...] // 6 jours
}

// Cours
{
  module: string,
  prof: string,
  salle: string,
  debut: number, // heure de début (8-17)
  duree: number  // durée en heures
}
```

## 🛠️ Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Styles modernes avec variables CSS
- **JavaScript ES6+** : Logique applicative modulaire
- **LocalStorage** : Persistance des données côté client
- **Architecture modulaire** : Séparation des responsabilités

## 📱 Compatibilité

- ✅ Chrome/Chromium 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 44+
- ✅ Mobile Safari
- ✅ Chrome Mobile

## 🔧 Architecture technique

### Modules principaux

1. **DataManager** (`data-manager.js`) : Gestion des données et persistance
2. **UIManager** (`ui-manager.js`) : Interface utilisateur et interactions
3. **AdvancedManager** (`advanced-manager.js`) : Fonctionnalités avancées
4. **sche.js** : Logique métier principale (legacy + nouvelles fonctions)

### Styles

- `style.css` : Styles de base
- `enhanced-styles.css` : Améliorations modernes et responsive

## 🚨 Dépannage

### Les données ne se sauvegardent pas
- Vérifiez que localStorage est activé dans votre navigateur
- Utilisez un serveur HTTP local au lieu d'ouvrir le fichier directement

### L'export/import ne fonctionne pas
- Lancez l'application via un serveur HTTP local
- Vérifiez les permissions de téléchargement de votre navigateur

### Interface ne s'affiche pas correctement
- Assurez-vous que JavaScript est activé
- Vérifiez la console du navigateur pour d'éventuelles erreurs

## 📝 Développement

Pour contribuer au projet :

1. Respectez l'architecture modulaire existante
2. Ajoutez des commentaires JSDoc pour les nouvelles fonctions
3. Testez sur plusieurs navigateurs
4. Maintenez la compatibilité avec les données existantes

## 📄 Licence

Ce projet est open source. Vous pouvez l'utiliser et le modifier librement.

---

**Développé avec ❤️ pour simplifier la gestion des emplois du temps scolaires**