//budgetcontroller
BudgetController = (function () {
  //some code
  var expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  expense.prototype.calcpercentage = function (totalincome) {
    if (totalincome > 0) {
      this.percentage = Math.round((this.value / totalincome) * 100);
    } else {
      this.percentage = -1;
    }
  };
  expense.prototype.getpercentage = function () {
    return this.percentage;
  };
  var income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var calculatetotal = function (type) {
    var sum = 0;
    data.allitems[type].forEach(function (curr) {
      sum += curr.value;
    });
    data.totals[type] = sum;
  };
  var data = {
    allitems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  return {
    addItem: function (type, des, val) {
      var ID, newitem;
      if (data.allitems[type].length > 0) {
        ID = data.allitems[type][data.allitems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      if (type === "exp") {
        newitem = new expense(ID, des, val);
      } else if (type === "inc") {
        newitem = new income(ID, des, val);
      }
      data.allitems[type].push(newitem);
      return newitem;
    },
    deleteitem: function (type, id) {
      var ids;
      ids = data.allitems[type].map(function (curr) {
        return curr.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allitems[type].splice(index, 1);
      }
    },
    calculatebudget: function () {
      calculatetotal("exp");
      calculatetotal("inc");
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getbudget: function () {
      return {
        budget: data.budget,
        percentage: data.percentage,
        totalinc: data.totals.inc,
        totalexp: data.totals.exp,
      };
    },
    calculatepercentages: function () {
      data.allitems.exp.forEach(function (curr) {
        curr.calcpercentage(data.totals.inc);
      });
    },
    getpercentagesfun: function () {
      var allperc = data.allitems.exp.map(function (curr) {
        return curr.getpercentage();
      });
      return allperc;
    },
    testing: function () {
      console.log(data);
    },
  };
})();

//UIcontroller
UIController = (function () {
  //write code
  var DOMstrings = {
    inputtype: ".add__type",
    inputdescription: ".add__description",
    inputvalue: ".add__value",
    inputbtn: ".add__btn",
    incomecontainer: ".income__list",
    expensecontainer: ".expenses__list",
    budgetlabel: ".budget__value",
    incomelabel: ".budget__income--value",
    expenselabel: ".budget__expenses--value",
    expensepercentage: ".budget__expenses--percentage",
    container: ".container",
    exppercent: ".item__percentage",
    datelabel: ".budget__title--month",
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputtype).value,
        description: document.querySelector(DOMstrings.inputdescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputvalue).value),
      };
    },
    deleteitemUI: function (selectorid) {
      var temp = document.getElementById(selectorid);
      temp.parentNode.removeChild(temp);
    },
    addListItem: function (obj, type) {
      //1.create html string with placeholder text
      var html, newHTML, element;
      if (type === "inc") {
        element = DOMstrings.incomecontainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">💲%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensecontainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">$%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //2.replace placeholder with actual data
      newHTML = html.replace("%id%", obj.id);
      newHTML = newHTML.replace("%description%", obj.description);
      newHTML = newHTML.replace("%value%", obj.value);
      //3.insert html to the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHTML);
    },
    clearField: function () {
      var field, fieldarr;
      field = document.querySelectorAll(
        DOMstrings.inputdescription + "," + DOMstrings.inputvalue
      );
      fieldarr = Array.prototype.slice.call(field);
      fieldarr.forEach(function (current, index, array) {
        current.value = "";
      });
      fieldarr[0].focus();
    },
    updatebudgetUI: function (obj) {
      document.querySelector(
        DOMstrings.budgetlabel
      ).textContent = `$${obj.budget}`;
      document.querySelector(
        DOMstrings.incomelabel
      ).textContent = `$${obj.totalinc}`;
      document.querySelector(
        DOMstrings.expenselabel
      ).textContent = `$${obj.totalexp}`;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.expensepercentage).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.expensepercentage).textContent =
          "---";
      }
    },
    displaypercentages: function (perc) {
      var fileds = document.querySelectorAll(DOMstrings.exppercent);
      var nodelistforeach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };
      nodelistforeach(fileds, function (current, index) {
        if (perc[index] > 0) {
          current.textContent = perc[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },
    displaymonth: function () {
      var now, year, mon, monlist;
      now = new Date();
      monlist = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JULY",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
      mon = now.getMonth();
      year = now.getFullYear();
      var name = prompt("Enter your Name");
      document.querySelector(DOMstrings.datelabel).textContent =
        "Hello, " + name + " Available Budget in " + monlist[mon] + " " + year;
    },
    getdomstrings: function () {
      return DOMstrings;
    },
  };
})();

//controller
controller = (function (budgetcntrl, uicntrl) {
  //write code
  var setupeventlisterner = function () {
    var DOM = uicntrl.getdomstrings();
    document
      .querySelector(DOM.inputbtn)
      .addEventListener("click", cntrladditem);

    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        cntrladditem();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener("click", cntrldeleteitem);
  };
  var updatebudget = function () {
    budgetcntrl.calculatebudget();
    var budget = budgetcntrl.getbudget();
    uicntrl.updatebudgetUI(budget);
    //console.log(budget);
  };
  var updatepercentages = function () {
    // body...
    budgetcntrl.calculatepercentages();
    var p = budgetcntrl.getpercentagesfun();
    uicntrl.displaypercentages(p);
    console.log(p);
  };
  cntrladditem = function () {
    // 1.getinput
    var input = uicntrl.getInput();
    var newitem;
    //2.adding items to budgetlist
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      newitem = BudgetController.addItem(
        input.type,
        input.description,
        input.value
      );
      //3.add newitem to UI
      uicntrl.addListItem(newitem, input.type);
      //4.clear the inputs in UI
      uicntrl.clearField();

      updatebudget();
      updatepercentages();
    } else {
      alert("Enter Correct inputs");
    }
  };
  cntrldeleteitem = function (e) {
    var Itemid, splitid, type, id;
    Itemid = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if (Itemid) {
      splitid = Itemid.split("-");
      type = splitid[0];
      id = parseInt(splitid[1]);
      budgetcntrl.deleteitem(type, id);
      uicntrl.deleteitemUI(Itemid);
      updatebudget();
    }
  };
  return {
    init: function () {
      console.log("Application Started");
      uicntrl.displaymonth();
      uicntrl.updatebudgetUI({
        budget: 0,
        totalinc: 0,
        totalexp: 0,
        percentage: -1,
      });
      setupeventlisterner();
    },
  };
})(BudgetController, UIController);
//initiation
controller.init();
