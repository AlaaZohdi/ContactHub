// ? ========================================Varibels=============================================
var fullNameInput = document.getElementById("fullName");
var phoneNumInput = document.getElementById("phoneNum");
var emailInput = document.getElementById("email");
var addressInput = document.getElementById("address");
var groupInput = document.getElementById("group");
var notesInput = document.getElementById("notes");
var favoriteInput = document.getElementById("favorite");
var emergencyInput = document.getElementById("emergency");
var addContactBtn = document.getElementById("addContactBtn");
var deleteBtn = document.getElementById("deleteBtn");
var allContactsSection = document.getElementById("allContacts");
var contactsList = [];
if (localStorage.getItem("contactsList") !== null) {
  contactsList = JSON.parse(localStorage.getItem("contactsList"));
}
var Favorites = document.getElementById("Favorites");
var favoriteList = [];
if (localStorage.getItem("favoriteList") !== null) {
  favoriteList = JSON.parse(localStorage.getItem("favoriteList"));
}
var favoriteBtn = document.getElementById("favoriteBtn");
var addContactModal = new bootstrap.Modal(
  document.getElementById("addContact"),
);
var Emergency = document.getElementById("Emergency");
var emergencyList = [];
if (localStorage.getItem("emergencyList") !== null) {
  emergencyList = JSON.parse(localStorage.getItem("emergencyList"));
}
var mainHeaderContant = document.getElementById("mainHeaderContant");
fullNameInput.addEventListener("input", validateContactName);
phoneNumInput.addEventListener("input", validateContactPhone);
emailInput.addEventListener("input", validateContactEmail);
// ? ====================================== main Contacts ==========================================
addContactBtn.addEventListener("click", addContact);
function addContact() {
  if (validateContactName() === false) {
    Swal.fire({
      icon: "error",
      title: "Invalid Name",
      text: "Name must start with a Capital letter and be between 3 to 7 characters long!",
    });
    return;
  }
  if (validateContactPhone() === false) {
    Swal.fire({
      icon: "error",
      title: "Invalid phone Number",
      text: "Please enter a valid Egyptian phone number",
    });
    return;
  }
  if (validateContactEmail() === false) {
    Swal.fire({
      icon: "error",
      title: "Invalid email",
      text: "Please enter a valid Email",
    });
    return;
  }
  if (updatedContactIndex !== undefined && updatedContactIndex !== null) {
    updateContact(updatedContactIndex);
  } else {
    var contact = {
      contactId: Date.now(),
      contactName: fullNameInput.value,
      contactPhone: phoneNumInput.value,
      contactEmail: emailInput.value,
      contactAddress: addressInput.value,
      contactGroup: groupInput.value,
      contactNotes: notesInput.value,
      contactFavorite: favoriteInput.checked,
      contactEmergency: emergencyInput.checked,
    };
    contactsList.push(contact);
    if (favoriteInput.checked === true) {
      favoriteList.push(contact);
      localStorage.setItem("favoriteList", JSON.stringify(favoriteList));
    }
    if (emergencyInput.checked === true) {
      emergencyList.push(contact);
      localStorage.setItem("emergencyList", JSON.stringify(emergencyList));
    }
    localStorage.setItem("contactsList", JSON.stringify(contactsList));
    displayAllContacts(contactsList);
    displayFavorites(favoriteList);
    displayEmergency(emergencyList);
    dispalayMainHeaderContant();
    clearForm();
    addContactModal.hide();
    Swal.fire({
      icon: "success",
      title: "added !",
      text: "Contant has been added successfully",
      showConfirmButton: false,
      timer: 1500,
    });
  }
}

displayAllContacts(contactsList);
function displayAllContacts(list) {
  var container = "";
  for (var i = 0; i < list.length; i++) {
    container += `
          <div class="col-md-6">
          <div class="item bg-white pt-3 rounded-3 shadow-sm">
          <header class="d-flex gap-3 align-items-center px-3">
            <span class="icon-wrapper p-3 rounded-3 text-white fw-semibold" style="background-color: ${generateRandomColor()}">${list[i].contactName[0].toUpperCase()}</span>
            <div class="content-wrapper">
            <h3 class="text-black fw-semibold fs-6">${list[i].contactName}</h3>
            <div>
            <span class="icon-wrapper bg-primary-subtle p-1 rounded-3 ">
              <i class="fa fa-phone text-primary font-size-14"></i></span> 
            <span class="text-gray-light-color font-size-14">${list[i].contactPhone}</span>
          </div>
            </div>
          </header>

          <div class="px-3">
            <div class="my-3">
              <span class="icon-wrapper bg-purple p-1 rounded-3 me-1">
                <i class="fa fa-envelope text-purple font-size-14"></i></span> 
              <span class="text-gray-light-color font-size-14">${list[i].contactEmail}</span>
            </div>
  
            <div class="my-3">
              <span class="icon-wrapper bg-green p-1 rounded-3 me-1">
                <i class="fa fa-location-dot text-green font-size-14"></i>
              </span> 
              <span class="text-gray-light-color font-size-14">${list[i].contactAddress}</span>
            </div>
  
            <div class="my-3">
            <span class="bg-primary-subtle p-2 rounded-3">
              <span class="text-primary font-size-14">${list[i].contactGroup}</span>
            </span>
            </div>

          </div>

          <footer class="rounded-bottom-3 p-3 border-top ">
            <div class="container-fluid d-flex justify-content-between align-items-center">
              <div>
            
          <button class="icon-wrapper bg-green p-1 rounded-3 me-1 border-0">
                <a href="tel:${list[i].contactPhone}"><i class="fa fa-phone text-green font-size-14"></i></a>
            </button> 
            <button class="icon-wrapper bg-purple p-1 rounded-3 me-1 border-0">
                <a href="mailto:${list[i].contactEmail}"><i class="fa fa-envelope text-purple font-size-14"></i></a>
            </button> 
            </div>

            <div>
              <button onclick="addToFavorites(${i})"
  class="icon-wrapper p-1 rounded-3 me-1 border-0">
  <i class="fa ${isFav(contactsList[i]) ? "fa-solid text-warning" : "fa-regular text-gray-light-color"} fa-star"></i>
</button>
              <button onclick="addToEmergency(${i})" class="icon-wrapper p-1 rounded-3 me-1 border-0">
  <i class="fa ${isEmergency(contactsList[i]) ? "fa-solid text-danger" : "fa-regular text-gray-light-color"} fa-heart"></i>
</button>
              <button onclick="setFormForUpdate(${i})" class="icon-wrapper p-1 rounded-3 me-1 text-gray-light-color border-0">
                <i class="fa fa-pen font-size-14"></i>
            </button> 
              <button class="icon-wrapper p-1 rounded-3 me-1 text-gray-light-color border-0" id="deleteBtn" onclick="deleteContact(${i})">
                <i class="fa fa-trash font-size-14"></i>
            </button> 
            </div>
            </div>           
        </footer>
          </div>
        </div>
        `;
  }
  allContactsSection.innerHTML = container;
}
function generateRandomColor() {
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  return "rgb(" + r + "," + g + "," + b + ")";
}
// ? ====================================== header Contacts ==========================================
function dispalayMainHeaderContant() {
  mainHeaderContant.innerHTML = `<div class="col-6 col-lg-4 ">
      <div class="header-item d-flex align-items-center gap-2 bg-white rounded-3 p-3 shadow-sm">
        <div class="icon-wrapper bg-primary p-2 rounded-3">
          <i class="fa fa-users text-white"></i>
        </div>
        <div class="content-wrapper">
          <p class="text-gray-light-color font-size-12 fw-semibold">TOTAL</p>
          <span class="black-text fw-bold">${contactsList.length}</span>
        </div>
      </div>
      </div>

       <div class="col-6 col-lg-4 ">
      <div class="header-item d-flex align-items-center gap-2 bg-white rounded-3 p-3 shadow-sm">
        <div class="icon-wrapper bg-mix-yellow p-2 rounded-3">
          <i class="fa fa-star text-white"></i>
        </div>
        <div class="content-wrapper">
          <p class="text-gray-light-color font-size-12 fw-semibold">FAVORITES</p>
          <span class="black-text fw-bold">${favoriteList.length}</span>
        </div>
      </div>
      </div>

       <div class="col-6 col-lg-4 ">
      <div class="header-item d-flex align-items-center gap-2 bg-white rounded-3 p-3 shadow-sm">
        <div class="icon-wrapper bg-danger p-2 rounded-3">
          <i class="fa fa-heart-pulse text-white"></i>
        </div>
        <div class="content-wrapper">
          <p class="text-gray-light-color font-size-12 fw-semibold">Emergency</p>
          <span class="black-text fw-bold">${emergencyList.length}</span>
        </div>
      </div>
      </div>`;
}
dispalayMainHeaderContant();
// ? ====================================== search Contacts ==========================================
function searchContacts() {
  var searchList = [];
  var searchInput = document.getElementById("searchInput");
  for (var i = 0; i < contactsList.length; i++) {
    if (
      contactsList[i].contactName
        .toLowerCase()
        .includes(searchInput.value.toLowerCase()) ||
      contactsList[i].contactEmail
        .toLowerCase()
        .includes(searchInput.value.toLowerCase()) ||
      contactsList[i].contactPhone
        .toLowerCase()
        .includes(searchInput.value.toLowerCase())
    ) {
      searchList.push(contactsList[i]);
    }
  }
  displayAllContacts(searchList);
}
// ? ====================================== delete Contacts ==========================================
function deleteContact(i) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#C62222",
    cancelButtonColor: "#6B7280",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      var deletedPhone = contactsList[i].contactPhone;
      contactsList.splice(i, 1);
      localStorage.setItem("contactsList", JSON.stringify(contactsList));
      for (var j = 0; j < favoriteList.length; j++) {
        if (favoriteList[j].contactPhone === deletedPhone) {
          favoriteList.splice(j, 1);
          break;
        }
      }
      localStorage.setItem("favoriteList", JSON.stringify(favoriteList));
      for (var k = 0; k < emergencyList.length; k++) {
        if (emergencyList[k].contactPhone === deletedPhone) {
          emergencyList.splice(k, 1);
          break;
        }
      }
      localStorage.setItem("emergencyList", JSON.stringify(emergencyList));
      displayAllContacts(contactsList);
      displayFavorites(favoriteList);
      displayEmergency(emergencyList);
      dispalayMainHeaderContant();
      if (result.isConfirmed)
        Swal.fire({
          title: "Deleted!",
          text: "Contant has been deleted successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
    }
  });
}
// ? ====================================== update Contacts ==========================================
var updatedContactIndex;
function setFormForUpdate(i) {
  updatedContactIndex = i;
  fullNameInput.value = contactsList[i].contactName;
  phoneNumInput.value = contactsList[i].contactPhone;
  emailInput.value = contactsList[i].contactEmail;
  addressInput.value = contactsList[i].contactAddress;
  groupInput.value = contactsList[i].contactGroup;
  notesInput.value = contactsList[i].contactNotes;
  addContactModal.show();
}

function updateContact(updatedContactIndex) {
  contactsList[updatedContactIndex].contactName = fullNameInput.value;
  contactsList[updatedContactIndex].contactPhone = phoneNumInput.value;
  contactsList[updatedContactIndex].contactEmail = emailInput.value;
  contactsList[updatedContactIndex].contactAddress = addressInput.value;
  contactsList[updatedContactIndex].contactGroup = groupInput.value;
  contactsList[updatedContactIndex].contactNotes = notesInput.value;
  localStorage.setItem("contactsList", JSON.stringify(contactsList));
  displayAllContacts(contactsList);
  displayFavorites(favoriteList);
  displayEmergency(emergencyList);
  clearForm();
  addContactModal.hide();
  Swal.fire({
    icon: "success",
    title: "updated !",
    text: "Contant has been updated successfully",
    showConfirmButton: false,
    timer: 1500,
  });
}
// ? ====================================== Favorites ==========================================
function addToFavorites(i) {
  var index = -1;
  for (var j = 0; j < favoriteList.length; j++) {
    if (favoriteList[j].contactPhone === contactsList[i].contactPhone) {
      index = j;
      break;
    }
  }
  if (index !== -1) {
    favoriteList.splice(index, 1);
  } else {
    favoriteList.push(contactsList[i]);
  }

  localStorage.setItem("favoriteList", JSON.stringify(favoriteList));

  displayFavorites(favoriteList);
  displayAllContacts(contactsList);
  dispalayMainHeaderContant();
}
function isFav(contact) {
  for (var i = 0; i < favoriteList.length; i++) {
    if (favoriteList[i].contactPhone === contact.contactPhone) {
      return true;
    }
  }
  return false;
}
function displayFavorites(list) {
  var container = `<header class="d-flex gap-2 align-items-center p-2 rounded-3">
          <div class="icon-wraapper bg-mix-yellow text-white rounded-3">
          <i class="fa fa-star fs-6 m-2"></i></div>
      <div class="content-wrapper">
        <p class="fw-bold m-0 fw-semibold">Favorites</span></p>
        <p class="text-gray-light-color font-size-12 ">Quick access</p>
      </header>`;
  for (var i = 0; i < list.length; i++) {
    container += `
      <div class="p-2 row g-3">
        <div>
          <div class="d-flex align-items-center border p-2 rounded-3 Favorite-item">
              <span class="icon bg-pink rounded-3 text-white p-2 fw-semibold me-2">${list[i].contactName[0].toUpperCase()}</span>
              <div class="content-wrapper">
              <h3 class="text-black fs-6 m-0">${list[i].contactName}</h3>
              <div>
              <span class="text-gray-light-color font-size-14">${list[i].contactPhone}</span>
            </div>
              </div>
              <button class="icon-wrapper p-1 rounded-3 me-1 ms-auto border-0">
                  <a href=tel:${list[i].contactPhone}><i class="fa fa-phone font-size-14"></i></a>
              </button> 
            </div>
        </div>
      </div>
        `;
  }
  Favorites.innerHTML = container;
}
displayFavorites(favoriteList);
// ? ====================================== Emergency ==========================================
function addToEmergency(i) {
  var index = -1;
  for (var j = 0; j < emergencyList.length; j++) {
    if (emergencyList[j].contactPhone === contactsList[i].contactPhone) {
      index = j;
      break;
    }
  }
  if (index !== -1) {
    emergencyList.splice(index, 1);
  } else {
    emergencyList.push(contactsList[i]);
  }
  localStorage.setItem("emergencyList", JSON.stringify(emergencyList));
  displayEmergency(emergencyList);
  displayAllContacts(contactsList);
  dispalayMainHeaderContant();
}
function isEmergency(contact) {
  for (var i = 0; i < emergencyList.length; i++) {
    if (emergencyList[i].contactPhone === contact.contactPhone) {
      return true;
    }
  }
  return false;
}
function displayEmergency(list) {
  var container = `
      <header class="d-flex gap-2 align-items-center p-2 rounded-3">
        <div class="icon-wraapper bg-danger text-white rounded-3">
          <i class="fa fa-heart-pulse fs-6 m-2"></i>
        </div>
        <div class="content-wrapper">
          <p class="fw-bold m-0 fw-semibold">Emergency</p>
          <p class="text-gray-light-color font-size-12">Urgent contacts</p>
        </div>
      </header>
      <div class="p-2 row g-3">`;

  for (var i = 0; i < list.length; i++) {
    container += `
        <div>
          <div class="d-flex align-items-center border p-2 rounded-3 Emergency-item">
              <span class="icon bg-pink rounded-3 text-white p-2 fw-semibold me-2">${list[i].contactName[0].toUpperCase()}</span>
              <div class="content-wrapper">
                <h3 class="text-black fs-6 m-0">${list[i].contactName}</h3>
                <div>
                  <span class="text-gray-light-color font-size-14">${list[i].contactPhone}</span>
                </div>
              </div>
              <button class="icon-wrapper p-1 rounded-3 me-1 ms-auto border-0">
                  <a href="tel:${list[i].contactPhone}><i class="fa fa-phone font-size-14"></i></a>
              </button> 
          </div>
        </div>
        `;
  }

  container += `</div>`;
  Emergency.innerHTML = container;
}
displayEmergency(emergencyList);
// ? ====================================== clear ==========================================
function clearForm() {
  fullNameInput.value = null;
  phoneNumInput.value = null;
  emailInput.value = null;
  groupInput.value = null;
  emergencyInput.value = null;
  addContactBtn.value = null;
  updatedContactIndex = null;
  fullNameInput.classList.remove("is-invalid");
  fullNameInput.classList.remove("is-valid");
  phoneNumInput.classList.remove("is-valid");
  phoneNumInput.classList.remove("is-invalid");
  emailInput.classList.remove("is-invalid");
  emailInput.classList.remove("is-valid");
}
// ? ====================================== regex ==========================================
function validateContactName() {
  var nameRegex = /^[A-Z][a-zA-Z]{2,6}$/;
  var nameValue = fullNameInput.value.trim();
  if (nameRegex.test(nameValue) === true) {
    fullNameInput.classList.remove("is-invalid");
    fullNameInput.classList.add("is-valid");
    return true;
  } else {
    fullNameInput.classList.remove("is-valid");
    fullNameInput.classList.add("is-invalid");
    return false;
  }
}
function validateContactPhone() {
  var phoneRegex = /^01(0|1|2|5){1}[0-9]{8}$/;
  var phoneValue = phoneNumInput.value.trim();
  if (phoneRegex.test(phoneValue) === true) {
    phoneNumInput.classList.remove("is-invalid");
    phoneNumInput.classList.add("is-valid");
    return true;
  } else {
    phoneNumInput.classList.remove("is-valid");
    phoneNumInput.classList.add("is-invalid");
    return false;
  }
}
function validateContactEmail() {
  var emailRegex = /^[a-z]{1,}@gmail.com$/;
  var emailValue = emailInput.value.trim();
  if (emailRegex.test(emailValue) === true) {
    emailInput.classList.remove("is-invalid");
    emailInput.classList.add("is-valid");
    return true;
  } else {
    emailInput.classList.remove("is-valid");
    emailInput.classList.add("is-invalid");
    return false;
  }
}
