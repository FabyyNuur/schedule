/**
 * Gestionnaire d'interface utilisateur pour l'application de planning
 * Gère l'affichage, les interactions et les notifications
 */

class UIManager {
  constructor() {
    this.colors = [
      "rgb(66, 183, 237)",
      "rgb(11, 170, 14)",
      "#F68C00",
      "#ec6c6fdf",
      "#7FB8B4",
      "#9F4C9D",
      "#0073BC",
      "#e14fd3",
      "#ee9c9db0",
      "#58e5f851",
    ];
    this.currentView = "classes";
    this.currentEntity = null;
    this.currentJour = 0;

    // Attendre que le DOM soit chargé
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
  }

  /**
   * Initialise l'UIManager
   */
  initialize() {
    console.log("Initialisation de l'UIManager...");
    this.initializeElements();
    this.setupEventListeners();
    this.loadData();
    console.log("UIManager initialisé avec succès");
  }

  /**
   * Initialise les éléments DOM
   */
  initializeElements() {
    // Éléments principaux
    this.elements = {
      // Navigation
      cards: document.querySelectorAll(".card"),
      select: document.querySelector("#select"),

      // Compteurs
      nbrClasses: document.querySelector("#classes .Nbr"),
      nbrEnseignants: document.querySelector("#enseignants .Nbr"),
      nbrSalles: document.querySelector("#salles .Nbr"),
      nbrModules: document.querySelector("#modules .Nbr"),

      // Titre et informations
      title: document.querySelector(".title h1"),
      tacheCount: document.querySelector(".title .sm-l"),

      // Modal cours
      modal: document.querySelector(".modal"),
      modalTitle: document.querySelector("#modalTitle"),
      selectModule: document.querySelector("#select_module"),
      selectEnseignant: document.querySelector("#select_enseignant"),
      selectSalle: document.querySelector("#select_salle"),
      selectDebut: document.querySelector("#select_debut"),
      selectFin: document.querySelector("#select_fin"),
      btnSave: document.querySelector("#save"),
      btnCloseModal: document.querySelector("#closeModal"),
      btnCloseModal2: document.querySelector("#closeModal2"),
      closeBtnX: document.querySelector(".close-btn"),
      errorModal: document.querySelector(".modal .error-mod"),
      selectType: document.querySelector("#select_type"),
      coursNotes: document.querySelector("#cours_notes"),

      // Boutons d'ajout
      addProf: document.querySelector("#addProf"),
      addSalle: document.querySelector("#addSalle"),
      addClasse: document.querySelector("#addClasse"),
      addMod: document.querySelector("#addMod"),
      addCours: document.querySelectorAll(".add-cours"),

      // Modals d'ajout
      pageProf: document.querySelector(".prof"),
      pageSalle: document.querySelector(".salle"),
      pageClasse: document.querySelector(".classe"),
      pageMod: document.querySelector(".module"),

      // Recherche
      searchInput: document.querySelector("#search"),
      suggestions: document.querySelector("#suggestions"),

      // Thème
      themeSwitch: document.querySelector("#switcher"),
    };
  }

  /**
   * Configure les écouteurs d'événements
   */
  setupEventListeners() {
    console.log("Configuration des écouteurs d'événements...");

    // Navigation entre les vues
    this.elements.cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        this.switchView(card.id);
      });
    });

    // Sélection d'entité
    if (this.elements.select) {
      this.elements.select.addEventListener("change", (e) => {
        this.selectEntity(e.target.value);
      });
    }

    // Ajout de cours - IMPORTANT: S'assurer que les éléments existent
    if (this.elements.addCours && this.elements.addCours.length > 0) {
      console.log(
        `Ajout d'événements pour ${this.elements.addCours.length} boutons de cours`
      );
      this.elements.addCours.forEach((btn, index) => {
        btn.addEventListener("click", (e) => {
          console.log(
            `Clic sur bouton cours ${index + 1}, jour: ${e.target.getAttribute(
              "day"
            )}`
          );
          const jour = e.target.getAttribute("day");
          if (jour) {
            this.openCoursModal(jour);
          } else {
            console.error("Attribut day manquant sur le bouton");
          }
        });
      });
    } else {
      console.error("Aucun bouton add-cours trouvé !");
    }

    // Modals d'ajout
    this.elements.addProf.addEventListener("click", () =>
      this.openModal("prof")
    );
    this.elements.addSalle.addEventListener("click", () =>
      this.openModal("salle")
    );
    this.elements.addClasse.addEventListener("click", () =>
      this.openModal("classe")
    );
    this.elements.addMod.addEventListener("click", () =>
      this.openModal("module")
    );

    // Modal cours
    this.elements.btnSave.addEventListener("click", () => this.saveCours());
    this.elements.btnCloseModal.addEventListener("click", () =>
      this.closeModal()
    );

    // Nouveaux boutons de fermeture du modal cours
    if (this.elements.btnCloseModal2) {
      this.elements.btnCloseModal2.addEventListener("click", () =>
        this.closeModal()
      );
    }

    if (this.elements.closeBtnX) {
      this.elements.closeBtnX.addEventListener("click", () =>
        this.closeModal()
      );
    }

    // Sélection de module pour filtrer les enseignants
    this.elements.selectModule.addEventListener("change", () => {
      this.updateEnseignantsForModule();
    });

    // Recherche
    this.elements.searchInput.addEventListener("input", (e) => {
      this.performSearch(e.target.value);
    });

    // Thème
    this.elements.themeSwitch.addEventListener("change", (e) => {
      this.toggleTheme(e.target.checked);
    });

    // Fermeture des modals en cliquant à l'extérieur
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("modal") ||
        e.target.classList.contains("prof") ||
        e.target.classList.contains("salle") ||
        e.target.classList.contains("classe") ||
        e.target.classList.contains("module")
      ) {
        this.closeModal();
      }
    });
  }

  /**
   * Charge les données initiales
   */
  loadData() {
    this.updateCounters();
    this.populateSelects();
    this.displayCurrentPlanning();
    this.updateTitle();
  }

  /**
   * Met à jour les compteurs
   */
  updateCounters() {
    const classes = dataManager.getData("classes") || [];
    const enseignants = dataManager.getData("enseignants") || [];
    const salles = dataManager.getData("salles") || [];
    const modules = dataManager.getData("modules") || [];

    this.elements.nbrClasses.textContent = classes.length;
    this.elements.nbrEnseignants.textContent = enseignants.length;
    this.elements.nbrSalles.textContent = salles.length;
    this.elements.nbrModules.textContent = modules.length;
  }

  /**
   * Remplit les selects avec les données
   */
  populateSelects() {
    // Select principal de navigation
    this.populateSelect(
      this.elements.select,
      this.getCurrentViewData(),
      "Sélectionner..."
    );

    // Selects du modal de cours
    this.populateSelect(
      this.elements.selectModule,
      dataManager.getData("modules"),
      "Choisir un module"
    );
    this.populateSelect(
      this.elements.selectSalle,
      dataManager.getData("salles"),
      "Choisir une salle"
    );

    // Heures
    this.populateHours(this.elements.selectDebut, 8, 16);
    this.populateHours(this.elements.selectFin, 9, 17);
  }

  /**
   * Remplit un select avec des données
   */
  populateSelect(selectElement, data, placeholder) {
    if (!selectElement) return;

    selectElement.innerHTML = `<option value="">${placeholder}</option>`;

    if (data && data.length > 0) {
      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.nom;
        selectElement.appendChild(option);
      });
    }
  }

  /**
   * Remplit un select avec les heures
   */
  populateHours(selectElement, start, end) {
    if (!selectElement) return;

    selectElement.innerHTML = "";
    for (let i = start; i <= end; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `${i}H`;
      selectElement.appendChild(option);
    }
  }

  /**
   * Change de vue (classes, enseignants, salles, modules)
   */
  switchView(viewType) {
    // Mettre à jour la vue active
    this.elements.cards.forEach((card) => card.classList.remove("active"));
    document.getElementById(viewType).classList.add("active");

    this.currentView = viewType;
    this.currentEntity = null;

    // Mettre à jour le select
    this.populateSelect(
      this.elements.select,
      this.getCurrentViewData(),
      "Sélectionner..."
    );

    // Réinitialiser l'affichage
    this.updateTitle();
    this.clearPlanning();
  }

  /**
   * Sélectionne une entité spécifique
   */
  selectEntity(entityId) {
    if (!entityId) {
      this.currentEntity = null;
      this.clearPlanning();
      return;
    }

    const data = this.getCurrentViewData();
    this.currentEntity = data.find((item) => item.id == entityId);

    if (this.currentEntity) {
      this.updateTitle();
      this.displayCurrentPlanning();
    }
  }

  /**
   * Obtient les données de la vue courante
   */
  getCurrentViewData() {
    switch (this.currentView) {
      case "classes":
        return dataManager.getData("classes") || [];
      case "enseignants":
        return dataManager.getData("enseignants") || [];
      case "salles":
        return dataManager.getData("salles") || [];
      case "modules":
        return dataManager.getData("modules") || [];
      default:
        return [];
    }
  }

  /**
   * Met à jour le titre
   */
  updateTitle() {
    let title = "Planning";
    let tacheCount = 0;

    if (this.currentEntity) {
      title += ` : ${this.currentEntity.nom}`;
      if (this.currentEntity.planning) {
        tacheCount = this.currentEntity.planning.flat().length;
      }
    }

    this.elements.title.textContent = title;
    this.elements.tacheCount.textContent = `${tacheCount} cours`;
  }

  /**
   * Affiche le planning de l'entité courante
   */
  displayCurrentPlanning() {
    this.clearPlanning();

    if (!this.currentEntity || !this.currentEntity.planning) return;

    this.currentEntity.planning.forEach((jourCours, jourIndex) => {
      const dayContent = document.getElementById(`day_${jourIndex + 1}`);
      if (!dayContent) return;

      jourCours.forEach((cours) => {
        const coursElement = this.createCoursElement(cours);
        dayContent.appendChild(coursElement);
      });
    });
  }

  /**
   * Crée un élément de cours
   */
  createCoursElement(cours) {
    const coursDiv = document.createElement("div");
    coursDiv.className = "cours";
    coursDiv.style.backgroundColor = this.getRandomColor();
    coursDiv.style.left = `${(cours.debut - 8) * (100 / 10)}%`;
    coursDiv.style.width = `${cours.duree * (100 / 10)}%`;

    // Icônes pour les types de cours
    const typeIcons = {
      cours: "📚",
      td: "✏️",
      tp: "🔬",
      examen: "📝",
    };

    const typeIcon = typeIcons[cours.type] || "📚";
    const typeLabel = cours.type ? `(${cours.type})` : "";

    coursDiv.innerHTML = `
            <h3>${typeIcon} ${cours.module}</h3>
            <small>👨‍🏫 ${cours.prof}</small>
            <small>🏫 ${cours.salle} ${typeLabel}</small>
            ${
              cours.notes
                ? `<small>📝 ${cours.notes.substring(0, 30)}${
                    cours.notes.length > 30 ? "..." : ""
                  }</small>`
                : ""
            }
            <span class="delete-cours" onclick="uiManager.deleteCours(${
              cours.debut
            }, ${cours.duree})" title="Supprimer ce cours">×</span>
        `;

    return coursDiv;
  }

  /**
   * Vide l'affichage du planning
   */
  clearPlanning() {
    for (let i = 1; i <= 6; i++) {
      const dayContent = document.getElementById(`day_${i}`);
      if (dayContent) {
        dayContent.innerHTML = "";
      }
    }
  }

  /**
   * Ouvre le modal de cours
   */
  openCoursModal(jour) {
    console.log(`Ouverture du modal pour le jour: ${jour}`);

    if (!jour) {
      console.error("Jour non spécifié");
      return;
    }

    this.currentJour = parseInt(jour) - 1;
    console.log(`Jour converti en index: ${this.currentJour}`);

    if (!this.elements.modal) {
      console.error("Élément modal non trouvé");
      return;
    }

    this.elements.modal.classList.add("open");

    if (this.elements.modalTitle) {
      this.elements.modalTitle.textContent = `Ajouter un cours - ${this.getDayName(
        jour
      )}`;
    }

    this.clearModalForm();
    this.updateEnseignantsForModule();

    console.log("Modal ouvert avec succès");
  }

  /**
   * Retourne le nom du jour
   */
  getDayName(jour) {
    const jours = [
      "",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    return jours[parseInt(jour)] || "Jour inconnu";
  }

  /**
   * Met à jour les enseignants selon le module sélectionné
   */
  updateEnseignantsForModule() {
    const moduleId = parseInt(this.elements.selectModule.value);
    const enseignants = dataManager.getData("enseignants") || [];

    let filteredEnseignants = enseignants;
    if (moduleId) {
      filteredEnseignants = enseignants.filter(
        (ens) => ens.modules && ens.modules.includes(moduleId)
      );
    }

    this.populateSelect(
      this.elements.selectEnseignant,
      filteredEnseignants,
      "Choisir un enseignant"
    );
  }

  /**
   * Sauvegarde un cours
   */
  saveCours() {
    const cours = {
      module: this.getSelectText(this.elements.selectModule),
      prof: this.getSelectText(this.elements.selectEnseignant),
      salle: this.getSelectText(this.elements.selectSalle),
      debut: parseInt(this.elements.selectDebut.value),
      duree:
        parseInt(this.elements.selectFin.value) -
        parseInt(this.elements.selectDebut.value),
      type: this.elements.selectType ? this.elements.selectType.value : "cours",
      notes: this.elements.coursNotes
        ? this.elements.coursNotes.value.trim()
        : "",
    };

    // Validation
    const errors = dataManager.validateCours(cours);
    if (errors.length > 0) {
      this.showError(errors.join(", "));
      return;
    }

    // Vérification des conflits
    const conflicts = dataManager.checkConflicts(
      cours,
      this.currentJour,
      this.currentEntity?.id
    );
    if (conflicts.length > 0) {
      this.showError(conflicts.join(", "));
      return;
    }

    // Ajouter le cours
    if (this.currentEntity && this.currentEntity.planning) {
      this.currentEntity.planning[this.currentJour].push(cours);

      // Sauvegarder
      if (this.currentView === "classes") {
        dataManager.saveData("currentClass", this.currentEntity);
      }

      this.displayCurrentPlanning();
      this.updateTitle();
      this.closeModal();
      this.showSuccess("Cours ajouté avec succès");
    }
  }

  /**
   * Supprime un cours
   */
  deleteCours(debut, duree) {
    if (!this.currentEntity || !this.currentEntity.planning) return;

    this.currentEntity.planning.forEach((jourCours) => {
      const index = jourCours.findIndex(
        (cours) => cours.debut === debut && cours.duree === duree
      );
      if (index !== -1) {
        jourCours.splice(index, 1);
      }
    });

    this.displayCurrentPlanning();
    this.updateTitle();
    this.showSuccess("Cours supprimé");
  }

  /**
   * Ouvre un modal d'ajout
   */
  openModal(type) {
    const modal =
      this.elements[`page${type.charAt(0).toUpperCase() + type.slice(1)}`];
    if (modal) {
      modal.classList.add("open");
    }
  }

  /**
   * Ferme tous les modals
   */
  closeModal() {
    document
      .querySelectorAll(".modal, .prof, .salle, .classe, .module")
      .forEach((modal) => {
        modal.classList.remove("open");
      });
    this.clearErrors();
  }

  /**
   * Efface le formulaire du modal
   */
  clearModalForm() {
    this.elements.selectModule.selectedIndex = 0;
    this.elements.selectEnseignant.selectedIndex = 0;
    this.elements.selectSalle.selectedIndex = 0;
    this.elements.selectDebut.selectedIndex = 0;
    this.elements.selectFin.selectedIndex = 0;

    // Nouveaux champs
    if (this.elements.selectType) {
      this.elements.selectType.selectedIndex = 0;
    }
    if (this.elements.coursNotes) {
      this.elements.coursNotes.value = "";
    }

    this.clearErrors();
  }

  /**
   * Effectue une recherche
   */
  performSearch(query) {
    if (query.length < 2) {
      this.elements.suggestions.innerHTML = "";
      return;
    }

    const results = dataManager.search(query);
    this.displaySearchResults(results);
  }

  /**
   * Affiche les résultats de recherche
   */
  displaySearchResults(results) {
    let html = "";

    Object.keys(results).forEach((collection) => {
      if (results[collection].length > 0) {
        html += `<div class="suggestion-group">
                    <strong>${
                      collection.charAt(0).toUpperCase() + collection.slice(1)
                    }</strong>
                    ${results[collection]
                      .map(
                        (item) =>
                          `<div class="suggestion-item" onclick="uiManager.selectFromSearch('${collection}', ${item.id})">
                            ${item.nom}
                        </div>`
                      )
                      .join("")}
                </div>`;
      }
    });

    this.elements.suggestions.innerHTML = html;
  }

  /**
   * Sélectionne un élément depuis la recherche
   */
  selectFromSearch(collection, itemId) {
    this.switchView(collection);
    setTimeout(() => {
      this.elements.select.value = itemId;
      this.selectEntity(itemId);
    }, 100);
    this.elements.suggestions.innerHTML = "";
    this.elements.searchInput.value = "";
  }

  /**
   * Change le thème
   */
  toggleTheme(isLight) {
    document.body.setAttribute("data-theme", isLight ? "light" : "dark");
  }

  /**
   * Utilitaires
   */
  getSelectText(selectElement) {
    return selectElement.options[selectElement.selectedIndex]?.text || "";
  }

  getRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  showError(message) {
    this.elements.errorModal.textContent = message;
    this.elements.errorModal.style.color = "var(--error-color)";
  }

  showSuccess(message) {
    // Créer une notification de succès
    const notification = document.createElement("div");
    notification.className = "notification success";
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--green-color);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
        `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  clearErrors() {
    this.elements.errorModal.textContent = "";
  }
}

// Instance globale du gestionnaire d'interface
window.uiManager = new UIManager();
