# Passman Planificator

Une Progressive Web App (PWA) pour la gestion des interventions et la planification des sous-traitants pour l'entreprise Passman.

## Description

Passman Planificator est une application web progressive qui permet à l'entreprise Passman de :
- Visualiser les interventions à planifier sur une carte interactive
- Afficher les sous-traitants disponibles en France
- Trouver les sous-traitants les plus proches d'un site d'intervention
- Gérer la base de données des sous-traitants
- Géolocaliser les adresses et convertir automatiquement en coordonnées GPS

## Technologies utilisées

- Vue.js 3 avec TypeScript
- Pinia pour la gestion d'état
- Vue Router pour la navigation
- Leaflet pour la cartographie interactive avec OpenStreetMap
- Vuetify 3 pour l'interface utilisateur (Material Design)
- Geolib pour les calculs de distance géographique
- Vite avec plugin PWA pour le support hors ligne et l'installation
- API Nominatim pour le géocodage des adresses

## Fonctionnalités principales

1. **Carte interactive** : Affichage des sous-traitants et des interventions en France
   - Contrôles de zoom personnalisés
   - Marqueurs interactifs avec info-bulles au survol
   - Clearing automatique des sélections précédentes
   - Marquage visuel distinct pour les interventions et sous-traitants
   - Affichage des contacts séparés (téléphone et email) dans les popups
2. **Interface moderne** : Design épuré avec la couleur principale #162272
   - Animations et transitions fluides
   - Cartes avec effets d'élévation et de survol
   - Navigation intuitive et cohérente
   - Feedback visuel pour toutes les interactions
3. **Liste des interventions** : Affichage des interventions à planifier
4. **Recherche de proximité** : Calcul des 5 sous-traitants les plus proches d'une intervention
5. **Gestion des sous-traitants** : 
   - Ajout de nouveaux sous-traitants via adresse postale
   - Champs séparés pour téléphone et email
   - Édition et suppression des sous-traitants existants
   - Affichage des coordonnées GPS pour référence
   - Conversion automatique des adresses en coordonnées géographiques
6. **Saisie d'adresses intelligente** :
   - Suggestions d'adresses après 1.5 secondes d'inactivité
   - Conversion automatique en coordonnées GPS
   - Interface utilisateur intuitive avec retour visuel
7. **Support PWA** : Fonctionnalité hors ligne et installation sur les appareils

## Installation

```bash
# Cloner le dépôt
git clone <url-du-depot>

# Accéder au répertoire du projet
cd passman-planificator

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## Build de production

```bash
# Compiler et minifier pour la production
npm run build

# Prévisualiser la version de production
npm run preview
```

## Structure du projet

```
passman-planificator/
├── public/               # Ressources statiques
├── src/
│   ├── assets/           # Images, styles, etc.
│   ├── components/       # Composants Vue
│   │   ├── Home.vue      # Page principale avec carte et liste
│   │   ├── Map.vue       # Composant cartographique avec Leaflet
│   │   ├── InterventionList.vue  # Liste des interventions
│   │   ├── NearestSubcontractors.vue  # Liste des sous-traitants proches
│   │   ├── Settings.vue  # Page de paramètres et gestion des sous-traitants
│   │   └── AddressAutocomplete.vue # Composant de recherche d'adresses
│   ├── services/         # Services
│   │   └── geocoding.ts  # Service de géocodage d'adresses
│   ├── stores/           # Stores Pinia
│   │   ├── interventions.ts  # Gestion des interventions
│   │   └── subcontractors.ts # Gestion des sous-traitants
│   ├── App.vue           # Composant racine
│   ├── main.ts           # Point d'entrée de l'application
│   └── style.css         # Styles globaux
├── vite.config.ts        # Configuration Vite et PWA
└── package.json          # Dépendances et scripts
```

## Fonctionnement technique

L'application utilise une architecture basée sur des composants Vue.js 3 avec la Composition API et TypeScript pour un développement typé. La gestion d'état est assurée par Pinia, qui permet de stocker et de manipuler :

- La liste des interventions à planifier
- Les données des sous-traitants (nom, type, téléphone, email, adresse, coordonnées)
- L'intervention sélectionnée
- Les calculs de proximité entre interventions et sous-traitants

La cartographie est gérée par Leaflet via une implémentation personnalisée qui permet d'afficher :
- Des marqueurs bleus pour les sous-traitants avec info-bulles au survol
- Popups détaillées avec contacts séparés (téléphone et email)
- Un marqueur rouge proéminent pour l'intervention sélectionnée
- Des contrôles de zoom personnalisés pour une meilleure expérience utilisateur

L'application est conçue avec une mise en page responsive qui s'adapte aux différentes tailles d'écran :
- Sur desktop : disposition 70/30 avec carte à gauche et liste à droite
- Sur mobile : disposition empilée avec carte en haut et liste en bas

Le géocodage d'adresses utilise l'API Nominatim (OpenStreetMap) pour :
- Convertir des adresses postales en coordonnées géographiques
- Fournir des suggestions d'adresses pendant la saisie
- Assurer une validation et un feedback utilisateur en temps réel

Le support PWA permet l'utilisation hors ligne grâce au cache des tuiles OpenStreetMap et des données statiques.

## Utilisation

1. Consultez la liste des interventions dans le panneau latéral droit
2. Cliquez sur une intervention pour l'afficher sur la carte
3. Les 5 sous-traitants les plus proches s'affichent automatiquement
4. Survolez un marqueur de sous-traitant pour voir ses informations détaillées
5. Accédez aux paramètres en cliquant sur "Paramètres" dans la barre supérieure
6. Ajoutez ou modifiez des sous-traitants en utilisant l'adresse postale (conversion automatique en coordonnées)
7. Supprimez des sous-traitants que vous ne souhaitez plus suivre

## Améliorations récentes

- **Interface utilisateur moderne**
  - Nouvelle couleur principale #162272 pour une identité visuelle professionnelle
  - Redesign complet avec des cartes et des composants modernes
  - Animations et transitions améliorées pour une meilleure expérience
  - Modales et dialogs entièrement repensés avec une apparence cohérente

- **Carte interactive améliorée**
  - Popups améliorées avec séparation téléphone/email
  - Icônes dédiées pour chaque type de contact
  - Affichage d'info-bulles au survol des marqueurs de sous-traitants
  - Fermeture automatique des pop-ups précédents lors de nouvelles sélections

- **Gestion avancée des sous-traitants**
  - Séparation des champs téléphone et email pour une meilleure organisation
  - Interface de gestion complètement redesignée
  - Listes et tableaux améliorés avec indicateurs visuels
  - Modales d'information et de confirmation modernisées

- **Géocodage d'adresses**
  - Suggestions d'adresses apparaissant après 1.5 secondes d'inactivité
  - Meilleure intégration visuelle du composant d'autocomplétion
  - Détection intelligente du type de contact (email vs téléphone)

- **Expérience utilisateur**
  - Navigation simplifiée avec labels et icônes explicites
  - Feedback visuel pour toutes les actions (chargement, succès, erreur)
  - Adaptations responsives améliorées pour tous les appareils

## Licence

Propriétaire - Passman © 2023
