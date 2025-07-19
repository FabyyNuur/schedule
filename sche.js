// Application de gestion de planning scolaire améliorée
// Utilisation des nouveaux gestionnaires pour une meilleure organisation du code

// Récupération des données via le DataManager
const classes = dataManager.getData("classes");
const Modules = dataManager.getData("modules");
const enseignants = dataManager.getData("enseignants");
const Salles = dataManager.getData("salles");

// Données courantes
let Classe = dataManager.getData("currentClass");
let Enseignant = dataManager.getData("currentEnseignant") || {
  id: 1,
  nom: "Aly",
  semaine: dataManager.getCurrentWeek(),
  planning: [[], [], [], [], [], []],
  modules: [1, 3, 4, 5],
};

let Module = dataManager.getData("currentModule") || {
  id: 1,
  nom: "ALGO",
  semaine: dataManager.getCurrentWeek(),
  planning: [[], [], [], [], [], []],
};

let Salle = dataManager.getData("currentSalle") || {
  id: 1,
  nom: "101",
  semaine: dataManager.getCurrentWeek(),
  planning: [[], [], [], [], [], []],
  nbrPlaces: 10,
};
// ---------------------------------------
const colors = [
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
const cards = document.querySelectorAll(".card");
const select = document.querySelector("#select");
const bod = document.querySelector("body");
const title = document.querySelector(".title h1");
const tache = document.querySelector(".title .sm-l");

const divClasses = document.querySelector("#classes");
const divEnseignants = document.querySelector("#enseignants");
const divSalles = document.querySelector("#salles");
const divModules = document.querySelector("#modules");

const addCours = document.querySelectorAll(".add-cours");
const addProf = document.querySelector("#addProf");
const addSal = document.querySelector("#addSalle");
const addCla = document.querySelector("#addClasse");
const addMod = document.querySelector("#addMod");

const selectModule = document.querySelector("#select_module");
const selectEnseignant = document.querySelector("#select_enseignant");
const selectDebut = document.querySelector("#select_debut");
const selectFin = document.querySelector("#select_fin");
const selectSalle = document.querySelector("#select_salle");
const choix = document.querySelector("#select");

const errorMod = document.querySelector(".error-modal");
const btnSaveModal = document.querySelector("#save");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector("#closeModal");

const nbrMod = document.querySelector("#modules .Nbr");
const nbrSal = document.querySelector("#salles .Nbr");
const nbrEns = document.querySelector("#enseignants .Nbr");
const nbrCla = document.querySelector("#classes .Nbr");

const selModProf = document.querySelector("#modProf");
const saveProf = document.querySelector("#saveProf");
const closeProf = document.querySelector("#closeProf");

const pageProf = document.querySelector(".prof");
const select_mod1 = document.querySelector("#select_mod1");
const select_mod2 = document.querySelector("#select_mod2");
const select_mod3 = document.querySelector("#select_mod3");
const select_mod4 = document.querySelector("#select_mod4");
const nomProf = document.querySelector("#nomProf");
const errorModal = document.querySelector(".prof .error-mod");

const pageSalle = document.querySelector(".salle");
const nomSall = document.querySelector("#nomSall");
const effSall = document.querySelector("#effSal");
const errorModal2 = document.querySelector(".salle .error-mod");

const saveSalle = document.querySelector("#saveSalle");
const closeSalle = document.querySelector("#closeSalle");

const saveMod = document.querySelector("#saveMod");
const closeMod = document.querySelector("#closeMod");

const pageMod = document.querySelector(".module");
const nomModule = document.querySelector("#nomModule");
const errorModal4 = document.querySelector(".module .error-mod");

const saveCla = document.querySelector("#saveClasse");
const closeClasse = document.querySelector("#closeClasse");

const pageClasse = document.querySelector(".classe");
const nomCla = document.querySelector("#nomClasse");
const effCla = document.querySelector("#effCla");
const errorModal3 = document.querySelector(".classe .error-mod");
//
let jour = 0;
//
const input = document.querySelector(".theme-switcher input");

input.addEventListener("change", (e) => {
  if (e.target.checked) {
    document.body.setAttribute("data-theme", "light");
  } else {
    document.body.setAttribute("data-theme", "dark");
  }
});
chargerHeure(8, 16, selectDebut);
chargerHeure(9, 17, selectFin);
//
chargerSelect(Modules, selectModule, "Choisir un Module");
chargerSelect(Salles, selectSalle, "Choisir une Salle");
chargerSelect(Modules, select_mod1, "Choisir un Module");
chargerSelect(Modules, select_mod2, "Choisir un Module");
chargerSelect(Modules, select_mod3, "Choisir un Module");
chargerSelect(Modules, select_mod4, "Choisir un Module");
//
afficherPlanning();
color();

// Les événements pour addCours sont maintenant gérés par ui-manager.js
// Commenté pour éviter les conflits
// addCours.forEach((e) => {
//   e.addEventListener("click", (C) => {
//     jour = C.target.getAttribute("day");
//     modal.classList.toggle("open");
//   });
//   afficherPlanning();
// });

addSal.addEventListener("click", () => {
  pageSalle.classList.toggle("open");
});
addProf.addEventListener("click", () => {
  pageProf.classList.toggle("open");
});
addCla.addEventListener("click", () => {
  pageClasse.classList.toggle("open");
});
addMod.addEventListener("click", () => {
  pageMod.classList.toggle("open");
});
selectModule.addEventListener("change", () => {
  let idM = getSelectedValue(selectModule);
  profs = getProfByIdMod(idM);
  chargerSelect(profs, selectEnseignant, "Choisir un enseignant");
});
function findW(data, sel) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == sel) {
      return data[i];
    }
  }
}
function addPlanClass() {
  for (let i = 0; i < classes.length; i++) {
    if (classes[i].nom == Classe.nom) {
      classes[i].semaine = Classe.semaine;
      classes[i].planning = Classe.planning;
    }
  }
  localStorage.setItem("classes", JSON.stringify(classes));
}
function addPlanProfs() {
  for (let i = 0; i < enseignants.length; i++) {
    for (let j = 0; j < classes.length; j++) {
      tmp = classes[j].planning;
      for (let index = 0; index < tmp.length; index++) {
        tmp[index].forEach((el) => {
          if (el.prof == enseignants[i].nom) {
            W = el;
            W.classe = classes[j].nom;
            enseignants[i].planning[index].push(W);
          }
        });
      }
    }
  }
  localStorage.setItem("enseignants", JSON.stringify(enseignants));
}
function addPlanMod() {
  for (let i = 0; i < Modules.length; i++) {
    for (let j = 0; j < classes.length; j++) {
      tmp = classes[j].planning;
      for (let index = 0; index < tmp.length; index++) {
        tmp[index].forEach((el) => {
          if (el.module == Modules[i].nom) {
            W = el;
            W.classe = classes[j].nom;
            Modules[i].planning[index].push(W);
          }
        });
      }
    }
  }
  localStorage.setItem("Modules", JSON.stringify(Modules));
}
function addPlanSal() {
  for (let i = 0; i < Salles.length; i++) {
    for (let j = 0; j < classes.length; j++) {
      tmp = classes[j].planning;
      for (let index = 0; index < tmp.length; index++) {
        tmp[index].forEach((el) => {
          if (el.salle == Salles[i].nom) {
            W = el;
            W.classe = classes[j].nom;
            Salles[i].planning[index].push(W);
          }
        });
      }
    }
  }
  localStorage.setItem("Modules", JSON.stringify(Modules));
}
function cleanprof() {
  for (let index = 0; index < enseignants.length; index++) {
    enseignants[index].planning = [[], [], [], [], [], []];
  }
}
function cleanmod() {
  for (let index = 0; index < Modules.length; index++) {
    Modules[index].planning = [[], [], [], [], [], []];
  }
}
function cleansal() {
  for (let index = 0; index < Salles.length; index++) {
    Salles[index].planning = [[], [], [], [], [], []];
  }
}
btnSaveModal.addEventListener("click", () => {
  var cours = {};
  errorMod.innerHTML = "";
  cours.module = findW(Modules, getSelectedValue(selectModule)).nom;
  cours.prof = findW(enseignants, getSelectedValue(selectEnseignant)).nom;
  if (getSelectedValue(selectSalle) == 0) {
    cours.salle = "En Ligne";
  } else {
    cours.salle = findW(Salles, getSelectedValue(selectSalle)).nom;
  }
  cours.debut = +getSelectedValue(selectDebut);
  if (cours.debut > +getSelectedValue(selectFin)) {
    errorMod.innerHTML = "Revoyez l heure de fin..";
  } else {
    cours.duree = +getSelectedValue(selectFin) - +getSelectedValue(selectDebut);
    if (
      getSelectedValue(selectSalle) != 0 &&
      findW(Salles, getSelectedValue(selectSalle)).nbrPlaces < Classe.effectif
    ) {
      errorMod.innerHTML =
        "Cette Salle ne peut contenir l effectif de cette classe..";
      cours = {};
    } else {
      errorMod.innerHTML = "";
      if (
        getSelectedValue(selectSalle) != 0 &&
        verifSalleEff(
          +jour - 1,
          +getSelectedValue(selectDebut),
          findW(Salles, getSelectedValue(selectSalle)).nom,
          +getSelectedValue(selectFin)
        ) == 1
      ) {
        errorMod.innerHTML = "Cette Salle est occupe a cet heure..";
      } else {
        errorMod.innerHTML = "";
        if (
          verifProfCours(
            +jour - 1,
            +getSelectedValue(selectDebut),
            findW(enseignants, getSelectedValue(selectEnseignant)).nom,
            +getSelectedValue(selectFin)
          ) == 1
        ) {
          errorMod.innerHTML = "Ce prof a deja un cours a cet heure..";
        } else {
          if (
            verifcoursCl(
              +jour - 1,
              +getSelectedValue(selectDebut),
              +getSelectedValue(selectFin),
              Classe.nom
            ) == 1
          ) {
            errorMod.innerHTML = "Cette classe a deja un cours a cet heure..";
          } else {
            Classe.planning[+jour - 1].push(cours);
            localStorage.setItem("Classe", JSON.stringify(Classe));
            modal.classList.remove("open");
            location.reload();
            afficherPlanning();
          }
        }
      }
    }
  }
});
function verifSalleEff(jour, deb, sal, fin) {
  let trouve = 0;
  for (let j = 0; j < classes.length; j++) {
    tmp = classes[j].planning;
    tmp[jour].forEach((el) => {
      if (el.salle == sal) {
        if (deb <= fin && fin <= el.debut) {
          trouve = 0;
        } else if (fin >= deb && deb >= el.debut + el.duree) {
          trouve = 0;
        } else {
          trouve = 1;
        }
      }
    });
  }
  return trouve;
}
function verifProfCours(jour, deb, prof, fin) {
  let trouve = 0;
  for (let j = 0; j < classes.length; j++) {
    tmp = classes[j].planning;
    tmp[jour].forEach((el) => {
      if (el.prof == prof) {
        if (deb <= fin && fin <= el.debut) {
          trouve = 0;
        } else if (fin >= deb && deb >= el.debut + el.duree) {
          trouve = 0;
        } else {
          trouve = 1;
        }
      }
    });
  }
  return trouve;
}
function verifcoursCl(jour, deb, fin, classe) {
  let trouve = 0;
  for (let j = 0; j < classes.length; j++) {
    tmp = classes[j].planning;
    if (classes[j].nom == classe) {
      tmp[jour].forEach((el) => {
        if (deb <= fin && fin <= el.debut) {
          trouve = 0;
        } else if (fin >= deb && deb >= el.debut + el.duree) {
          trouve = 0;
        } else {
          trouve = 1;
        }
      });
    }
  }
  return trouve;
}
saveProf.addEventListener("click", () => {
  errorModal.innerHTML = "";
  rep = verif(enseignants, nomProf.value);
  if (nomProf.value != "") {
    if (rep == false) {
      ens = {};
      ens.id = enseignants.length + 1;
      ens.nom = nomProf.value;
      ens.semaine = "16/01/2023 - 21/01/2023";
      ens.planning = [[], [], [], [], [], []];
      let mod = [];
      addSelmo(getSelectedValue(select_mod1), mod);
      addSelmo(getSelectedValue(select_mod2), mod);
      addSelmo(getSelectedValue(select_mod3), mod);
      addSelmo(getSelectedValue(select_mod4), mod);
      if (mod.length < 1) {
        errorModal.innerHTML = "Choisissez au moins un module...";
      } else {
        ens.modules = mod;
        enseignants.push(ens);
        localStorage.setItem("enseignants", JSON.stringify(enseignants));
        pageProf.classList.toggle("open");
        location.reload();
        afficherPlanning();
      }
    } else {
      errorModal.innerHTML = "Ce prof existe deja dans la base...";
    }
  } else {
    errorModal.innerHTML = "Veuillez remplir le champ...";
  }
});
saveSalle.addEventListener("click", () => {
  errorModal2.innerHTML = "";
  rep = verif(Salles, nomSall.value);
  if (nomSall.value != "") {
    if (rep == false) {
      sal = {};
      sal.id = Salles.length + 1;
      sal.nom = nomSall.value;
      sal.semaine = "16/01/2023 - 21/01/2023";
      sal.planning = [[], [], [], [], [], []];
      sal.nbrPlaces = effSall.value;
      if ((sal.nbrPlaces >= 10) & (sal.nbrPlaces <= 50)) {
        Salles.push(sal);
        localStorage.setItem("Salles", JSON.stringify(Salles));
        pageSalle.classList.toggle("open");
        location.reload();
        afficherPlanning();
      } else {
        errorModal2.innerHTML = "Entrez un effectif entre 10 et 50...";
      }
    } else {
      errorModal2.innerHTML = "Cette salle existe deja dans la base...";
    }
  } else {
    errorModal2.innerHTML = "Veuillez remplir le champ...";
  }
});
saveCla.addEventListener("click", () => {
  errorModal3.innerHTML = "";
  rep = verif(classes, nomCla.value);
  if (nomCla.value != "") {
    if (rep == false) {
      cla = {};
      cla.id = classes.length + 1;
      cla.nom = nomCla.value;
      cla.effectif = effCla.value;
      cla.semaine = "16/01/2023 - 21/01/2023";
      cla.planning = [[], [], [], [], [], []];
      if ((cla.effectif > 10) & (cla.effectif < 50)) {
        classes.push(cla);
        localStorage.setItem("classes", JSON.stringify(classes));
        pageClasse.classList.toggle("open");
        location.reload();
        afficherPlanning();
      } else {
        errorModal3.innerHTML = "Entrez un effectif entre 10 et 50...";
      }
    } else {
      errorModal3.innerHTML = "Cette classe existe deja dans la base...";
    }
  } else {
    errorModal3.innerHTML = "Veuillez remplir le champ...";
  }
});
saveMod.addEventListener("click", () => {
  errorModal4.innerHTML = "";
  rep = verif(Modules, nomModule.value);
  if (nomModule.value != "") {
    if (rep == false) {
      cla = {};
      cla.id = Modules.length + 1;
      cla.nom = nomModule.value;
      cla.semaine = "16/01/2023 - 21/01/2023";
      cla.planning = [[], [], [], [], [], []];
      Modules.push(cla);
      localStorage.setItem("Modules", JSON.stringify(Modules));
      pageMod.classList.toggle("open");
      location.reload();
      afficherPlanning();
    } else {
      errorModal4.innerHTML = "Ce module existe deja dans la base...";
    }
  } else {
    errorModal4.innerHTML = "Veuillez remplir le champ...";
  }
});
function verif(data, nomp) {
  for (let index = 0; index < data.length; index++) {
    if (data[index].nom == nomp) {
      return true;
    }
  }
  return false;
}
function addSelmo(selectm, mod) {
  if (selectm in mod) {
  } else {
    if (selectm > 0) {
      mod.push(+selectm);
    }
  }
}
closeModal.addEventListener("click", () => {
  modal.classList.remove("open");
});
closeProf.addEventListener("click", () => {
  pageProf.classList.toggle("open");
});
closeSalle.addEventListener("click", () => {
  pageSalle.classList.toggle("open");
});
closeMod.addEventListener("click", () => {
  pageMod.classList.remove("open");
});
closeClasse.addEventListener("click", () => {
  pageClasse.classList.remove("open");
});
function getSelectedValue(select) {
  return select.options[select.selectedIndex].value;
}
function getSelected(select) {
  return select.options[select.selectedIndex].text;
}
function ent(data) {
  title.innerHTML = `Planning:${data.nom}`;
}
function plu() {
  addCours.classList.add("plus");
}
function plum() {
  addCours.classList.remove("plus");
}
addPlanClass();
cleanprof();
addPlanProfs();
cleanmod();
addPlanMod();
cleansal();
addPlanSal();
choix.addEventListener("change", () => {
  const ch = getSelected(choix);
  classes.forEach((cl) => {
    if (cl["nom"] == ch) {
      Classe = cl;
      localStorage.setItem("Classe", JSON.stringify(Classe));
      afficherPlanning();
    }
  });
  enseignants.forEach((cl) => {
    if (cl["nom"] == ch) {
      Enseignant = cl;
      localStorage.setItem("Enseignant", JSON.stringify(Enseignant));
      afficherPlanningProfs();
    }
  });
  Modules.forEach((cl) => {
    if (cl["nom"] == ch) {
      Module = cl;
      localStorage.setItem("Module", JSON.stringify(Module));
      afficherPlanningMod();
    }
  });
  Salles.forEach((cl) => {
    if (cl["nom"] == ch) {
      Salle = cl;
      localStorage.setItem("Salle", JSON.stringify(Salle));
      afficherPlanningSal();
    }
  });
  // }
});
function getProfByIdMod(idM) {
  profs = enseignants.filter((el) => el.modules.includes(+idM));
  return profs;
}
const inputt = document.querySelector("#search");

inputt.addEventListener("keyup", () => {
  const val = inputt.value;
  const result1 = classes.filter((item) =>
    item.nom.toLowerCase().includes(val.toLowerCase())
  );
  const result2 = Modules.filter((item) =>
    item.nom.toLowerCase().includes(val.toLowerCase())
  );
  const result3 = Salles.filter((item) =>
    item.nom.toLowerCase().includes(val.toLowerCase())
  );
  const result4 = enseignants.filter((item) =>
    item.nom.toLowerCase().includes(val.toLowerCase())
  );
  let suggestion = "";
  document.querySelector("#suggestions").classList.remove("disp");
  if (val != "") {
    result1.forEach((r) => {
      suggestion += `
            <div class="suggestion">${r.nom}</div>
            `;
    });
    result2.forEach((r) => {
      suggestion += `
            <div class="suggestion">${r.nom}</div>
            `;
    });
    result3.forEach((r) => {
      suggestion += `
            <div class="suggestion">${r.nom}</div>
            `;
    });
    result4.forEach((r) => {
      suggestion += `
            <div class="suggestion">${r.nom}</div>
            `;
    });
    document.querySelector(".cards").style.display = "none";
    choix.style.display = "none";
    document.getElementById("suggestions").innerHTML = suggestion;
    const sugg = document.querySelectorAll(".suggestion");
    sugg.forEach((s) => {
      s.addEventListener("click", () => {
        if (verif(classes, s.innerText) == true) {
          classes.forEach((cl) => {
            if (cl["nom"] == s.innerHTML) {
              Classe = cl;
              localStorage.setItem("Classe", JSON.stringify(Classe));
              choix.style.display = "flex";
              document.querySelector(".cards").style.display = "flex";
              document.querySelector("#suggestions").classList.add("disp");
              afficherPlanning();
            }
          });
        } else if (verif(Modules, s.innerText) == true) {
          Modules.forEach((cl) => {
            if (cl["nom"] == s.innerHTML) {
              Module = cl;
              localStorage.setItem("Module", JSON.stringify(Module));
              choix.style.display = "flex";
              document.querySelector(".cards").style.display = "flex";
              document.querySelector("#suggestions").classList.add("disp");
              afficherPlanningMod();
            }
          });
        } else if (verif(enseignants, s.innerText) == true) {
          enseignants.forEach((cl) => {
            if (cl["nom"] == s.innerHTML) {
              Enseignant = cl;
              localStorage.setItem("Enseignant", JSON.stringify(Enseignant));
              choix.style.display = "flex";
              document.querySelector(".cards").style.display = "flex";
              document.querySelector("#suggestions").classList.add("disp");
              afficherPlanningProfs();
            }
          });
        } else if (verif(Salles, s.innerText) == true) {
          Salles.forEach((cl) => {
            if (cl["nom"] == s.innerHTML) {
              Salle = cl;
              localStorage.setItem("Salle", JSON.stringify(Salle));
              choix.style.display = "flex";
              document.querySelector(".cards").style.display = "flex";
              document.querySelector("#suggestions").classList.add("disp");
              afficherPlanningSal();
            }
          });
        }
      });
    });
  } else {
    choix.style.display = "flex";
    document.querySelector(".cards").style.display = "flex";
    document.querySelector("#suggestions").classList.add("disp");
  }
});
function afficherPlanning() {
  effacerCours();
  ent(Classe);
  compte(Classe.planning);
  Classe.planning.forEach((p, i) => {
    const jour = document.querySelector(`#day_${i + 1}`);
    p.forEach((c) => {
      let posColor = Math.floor(Math.random() * colors.length);
      jour.appendChild(
        createDivCours(
          c.debut,
          c.duree,
          colors[posColor],
          c.module,
          c.prof,
          c.salle
        )
      );
    });
  });
}
function compte(data) {
  let nbr = 0;
  for (let i = 0; i < data.length; i++) {
    const el = data[i];
    el.forEach((e) => {
      nbr = nbr + 1;
    });
  }
  tache.innerHTML = `${nbr} cours`;
}
function afficherPlanningProfs() {
  effacerCours();
  ent(Enseignant);
  compte(Enseignant.planning);
  Enseignant.planning.forEach((p, i) => {
    const jour = document.querySelector(`#day_${i + 1}`);
    p.forEach((c) => {
      let posColor = Math.floor(Math.random() * colors.length);
      jour.appendChild(
        createDivProfs(
          c.debut,
          c.duree,
          colors[posColor],
          c.module,
          c.salle,
          c.classe
        )
      );
    });
  });
}
function afficherPlanningMod() {
  effacerCours();
  ent(Module);
  compte(Module.planning);
  Module.planning.forEach((p, i) => {
    const jour = document.querySelector(`#day_${i + 1}`);
    p.forEach((c) => {
      let posColor = Math.floor(Math.random() * colors.length);
      jour.appendChild(
        createDivMod(
          c.debut,
          c.duree,
          colors[posColor],
          c.prof,
          c.salle,
          c.classe
        )
      );
    });
  });
}
function afficherPlanningSal() {
  effacerCours();
  ent(Salle);
  compte(Salle.planning);
  Salle.planning.forEach((p, i) => {
    const jour = document.querySelector(`#day_${i + 1}`);
    p.forEach((c) => {
      let posColor = Math.floor(Math.random() * colors.length);
      jour.appendChild(
        createDivSalle(
          c.debut,
          c.duree,
          colors[posColor],
          c.prof,
          c.module,
          c.classe
        )
      );
    });
  });
}
function createDivCours(debut, duree, color, module, prof, salle) {
  col = debut - 8;
  //
  const div = document.createElement("div");
  div.className = "cours";

  const spanDelete = document.createElement("span");
  spanDelete.innerText = "x";
  spanDelete.className = "delete-cours";

  const small1 = document.createElement("small");
  small1.innerText = prof;

  const small2 = document.createElement("small");
  small2.innerText = salle;

  const h3 = document.createElement("h3");
  h3.innerText = module;

  div.style.backgroundColor = color;
  div.style.width = `${duree * 10}%`;
  div.style.marginLeft = `${col * 11.4}%`;

  div.append(spanDelete, small1, h3, small2);
  return div;
}
function createDivProfs(debut, duree, color, module, salle, classe) {
  col = debut - 8;
  //
  const div = document.createElement("div");
  div.className = "cours";

  const small1 = document.createElement("small");
  small1.innerText = classe;

  const small2 = document.createElement("small");
  small2.innerText = salle;

  const h3 = document.createElement("h3");
  h3.innerText = module;

  div.style.backgroundColor = color;
  div.style.width = `${duree * 10}%`;
  div.style.marginLeft = `${col * 11.4}%`;

  div.append(small1, h3, small2);
  return div;
}
function createDivMod(debut, duree, color, prof, salle, classe) {
  col = debut - 8;
  //
  const div = document.createElement("div");
  div.className = "cours";

  const small1 = document.createElement("small");
  small1.innerText = classe;

  const small2 = document.createElement("small");
  small2.innerText = salle;

  const h3 = document.createElement("h3");
  h3.innerText = prof;

  div.style.backgroundColor = color;
  div.style.width = `${duree * 10}%`;
  div.style.marginLeft = `${col * 11.4}%`;

  div.append(small1, h3, small2);
  return div;
}
function createDivSalle(debut, duree, color, prof, module, classe) {
  col = debut - 8;
  //
  const div = document.createElement("div");
  div.className = "cours";

  const small1 = document.createElement("small");
  small1.innerText = classe;

  const small2 = document.createElement("small");
  small2.innerText = module;

  const h3 = document.createElement("h3");
  h3.innerText = prof;

  div.style.backgroundColor = color;
  div.style.width = `${duree * 10}%`;
  div.style.marginLeft = `${col * 11.4}%`;

  div.append(small1, h3, small2);
  return div;
}
function effacerCours() {
  const cours = document.querySelectorAll(".day-content");
  cours.forEach((c) => {
    c.innerHTML = "";
  });
}
function chargerSelect(data, select, label) {
  select.innerHTML = "";
  //
  const option = document.createElement("option");
  option.innerText = label;
  option.value = 0;
  select.appendChild(option);
  //
  data.forEach((d) => {
    const option = document.createElement("option");
    option.innerText = d.nom;
    option.value = d.id;
    select.appendChild(option);
  });
}
function chargerHeure(min, max, select) {
  select.innerHTML = "";
  const option = document.createElement("option");
  option.innerText = "Choisir une Heure";
  option.value = 0;
  select.appendChild(option);
  //
  for (let i = min; i <= max; i++) {
    const option = document.createElement("option");
    option.innerText = `${i} H`;
    option.value = i;
    select.appendChild(option);
  }
}
function color() {
  divClasses.addEventListener("click", function () {
    divClasses.classList.add("active");
    divEnseignants.classList.remove("active");
    divModules.classList.remove("active");
    divSalles.classList.remove("active");
    chargerSelect(classes, select, "Classes");
  });
  nbrCla.textContent = classes.length;

  divEnseignants.addEventListener("click", function () {
    divEnseignants.classList.add("active");
    divClasses.classList.remove("active");
    divModules.classList.remove("active");
    divSalles.classList.remove("active");
    chargerSelect(enseignants, select, "Enseignants");
  });
  nbrEns.textContent = enseignants.length;

  divModules.addEventListener("click", function () {
    divModules.classList.add("active");
    divEnseignants.classList.remove("active");
    divClasses.classList.remove("active");
    divSalles.classList.remove("active");
    chargerSelect(Modules, select, "Modules");
  });
  nbrMod.textContent = Modules.length;

  divSalles.addEventListener("click", function () {
    divSalles.classList.add("active");
    divEnseignants.classList.remove("active");
    divModules.classList.remove("active");
    divClasses.classList.remove("active");
    chargerSelect(Salles, select, "Salles");
  });
  nbrSal.textContent = Salles.length;
}
addPlanClass();
cleanprof();
addPlanProfs();
cleanmod();
addPlanMod();
cleansal();
addPlanSal();
afficherPlanning();
const removeB = document.querySelectorAll(".delete-cours");
supp();

function supp() {
  removeB.forEach((button) => {
    button.addEventListener("click", function () {
      const course = this.parentNode;
      const j = course.parentNode;
      const jj = j.parentNode;
      const jjj = jj.parentNode;
      const indexJ = Array.prototype.indexOf.call(jjj.children, jj);
      const indexC = Array.prototype.indexOf.call(j.children, course);
      Classe.planning[indexJ - 1].splice(indexC, 1);
      localStorage.setItem("Classe", JSON.stringify(Classe));
      cleanprof();
      addPlanProfs();
      cleanmod();
      addPlanMod();
      cleansal();
      addPlanSal();
      location.reload();
      course.remove();
    });
  });
}
