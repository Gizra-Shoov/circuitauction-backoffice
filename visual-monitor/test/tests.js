'use strict';

var shoovWebdrivercss = require('shoov-webdrivercss');
var projectName = 'backoffice-shoov';

// This can be executed by passing the environment argument like this:
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=chrome mocha
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=ie11 mocha
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=iphone5 mocha

var capsConfig = {
  'chrome': {
    project: projectName,
    'browser' : 'Chrome',
    'browser_version' : '42.0',
    'os' : 'OS X',
    'os_version' : 'Yosemite',
    'resolution' : '1024x768'
  },
  'ie11': {
    project: projectName,
    'browser' : 'IE',
    'browser_version' : '11.0',
    'os' : 'Windows',
    'os_version' : '7',
    'resolution' : '1024x768'
  },
};

var selectedCaps = process.env.SELECTED_CAPS || undefined;
var caps = selectedCaps ? capsConfig[selectedCaps] : undefined;

var providerPrefix = process.env.PROVIDER_PREFIX ? process.env.PROVIDER_PREFIX + '-' : '';
var testName = selectedCaps ? providerPrefix + selectedCaps : providerPrefix + 'default';

var baseUrl = process.env.BASE_URL ? process.env.BASE_URL : 'http://master-6kqyz7hw2zazm.eu.platform.sh/#/dashboard/dashboard';

var resultsCallback = process.env.DEBUG ? console.log : shoovWebdrivercss.processResults;

describe('Visual monitor testing', function() {

  this.timeout(99999999);
  var client = {};

  before(function(done){
    client = shoovWebdrivercss.before(done, caps);
  });

  after(function(done) {
    shoovWebdrivercss.after(done);
  });

  it('should show the login page',function(done) {
    client
      .url(baseUrl)
      .pause(5000)
      .webdrivercss(testName + '.login', {
        name: '1',
        screenWidth: selectedCaps == 'chrome' ? [320, 640, 960, 1200] : undefined,
      }, resultsCallback)
      .call(done);
  });

  it('should show the forgot password page',function(done) {
    client
      .url(baseUrl + '/forgot-password')
      .webdrivercss(testName + '.forgot-password', {
        name: '1',
        screenWidth: selectedCaps == 'chrome' ? [320, 640, 960, 1200] : undefined,
      }, resultsCallback)
      .call(done);
  });

  it('should show the dashboard client page',function(done) {
    client
      .url(baseUrl + '/dashboard/clients')
      .setValue('form div:nth-child(3) input', 'staff')
      .setValue('form div:nth-child(4) input', '123')
      .click('form > div.form-actions button')
      .url(baseUrl + '/dashboard/clients')
      .webdrivercss(testName + '.dashboard-clients', {
        name: '1',
        hide:
          [
            // Binding.
            '.details .number',
            // Notification.
            '.badge-default',
          ],
        remove:
          [
            // Table.
            'tbody',
            '.dataTables_info',
            // Records.
            '#DataTables_Table_0_length',
            '.pagination-panel',
            // Header.
            selectedCaps == 'ie11' ? '.page-header' : '',
          ],
        screenWidth: selectedCaps == 'chrome' ? [320, 640, 960, 1200] : undefined,
      }, resultsCallback)
      .call(done);
  });

  it('should show the dashboard client new page',function(done) {
    client
      .url(baseUrl + '/dashboard/clients/new')
      .webdrivercss(testName + '.dashboard-clients-new', {
        name: '1',
        hide:
          [
            // Binding.
            '.details .number',
            // Notification.
            '.badge-default',
          ],
        remove:
          [
            // Header.
            selectedCaps == 'ie11' ? '.page-header' : '',
          ],
        screenWidth: selectedCaps == 'chrome' ? [320, 640, 960, 1200] : undefined,
      }, resultsCallback)
      .call(done);
  });

  it('should show the dashboard consignments page',function(done) {
    client
      .url(baseUrl + '/dashboard/consignments')
      .webdrivercss(testName + '.dashboard-clients', {
        name: '1',
        hide:
          [
            // Binding.
            '.details .number',
            // Notification.
            '.badge-default',
          ],
        remove:
          [
            // Table.
            'tbody',
            '.dataTables_info',
            // Records.
            '#DataTables_Table_0_length',
            '.pagination-panel',
            // Header.
            selectedCaps == 'ie11' ? '.page-header' : '',
          ],
        screenWidth: selectedCaps == 'chrome' ? [320, 640, 960, 1200] : undefined,
      }, resultsCallback)
      .call(done);
  });

  it('should show the dashboard consignments new page',function(done) {
    client
      .url(baseUrl + '/dashboard/consignments/new/')
      .webdrivercss(testName + '.dashboard-consignments-new', {
        name: '1',
        remove:
          [
            // Header.
            selectedCaps == 'ie11' ? '.page-header' : '',
          ],
        screenWidth: selectedCaps == 'chrome' ? [320, 640, 960, 1200] : undefined,
      }, resultsCallback)
      .call(done);
  });

  it('should show the dashboard items page',function(done) {
    client
      .url(baseUrl + '/dashboard/items')
      .webdrivercss(testName + '.dashboard-items', {
        name: '1',
        hide:
          [
            // Notification.
            '.badge-default',
          ],
        remove:
          [
            // Table.
            'tbody',
            '.dataTables_info',
            // Records.
            '#DataTables_Table_0_length',
            '.pagination-panel',
            // Header.
            selectedCaps == 'ie11' ? '.page-header' : '',
          ],
        screenWidth: selectedCaps == 'chrome' ? [320, 640, 960, 1200] : undefined,
      }, resultsCallback)
      .call(done);
  });

  it('should show the dashboard items new page',function(done) {
    client
      .url(baseUrl + '/dashboard/items/new/')
      .webdrivercss(testName + '.dashboard-items-new', {
        name: '1',
        hide:
          [
            // Notification.
            '.badge-default',
          ],
        remove:
          [
            // Header.
            selectedCaps == 'ie11' ? '.page-header' : '',
          ],
        screenWidth: selectedCaps == 'chrome' ? [320, 640, 960, 1200] : undefined,
      }, resultsCallback)
      .call(done);
  });

  it('should show the dashboard sales page',function(done) {
    client
      .url(baseUrl + '/dashboard/sales')
      .webdrivercss(testName + '.dashboard-sales', {
        name: '1',
        hide:
          [
            // Notification.
            '.badge-default',
          ],
        remove:
          [
            // Table.
            'tbody',
            '.dataTables_info',
            // Records.
            '#DataTables_Table_0_length',
            '.pagination-panel',
            // Header.
            selectedCaps == 'ie11' ? '.page-header' : '',
          ],
        screenWidth: selectedCaps == 'chrome' ? [320, 640, 960, 1200] : undefined,
      }, resultsCallback)
      .call(done);
  });

  it('should show the dashboard sales new page',function(done) {
    client
      .url(baseUrl + '/dashboard/sales/new')
      .webdrivercss(testName + '.dashboard-sales-new', {
        name: '1',
        hide:
          [
            // Notification.
            '.badge-default',
          ],
        remove:
          [
            // Header.
            selectedCaps == 'ie11' ? '.page-header' : '',
          ],
        screenWidth: selectedCaps == 'chrome' ? [320, 640, 960, 1200] : undefined,
      }, resultsCallback)
      .call(done);
  });

  it('should show the dashboard bids page',function(done) {
    client
      .url(baseUrl + '/dashboard/bids')
      .webdrivercss(testName + '.dashboard-bids', {
        name: '1',
        hide:
          [
            // Notification.
            '.badge-default',
            '#find_courses_submit'
          ],
        remove:
          [
            // Item box.
            '.sale.ng-scope',
            '.dataTables_info',
            // Records.
            '#DataTables_Table_0_length',
            '.pagination-panel',
            // Header.
            selectedCaps == 'ie11' ? '.page-header' : '',
          ],
        screenWidth: selectedCaps == 'chrome' ? [320, 640, 960, 1200] : undefined,
      }, resultsCallback)
      .call(done);
  });

  it('should show the dashboard orders bidder page',function(done) {
    client
      .url(baseUrl + '/dashboard/orders/bidder')
      .webdrivercss(testName + '.dashboard-orders-bidder', {
        name: '1',
        hide:
          [
            // Notification.
            '.badge-default',
          ],
        remove:
          [
            // Table.
            'tbody',
            '.dataTables_info',
            // Records.
            '#DataTables_Table_0_length',
            '.pagination-panel',
            // Header.
            selectedCaps == 'ie11' ? '.page-header' : '',
          ],
        screenWidth: selectedCaps == 'chrome' ? [320, 640, 960, 1200] : undefined,
      }, resultsCallback)
      .call(done);
  });

  it('should show the dashboard orders consignor page',function(done) {
    client
      .url(baseUrl + '/dashboard/orders/consignor')
      .webdrivercss(testName + '.dashboard-orders-consignor', {
        name: '1',
        hide:
          [
            // Notification.
            '.badge-default',
          ],
        remove:
          [
            // Table.
            'tbody',
            '.dataTables_info',
            // Records.
            '#DataTables_Table_0_length',
            '.pagination-panel',
            // Header.
            selectedCaps == 'ie11' ? '.page-header' : '',
          ],
        screenWidth: selectedCaps == 'chrome' ? [320, 640, 960, 1200] : undefined,
      }, resultsCallback)
      .call(done);
  });

  it('should show the dashboard categories page',function(done) {
    client
      .url(baseUrl + '/dashboard/categories')
      .webdrivercss(testName + '.dashboard-categories', {
        name: '1',
        hide:
          [
            // Notification.
            '.badge-default',
          ],
        remove:
          [
            // Categories box.
            '.portlet-body',
            // Header.
            selectedCaps == 'ie11' ? '.page-header' : '',
          ],
        screenWidth: selectedCaps == 'chrome' ? [320, 640, 960, 1200] : undefined,
      }, resultsCallback)
      .call(done);
  });
});
