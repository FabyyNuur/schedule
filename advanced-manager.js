/**
 * Gestionnaire de fonctionnalités avancées
 * Export/Import, statistiques, rapports
 */

class AdvancedFeaturesManager {
  constructor() {
    this.setupEventListeners();
  }

  /**
   * Configure les écouteurs d'événements
   */
  setupEventListeners() {
    // Boutons d'action
    document
      .getElementById("exportData")
      ?.addEventListener("click", () => this.exportData());
    document
      .getElementById("importData")
      ?.addEventListener("click", () => this.importData());
    document
      .getElementById("resetData")
      ?.addEventListener("click", () => this.resetData());

    // Raccourcis clavier
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            this.quickSave();
            break;
          case "e":
            e.preventDefault();
            this.exportData();
            break;
          case "r":
            e.preventDefault();
            if (e.shiftKey) this.resetData();
            break;
        }
      }
    });
  }

  /**
   * Exporte toutes les données au format JSON
   */
  exportData() {
    try {
      const data = dataManager.exportData();
      const jsonStr = JSON.stringify(data, null, 2);

      // Créer un blob et télécharger
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `planning-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.showNotification("Données exportées avec succès", "success");
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      this.showNotification("Erreur lors de l'export", "error");
    }
  }

  /**
   * Importe des données depuis un fichier JSON
   */
  importData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);

          if (this.validateImportData(data)) {
            if (
              confirm(
                "Êtes-vous sûr de vouloir importer ces données ? Cela remplacera toutes les données actuelles."
              )
            ) {
              const success = dataManager.importData(data);
              if (success) {
                this.showNotification(
                  "Données importées avec succès",
                  "success"
                );
                // Recharger l'interface
                setTimeout(() => window.location.reload(), 1000);
              } else {
                this.showNotification("Erreur lors de l'import", "error");
              }
            }
          } else {
            this.showNotification("Format de fichier invalide", "error");
          }
        } catch (error) {
          console.error("Erreur lors de l'import:", error);
          this.showNotification("Fichier JSON invalide", "error");
        }
      };
      reader.readAsText(file);
    };

    input.click();
  }

  /**
   * Valide les données d'import
   */
  validateImportData(data) {
    const requiredKeys = ["classes", "modules", "enseignants", "salles"];
    return requiredKeys.every((key) => Array.isArray(data[key]));
  }

  /**
   * Réinitialise toutes les données
   */
  resetData() {
    if (
      confirm(
        "Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible."
      )
    ) {
      dataManager.resetData();
      this.showNotification("Données réinitialisées", "success");
      setTimeout(() => window.location.reload(), 1000);
    }
  }

  /**
   * Sauvegarde rapide
   */
  quickSave() {
    // Sauvegarder dans le localStorage avec horodatage
    const backup = {
      timestamp: new Date().toISOString(),
      data: dataManager.exportData(),
    };

    localStorage.setItem("planning-quicksave", JSON.stringify(backup));
    this.showNotification("Sauvegarde rapide effectuée", "success");
  }

  /**
   * Génère un rapport de statistiques
   */
  generateReport() {
    const classes = dataManager.getData("classes") || [];
    const enseignants = dataManager.getData("enseignants") || [];
    const salles = dataManager.getData("salles") || [];
    const modules = dataManager.getData("modules") || [];

    // Calculer les statistiques
    const stats = {
      totalClasses: classes.length,
      totalEnseignants: enseignants.length,
      totalSalles: salles.length,
      totalModules: modules.length,
      totalEtudiants: classes.reduce(
        (sum, classe) => sum + (classe.effectif || 0),
        0
      ),
      totalPlacesDisponibles: salles.reduce(
        (sum, salle) => sum + (salle.nbrPlaces || 0),
        0
      ),
      utilisationSalles: this.calculateRoomUsage(),
      chargeEnseignants: this.calculateTeacherLoad(),
      planningCompletude: this.calculatePlanningCompleteness(),
    };

    this.displayReport(stats);
    return stats;
  }

  /**
   * Calcule l'utilisation des salles
   */
  calculateRoomUsage() {
    const classe = dataManager.getData("currentClass");
    if (!classe || !classe.planning) return {};

    const usage = {};
    classe.planning.forEach((jour, jourIndex) => {
      jour.forEach((cours) => {
        if (!usage[cours.salle]) usage[cours.salle] = 0;
        usage[cours.salle] += cours.duree || 1;
      });
    });

    return usage;
  }

  /**
   * Calcule la charge des enseignants
   */
  calculateTeacherLoad() {
    const classe = dataManager.getData("currentClass");
    if (!classe || !classe.planning) return {};

    const load = {};
    classe.planning.forEach((jour, jourIndex) => {
      jour.forEach((cours) => {
        if (!load[cours.prof]) load[cours.prof] = 0;
        load[cours.prof] += cours.duree || 1;
      });
    });

    return load;
  }

  /**
   * Calcule le taux de complétude du planning
   */
  calculatePlanningCompleteness() {
    const classe = dataManager.getData("currentClass");
    if (!classe || !classe.planning) return 0;

    const totalSlots = classe.planning.length * 10; // 6 jours * 10 heures max
    const usedSlots = classe.planning.reduce((sum, jour) => {
      return (
        sum + jour.reduce((daySum, cours) => daySum + (cours.duree || 1), 0)
      );
    }, 0);

    return Math.round((usedSlots / totalSlots) * 100);
  }

  /**
   * Affiche le rapport
   */
  displayReport(stats) {
    const reportHTML = `
            <div class="report-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Rapport de Planning</h3>
                        <button class="close-report">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <h4>Ressources</h4>
                                <p>Classes: ${stats.totalClasses}</p>
                                <p>Enseignants: ${stats.totalEnseignants}</p>
                                <p>Salles: ${stats.totalSalles}</p>
                                <p>Modules: ${stats.totalModules}</p>
                            </div>
                            <div class="stat-card">
                                <h4>Capacités</h4>
                                <p>Étudiants: ${stats.totalEtudiants}</p>
                                <p>Places disponibles: ${
                                  stats.totalPlacesDisponibles
                                }</p>
                                <p>Complétude: ${stats.planningCompletude}%</p>
                            </div>
                            <div class="stat-card">
                                <h4>Utilisation des salles</h4>
                                ${Object.entries(stats.utilisationSalles)
                                  .map(
                                    ([salle, heures]) =>
                                      `<p>${salle}: ${heures}h</p>`
                                  )
                                  .join("")}
                            </div>
                            <div class="stat-card">
                                <h4>Charge enseignants</h4>
                                ${Object.entries(stats.chargeEnseignants)
                                  .map(
                                    ([prof, heures]) =>
                                      `<p>${prof}: ${heures}h</p>`
                                  )
                                  .join("")}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" onclick="advancedManager.exportReport()">Exporter PDF</button>
                        <button class="btn btn-secondary close-report">Fermer</button>
                    </div>
                </div>
            </div>
        `;

    // Ajouter le modal au DOM
    const reportDiv = document.createElement("div");
    reportDiv.innerHTML = reportHTML;
    document.body.appendChild(reportDiv);

    // Gérer la fermeture
    reportDiv.querySelectorAll(".close-report").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.body.removeChild(reportDiv);
      });
    });
  }

  /**
   * Exporte le rapport en PDF (simulation)
   */
  exportReport() {
    const stats = this.generateReport();

    // Créer un contenu texte du rapport
    const reportText = `
RAPPORT DE PLANNING
Date: ${new Date().toLocaleDateString("fr-FR")}

RESSOURCES:
- Classes: ${stats.totalClasses}
- Enseignants: ${stats.totalEnseignants}
- Salles: ${stats.totalSalles}
- Modules: ${stats.totalModules}

CAPACITÉS:
- Total étudiants: ${stats.totalEtudiants}
- Places disponibles: ${stats.totalPlacesDisponibles}
- Complétude du planning: ${stats.planningCompletude}%

UTILISATION DES SALLES:
${Object.entries(stats.utilisationSalles)
  .map(([salle, heures]) => `- ${salle}: ${heures} heures`)
  .join("\n")}

CHARGE DES ENSEIGNANTS:
${Object.entries(stats.chargeEnseignants)
  .map(([prof, heures]) => `- ${prof}: ${heures} heures`)
  .join("\n")}
        `;

    // Télécharger comme fichier texte
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `rapport-planning-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showNotification("Rapport exporté", "success");
  }

  /**
   * Détecte les conflits dans le planning
   */
  detectConflicts() {
    const conflicts = [];
    const classe = dataManager.getData("currentClass");

    if (!classe || !classe.planning) return conflicts;

    classe.planning.forEach((jour, jourIndex) => {
      for (let i = 0; i < jour.length; i++) {
        for (let j = i + 1; j < jour.length; j++) {
          const cours1 = jour[i];
          const cours2 = jour[j];

          // Vérifier le chevauchement horaire
          const debut1 = cours1.debut;
          const fin1 = cours1.debut + cours1.duree;
          const debut2 = cours2.debut;
          const fin2 = cours2.debut + cours2.duree;

          if (debut1 < fin2 && debut2 < fin1) {
            conflicts.push({
              jour: [
                "Lundi",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendredi",
                "Samedi",
              ][jourIndex],
              cours1: `${cours1.module} (${cours1.prof}) ${debut1}h-${fin1}h`,
              cours2: `${cours2.module} (${cours2.prof}) ${debut2}h-${fin2}h`,
              type: "Chevauchement horaire",
            });
          }

          // Vérifier les conflits de salle
          if (cours1.salle === cours2.salle && debut1 < fin2 && debut2 < fin1) {
            conflicts.push({
              jour: [
                "Lundi",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendredi",
                "Samedi",
              ][jourIndex],
              cours1: `${cours1.module} (${cours1.prof})`,
              cours2: `${cours2.module} (${cours2.prof})`,
              type: "Conflit de salle: " + cours1.salle,
            });
          }
        }
      }
    });

    return conflicts;
  }

  /**
   * Affiche une notification
   */
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 5px;
            color: white;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;

    // Couleurs selon le type
    const colors = {
      success: "var(--green-color)",
      error: "var(--red-color)",
      warning: "var(--orange-color)",
      info: "var(--blue-color)",
    };

    notification.style.background = colors[type] || colors.info;

    document.body.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 10);

    // Suppression automatique
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  /**
   * Optimise automatiquement le planning
   */
  optimizePlanning() {
    const conflicts = this.detectConflicts();

    if (conflicts.length === 0) {
      this.showNotification("Aucun conflit détecté", "success");
      return;
    }

    this.showNotification(
      `${conflicts.length} conflit(s) détecté(s)`,
      "warning"
    );

    // Afficher les conflits
    const conflictHTML = conflicts
      .map(
        (conflict) =>
          `<div class="conflict-item">
                <strong>${conflict.jour}</strong>: ${conflict.type}<br>
                ${conflict.cours1} ↔ ${conflict.cours2}
            </div>`
      )
      .join("");

    const conflictModal = document.createElement("div");
    conflictModal.innerHTML = `
            <div class="modal open">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Conflits détectés</h3>
                    </div>
                    <div class="modal-body">
                        ${conflictHTML}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" onclick="this.closest('.modal').remove()">OK</button>
                    </div>
                </div>
            </div>
        `;

    document.body.appendChild(conflictModal);
  }
}

// Ajouter les styles CSS pour le rapport
const reportStyles = `
<style>
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin: 20px 0;
}

.stat-card {
    background: var(--color-three);
    padding: 15px;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-one);
}

.stat-card h4 {
    margin: 0 0 10px 0;
    color: var(--blue-color);
}

.stat-card p {
    margin: 5px 0;
    font-size: 14px;
}

.conflict-item {
    background: rgba(237, 43, 47, 0.1);
    border: 1px solid var(--red-color);
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
}

.report-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.close-report {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--text-color);
    float: right;
}
</style>
`;

// Ajouter les styles au document
document.head.insertAdjacentHTML("beforeend", reportStyles);

// Instance globale
window.advancedManager = new AdvancedFeaturesManager();
