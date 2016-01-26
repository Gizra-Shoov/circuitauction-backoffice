<?php

use Drupal\DrupalExtension\Context\DrupalContext;
use Behat\Behat\Context\SnippetAcceptingContext;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;
use Behat\Behat\Tester\Exception\PendingException;

class FeatureContext extends DrupalContext implements SnippetAcceptingContext {

  /**
   * @Given I login with user :username password :password
   *
   * @param $username
   * @param $password
   */
  public function iLoginWithUserPassword($username, $password) {
    $this->loginUser($username, $password);
  }

  /**
   * @Given I am admin
   */
  public function iAmAdmin() {
    $this->loginUser('admin', 'admin');
  }

  /**
   * Login a user to the site.
   *
   * @param $name
   *   The user name.
   * @param $password
   *   The use password.
   *
   * @throws \Behat\Mink\Exception\ElementNotFoundException
   * @throws \Exception
   */
  private function _login($name, $password) {
    $this->getSession()->visit($this->locatePath('/#/login'));
    print_r($this->getSession()->getPage()->getHtml());
    sleep(10);
    $element = $this->getSession()->getPage();
    // Add username
    $username = $element->find('css', '#username');

    $username->setValue($name);
    // Add password
    $password_element = $element->find('css', '#password');
    $password_element->setValue($password);
    // Click to submit the login form
    $this->iClickOnTheElementWithCss('.btn-success');
    sleep(10);
  }

  /**
   * Login a user to the site.
   *
   * @param $name
   *   The user name.
   * @param $password
   *   The use password.
   *
   * @throws \Behat\Mink\Exception\ElementNotFoundException
   * @throws \Exception
   */
  protected function loginUser($name, $password) {
    $this->_login($name, $password);
  }

  /**
   * @When /^I try to login with bad credentials$/
   */
  public function iLoginWithBadCredentials() {
    $this->_login('wrong-foo', 'wrong-bar');

    // Wait for the alert element to load.
    $this->iWaitForCssElement('.alert-danger', 'appear');
  }

  /**
   * @Then /^I should wait for the text "([^"]*)" to "([^"]*)"$/
   */
  public function iShouldWaitForTheTextTo($text, $appear) {
    $this->waitForXpathNode(".//*[contains(normalize-space(string(text())), \"$text\")]", $appear == 'appear');
  }

  /**
   * @Then /^I wait for css element "([^"]*)" to "([^"]*)"$/
   */
  public function iWaitForCssElement($element, $appear) {
    $xpath = $this->getSession()->getSelectorsHandler()->selectorToXpath('css', $element);
    $this->waitForXpathNode($xpath, $appear == 'appear');
  }
  /**
   * @AfterStep
   *
   * Take a screen shot after failed steps for Selenium drivers (e.g.
   * PhantomJs).
   */
  public function takeScreenshotAfterFailedStep($event) {
    if ($event->getTestResult()->isPassed()) {
      // Not a failed step.
      return;
    }

    if ($this->getSession()->getDriver() instanceof \Behat\Mink\Driver\Selenium2Driver) {
      $file_name = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'behat-failed-step.png';
      $screenshot = $this->getSession()->getDriver()->getScreenshot();
      file_put_contents($file_name, $screenshot);
      print "Screenshot for failed step created in $file_name";
    }
  }

  /**
   * @BeforeScenario
   *
   * Delete the RESTful tokens before every scenario, so user starts as
   * anonymous.
   */
  public function deleteRestfulTokens($event) {
    if (!module_exists('restful_token_auth')) {
      // Module is disabled.
      return;
    }
    if (!$entities = entity_load('restful_token_auth')) {
      // No tokens found.
      return;
    }
    foreach ($entities as $entity) {
      $entity->delete();
    }
  }

  /**
   * @When I visit :vocabulary terms list
   *
   * @param $vocabulary
   */
  public function iVisitTermsList($vocabulary) {
    $this->getSession()->visit($this->locatePath('/admin/structure/taxonomy/' . $vocabulary));
  }

  /**
   * @When /^I visit "([^"]*)" node with title "([^"]*)"$/
   */
  public function iVisitNodeWithTitle($type, $title) {
    $query = new \entityFieldQuery();
    $result = $query
      ->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', strtolower($type))
      ->propertyCondition('title', $title)
      ->propertyCondition('status', NODE_PUBLISHED)
      ->propertyOrderBy('nid')
      ->range(0, 1)
      ->execute();
    if (empty($result['node'])) {
      $params = array(
        '@title' => $title,
        '@type' => $type,
      );
      throw new \Exception(format_string("Node @title of @type not found.", $params));
    }
    $nid = key($result['node']);
    $this->getSession()->visit($this->locatePath('node/' . $nid));
  }

  /**
   * @BeforeScenario
   *
   * Resize the view port.
   */
  public function resizeWindow() {
    if ($this->getSession()->getDriver() instanceof \Behat\Mink\Driver\Selenium2Driver) {
      $this->getSession()->resizeWindow(1440, 900, 'current');
    }
  }

  /**
   * Helper function; Execute a function until it return TRUE or timeouts.
   *
   * @param $fn
   *   A callable to invoke.
   * @param int $timeout
   *   The timeout period. Defaults to 10 seconds.
   *
   * @throws Exception
   */
  private function waitFor($fn, $timeout = 5000) {
    $start = microtime(true);
    $end = $start + $timeout / 1000.0;
    while (microtime(true) < $end) {
      if ($fn($this)) {
        return;
      }
    }
    throw new \Exception('waitFor timed out.');
  }
  /**
   * Wait for an element by its XPath to appear or disappear.
   *
   * @param string $xpath
   *   The XPath string.
   * @param bool $appear
   *   Determine if element should appear. Defaults to TRUE.
   *
   * @throws Exception
   */
  private function waitForXpathNode($xpath, $appear = TRUE) {
    $this->waitFor(function($context) use ($xpath, $appear) {
      try {
        $nodes = $context->getSession()->getDriver()->find($xpath);
        if (count($nodes) > 0) {
          $visible = $nodes[0]->isVisible();
          return $appear ? $visible : !$visible;
        }
        return !$appear;
      }
      catch (WebDriver\Exception $e) {
        if ($e->getCode() == WebDriver\Exception::NO_SUCH_ELEMENT) {
          return !$appear;
        }
        throw $e;
      }
    });
  }

  /**
   * @Given I login with user
   */
  public function iLoginWithUser() {
    $this->iLoginWithUserPassword('staff','1');
  }

  /**
   * @Then I can logout
   */
  public function iCanLogout() {
    $this->iClickOnTheElementWithCss('div.top-menu ul li.dropdown.dropdown-quick-sidebar-toggler > a');
  }

  /**
   * @Given /^I click on the element with css "([^"]*)"$/
   */
  public function iClickOnTheElementWithCss($css_path) {
    if (!$element = $this->getSession()->getPage()->find('css', $css_path)) {
      throw new \Exception(sprintf('The element "%s" not found.', $css_path));
    }
    $element->click();
  }

}
