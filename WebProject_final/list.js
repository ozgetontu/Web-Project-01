$(document).ready(function () {
  var taskdata = JSON.parse(localStorage.getItem('taskdata')) || [];
  var lastLiIndex = parseInt(localStorage.getItem('lastLiIndex')) || 0;
  var previousMid = null;

  taskdata.forEach(function (gorev, index) {
    var $newLi = $("<li><div>" + gorev + "</div></li>");
    $("#middle").append($newLi);

    if (index === lastLiIndex) {
      $newLi.css({
        'border-left': '5px solid rgb(181, 16, 181)',
        'margin-left': '-35px'
      });
    }
  });

  var listGizliDurumu = localStorage.getItem('listGizliDurumu');
  if (listGizliDurumu === 'gizli') {
    $("#list").css("display", "none");
    $("#list1").css("display", "block");
  } else {
    $("#list").css("display", "block");
    $("#list1").css("display", "none");
  }

  $("#new").click(function () {
    $("#newtask1").css("display", "block");
  });

  $("#cancel").click(function () {
    $("#newtask1").css("display", "none");
  });

  $("#text1").keypress(function (e) {
    if (e.which === 13) { // Enter
      addtask();
    }
  });

  $("#members").click(function () {
    $("#list").css("display", "block");
    $("#list1").css("display", "none");
    var listGizliDurumu = $("#list").css("display") === "none" ? 'gizli' : 'görünür';
    localStorage.setItem('listGizliDurumu', listGizliDurumu);
  });

  $("#members").on("click", function () {
    $(this).css({
      'border-left': '5px solid rgb(181, 16, 181)',
      'margin-left': '1'
    });
    $("li").css({
      "border-left": "none",
      'margin-left': '-30px'
    });
  });

  $(document).on("click", function (event) {
    if (!$(event.target).closest("#members").length) {
      $("#members").css({
        "border-left": "none",
        'margin-left': '1'
      });
    }
  });

  $("#first").click(function () {
    addtask();
  });

  
  function addtask() {
    var inputValue = $("#text1").val() + "<img src='./images/garbage (1).png' >";
    if (inputValue.trim() !== "") {
        // add
        var $newLi = $("<li><div>" + inputValue +"</div></li>" );
         $("#list1 h1").remove();
        $("#middle").append($newLi);
        var $newH1 = $("<h1>" + $("#text1").val() + "</h1>");
        $("#list1").append($newH1);

        // clear input text
        $("#text1").val("");

        // görevleri localStorage'a ekle
        taskdata.push(inputValue);
        localStorage.setItem('taskdata', JSON.stringify(taskdata));
        $("#list").css("display", "none");
        $("#list1").css("display", "block");
        $("#newtask1").css("display", "none");

        // gizli durumu localStorage'a ekle
        var listGizliDurumu = $("#list").css("display") === "none" ? 'gizli' : 'görünür';
        localStorage.setItem('listGizliDurumu', listGizliDurumu);

        // Tüm li'lerden stilini kaldır
        $("li").css({
            'border-left': 'none',
            'margin-left': '-30px'
        });

        // En son eklenen li'ye özel stil ekle
        $newLi.css({
            'border-left': '5px solid rgb(181, 16, 181)',
            'margin-left': '-35px'
        });

        // En son eklenen li'nin indeksini kaydet
        lastLiIndex = $newLi.index();
        localStorage.setItem('lastLiIndex', lastLiIndex);
    }
}

  $("ul").on("click", "li", function (e) {
    var $clickedLi = $(this);
    $("li").css({
      'border-left': 'none',
      'margin-left': '-30px'
    });
    $clickedLi.css({
      'border-left': '5px solid rgb(181, 16, 181)',
      'margin-left': '-35px'
    });
    lastLiIndex = $clickedLi.index();
    localStorage.setItem('lastLiIndex', lastLiIndex);

    var liText = $clickedLi.find("div").text();
    var $newTitle = $("<h1 id='dynamicTitle'>" + liText + "</h1>");
    $("#list1 h1").remove();
    $("#list1").prepend($newTitle);

    if (previousMid !== null) {
      previousMid.remove();
    }

    var $newDiv = $("<div class='mid'></div>");
    var $newCheckbox = $('<input type="checkbox" size="10">');
    $newDiv.append($newCheckbox);
    var $newLabel = $('<label>' + liText + '</label>');
    $newDiv.append($newLabel);
    $("#list1").prepend($newDiv);

    previousMid = $newDiv;
  });

  $("#list1").on("change", ":checkbox", function () {
    updateLocalStorage();
  });

  $("ul").on("click", "li img", function (e) {
    e.stopPropagation();
    let $li = $(this).closest("li");
    let idx = $li.index();
    var $prevLi = $li.prev("li");
    if ($prevLi.length > 0) {
      $prevLi.css({
        'border-left': '5px solid rgb(181, 16, 181)',
        'margin-left': '-35px'
      });
      lastLiIndex = $prevLi.index();
    } else {
      lastLiIndex = 0;
    }
    taskdata.splice(idx, 1);
    $li.remove();
    localStorage.setItem("taskdata", JSON.stringify(taskdata));
    localStorage.setItem('lastLiIndex', lastLiIndex);
  });

  // Listelere task ekleme

  $(document).ready(function () {
    loadTasks();
  });

  $('#search').keypress(function (event) {
    if (event.which === 13) {
      addCheckbox();
    }
  });

  $(document).on('change', ':checkbox', function () {
    updateLocalStorage();
  });

  function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(function (task, index) {
      createTask(task.label, task.checked, index + 1);
    });
  }

  function createTask(label, isChecked, index) {
    var checkbox = $('<input type="checkbox" size="10">');
    var labelElement = $('<label>');
    checkbox.prop('checked', isChecked);
    labelElement.text(label);
    var taskContainer = $('<div class="mid" id="mid"></div>');
    taskContainer.append(checkbox);
    taskContainer.append(labelElement);
    $('#list1').append('<br>');
    $('#list1').append(taskContainer);
    checkbox.attr('id', 'chk' + index);
    labelElement.attr('for', 'chk' + index);
  }

  function addCheckbox() {
    var inputValue = $('#search').val();
    if (inputValue.trim() !== "") {
      var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      var newIndex = tasks.length + 1;
      createTask(inputValue, false, newIndex);
      $('#search').val('');
      updateLocalStorage();
    }
  }

  function updateLocalStorage() {
    var tasks = [];
    $(':checkbox').each(function (index) {
      tasks.push({
        label: $(this).siblings('label').text(),
        checked: $(this).prop('checked')
      });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  // localStorage.clear()
});
