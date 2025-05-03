// Bootstrap modal instance
const bsModal = new bootstrap.Modal(document.querySelector("#editModal"), {
  keyboard: true,
});

const form = document.querySelector("#crud-form");
const formEdit = document.querySelector("#crud-form-edit");
const crudResultList = document.querySelector("#crud-result-list");

// Raw internal array
let _crudDataArr = [];

// Proxy to observe changes
const crudDataArr = new Proxy(_crudDataArr, {
  set(target, property, value) {
    target[property] = value;
    localStorage.setItem("todos", JSON.stringify(target));
    dataViewer();
    return true;
  },
  deleteProperty(target, property) {
    delete target[property];
    localStorage.setItem("todos", JSON.stringify(target));
    dataViewer();
    return true;
  },
});

let selectedData = null;

const localStorageCheck = {
  get isSupported() {
    return typeof Storage !== "undefined";
  },
  get isPresent() {
    return localStorage.getItem("todos") !== null;
  },
};

const dataPusher = (evt) => {
  evt.preventDefault();
  let formData = new FormData(form);

  for (let [__, value] of formData.entries()) {
    if (!value) {
      return false;
    } else {
      crudDataArr.push({
        done: false,
        id: self.crypto.randomUUID(),
        name: formData.get("task"),
      });

      form.reset();
    }
  }
};

const dataViewer = () => {
  crudResultList.innerHTML = "";

  if (!_crudDataArr.length) {
    crudResultList.insertAdjacentHTML(
      "beforeend",
      `<li class="text-center p-5">
        <h2 class="heading heading__primary m-0">
          Record is empty
        </h2>
      </li>`
    );
    return;
  }

  _crudDataArr.forEach((item) => {
    crudResultList.insertAdjacentHTML(
      "beforeend",
      `<li class="crud-result__item ${
        item.done ? "crud-result__item--done" : ""
      } shadow">
        <div class="row gx-2">
          <div class="col-7 mb-3 mb-sm-0">
            <div class="crud-result__content">
              <p class="text-crud-blue-d text-break text-truncate m-0">
                ${item.name}
              </p>
            </div>
          </div>
          <div class="col">
            <div class="crud-result__action">
              <div class="row g-2">
                <div class="col">
                  <button type="button" class="btn btn__action edit"
                    data-uuid="${item.id}"
                    data-bs-toggle="modal" 
                    data-bs-target="#editModal">
                    Edit
                  </button>
                </div>
                <div class="col">
                  <button type="button" class="btn btn__action done"
                    data-uuid="${item.id}">
                    ${item.done ? "Undone" : "Done"}
                  </button>
                </div>
                <div class="col">
                  <button type="button" class="btn btn__action delete"
                    data-uuid="${item.id}">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>`
    );
  });

  initializeEventHandlers();
};

const dataSelected = (evt) => {
  let target = evt.currentTarget;
  let updateField = document.querySelector('[name="updated_name"]');
  selectedData = _crudDataArr.find((item) => item.id === target.dataset.uuid);
  updateField.value = selectedData.name;
};

const dataUpdate = (evt) => {
  evt.preventDefault();
  const formData = new FormData(formEdit);

  for (let [__, value] of formData.entries()) {
    if (!value) {
      evt.preventDefault();
      return false;
    } else {
      selectedData.name = value;
      localStorage.setItem("todos", JSON.stringify(_crudDataArr));
      formEdit.reset();
      dataViewer();
      bsModal.hide();
    }
  }
};

const dataDone = (evt) => {
  const target = evt.currentTarget;
  const item = _crudDataArr.find((i) => i.id === target.dataset.uuid);
  item.done = !item.done;
  localStorage.setItem("todos", JSON.stringify(_crudDataArr));
  dataViewer();
};

const dataRemover = (evt) => {
  const target = evt.currentTarget;
  const index = _crudDataArr.findIndex((i) => i.id === target.dataset.uuid);
  if (index !== -1) crudDataArr.splice(index, 1);
};

form.addEventListener("submit", (evt) => {
  if (localStorageCheck.isSupported) dataPusher(evt);
  else throw new Error("localStorage is empty.");
});

formEdit.addEventListener("submit", (evt) => {
  if (localStorageCheck.isSupported) dataUpdate(evt);
  else throw new Error("localStorage is empty.");
});

const initializeEventHandlers = () => {
  document.querySelectorAll(".delete").forEach((item) => {
    item.onclick = dataRemover;
  });
  document.querySelectorAll(".done").forEach((item) => {
    item.onclick = dataDone;
  });
  document.querySelectorAll(".edit").forEach((item) => {
    item.onclick = dataSelected;
  });
};

// On window load
window.onload = () => {
  if (localStorageCheck.isSupported && localStorageCheck.isPresent) {
    const saved = JSON.parse(localStorage.getItem("todos")) || [];
    _crudDataArr.push(...saved);
    dataViewer();
  } else if (localStorageCheck.isSupported) {
    localStorage.setItem("todos", JSON.stringify([]));
  } else {
    throw new Error("localStorage not supported.");
  }
};
