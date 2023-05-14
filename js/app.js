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
    if (localStorage.getItem("crudData") !== null) return true;
    else return false;
  },
};

const dataPusher = (evt) => {
  evt.preventDefault();
  let formData = new FormData(form);

  for (let [key, value] of formData.entries()) {
    if (!value) {
      evt.preventDefault();
      return false;
    } else {
      crudDataArr.push({
        count: crudDataArr.length,
        name: formData.get("name"),
      });

      localStorage.setItem("crudData", JSON.stringify(crudDataArr));
      form.reset();
      dataViewer();

      break;
    }
  }
};

const dataViewer = () => {
  crudDataArr = JSON.parse(localStorage.getItem("crudData")) || [];

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
      `<li class="crud-result__item shadow">
          <div class="row">
            <div class="col-sm-8 mb-3 mb-sm-0">
              <div class="crud-result__item--content">
                <p class="text-crud-blue-d m-0">
                  ${item.name}
                </p>
              </div>
            </div>
        
            <div class="col-sm-4">
              <div class="crud-result__item--action">
                <div class="row gx-2">
                  <div class="col-6">
                    <button class="btn btn__action edit"
                      data-count="${index}"
                      data-bs-toggle="modal" 
                      data-bs-target="#editModal">
                      Edit
                    </button>
                  </div>
                  <div class="col-6">
                    <button class="btn btn__action delete"
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

  for (let [key, value] of formData.entries()) {
    if (!value) {
      evt.preventDefault();
      return false;
    } else {
      crudDataArr[selectedIndex].name = value;

      localStorage.setItem("crudData", JSON.stringify(crudDataArr));
      formEdit.reset();
      dataViewer();
      bsModal.hide();
    }
  }
};

const dataRemover = (evt) => {
  let target = evt.currentTarget;
  let targetCount = +target.dataset.count;

  crudDataArr.splice(targetCount, 1);
  localStorage.setItem("crudData", JSON.stringify(crudDataArr));
  crudDataArr = JSON.parse(localStorage.getItem("crudItem"));
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
