Feature: my page can load


Scenario: page loads spinner
  Given my browser is open
  When my page loads
  Then I should see a spinner


Scenario: counter works
  Given the app is loaded with the counter
  When the plus button is pressed
  Then I should see an increment


Scenario: counter works by adding arbitrary value
  Given the app is loaded with the counter
  When an amount is added to the counter and I press "Add Amount"
  Then I should see the corresponding amount added 


Scenario: counter works by adding async value
  Given the app is loaded with the counter
  When an async amount is added to the counter and I press "Add Async"
  Then I should see the corresponding amount added post-async
