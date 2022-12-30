// Storage Controller
const StorageCtrl = (function(){
    
    // Public methods
    return {
      storeItem: function(item){
        let items;

        // Checking if there are any items in Local Storage
        if(localStorage.getItem('items') === null){
          items = [];

          // Pushing the new item
          items.push(item);

          // Seting Local Storage
          localStorage.setItem('items', JSON.stringify(items));

        } else {

          // Getting what is already in Local Storage
          items = JSON.parse(localStorage.getItem('items'));
  
          // Pushing the new item
          items.push(item);
  
          // Resetting Local Storage
          localStorage.setItem('items', JSON.stringify(items));

        }
      },

      getItemsFromStorage: function(){
        let items;
        if(localStorage.getItem('items') === null){
          items = [];
        } else {
          items = JSON.parse(localStorage.getItem('items'));
        }
        return items;
      },

      updateItemStorage: function(updatedItem){
        let items = JSON.parse(localStorage.getItem('items'));
  
        items.forEach(function(item, index){
          if(updatedItem.id === item.id){
            items.splice(index, 1, updatedItem);
          }
        });
        localStorage.setItem('items', JSON.stringify(items));
      },

      deleteItemFromStorage: function(id){
        let items = JSON.parse(localStorage.getItem('items'));
        
        items.forEach(function(item, index){
          if(id === item.id){
            items.splice(index, 1);
          }
        });
        localStorage.setItem('items', JSON.stringify(items));
      },

      clearItemsFromStorage: function(){
        localStorage.removeItem('items');
      }
    }
  })();
  
  
  // Item Controller
  const ItemCtrl = (function(){

    // Item Constructor
    const Item = function(id, name, calories){
      this.id = id;
      this.name = name;
      this.calories = calories;
    }
  
    // Data Structure / State
    const data = {
      // items: [
      //   // {id: 0, name: 'Steak Dinner', calories: 1200},
      //   // {id: 1, name: 'Cookie', calories: 400},
      //   // {id: 2, name: 'Eggs', calories: 300}
      // ],
      items: StorageCtrl.getItemsFromStorage(),
      currentItem: null,
      totalCalories: 0
    }
  
    // Public methods
    return {
      getItems: function(){
        return data.items;
      },

      addItem: function(name, calories){
        let ID;

        // Creating ID
        if(data.items.length > 0){
          ID = data.items[data.items.length - 1].id + 1;
        } else {
          ID = 0;
        }
  
        // Calories to Number
        calories = parseInt(calories);
  
        // Create new item
        newItem = new Item(ID, name, calories);
  
        // Add to items array
        data.items.push(newItem);
  
        return newItem;
      },

      getItemById: function(id){
        let found = null;
        // Looping through items
        data.items.forEach(function(item){
          if(item.id === id){
            found = item;
          }
        });
        return found;
      },

      updateItem: function(name, calories){
        // Calories to Number
        calories = parseInt(calories);
  
        let found = null;
  
        data.items.forEach(function(item){
          if(item.id === data.currentItem.id){
            item.name = name;
            item.calories = calories;
            found = item;
          }
        });
        return found;
      },

      deleteItem: function(id){
        // Getting IDs
        const ids = data.items.map(function(item){
          return item.id;
        });
  
        // Getting index
        const index = ids.indexOf(id);
  
        // Removing item
        data.items.splice(index, 1);
      },

      clearAllItems: function(){
        data.items = [];
      },

      setCurrentItem: function(item){
        data.currentItem = item;
      },

      getCurrentItem: function(){
        return data.currentItem;
      },

      getTotalCalories: function(){
        let total = 0;
  
        // Looping through items and adding calories
        data.items.forEach(function(item){
          total += item.calories;
        });
  
        // Setting total calories in the data structure
        data.totalCalories = total;
  
        // Returning the total calories
        return data.totalCalories;
      },

      logData: function(){
        return data;
      }
    }
  })();
  
  
  
  // Setting up UI Controller with UI selectors
  const UICtrl = (function(){
    const UISelectors = {
      itemList: '#item-list',
      listItems: '#item-list li',
      addBtn: '.add-btn',
      updateBtn: '.update-btn',
      deleteBtn: '.delete-btn',
      backBtn: '.back-btn',
      clearBtn: '.clear-btn',
      itemNameInput: '#item-name',
      itemCaloriesInput: '#item-calories',
      totalCalories: '.total-calories'
    }
    
    // Public methods
    return {
      populateItemList: function(items){
        let html = '';
  
        items.forEach(function(item){
          html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>`;
        });
  
        // Inserting list items
        document.querySelector(UISelectors.itemList).innerHTML = html;
      },

      getItemInput: function(){
        return {
          name:document.querySelector(UISelectors.itemNameInput).value,
          calories:document.querySelector(UISelectors.itemCaloriesInput).value
        }
      },

      addListItem: function(item){
        // Showing the list
        document.querySelector(UISelectors.itemList).style.display = 'block';

        // Creating li element
        const li = document.createElement('li');

        // Add class
        li.className = 'collection-item';

        // Adding ID
        li.id = `item-${item.id}`;

        // Adding HTML
        li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;

        // Inserting item
        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
      },

      updateListItem: function(item){
        let listItems = document.querySelectorAll(UISelectors.listItems);
  
        // Turning node list into array
        listItems = Array.from(listItems);
  
        listItems.forEach(function(listItem){
          const itemID = listItem.getAttribute('id');
  
          if(itemID === `item-${item.id}`){
            document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
          }
        });
      },

      deleteListItem: function(id){
        const itemID = `#item-${id}`;
        const item = document.querySelector(itemID);
        item.remove();
      },

      clearInput: function(){
        document.querySelector(UISelectors.itemNameInput).value = '';
        document.querySelector(UISelectors.itemCaloriesInput).value = '';
      },

      addItemToForm: function(){
        document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
        document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
        UICtrl.showEditState();
      },

      removeItems: function(){
        let listItems = document.querySelectorAll(UISelectors.listItems);
  
        // Turning node list into array
        listItems = Array.from(listItems);
  
        listItems.forEach(function(item){
          item.remove();
        });
      },

      hideList: function(){
        document.querySelector(UISelectors.itemList).style.display = 'none';
      },

      showTotalCalories: function(totalCalories){
        document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
      },

      clearEditState: function(){
        UICtrl.clearInput();
        document.querySelector(UISelectors.updateBtn).style.display = 'none';
        document.querySelector(UISelectors.deleteBtn).style.display = 'none';
        document.querySelector(UISelectors.backBtn).style.display = 'none';
        document.querySelector(UISelectors.addBtn).style.display = 'inline';
      },

      showEditState: function(){
        document.querySelector(UISelectors.updateBtn).style.display = 'inline';
        document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
        document.querySelector(UISelectors.backBtn).style.display = 'inline';
        document.querySelector(UISelectors.addBtn).style.display = 'none';
      },

      getSelectors: function(){
        return UISelectors;
      }
    }
  })();
  
  
  
  // App Controller
  const App = (function(ItemCtrl, StorageCtrl, UICtrl){

    // Loading event listeners
    const loadEventListeners = function(){

      // Getting UI selectors
      const UISelectors = UICtrl.getSelectors();
  
      // Adding item event
      document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
  
      // Disabling submit on enter
      document.addEventListener('keypress', function(e){
        if(e.keyCode === 13 || e.which === 13){
          e.preventDefault();
          return false;
        }
      });
  
      // Editing icon click event
      document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
  
      // Updating item event
      document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
  
      // Deleting item event
      document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
  
       // Backing button event
       document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
  
       // Clearing items event
      document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }
  
    // Adding item submit
    const itemAddSubmit = function(e){

      // Getting form input from UI Controller
      const input = UICtrl.getItemInput();
  
      // Checking for name and calorie input
      if(input.name !== '' && input.calories !== ''){

        // Adding item
        const newItem = ItemCtrl.addItem(input.name, input.calories);
  
        // Adding item to UI list
        UICtrl.addListItem(newItem);
  
        // Getting total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Adding total calories to UI
        UICtrl.showTotalCalories(totalCalories);
  
        //Storing in localStorage
        StorageCtrl.storeItem(newItem);
  
        // Clearing fields
        UICtrl.clearInput();
      }
  
      e.preventDefault();
    }
  
    // Clicking edit item
    const itemEditClick = function(e){
      if(e.target.classList.contains('edit-item')){

        // Getting list item id (item-0, item-1)
        const listId = e.target.parentNode.parentNode.id;
  
        // Breaking into an array
        const listIdArr = listId.split('-');
  
        // Geting the actual id
        const id = parseInt(listIdArr[1]);
  
        // Getting item
        const itemToEdit = ItemCtrl.getItemById(id);
  
        // Setting current item
        ItemCtrl.setCurrentItem(itemToEdit);
  
        // Adding item to form
        UICtrl.addItemToForm();
      }
  
      e.preventDefault();
    }
  
    // Updating item submit
    const itemUpdateSubmit = function(e){

      // Getting item input
      const input = UICtrl.getItemInput();
  
      // Updating item
      const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
  
      // Updating UI
      UICtrl.updateListItem(updatedItem);
  
       // Getting total calories
       const totalCalories = ItemCtrl.getTotalCalories();

       // Adding total calories to UI
       UICtrl.showTotalCalories(totalCalories);
  
       // Updating local storage
       StorageCtrl.updateItemStorage(updatedItem);
  
       UICtrl.clearEditState();
  
      e.preventDefault();
    }
  
    // Deleting button event
    const itemDeleteSubmit = function(e){

      // Getting current item
      const currentItem = ItemCtrl.getCurrentItem();
  
      // Deleting from data structure
      ItemCtrl.deleteItem(clientInformation);
  
      // Deleting from UI
      UICtrl.deleteListItem(currentItem.id);
  
      // Getting total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Adding total calories to UI
      UICtrl.showTotalCalories(totalCalories);
  
      // Deleting from local storage
      StorageCtrl.deleteItemFromStorage(currentItem.id);
  
      UICtrl.clearEditState();
  
      e.preventDefault();
    }
  
  
    // Clearing items event
    const clearAllItemsClick = function(){

      // Deleting all items from the data structure
      ItemCtrl.clearAllItems();
  
      // Getting total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Adding total calories to UI
      UICtrl.showTotalCalories(totalCalories);
  
      // Removing from UI
      UICtrl.removeItems();
  
      // Clearing from local storage
      StorageCtrl.clearItemsFromStorage();
  
      // Hiding UL
      UICtrl.hideList(); 

    }
  
    // Public methods
    return {
      init: function(){
        // Clearing edit state / set initial set
        UICtrl.clearEditState();
  
        // Fetching items from data structure
        const items = ItemCtrl.getItems();
  
        // Checking if any items
        if(items.length === 0){
          UICtrl.hideList();
        } else {
          // Populating list with items
          UICtrl.populateItemList(items);
        }
  
        // Getting total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Adding total calories to UI
        UICtrl.showTotalCalories(totalCalories);
  
        // Loading event listeners
        loadEventListeners();
      }
    }
    
  })(ItemCtrl, StorageCtrl, UICtrl);
  
  // Initializing App
  App.init();