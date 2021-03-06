(function() {
  var changeToken, clearCache, db_get, forceReload, getTheme, guiInit, gui_clearList, gui_main_createNewLine, gui_switchPage, gui_updateCourseList, gui_updateNormalList, gui_updatePopupNumber, iced, loadData, onItemClick, setAllReaded, __iced_k, __iced_k_noop,
    __slice = [].slice;

  iced = {
    Deferrals: (function() {

      function _Class(_arg) {
        this.continuation = _arg;
        this.count = 1;
        this.ret = null;
      }

      _Class.prototype._fulfill = function() {
        if (!--this.count) return this.continuation(this.ret);
      };

      _Class.prototype.defer = function(defer_params) {
        var _this = this;
        ++this.count;
        return function() {
          var inner_params, _ref;
          inner_params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (defer_params != null) {
            if ((_ref = defer_params.assign_fn) != null) {
              _ref.apply(null, inner_params);
            }
          }
          return _this._fulfill();
        };
      };

      return _Class;

    })(),
    findDeferral: function() {
      return null;
    },
    trampoline: function(_fn) {
      return _fn();
    }
  };
  __iced_k = __iced_k_noop = function() {};

  gui_updateCourseList = function() {
    var GUIlist, courseList, i, id, k, name, _i, _ref, _results;
    courseList = JSON.parse(localStorage.getItem('course_list'));
    if (!courseList) return;
    GUIlist = $('#course-list');
    $('#course-list .folder').remove();
    _results = [];
    for (i = _i = 0, _ref = courseList.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      id = courseList[i].id;
      name = courseList[i].name;
      k = $('<li class="folder">' + '<a href="#"><i class="icon-book"></i> ' + name + '</a>' + '<ul class="subfolder">' + '<li><a target="content-frame" href="' + URL_CONST['notification'] + '?course_id=' + id + '"><i class="icon-bullhorn"></i> 课程公告</a></li>' + '<li><a target="content-frame" href="' + URL_CONST['course_info'] + '?course_id=' + id + '"><i class="icon-info-sign"></i> 课程信息</a></li>' + '<li><a target="content-frame" href="' + URL_CONST['file'] + '?course_id=' + id + '"><i class="icon-download-alt"></i> 课程文件</a></li>' + '<li><a target="content-frame" href="' + URL_CONST['resource'] + '?course_id=' + id + '"><i class="icon-cloud"></i> 教学资源</a></li>' + '<li><a target="content-frame" href="' + URL_CONST['deadline'] + '?course_id=' + id + '"><i class="icon-pencil"></i> 课程作业</a></li>' + '<li><a target="content-frame" href="' + URL_CONST['mentor'] + '?course_id=' + id + '"><i class="icon-question-sign"></i> 课程答疑</a></li>' + '<li><a target="content-frame" href="' + URL_CONST['discuss'] + '?course_id=' + id + '"><i class="icon-comments"></i> 课程讨论</a></li>' + '<li><a target="_blank"        href="' + URL_CONST['course_page'] + '?course_id=' + id + '"><i class="icon-external-link"></i> 在新窗口中打开</a></li>' + '</ul>' + '</li>');
      _results.push(GUIlist.append(k));
    }
    return _results;
  };

  gui_updatePopupNumber = function() {
    var num, type, _i, _len, _ref, _results;
    _ref = CONST.featureName;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      type = _ref[_i];
      num = localStorage.getItem('number_' + type, '0');
      _results.push($('#unread-' + type).text(num));
    }
    return _results;
  };

  getTheme = function(dueDays, submit_state) {
    var prefix;
    prefix = 'theme-';
    if (dueDays < 0) return prefix + 'black';
    if (submit_state === CONST.stateTrans.submitted) {
      return prefix + 'green';
    } else {
      if (dueDays < 3) return prefix + 'red';
      if (dueDays < 5) return prefix + 'orange';
    }
    return '';
  };

  gui_main_createNewLine = function(data) {
    var dueDays, id, line;
    line = '<li class="message ';
    id = data.id;
    if (data.type === 'd') {
      dueDays = data.dueDays;
      line += 'deadline ';
      line += 'is-' + data.state + ' ';
      line += (data.submit_state === '已经提交' ? 'is-submitted' : '') + ' ';
      line += '" data-args=' + id + '> ';
      line += '<a class="title" data-args="read" target="content-frame" href="subframe.html?type=deadline&id=' + id + '" title="' + data.name + '">';
      line += '<span class="tag ' + getTheme(dueDays, data.submit_state) + '">';
      if (data.submit_state === CONST.stateTrans.submitted) {
        line += '<i class="icon-check"></i>';
      } else {
        line += '<i class="icon-pencil"></i>';
      }
      if (dueDays >= 0) line += ' ' + dueDays;
      line += '</span> ' + data.name + '</a>';
      line += '<span class="description">' + new Date(data.end).Format("yyyy-MM-dd") + ' - ' + data.submit_state + '</span>';
      line += '<div class="toolbar">';
      line += '<a class="handin-link" target="content-frame" href="' + URL_CONST['deadline_submit'] + '?id=' + data.id + '&course_id=' + data.courseId + '">提交链接</a> ';
      line += '<a class="add-star" href="#" data-args="star">置顶</a> ';
      if (data.resultState) {
        line += '<a class="review-link" target="content-frame" href="' + URL_CONST['deadline_review'] + '?id=' + data.id + '&course_id=' + data.courseId + '">查看批阅</a>';
      } else if (data.submit_state !== '尚未提交') {
        line += '<a class="review-link none">尚未批阅</a>';
      }
      line += '<a target="content-frame" class="course-name" href="' + URL_CONST['deadline'] + '?course_id=' + data.courseId + '">' + data.courseName.replace(/\(\d+\)\(.*$/, '') + '</a>';
      line += '</div>';
    } else if (data.type === 'n') {
      line += 'notification ';
      line += 'is-' + data.state + ' ';
      line += '" data-args=' + id + '> ';
      line += '<a class="title" data-args="read" target="content-frame" href="subframe.html?type=notification&id=' + id + '" title="' + data.name + '"><span class="tag theme-purple"><i class="icon-bullhorn"></i></span> ' + data.name + '</a></td>';
      line += '<span class="description">' + new Date(data.day).Format("yyyy-MM-dd") + '</span>';
      line += '<div class="toolbar">';
      line += '<a class="add-star" href="#" data-args="star">置顶</a>';
      line += '<a class="course-name" target="content-frame" href="' + URL_CONST['notification'] + '?course_id=' + data.courseId + '">' + data.courseName + '</a>';
      line += '</div>';
    } else if (data.type === 'f') {
      line += 'file ';
      line += 'is-' + data.state + ' ';
      line += '" data-args=' + id + '> ';
      line += '<a class="title" target="content-frame" data-args="read" href="https://learn.tsinghua.edu.cn' + data.href + '" title="' + data.name + '"><span class="tag theme-magenta"><i class="icon-download-alt"></i></span> ' + data.name + '</a></td>';
      line += '<span class="description">' + new Date(data.day).Format("yyyy-MM-dd") + '&nbsp;&nbsp;' + data.explanation + '</span>';
      line += '<div class="toolbar">';
      line += '<a class="add-star" href="#" data-args="star">置顶</a>';
      line += '<a class="set-readed" href="#" data-args="read">设为已读</a>';
      line += '<a class="course-name" target="content-frame" href="' + URL_CONST['notification'] + '?course_id=' + data.courseId + '">' + data.courseName + '</a>';
      line += '</div>';
    } else if (data.type === 't') {
      line += 'discuss ';
      line += 'is-' + data.state + ' ';
      line += '" data-args=' + id + '> ';
      line += '<a class="title" target="content-frame" data-args="read" href="' + URL_CONST['discuss_detail'] + '?default_cate_id=1&id=' + data.id + '&course_id=' + data.courseId + '" +\
			" title="' + data.name + '"><span class="tag theme-white"><i class="icon-question-sign"></i></span> ' + data.name + '</a></td>';
      line += '<span class="description">' + new Date(data.day).Format("yyyy-MM-dd") + '</span>';
      line += '<div class="toolbar">';
      line += '<a class="add-star" href="#" data-args="star">置顶</a>';
      line += '<a class="set-readed" href="#" data-args="read">设为已读</a>';
      line += '<a class="course-name" target="content-frame" href="' + URL_CONST['discuss'] + '?course_id=' + data.courseId + '">' + data.courseName + '</a>';
      line += '</div>';
    }
    line += '</li>';
    return line;
  };

  db_get = function(key, defaultValue, callback) {
    return chrome.storage.local.get(key, function(result) {
      if (result[key] === void 0) {
        callback(defaultValue);
        return;
      }
      return callback(JSON.parse(result[key]));
    });
  };

  gui_clearList = function(type) {
    return $(CONST.GUIListName[type]).find('li').remove();
  };

  gui_updateNormalList = function(type) {
    var GUIList, counter, line, list, value, ___iced_passed_deferral, __iced_deferrals, __iced_k,
      _this = this;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    gui_clearList(type);
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "src/iced/view.iced",
        funcname: "gui_updateNormalList"
      });
      db_get('cache_' + type, [], __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return list = arguments[0];
          };
        })(),
        lineno: 122
      }));
      __iced_deferrals._fulfill();
    })(function() {
      var _i, _len;
      GUIList = $(CONST.GUIListName[type]);
      counter = 0;
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        value = list[_i];
        line = gui_main_createNewLine(value);
        GUIList.append($(line));
      }
      $(CONST.GUIListName[type] + ' .title').click(function(e) {
        var args, node;
        node = e.target;
        args = node.getAttribute('data-args').split(',');
        args.push(node.parentNode);
        return onItemClick.apply(null, args);
      });
      $(CONST.GUIListName[type] + ' .add-star').click(function(e) {
        var args, node;
        node = e.target;
        args = node.getAttribute('data-args').split(',');
        args.push(node.parentNode.parentNode);
        return onItemClick.apply(null, args);
      });
      return $(CONST.GUIListName[type] + ' .set-readed').click(function(e) {
        var args, node;
        node = e.target;
        args = node.getAttribute('data-args').split(',');
        args.push(node.parentNode.parentNode);
        return onItemClick.apply(null, args);
      });
    });
  };

  onItemClick = function(op, node) {
    var cur_state, id, target_state, type;
    id = node.getAttribute('data-args');
    cur_state = node.className.match(/is-(\w*)/)[1];
    type = node.className.match(/deadline|notification|file|discuss/)[0];
    target_state = CONST.changeState[cur_state][op];
    if (target_state === cur_state) return;
    node.className = node.className.replace('is-' + cur_state, 'is-' + target_state);
    return chrome.extension.sendMessage({
      op: 'state',
      data: {
        type: type,
        id: id,
        targetState: target_state
      }
    }, function(response) {
      var entry, name, _i, _len, _ref, _results;
      gui_updatePopupNumber();
      _ref = ['collect', type];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        entry = CONST.panelTran[name];
        if (!$('#' + entry).is(':visible')) {
          _results.push(gui_updateNormalList(name));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
  };

  gui_switchPage = function(page) {
    var currentPane, dx, entry, name, _i, _len, _ref;
    currentPane = null;
    _ref = CONST.listTemp;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      entry = CONST.panelTran[name];
      if ($('#' + entry).is(':visible')) {
        currentPane = $('#' + entry).hide();
        (function(name) {
          return window.setTimeout(function() {
            return gui_updateNormalList(name);
          }, 300);
        })(name);
      }
    }
    currentPane.show();
    page = $('#' + page);
    if (currentPane.is(page)) return;
    currentPane.css({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0
    });
    dx = currentPane.width();
    page.css({
      position: 'relative',
      left: dx
    }).show();
    page.animate({
      left: 0
    }, 300);
    return currentPane.animate({
      left: -dx,
      right: dx
    }, 300, function() {
      currentPane.hide();
      return page.show();
    });
  };

  clearCache = function() {
    return chrome.extension.sendMessage({
      op: 'clear'
    }, function(response) {
      var name, _i, _len, _ref, _results;
      _ref = CONST.listTemp;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        _results.push(gui_updateNormalList(name));
      }
      return _results;
    });
  };

  forceReload = function() {
    return chrome.extension.sendMessage({
      op: 'forcereload'
    }, function(response) {
      if (response.op === 'ready') return loadData();
    });
  };

  setAllReaded = function() {
    return chrome.extension.sendMessage({
      op: 'allread'
    }, function(response) {
      return loadData();
    });
  };

  changeToken = function() {
    var password, username;
    username = $('#token-username').val();
    password = $('#token-password').val();
    $('#msg-text').text('正在验证中...');
    return chrome.extension.sendMessage({
      op: 'token',
      data: {
        username: username,
        password: password
      }
    }, function(response) {
      if (response.op === 'savedToken') {
        $('#token-modal').modal('hide');
        $('#msg-text').text('旧信息已全部删除，新用户名密码已储存。将在 2 秒内刷新该页面。');
        $('#msg-modal').modal('show');
        window.setTimeout(function() {
          return location.reload();
        });
        return 2000;
      } else if (response.op === 'failToken') {
        return alert(response.reason);
      }
    });
  };

  guiInit = function() {
    var name, page, _fn, _i, _len, _ref;
    _ref = CONST.listTemp;
    _fn = function(page) {
      return $('#switch-' + page).click(function() {
        return gui_switchPage(page);
      });
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      page = CONST.panelTran[name];
      _fn(page);
    }
    gui_switchPage('main-page');
    $('#token-modal').modal({
      title: '<i class="icon-signin"></i> 登录'
    });
    $('#msg-modal').modal({
      title: '<i class="icon-info-sign"></i> 通知'
    });
    $('#net-error-modal').modal({
      title: '<i class="icon-warning-sign"></i> 网络错误',
      closable: false
    });
    $('#new-term-modal').modal({
      title: '<i class="icon-code-fork"></i> 切换学期'
    });
    $('#option-clear-cache').click(clearCache);
    $('#option-set-all-read').click(setAllReaded);
    $('#option-force-reload-all').click(forceReload);
    $('#option-change-token').click(function() {
      return $('#token-modal').modal({
        closable: true
      }).modal('show');
    });
    $('#token-form').on('submit', function() {
      changeToken();
      return false;
    });
    $('#net-error-reload-btn').click(function() {
      return location.reload();
    });
    $('#net-error-offline-btn').click(function() {
      return $('#net-error-modal').modal('hide');
    });
    $('#new-term-switch-btn').click(function() {
      $('#new-term-modal').modal('hide');
      return chrome.extension.sendMessage({
        op: 'new_term'
      }, function(response) {
        return loadData();
      });
    });
    $('#new-term-cancel-btn').click(function() {
      return $('#new-term-modal').modal('hide');
    });
    return $('#new-term-force').click(function() {
      $('#new-term-modal').modal('hide');
      return chrome.extension.sendMessage({
        op: 'force_term'
      });
    });
  };

  loadData = function() {
    var name, _i, _len, _ref, _results;
    gui_updateCourseList();
    gui_updatePopupNumber();
    _ref = CONST.listTemp;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      _results.push(gui_updateNormalList(name));
    }
    return _results;
  };

  $(function() {
    chrome.extension.sendMessage({
      op: 'load'
    }, function(response) {
      if (response.op === 'ready') return loadData();
    });
    guiInit();
    gui_updateCourseList();
    gui_updatePopupNumber();
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
      var $folder;
      if (request.op === 'progress') {
        $folder = $('.pane-folder');
        return setLoading(request.data, $folder);
      } else if (request.op === 'newTerm') {
        $('#lastTerm').text(request.data.lastTerm);
        $('#currentTerm').text(request.data.currentTerm);
        return $('#new-term-modal').modal('show');
      }
    });
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.type === 'error') {
        if (request.data === 'netFail') {
          $('#net-error-modal').modal('show');
        } else if (request.data === 'noToken') {
          $('#token-modal').modal({
            closable: true
          }).modal('show');
        }
      }
      return false;
    });
    return chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
      var id, target, targetState, type;
      if (request.type === 'update') {
        type = request.data.type;
        id = request.data.id;
        targetState = request.data.targetState;
        target = $('li.message.' + type + '[data-args=' + id + ']');
        target.removeClass('is-stared');
        target.addClass('is-' + targetState);
      }
      return false;
    });
  });

}).call(this);
