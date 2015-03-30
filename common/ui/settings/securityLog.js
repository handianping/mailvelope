/**
 * Mailvelope - secure email with OpenPGP encryption for Webmail
 * Copyright (C) 2014  Mailvelope Authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License version 3
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

var mvelo = mvelo || null;
var options = options || null;

(function(options) {

  var $tableBody;
  var logEntryTmpl;
  var autoRefresh;

  function init() {
    $tableBody = $("#secrityLogTable tbody");
    if (logEntryTmpl === undefined) {
      logEntryTmpl = $tableBody.html();
    }
    $("#openSecurityLog").on("click", startSecurityLogMonitoring);
  }

  function startSecurityLogMonitoring() {
    updateSecurityLog();
    clearInterval(autoRefresh);
    autoRefresh = setInterval(updateSecurityLog, 1000);
  }

  function updateSecurityLog() {
    mvelo.extension.sendMessage({event: "get-ui-log"}, refreshSecurityLog);
  }

  function refreshSecurityLog(request) {
    var tableRow;
    var timestamp;
    var tmpDate;
    $tableBody.children().remove();
    request.secLog.reverse().forEach(function(entry) {
      tableRow = $.parseHTML(logEntryTmpl);
      tmpDate = new Date(entry.timestamp);
      timestamp = pad(tmpDate.getUTCHours()) + ":" + pad(tmpDate.getUTCMinutes()) + ":" + pad(tmpDate.getUTCSeconds());
      $(tableRow).find('.timestamp').text(timestamp);
      $(tableRow).find('td:nth-child(1)').attr("title", entry.timestamp);
      $(tableRow).find('td:nth-child(2)').text(entry.sourcei18n);
      $(tableRow).find('td:nth-child(3)').text(entry.typei18n);
      $tableBody.append(tableRow);
    });
  }

  function pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }

  options.startSecurityLogMonitoring = startSecurityLogMonitoring;
  options.event.on('ready', init);

}(options));