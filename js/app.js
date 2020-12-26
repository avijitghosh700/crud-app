let form = document.querySelector("#crud-form");
let formEdit = document.querySelector('#crud-form-edit');
let crudResultList = document.querySelector('#crud-result-list');
let crudDataArr = [];
let selectedIndex = null;
let bsModal = new bootstrap.Modal(document.querySelector("#editModal"), { keyboard: true });

let localStorageCheck = {
  get: function() {
    let test = "test";
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } 
    catch (e) {
      return false;
    }
  },
};

let localStorageItemCheck = {
  get: () => {
    if (localStorage.getItem('crudData') !== null) return true;
    else return false;
  }
}

let dataPusher = (evt) => {
  evt.preventDefault();
  let formData = new FormData(form);

  for (let [key, value] of formData.entries()) {
    if (!value) {
      evt.preventDefault();
      return false;
    } 
    else {
      crudDataArr.push({
        count: crudDataArr.length,
        name: value,
      });
      
      localStorage.setItem("crudData", JSON.stringify(crudDataArr));
      form.reset();
      dataViewer();
      console.log(`${key}: ${value}`);
      console.log(crudDataArr);
    }
  }
};

let dataViewer = () => {
  crudDataArr = JSON.parse(localStorage.getItem('crudData')) || [];
  console.log(crudDataArr);
  
  if (crudDataArr != false) { // I need falsy value when the array is empty. e.g [] == false -> True || [] === false -> false
    crudResultList.innerHTML = '';
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
  }
  else {
    crudResultList.innerHTML = '';
    crudResultList.insertAdjacentHTML(
      "beforeend",
      `<li class="text-center p-5">
        <h2 class="heading heading__primary m-0">
          Record is empty
        </h2>
      </li>`
    );
  }
}

let dataSelected = (evt) => {
  let target = evt.currentTarget;
  selectedIndex = +target.dataset.count;
  let updateField = document.querySelector('[name="updated_name"]');
  let selectedName = crudDataArr[selectedIndex].name;

  updateField.value = selectedName;
  console.log(selectedName, crudDataArr[selectedIndex]);
}

let dataUpdate = (evt) => {
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
      console.log(crudDataArr);
    }
  }
}

let dataRemover = (evt) => {
  let target = evt.currentTarget;
  let targetCount = +(target.dataset.count);

  crudDataArr.splice(targetCount, 1);
  localStorage.setItem('crudData', JSON.stringify(crudDataArr));
  crudDataArr = JSON.parse(localStorage.getItem('crudItem'));
  dataViewer();
  
  console.log(targetCount);
}

form.addEventListener("submit", (evt) => {
  if (localStorageCheck) {
    dataPusher(evt);
  }
  else
    console.log('Not supported.');
});

formEdit.addEventListener('submit', (evt) => {
  if (localStorageCheck) {
    dataUpdate(evt)
  }
  else {
    console.log('Not Supported.');
  }
});

// Update the view on load
(() => {
  if (localStorageCheck && localStorageItemCheck) {
    dataViewer();
  }
  else {
    console.log('Not supported.');
  }
})();

// Listening for event from dynamically added DOM elements on load
window.onload = () => {
  // Collecting dynamically added DOM elements on load
  let deleteBtn = document.querySelectorAll('.delete');
  let editBtn = document.querySelectorAll('.edit');
  // END
  
  deleteBtn.forEach((item, index) => {
    // console.log(item);
    item.addEventListener('click', (evt) => {
      dataRemover(evt);
    });
  });

  editBtn.forEach((item, index) => {
    item.addEventListener('click', (evt) => {
      dataSelected(evt);
    });
  });
}

// Using MutationObserver API to listen for immediate DOM changes
let mutationObserver = new MutationObserver((mutations) => {
  let deleteBtn = document.querySelectorAll('.delete');
  let editBtn = document.querySelectorAll('.edit');
  
  console.log(mutations);
  deleteBtn.forEach((item, index) => {
    // console.log(item);
    item.addEventListener('click', (evt) => {
      dataRemover(evt);
    });
  });

  editBtn.forEach((item, index) => {
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
  characterDataOldValue: true
});

// mutationObserver.disconnect();