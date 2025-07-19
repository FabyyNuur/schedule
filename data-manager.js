/**
 * Gestionnaire de données pour l'application de planning
 * Améliore la gestion et la persistance des données
 */

class DataManager {
  constructor() {
    this.storageKeys = {
      classes: "classes",
      modules: "Modules",
      enseignants: "enseignants",
      salles: "Salles",
      currentClass: "Classe",
      currentEnseignant: "Enseignant",
      currentModule: "Module",
      currentSalle: "Salle",
    };
    this.initializeData();
  }

  /**
   * Initialise les données par défaut si elles n'existent pas
   */
  initializeData() {
    // Classes par défaut
    if (!this.getData("classes")) {
      const defaultClasses = [
        {
          id: 1,
          nom: "L2 GLRS A",
          effectif: 29,
          semaine: "",
          planning: [[], [], [], [], [], []],
        },
        {
          id: 2,
          nom: "L2 GLRS B",
          effectif: 25,
          semaine: "",
          planning: [[], [], [], [], [], []],
        },
        {
          id: 3,
          nom: "L2 ETSE",
          effectif: 29,
          semaine: "",
          planning: [[], [], [], [], [], []],
        },
        {
          id: 4,
          nom: "L1 A",
          effectif: 40,
          semaine: "",
          planning: [[], [], [], [], [], []],
        },
        {
          id: 5,
          nom: "IAGE B",
          effectif: 21,
          semaine: "",
          planning: [[], [], [], [], [], []],
        },
        {
          id: 6,
          nom: "L2 CDSD",
          effectif: 4,
          semaine: "",
          planning: [[], [], [], [], [], []],
        },
      ];
      this.saveData("classes", defaultClasses);
    }

    // Modules par défaut
    if (!this.getData("modules")) {
      const defaultModules = [
        { id: 1, nom: "ALGO", semaine: "", planning: [[], [], [], [], [], []] },
        { id: 2, nom: "PHP", semaine: "", planning: [[], [], [], [], [], []] },
        {
          id: 3,
          nom: "PYTHON",
          semaine: "",
          planning: [[], [], [], [], [], []],
        },
        { id: 4, nom: "LC", semaine: "", planning: [[], [], [], [], [], []] },
        {
          id: 5,
          nom: "JAVASCRIPT",
          semaine: "",
          planning: [[], [], [], [], [], []],
        },
        { id: 6, nom: "JAVA", semaine: "", planning: [[], [], [], [], [], []] },
      ];
      this.saveData("modules", defaultModules);
    }

    // Enseignants par défaut
    if (!this.getData("enseignants")) {
      const defaultEnseignants = [
        {
          id: 1,
          nom: "Aly",
          semaine: "",
          planning: [[], [], [], [], [], []],
          modules: [1, 3, 4, 5],
        },
        {
          id: 2,
          nom: "Baila",
          semaine: "",
          planning: [[], [], [], [], [], []],
          modules: [1, 2, 5, 6],
        },
        {
          id: 3,
          nom: "Ndoye",
          semaine: "",
          planning: [[], [], [], [], [], []],
          modules: [1],
        },
        {
          id: 4,
          nom: "Mbaye",
          semaine: "",
          planning: [[], [], [], [], [], []],
          modules: [3, 5, 4],
        },
        {
          id: 5,
          nom: "Djiby",
          semaine: "",
          planning: [[], [], [], [], [], []],
          modules: [1, 2, 6],
        },
        {
          id: 6,
          nom: "Seckouba",
          semaine: "",
          planning: [[], [], [], [], [], []],
          modules: [5, 6],
        },
      ];
      this.saveData("enseignants", defaultEnseignants);
    }

    // Salles par défaut
    if (!this.getData("salles")) {
      const defaultSalles = [
        {
          id: 1,
          nom: "101",
          semaine: "",
          planning: [[], [], [], [], [], []],
          nbrPlaces: 10,
        },
        {
          id: 2,
          nom: "102",
          semaine: "",
          planning: [[], [], [], [], [], []],
          nbrPlaces: 20,
        },
        {
          id: 3,
          nom: "103",
          semaine: "",
          planning: [[], [], [], [], [], []],
          nbrPlaces: 30,
        },
        {
          id: 4,
          nom: "104",
          semaine: "",
          planning: [[], [], [], [], [], []],
          nbrPlaces: 10,
        },
        {
          id: 5,
          nom: "201",
          semaine: "",
          planning: [[], [], [], [], [], []],
          nbrPlaces: 50,
        },
        {
          id: 6,
          nom: "incub",
          semaine: "",
          planning: [[], [], [], [], [], []],
          nbrPlaces: 15,
        },
      ];
      this.saveData("salles", defaultSalles);
    }

    // Classe courante par défaut
    if (!this.getData("currentClass")) {
      const defaultCurrentClass = {
        id: 12,
        nom: "L2 CDSD",
        effectif: 43,
        semaine: this.getCurrentWeek(),
        planning: [
          [
            { module: "PYTHON", prof: "Aly", duree: 3, debut: 9, salle: "201" },
            { module: "PHP", prof: "Baila", duree: 4, debut: 13, salle: "102" },
          ],
          [],
          [
            {
              module: "JAVASCRIPT",
              prof: "Aly",
              duree: 2,
              debut: 15,
              salle: "102",
            },
          ],
          [{ module: "LC", prof: "Mbaye", duree: 2, debut: 8, salle: "incub" }],
          [],
          [],
        ],
      };
      this.saveData("currentClass", defaultCurrentClass);
    }
  }

  /**
   * Récupère des données du localStorage
   */
  getData(key) {
    try {
      const data = localStorage.getItem(this.storageKeys[key] || key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des données ${key}:`,
        error
      );
      return null;
    }
  }

  /**
   * Sauvegarde des données dans le localStorage
   */
  saveData(key, data) {
    try {
      localStorage.setItem(this.storageKeys[key] || key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde des données ${key}:`, error);
      return false;
    }
  }

  /**
   * Ajoute un nouvel élément à une collection
   */
  addItem(collection, item) {
    const data = this.getData(collection) || [];
    const newId = Math.max(...data.map((d) => d.id), 0) + 1;
    item.id = newId;

    // Initialiser le planning si nécessaire
    if (!item.planning) {
      item.planning = [[], [], [], [], [], []];
    }

    data.push(item);
    this.saveData(collection, data);
    return item;
  }

  /**
   * Met à jour un élément dans une collection
   */
  updateItem(collection, itemId, updatedItem) {
    const data = this.getData(collection) || [];
    const index = data.findIndex((item) => item.id === itemId);

    if (index !== -1) {
      data[index] = { ...data[index], ...updatedItem };
      this.saveData(collection, data);
      return data[index];
    }
    return null;
  }

  /**
   * Supprime un élément d'une collection
   */
  deleteItem(collection, itemId) {
    const data = this.getData(collection) || [];
    const filteredData = data.filter((item) => item.id !== itemId);
    this.saveData(collection, filteredData);
    return filteredData;
  }

  /**
   * Valide les données d'un cours avant ajout
   */
  validateCours(cours) {
    const errors = [];

    if (!cours.module) errors.push("Module requis");
    if (!cours.prof) errors.push("Professeur requis");
    if (!cours.salle) errors.push("Salle requise");
    if (!cours.debut || cours.debut < 8 || cours.debut > 17) {
      errors.push("Heure de début invalide (8h-17h)");
    }
    if (!cours.duree || cours.duree < 1 || cours.duree > 8) {
      errors.push("Durée invalide (1-8h)");
    }

    return errors;
  }

  /**
   * Vérifie les conflits de planning
   */
  checkConflicts(cours, jour, classeId) {
    const conflicts = [];
    const classe = this.getData("currentClass");

    if (!classe || !classe.planning[jour]) return conflicts;

    const debut = cours.debut;
    const fin = cours.debut + cours.duree;

    // Vérifier les conflits dans la classe
    classe.planning[jour].forEach((existingCours) => {
      const existingDebut = existingCours.debut;
      const existingFin = existingCours.debut + existingCours.duree;

      if (debut < existingFin && fin > existingDebut) {
        conflicts.push(
          `Conflit avec ${existingCours.module} de ${existingDebut}h à ${existingFin}h`
        );
      }
    });

    return conflicts;
  }

  /**
   * Obtient la semaine courante formatée
   */
  getCurrentWeek() {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 5));

    const formatDate = (date) => {
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  }

  /**
   * Exporte toutes les données
   */
  exportData() {
    const data = {};
    Object.keys(this.storageKeys).forEach((key) => {
      data[key] = this.getData(key);
    });
    return data;
  }

  /**
   * Importe des données
   */
  importData(data) {
    try {
      Object.keys(data).forEach((key) => {
        if (this.storageKeys[key]) {
          this.saveData(key, data[key]);
        }
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de l'importation:", error);
      return false;
    }
  }

  /**
   * Réinitialise toutes les données
   */
  resetData() {
    Object.values(this.storageKeys).forEach((key) => {
      localStorage.removeItem(key);
    });
    this.initializeData();
  }

  /**
   * Recherche dans les données
   */
  search(query, collections = ["classes", "enseignants", "modules", "salles"]) {
    const results = {};

    collections.forEach((collection) => {
      const data = this.getData(collection) || [];
      results[collection] = data.filter((item) =>
        item.nom.toLowerCase().includes(query.toLowerCase())
      );
    });

    return results;
  }
}

// Instance globale du gestionnaire de données
window.dataManager = new DataManager();
