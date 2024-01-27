const bsModal = new bootstrap.Modal(document.querySelector("#editModal"), { keyboard: true });

const form = document.querySelector("#crud-form");
const formEdit = document.querySelector("#crud-form-edit");
const crudResultList = document.querySelector("#crud-result-list");

let crudDataArr = [];
let selectedIndex = null;

const localStorageCheck = {
  get isSupported() {
    if (typeof Storage !== "undefined") return true;
    else return false;
  },
  get isPresent() {
    if (localStorage.getItem("todos") !== null) return true;
    else return false;
  },
};

const dataPusher = (evt) => {
  evt.preventDefault();
  let formData = new FormData(form);

  for (let [key, value] of formData.entries()) {
    if (!value) {
      return false;
    } else {
      crudDataArr.push({
        done: false,
        count: crudDataArr.length,
        name: formData.get("task"),
      });

      localStorage.setItem("todos", JSON.stringify(crudDataArr));
      form.reset();
      dataViewer();
    }
  }
};

const dataViewer = () => {
  crudDataArr = JSON.parse(localStorage.getItem("todos")) || [];

  crudResultList.innerHTML = "";

  if (!crudDataArr.length) {
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

  crudDataArr.forEach((item, index) => {
    crudResultList.insertAdjacentHTML(
      "beforeend",
      `<li class="crud-result__item ${item.done ? "crud-result__item--done" : ""} shadow">
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
                      data-count="${index}"
                      data-bs-toggle="modal" 
                      data-bs-target="#editModal">
                      Edit
                    </button>
                  </div>
                  <div class="col">
                    <button type="button" class="btn btn__action done"
                      data-count="${index}">
                      ${item.done ? "Undone" : "Done"}
                    </button>
                  </div>
                  <div class="col">
                    <button type="button" class="btn btn__action delete"
                      data-count="${index}">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li> `
    );
  });
};

const dataSelected = (evt) => {
  let target = evt.currentTarget;
  selectedIndex = +target.dataset.count;
  let updateField = document.querySelector('[name="updated_name"]');
  let selectedName = crudDataArr[selectedIndex].name;

  updateField.value = selectedName;
};

const dataUpdate = (evt) => {
  evt.preventDefault();
  let formData = new FormData(formEdit);

  for (let [__, value] of formData.entries()) {
    if (!value) {
      evt.preventDefault();
      return false;
    } else {
      crudDataArr[selectedIndex].name = value;

      localStorage.setItem("todos", JSON.stringify(crudDataArr));
      formEdit.reset();
      dataViewer();
      bsModal.hide();
    }
  }
};

const dataDone = (evt) => {
  const target = evt.currentTarget;
  const targetIndex = +target.dataset.count;

  crudDataArr[targetIndex].done = !crudDataArr[targetIndex].done;
  localStorage.setItem("todos", JSON.stringify(crudDataArr));

  dataViewer();
};

const dataRemover = (evt) => {
  const target = evt.currentTarget;
  const targetCount = +target.dataset.count;

  crudDataArr.splice(targetCount, 1);
  localStorage.setItem("todos", JSON.stringify(crudDataArr));

  dataViewer();
};

form.addEventListener("submit", (evt) => {
  if (localStorageCheck.isSupported) dataPusher(evt);
  else throw new Error("localStorage is empty.");
});

formEdit.addEventListener("submit", (evt) => {
  if (localStorageCheck.isSupported) dataUpdate(evt);
  else throw new Error("localStorage is empty.");
});

// Using MutationObserver API to listen for immediate DOM changes
const mutationObserver = new MutationObserver(() => {
  let deleteBtn = document.querySelectorAll(".delete");
  let editBtn = document.querySelectorAll(".edit");
  let doneBtn = document.querySelectorAll(".done");

  deleteBtn.forEach((item) => {
    item.addEventListener("click", (evt) => {
      dataRemover(evt);
    });
  });

  doneBtn.forEach((item) => {
    item.addEventListener("click", (evt) => {
      dataDone(evt);
    });
  });

  editBtn.forEach((item) => {
    item.addEventListener("click", (evt) => {
      dataSelected(evt);
    });
  });
});

mutationObserver.observe(crudResultList, {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true,
});
// mutationObserver.disconnect();

// Listening for event from dynamically added DOM elements on load
window.onload = () => {
  // Collecting dynamically added DOM elements on load
  let deleteBtn = document.querySelectorAll(".delete");
  let editBtn = document.querySelectorAll(".edit");
  // END

  if (localStorageCheck.isSupported && localStorageCheck.isPresent) dataViewer();
  else throw new Error("localStorage not supported.");

  deleteBtn.forEach((item) => {
    item.addEventListener("click", (evt) => {
      dataRemover(evt);
    });
  });

  editBtn.forEach((item) => {
    item.addEventListener("click", (evt) => {
      dataSelected(evt);
    });
  });
};
