Feature: loading the page

Scenario: Loading the main page
  Given the browser has opened
  When the page has loaded
  Then I should see a spinner
