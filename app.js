// Storage Controller


// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    items: [
      // { id: 0, name: 'Steak Dinner', calories: 1200 },
      // { id: 1, name: 'Cookies', calories: 400 },
      // { id: 2, name: 'Eggs', calories: 300 }
    ],
    currentItem: null,
    totalCalories: 0
  }

  // Public Methods
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      // Create ID
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new Item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },

    getItemById: function (id) {
      let found = null;
      // Loop through items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    getTotalCalories: function () {
      let total = 0;

      // Loop through items and add cals
      data.items.forEach(function (item) {
        total += item.calories;
      });

      // Set total cal in Data Structure
      data.totalCalories = total;

      // Return total
      return data.totalCalories;
    },

    logData: function () {
      return data;
    }
  }
})();



// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  // Public Methods 
  return {
    populateItemList: function (items) {
      let html = '';

      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
          </li>`
      });

      // Insert List Item
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function (item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li Element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item',
        // Add ID
        li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;

      // Insert Item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },

    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    getSelectors: function () {
      return UISelectors;
    }
  }
})();



// App Controller
const App = (function (ItemCtrl, UICtrl) {
  // Load Event Listeners
  const loadEventListeners = function () {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Edit item Event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
  }

  // Add item Submit
  const itemAddSubmit = function (e) {
    // Get form input from UICtrl
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if (input.name !== '' && input.calories !== '') {
      // Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add Item to UI List
      UICtrl.addListItem(newItem);

      // Get Tolal Calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add Total Calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Clear Fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Update item Submit
  const itemUpdateSubmit = function (e) {
    if (e.target.classList.contains('edit-item')) {
      // Get List item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;

      // Break into an Array
      const listIdArr = listId.split('-');

      // Get the Actual ID
      const id = parseInt(listIdArr[1]);

      // Get Item to Edit
      const itemToEdit = ItemCtrl.getItemById(id);

      ItemCtrl.setCurrentItem(itemToEdit);
    }
    e.preventDefault();
  }

  // Public methods
  return {
    init: function () {
      // Clear Edit Fields / Set Initial state
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if Any Items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with item
        UICtrl.populateItemList(items);
      }

      // The next two lines of code is done for Local Storage. Since data will persist once we use LS, we want the total Calories to be calculated and displayed in the UI as soon as the app is Opened.

      // Get Tolal Calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add Total Calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event Listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);

// Initialize App
App.init();